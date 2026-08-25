#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
壮大なる愚作 — 記事ページ生成スクリプト。

contents/<slug>/source.html を読み込み，
  contents/<slug>/index.html      （ヘッダー・フッター込みの実ページ）
  assets/score-data.js            （スコア譜のデータ。全記事分をこのスクリプトが毎回作り直す）
を書き出す。外部ライブラリ不要（Python標準ライブラリのみ）。

使い方:
    python tools/build.py

記事を追加・編集したいときは，contents/<slug>/source.html だけを書けばよい。
ヘッダー（アイコンナビ）・フッター・<head>まわりの定型部分や assets/score-data.js は
このスクリプトが毎回自動生成するので，手で直接編集しないこと（次回のビルドで上書きされる）。

--- contents/<slug>/source.html の書式 ---

ファイル先頭に <!--meta ... --> ブロックでメタデータを書き，
その下に記事本文をHTML片（<p>や<table>など，<section>や<html>は不要）で書く。

必須項目:
    title   記事タイトル
    kind    種別（例：作品，楽曲探索，研究メモ）。サイト表示には出さない内部用の分類で，
            source.html を読む人（自分）が識別しやすくするためだけに使う
    date    投稿日（YYYY-MM-DD）
    pc1     記事ベクトルの第1主成分の仮値（-1〜1）。index.htmlのスコア譜ではソプラノ段の音高になる

省略可能な項目（省略時は自動で補う）:
    series      連作ID。同じseriesを持つ記事どうしが連桁でつながる（既定 なし）
    dummy       true にするとDEMO CONTENTバナー・noindexが自動で付く（既定 false）
    heading     ページ見出し(h1)がtitleと違う場合だけ指定（既定 titleと同じ）
    eyebrow     見出し上の小さなラベル（既定 "{年}"）。「作品」「研究記録」等の
                カテゴリ名は出さない方針（記事は分類ラベルを名乗らない）
    deck        見出し下の一言（既定：dummyならデモ表記，通常は空）
    description meta descriptionタグの内容（既定：自動生成）
    pc2/pc3/pc4 第2〜4主成分の仮値（-1〜1）。index.htmlのスコア譜ではそれぞれ
                アルト／テノール／バス段の音高になり，4段で1つの記事＝1つの和音を表す
                （パート譜では使わず，pc1のみ参照する）。省略時はslugから決定論的に
                生成した仮値で自動的に埋める（毎回同じ値になるが，本文からの算出ではない）

例:
    <!--meta
    title: Lyric Pieces Op. 2
    kind: 作品
    date: 2021-08-15
    pc1: 0.50
    -->
    <p>本文...</p>
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENTS = ROOT / "contents"

DEMO_BANNER = (
    "DEMO CONTENT — これは実際の記事ではなく，スコア譜の仕組みを示すための"
    "仮のプレースホルダーです．本文はダミーであり，実際の内容ではありません．"
)

HEADER_NAV = """    <header class="page-header">
        <svg class="icon-compact" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="ページ内ナビゲーション">
            <g class="hotspot" tabindex="0" data-target="/index.html#abstract" data-label="ABSTRACT">
                <title>ABSTRACT</title>
                <circle class="shape" cx="150" cy="92" r="76" fill="var(--k-blue)" fill-opacity="0.16" stroke="var(--ink)" stroke-width="1.3"></circle>
            </g>
            <g class="hotspot" tabindex="0" data-target="/index.html#identity" data-label="IDENTITY">
                <title>IDENTITY</title>
                <polygon class="shape" points="52,192 128,150 90,242" fill="var(--k-yellow)" stroke="var(--ink)" stroke-width="1.2"></polygon>
            </g>
            <g class="hotspot" tabindex="0" data-target="/index.html#score-frame" data-label="CONTENTS">
                <title>CONTENTS</title>
                <rect class="shape" x="176" y="176" width="16" height="16" fill="var(--ink)"></rect>
                <rect class="shape" x="176" y="208" width="16" height="16" fill="var(--ink)"></rect>
                <rect class="shape" x="208" y="192" width="16" height="16" fill="var(--ink)"></rect>
                <rect class="shape" x="208" y="224" width="16" height="16" fill="var(--ink)"></rect>
            </g>
            <g class="hotspot" tabindex="0" data-target="/index.html#contact" data-label="CONTACT">
                <title>CONTACT</title>
                <circle class="shape" cx="222" cy="52" r="10" fill="var(--k-red)"></circle>
            </g>
            <g class="hotspot" tabindex="0" data-target="/index.html#help" data-label="HELP">
                <title>HELP</title>
                <line class="shape" x1="8" y1="150" x2="70" y2="112" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"></line>
                <circle class="shape" cx="70" cy="112" r="3.2" fill="var(--ink)"></circle>
            </g>
            <g class="hotspot" tabindex="0" data-target="/index.html#satellites" data-label="SATELLITES">
                <title>SATELLITES</title>
                <circle class="shape" cx="24" cy="18" r="11" fill="var(--k-blue-deep)" stroke="var(--ink)" stroke-width="1.2"></circle>
                <circle class="shape" cx="42" cy="32" r="5.5" fill="var(--k-blue-deep)"></circle>
                <circle class="shape" cx="26" cy="42" r="3.5" fill="var(--k-blue-deep)"></circle>
            </g>
        </svg>
        <div class="header-text">
            <a class="back-link" href="/index.html">← index.html</a>
            <p class="eyebrow">{eyebrow}</p>
            <h1 class="title">{heading}</h1>
            <p class="deck">{deck}</p>
        </div>
    </header>"""

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
{robots}    <meta name="description" content="{description}">
    <link rel="icon" href="../../icon.JPG">
    <title>{title} | 壮大なる愚作</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=PT+Mono&family=Noto+Music&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../assets/score.css">
</head>
<body>
{header}

    <div class="page">
{banner}        <section class="article-body">
{body}
        </section>

        <div class="score-frame" id="score-frame">
            <span class="corner-bl"></span><span class="corner-br"></span>
            <div id="score-canvas-mount"></div>
        </div>
    </div>

    <footer class="site-footer">
        <p>© 2024 壮大なる愚作 MSW-DSCH</p>
    </footer>

    <div class="modal-overlay" id="modalOverlay" hidden>
        <div class="modal-panel" role="dialog" aria-modal="true">
            <button class="modal-close" type="button" id="modalClose" aria-label="閉じる">×</button>
            <div class="modal-body" id="modalBody"></div>
        </div>
    </div>

    <script src="/assets/score-data.js"></script>
    <script>
        window.SCORE_FOCUS_ID = "{slug}";
        window.SCORE_HOME_HREF = "/index.html#score-frame";
    </script>
    <script src="/assets/score.js"></script>
</body>
</html>
"""

SCORE_DATA_HEADER = """/*
 * 壮大なる愚作 — スコアデータ（楽譜としてのグラフ）
 *
 * このファイルは tools/build.py が contents 以下の各 source.html から自動生成する。
 * 直接編集しないこと（次回 `python tools/build.py` を実行すると上書きされる）。
 * 記事を追加・編集するには，該当する contents/<slug>/source.html を書き換えてから
 * ビルドスクリプトを実行する。
 */

window.SCORE_DATA = {
  nodes: [
"""


def parse_source(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--meta\s*\n(.*?)\n-->\s*\n?(.*)", text, re.S)
    if not m:
        raise ValueError(f"{path}: '<!--meta ... -->' block not found at top of file")
    meta_block, body = m.group(1), m.group(2)
    meta = {}
    for line in meta_block.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    return meta, body.strip()


def truthy(value, default=False):
    if value is None or value == "":
        return default
    return value.strip().lower() in ("true", "yes", "1")


def hash_pc(slug, axis):
    """slugとaxis名から-1〜1の決定論的な仮値を作る（pc2〜pc4の既定値用）。"""
    digest = hashlib.sha256(f"{slug}:{axis}".encode("utf-8")).hexdigest()
    n = int(digest[:8], 16)
    return round((n / 0xFFFFFFFF) * 2 - 1, 4)


def build_one(slug_dir):
    slug = slug_dir.name
    meta, body = parse_source(slug_dir / "source.html")

    for required in ("title", "kind", "date", "pc1"):
        if required not in meta or meta[required] == "":
            raise ValueError(f"{slug}: source.html is missing required field '{required}'")

    title = meta["title"]
    kind = meta["kind"]
    date = meta["date"]
    year = date[:4]
    pc1 = float(meta["pc1"])
    pc2 = float(meta["pc2"]) if meta.get("pc2") else hash_pc(slug, "pc2")
    pc3 = float(meta["pc3"]) if meta.get("pc3") else hash_pc(slug, "pc3")
    pc4 = float(meta["pc4"]) if meta.get("pc4") else hash_pc(slug, "pc4")
    series = meta.get("series") or None
    dummy = truthy(meta.get("dummy"), default=False)

    heading = meta.get("heading") or title
    eyebrow = meta.get("eyebrow") or year
    deck = meta.get("deck")
    if deck is None:
        deck = "これはデモ記事です．" if dummy else ""
    description = meta.get("description")
    if description is None:
        description = (
            "デモ記事。スコア譜の仕組みを示すための仮データ。"
            if dummy else f"{title}（{year}）。壮大なる愚作より。"
        )

    html = PAGE_TEMPLATE.format(
        robots='    <meta name="robots" content="noindex">\n' if dummy else "",
        description=description,
        title=title,
        header=HEADER_NAV.format(eyebrow=eyebrow, heading=heading, deck=deck),
        banner=(f'        <div class="demo-banner">{DEMO_BANNER}</div>\n' if dummy else ""),
        body=body,
        slug=slug,
    )
    (slug_dir / "index.html").write_text(html, encoding="utf-8", newline="\n")

    return {
        "id": slug,
        "title": title,
        "url": f"/contents/{slug}/",
        "date": date,
        "kind": kind,
        "pc1": pc1,
        "pc2": pc2,
        "pc3": pc3,
        "pc4": pc4,
        "series": series,
        "dummy": dummy,
    }


def js_value(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if v is None:
        return "null"
    if isinstance(v, float):
        return repr(round(v, 4))
    if isinstance(v, int):
        return str(v)
    return json.dumps(v, ensure_ascii=False)


def write_score_data(nodes):
    lines = [SCORE_DATA_HEADER.rstrip("\n")]
    for i, n in enumerate(nodes):
        comma = "," if i < len(nodes) - 1 else ""
        lines.append("    {")
        lines.append(f'      id: {js_value(n["id"])},')
        lines.append(f'      title: {js_value(n["title"])},')
        lines.append(f'      url: {js_value(n["url"])},')
        lines.append(f'      date: {js_value(n["date"])},')
        lines.append(f'      kind: {js_value(n["kind"])},')
        lines.append(f'      pc1: {js_value(n["pc1"])},')
        lines.append(f'      pc2: {js_value(n["pc2"])},')
        lines.append(f'      pc3: {js_value(n["pc3"])},')
        lines.append(f'      pc4: {js_value(n["pc4"])},')
        lines.append(f'      series: {js_value(n["series"])},')
        lines.append(f'      dummy: {js_value(n["dummy"])}')
        lines.append("    }" + comma)
    lines.append("  ]")
    lines.append("};")
    lines.append("")
    (ROOT / "assets" / "score-data.js").write_text("\n".join(lines), encoding="utf-8", newline="\n")


def main():
    slug_dirs = sorted(p for p in CONTENTS.iterdir() if p.is_dir() and (p / "source.html").exists())
    if not slug_dirs:
        raise SystemExit("contents/ 以下に source.html が見つかりません")

    nodes = []
    for slug_dir in slug_dirs:
        try:
            nodes.append(build_one(slug_dir))
        except Exception as e:
            raise SystemExit(f"エラー（{slug_dir.name}）: {e}")

    nodes.sort(key=lambda n: n["date"])
    write_score_data(nodes)

    real_count = sum(1 for n in nodes if not n["dummy"])
    dummy_count = len(nodes) - real_count
    print(f"生成しました：記事{len(nodes)}件（実記事{real_count}件／デモ{dummy_count}件）")
    print("  -> contents/*/index.html")
    print("  -> assets/score-data.js")


if __name__ == "__main__":
    main()
