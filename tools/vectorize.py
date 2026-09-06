#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
壮大なる愚作 — 記事の自動ベクトル化と主成分分析（PCA）。

各記事の本文（contents/<slug>/source.html）から特徴ベクトルを作り，全記事に対して
主成分分析を行って第1〜第4主成分スコアを求める。得られたスコアが score-data.js の
pc1〜pc4 になり，スコア譜のソプラノ／アルト／テノール／バス各段の音高になる。
tools/build.py から呼ばれるほか，単体で実行すると解析レポートを表示する。

    python tools/vectorize.py            # 解析レポート（寄与率・各軸の特徴語・記事の座標）
    python tools/vectorize.py --terms 20 # 各軸に表示する特徴語の数を変える

外部ライブラリ不要（Python標準ライブラリのみ）。日本語の形態素解析器も使えないため，
以下の素朴だが決定論的な手順を踏む。

1. テキスト抽出（`document_text`）
   source.html からコメント・script/style/iframe・タグを除き，実体参照を戻して
   NFKC正規化する。メタデータからは title・heading・deck だけを本文に足す。

2. トークン化（`tokenize`）
   文字種（漢字／カタカナ／かな／ラテン文字・キリル文字／その他）の切れ目で文字列を
   区切り，
     - 漢字の連なり → 文字bigram（1文字だけならその文字）
     - カタカナの連なり → 語全体（2文字以上）＋文字bigram（3文字以上のとき）
     - ラテン文字・キリル文字の連なり → 小文字化した語全体（2文字以上）
     - ひらがな・数字・記号 → 捨てる（助詞・活用語尾など，内容を持たないため）
   を取り出す。形態素解析なしで日本語を扱う定石（文字bigram）に，固有名詞が
   カタカナ・ラテン文字で書かれるこのサイトの事情を足したもの。

3. 重み付け（`tfidf`）
   TF-IDF。tf は 1+log(出現数)，idf は log(N/df)。2記事未満にしか現れない語（df<2）は
   比較に使えないので捨て，全記事に現れる語（df=N，idf=0）も落ちる。最後に各記事の
   ベクトルをL2正規化して，記事の長短が距離に効かないようにする。

4. 主成分分析（`pca`）
   語彙数Vは記事数Nよりはるかに多いので，V×Vの共分散行列ではなく，中心化した
   行列のN×Nグラム行列 Xc・Xcᵀ を作り，Jacobi法で固有値分解する。その固有ベクトルが
   そのまま各記事の主成分スコア（の定数倍）になる（双対PCA）。

5. 符号と尺度（`SCALINGS`）
   主成分の符号は数学的には任意なので，各軸で絶対値が最大の記事のスコアが正になる
   ように向きを固定する（再ビルドで符号が反転しないようにするため）。-1〜1への
   収め方は2通りあり，`--scale` で選ぶ。
     peak（既定）  軸ごとに最大絶対値で割る。主成分スコアの比がそのまま音程差に
                   なる素直な方法。ただし上位の軸は「特定の連作だけが突出し，
                   残りは0付近に密集する」形になりやすく，その段は同音が続く
                   （記事が増えて話題が散れば自然に解消する）
     quantile      順位だけを使い，-1〜1に等間隔で並べる。主成分の順序は保つが
                   大小の比は失われる。どの段も音符が散らばって見える
   第1主成分ほど分散が大きいという情報は，どちらの方法でも音高の幅としては
   表現されず，寄与率としてビルド時のレポートに出るだけである。
"""
import html as html_lib
import math
import re
import unicodedata
from collections import Counter

N_COMPONENTS = 4
MIN_DF = 2              # これ未満の記事にしか現れない語は捨てる
PC_RANGE = 1.0          # 出力するスコアの絶対値の上限
DEFAULT_SCALING = "peak"

_COMMENT_RE = re.compile(r"<!--.*?-->", re.S)
_BLOCK_RE = re.compile(r"<(script|style|iframe)\b[^>]*>.*?</\1\s*>", re.S | re.I)
_TAG_RE = re.compile(r"<[^>]*>", re.S)


# --- 1. テキスト抽出 -------------------------------------------------------

def strip_html(fragment):
    """HTML片から地の文だけを取り出す。"""
    text = _COMMENT_RE.sub(" ", fragment)
    text = _BLOCK_RE.sub(" ", text)
    text = _TAG_RE.sub(" ", text)
    text = html_lib.unescape(text)
    text = unicodedata.normalize("NFKC", text)
    return re.sub(r"\s+", " ", text).strip()


def document_text(meta, body):
    """記事1件分の解析対象テキスト（title・heading・deck＋本文）。"""
    parts = [meta.get("title", ""), meta.get("heading", ""), meta.get("deck", ""), body]
    return strip_html(" ".join(p for p in parts if p))


# --- 2. トークン化 ---------------------------------------------------------

def _char_class(ch):
    o = ord(ch)
    if 0x3040 <= o <= 0x309F:
        return "hira"
    if 0x30A0 <= o <= 0x30FF:
        return "kata"
    if 0x3400 <= o <= 0x9FFF or o == 0x3005:      # CJK統合漢字（拡張A含む）と々
        return "kanji"
    if o < 0x3000 and ch.isalpha():               # ラテン・キリル・ギリシャ文字
        return "word"
    return "other"


def _runs(text):
    """文字種が同じ文字の連なりに分ける。"""
    current, cls = [], None
    for ch in text:
        c = _char_class(ch)
        if c != cls:
            if current and cls not in (None, "other"):
                yield cls, "".join(current)
            current, cls = [ch], c
        else:
            current.append(ch)
    if current and cls not in (None, "other"):
        yield cls, "".join(current)


def _bigrams(run):
    return [run[i:i + 2] for i in range(len(run) - 1)]


def tokenize(text):
    """文字種ごとの規則でトークン列を作る（詳しくはモジュール冒頭の説明）。"""
    tokens = []
    for cls, run in _runs(text):
        if cls == "kanji":
            if len(run) == 1:
                tokens.append(run)
            else:
                tokens.extend(_bigrams(run))
        elif cls == "kata":
            word = run.strip("ー")
            if len(word) >= 2:
                tokens.append(word)
            if len(word) >= 3:
                tokens.extend(_bigrams(word))
        elif cls == "word":
            word = run.lower()
            if len(word) >= 2:
                tokens.append(word)
    return tokens


# --- 3. TF-IDF -------------------------------------------------------------

def tfidf(token_lists):
    """トークン列のリストから，語彙とL2正規化済みのTF-IDFベクトル（疎な辞書）を作る。"""
    n_docs = len(token_lists)
    counts = [Counter(toks) for toks in token_lists]
    df = Counter()
    for c in counts:
        df.update(c.keys())

    vocab = sorted(t for t, d in df.items() if MIN_DF <= d < n_docs)
    idf = {t: math.log(n_docs / df[t]) for t in vocab}

    rows = []
    for c in counts:
        row = {}
        for term in vocab:                        # vocabは整列済み＝加算の順序が一意
            f = c.get(term, 0)
            if f:
                row[term] = (1.0 + math.log(f)) * idf[term]
        norm = math.sqrt(math.fsum(v * v for v in row.values()))
        if norm > 0:
            for term in row:
                row[term] /= norm
        rows.append(row)
    return vocab, rows


# --- 4. 主成分分析 ---------------------------------------------------------

def _jacobi(matrix, sweeps=100, eps=1e-14):
    """対称行列の固有値分解（巡回Jacobi法）。(固有値, 固有ベクトルを列に持つ行列)。"""
    n = len(matrix)
    a = [row[:] for row in matrix]
    v = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
    for _ in range(sweeps):
        off = math.fsum(a[i][j] ** 2 for i in range(n) for j in range(i + 1, n))
        if off <= eps:
            break
        for p in range(n - 1):
            for q in range(p + 1, n):
                if abs(a[p][q]) <= 1e-18:
                    continue
                theta = (a[q][q] - a[p][p]) / (2.0 * a[p][q])
                t = math.copysign(1.0, theta) / (abs(theta) + math.sqrt(theta * theta + 1.0))
                c = 1.0 / math.sqrt(t * t + 1.0)
                s = t * c
                for k in range(n):                # 列の回転
                    akp, akq = a[k][p], a[k][q]
                    a[k][p], a[k][q] = c * akp - s * akq, s * akp + c * akq
                for k in range(n):                # 行の回転
                    apk, aqk = a[p][k], a[q][k]
                    a[p][k], a[q][k] = c * apk - s * aqk, s * apk + c * aqk
                for k in range(n):                # 固有ベクトルの蓄積
                    vkp, vkq = v[k][p], v[k][q]
                    v[k][p], v[k][q] = c * vkp - s * vkq, s * vkp + c * vkq
    return [a[i][i] for i in range(n)], v


def _dot(row_a, row_b):
    if len(row_b) < len(row_a):
        row_a, row_b = row_b, row_a
    return math.fsum(w * row_b[t] for t, w in sorted(row_a.items()) if t in row_b)


def _loadings(rows, mean, u):
    """主成分の語ごとの重み w = Xcᵀ・u（どの語がその軸を作っているかの説明用）。"""
    total_u = math.fsum(u)
    weights = {}
    for i, row in enumerate(rows):
        if u[i] == 0.0:
            continue
        for term, w in row.items():
            weights[term] = weights.get(term, 0.0) + u[i] * w
    for term, m in mean.items():
        if m:
            weights[term] = weights.get(term, 0.0) - total_u * m
    return weights


def _scale_peak(scores):
    """最大絶対値が PC_RANGE になるように割る（スコアの比を保つ）。"""
    peak = max(abs(s) for s in scores) or 1.0
    return [PC_RANGE * s / peak for s in scores]


def _scale_quantile(scores):
    """順位だけを使い，-PC_RANGE〜PC_RANGE に等間隔で並べる（比は失われる）。"""
    n = len(scores)
    if n < 2:
        return [0.0] * n
    order = sorted(range(n), key=lambda i: (scores[i], i))
    out = [0.0] * n
    for rank, i in enumerate(order):
        out[i] = PC_RANGE * (2.0 * rank / (n - 1) - 1.0)
    return out


SCALINGS = {"peak": _scale_peak, "quantile": _scale_quantile}


def pca(rows, n_components=N_COMPONENTS, scaling=DEFAULT_SCALING):
    """中心化したTF-IDF行列の双対PCA。軸ごとにスコア・寄与率・語の重みを返す。"""
    n_docs = len(rows)
    mean = {}
    for row in rows:
        for term, w in row.items():
            mean[term] = mean.get(term, 0.0) + w
    for term in mean:
        mean[term] /= n_docs

    # G = Xc・Xcᵀ を，中心化前の内積から組み立てる
    mm = math.fsum(v * v for v in mean.values())
    proj = [_dot(row, mean) for row in rows]
    gram = [[0.0] * n_docs for _ in range(n_docs)]
    for i in range(n_docs):
        for j in range(i, n_docs):
            g = _dot(rows[i], rows[j]) - proj[i] - proj[j] + mm
            gram[i][j] = gram[j][i] = g

    eigenvalues, eigenvectors = _jacobi(gram)
    order = sorted(range(n_docs), key=lambda k: -eigenvalues[k])
    total = math.fsum(max(e, 0.0) for e in eigenvalues) or 1.0
    rescale = SCALINGS[scaling]

    components = []
    for rank in range(min(n_components, n_docs)):
        k = order[rank]
        lam = max(eigenvalues[k], 0.0)
        u = [eigenvectors[i][k] for i in range(n_docs)]
        scores = [math.sqrt(lam) * ui for ui in u]

        # 符号の固定：絶対値が最大の記事を正にする（再ビルドでの反転を防ぐ）
        pivot = max(range(n_docs), key=lambda i: (abs(scores[i]), -i))
        if scores[pivot] < 0:
            scores = [-s for s in scores]
            u = [-ui for ui in u]

        components.append({
            "scores": rescale(scores),
            "explained": lam / total,
            "loadings": _loadings(rows, mean, u),
        })
    while len(components) < n_components:         # 記事数が足りないときの穴埋め
        components.append({"scores": [0.0] * n_docs, "explained": 0.0, "loadings": {}})
    return components


# --- まとめ ---------------------------------------------------------------

def analyse(documents, n_components=N_COMPONENTS, scaling=DEFAULT_SCALING):
    """documents: [(slug, text), ...] を解析する。

    戻り値の "scores" は {slug: [pc1, pc2, pc3, pc4]}（各 -1〜1）。
    """
    slugs = [slug for slug, _ in documents]
    token_lists = [tokenize(text) for _, text in documents]
    vocab, rows = tfidf(token_lists)
    components = pca(rows, n_components, scaling)
    scores = {
        slug: [round(components[k]["scores"][i], 4) for k in range(n_components)]
        for i, slug in enumerate(slugs)
    }
    return {
        "scores": scores,
        "slugs": slugs,
        "scaling": scaling,
        "vocab_size": len(vocab),
        "token_counts": [len(t) for t in token_lists],
        "explained": [c["explained"] for c in components],
        "loadings": [c["loadings"] for c in components],
    }


def format_report(result, n_terms=12):
    """単体実行時に表示する解析レポート。"""
    lines = ["語彙 {} 語／記事 {} 件（延べトークン {}）".format(
        result["vocab_size"], len(result["slugs"]), sum(result["token_counts"]))]
    for k, ratio in enumerate(result["explained"]):
        ranked = sorted(result["loadings"][k].items(), key=lambda kv: -kv[1])
        plus = "，".join(t for t, _ in ranked[:n_terms])
        minus = "，".join(t for t, _ in reversed(ranked[-n_terms:]))
        ordered = sorted(result["scores"].items(), key=lambda kv: -kv[1][k])
        lines.append("")
        lines.append("pc{}  寄与率 {:5.1f}%".format(k + 1, ratio * 100))
        lines.append("    ＋側: " + plus)
        lines.append("    －側: " + minus)
        lines.append("    " + "  ".join(
            "{}:{:+.2f}".format(slug, vals[k]) for slug, vals in ordered))
    return "\n".join(lines)


def main():
    import argparse
    import build                                  # 単体実行時のみ（循環importを避ける）

    parser = argparse.ArgumentParser(description="記事ベクトルの主成分分析レポート")
    parser.add_argument("--terms", type=int, default=12, help="各軸に表示する特徴語の数")
    parser.add_argument("--scale", choices=sorted(SCALINGS), default=DEFAULT_SCALING,
                        help="スコアを-1〜1に収める方法（既定 %(default)s）")
    args = parser.parse_args()

    sources = build.collect_sources()
    documents = [(d.name, document_text(meta, body)) for d, meta, body in sources]
    print(format_report(analyse(documents, scaling=args.scale), n_terms=args.terms))


if __name__ == "__main__":
    main()
