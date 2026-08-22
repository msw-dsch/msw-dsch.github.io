# CLAUDE.md

このファイルは，このリポジトリ（`msw-dsch.github.io`）で作業する Claude セッションのためのガイドです．

## サイト概要

個人ホームページ．GitHub Pages（`msw-dsch.github.io`）でそのまま公開している素のHTML/CSSサイト．
サイト名「壮大なる愚作」は，ショスタコーヴィチの交響曲第7番が「壮大なる愚作（駄作）」と評されることに由来する，皮肉と敬意を込めた自称．
内容は，建築学の研究記録，クラシック音楽（主にロシア・アヴァンギャルド周辺）の紹介，自作曲の作品集の3本柱．

2026-08-22 に，デザインコンセプトを一新した（下記「2026-08-22 に実施したリニューアル」を参照）．サイト内の記事どうしの関連を，カンディンスキー《小さな世界 IV》をモチーフにしたナビゲーションと，SATB4声部の生成楽譜として可視化する仕組みを導入している．

## ディレクトリ構成

```
/
├─ index.html                        トップページ．全面のアイコンナビ＋前文＋スコア譜（総譜）＋Identity/Contact/Help
├─ icon.JPG                          サイトアイコン画像（ファビコンとして使用）
├─ assets/
│   ├─ score.css                     全ページ共通スタイル（旧 style.css を置き換え）
│   ├─ score-data.js                 スコア譜のデータ（実記事＋デモ記事）。単一情報源
│   └─ score.js                      アイコンナビ／スコア譜・パート譜の描画エンジン
├─ introduction/index.html           略歴（本文未着手）
├─ research/index.html               研究記録（本文未着手。デモ記事へのリンクあり）
├─ music/
│   ├─ index.html                    楽曲探索：一覧ページ
│   └─ roslavets/index.html          記事：ロースラヴェツ（実記事，末尾にパート譜）
├─ composition/
│   ├─ index.html                    作品集：一覧ページ（受賞歴を含む）
│   ├─ festive-sonata-op1/index.html 記事：Festive Sonata Op. 1（実記事，末尾にパート譜）
│   ├─ lyric-pieces-op2/index.html   記事：Lyric Pieces Op. 2（実記事，解説文は未着手）
│   ├─ staff-meeting-in-progress/    記事：staff meeting in progress（実記事，詳細未着手）
│   └─ five-in-a-row/                記事：Five in a Row（実記事，詳細未着手）
└─ demo/                             デモ記事6件（DEMO CONTENTバナー付き，dummy: true）。
                                      研究記録に実記事がまだ無いため，仕組みを示す目的でのみ存在する。
```

## スコア譜（楽譜としてのグラフ）の仕組み

- `assets/score-data.js` の `window.SCORE_DATA.nodes` が唯一のデータソース．各記事は `id`・`title`・`url`（サイトルート相対パス）・`date`・`kind`・`pc1`（記事ベクトルの主成分の仮値，-1〜1）・`series`（連作ID，任意）・`dummy`（デモ記事かどうか）を持つ．
- 声部（S/A/T/B）は `pc1` の四分位で機械的に決まる．意味的な区分けは持たない．
- 横位置は `date`．連桁（符幹をつなぐ太線）は同一 `series` の記事どうしのみに引かれる．
- `assets/score.js` は `window.SCORE_FOCUS_ID` が未設定なら「スコア譜」（index.htmlの全ノード），設定済みなら「パート譜」（そのノードを中心とした近傍のみ）を描画する．記事ページは `<script>` で `window.SCORE_FOCUS_ID` をセットしてから `score.js` を読み込む．
- `pc1` の値，および年のみ判明している記事の月日（`isDateExact: false`）は仮の値．実データが判明次第 `score-data.js` を直接書き換える．

## 技術構成・制約

- ビルドツール，静的サイトジェネレータ（Jekyllなど）は未使用．すべて素のHTML/CSSを直接編集して公開している．
- 共通CSS/JS（`assets/score.css`・`assets/score.js`・`assets/score-data.js`）は外部ファイル化して重複を避けているが，各ページの `<header class="page-header">`（アイコンナビのSVGを含む）自体はインクルードの仕組みがないため手作業で複製している．ナビゲーションのリンク先を変えるには全ページの修正が必要（後述の既知の課題を参照）．
- 改行コードは `.gitattributes` で LF に統一している．エディタ側の自動変換設定によってはCRLFで保存されることがあるため，コミット前に確認すること．

## 2026-08-22 に実施したリニューアル

複数セッションにわたる「グラフ＝楽譜」コンセプトの検討（Artifactでの試作を経て）を，実際のリポジトリに反映した．

- **デザイン一新**：レトロな紫×MS Pゴシックの配色を廃止．カンディンスキー《小さな世界 IV》とバウハウス色彩理論（三角形＝黄，円＝青，四角＝赤）を基調にした，紙のような暖色グレー地の配色に変更．書体は Jost（見出し）／PT Serif（本文）／PT Mono（データ表示）．
- **アイコンナビ**：カンディンスキー風の図形（円＝Abstract，三角形＝Identity，格子＝Contents，点＝Contact，線＝Help）をナビゲーションとして使用．index.htmlでは全面に，他ページではヘッダー右上に小さく配置．
- **スコア譜（楽譜としてのグラフ）**：index.htmlに全記事を含む「スコア譜」，各記事ページの末尾に周辺記事だけの「パート譜」を表示．音符をクリックするとその記事へ遷移する．詳しい仕組みは上記「スコア譜の仕組み」を参照．
- **記事の個別ページ化**：作品集の4作品，楽曲探索のロースラヴェツ記事を，それぞれ独立したページに分割（旧・一覧ページの本文はそのまま個別ページへ移動し，一覧ページは短い紹介＋リンクのみに変更）．内容は一切創作しておらず，既存の実文章をそのまま移設している．
- **デモ記事6件を追加**（`demo/` 以下，`dummy: true`）：研究記録にまだ実記事が無いため，スコア譜の仕組み（特に連桁＝連作関係）を一通り確認できるようにする目的のみで作成．すべて DEMO CONTENT バナー付きで，本人の実際の文章と誤解されないようにしている．
- `meta description` を全ページに追加．デモ記事には `<meta name="robots" content="noindex">` を付与．
- `style.css` を削除し，`assets/score.css` に統一．
- レスポンシブ対応：スマホ幅（375px）でのヘッダー崩れ・横スクロールが発生しないことを確認済み．

## 2026-08-21 に実施した整理内容

- トップページ（`index.html`）のナビゲーションで，「略歴」リンクが `../introduction/index.html` となっており，サイト外に出る壊れたリンクになっていたバグを修正（`./introduction/index.html` に修正）．
- `composition/index.html` のナビゲーションで「楽曲探求」となっていた表記ゆれを，他ページと同じ「楽曲探索」に統一．
- `style.css` の `h2 { text-size: 20px; }` は無効なプロパティ名（正しくは `font-size`）で見出しサイズが反映されていなかったため修正．
- `style.css` の `.sticker::before` / `::after` にあった `boder: none;` のタイプミスを `border: none;` に修正（表示への影響はない無効プロパティだったが，コードの正確性のため）．
- `introduction/index.html`，`research/index.html` の `<title>` タグが両方とも `壮大なる愚作` のままで区別がつかなかったため，`楽曲探索`／`作品集` ページに合わせて `略歴 | 壮大なる愚作`／`研究記録 | 壮大なる愚作` に変更．
- `header.html`，`footer.html` を削除．過去にヘッダー／フッターを共通化しようとして作られたファイルだが，どのページからも読み込まれておらず（インクルードの仕組み自体が存在しない），中身も実際のページと食い違っていた（例：footer.htmlは「My Website」という仮の文言のまま，header.htmlのナビ表記は「プロフィール」で他ページの「略歴」と不一致）．死んでいて誤解を招くだけのファイルだったため整理．共通化そのものは今後の課題として下記に記載．
- `.gitattributes` を追加し，改行コードをLFに統一．編集済みファイルはLF化してコミットしている．

## 既知の課題・次のリニューアル作業で検討すべきこと

- **ヘッダーの重複**：各ページの `<header class="page-header">`（アイコンナビのSVGを含む）は，インクルードの仕組みがないため手作業で複製している．静的サイトジェネレータ（Eleventy, Astro, Hugoなど）の導入か，簡易なビルドスクリプトでのインクルード機構の用意を検討．
- **`pc1`（記事ベクトルの主成分）が仮値**：`assets/score-data.js` の各記事に人手で -1〜1 の値を割り当てているだけで，本文からベクトルを生成する仕組みはまだ無い．
- **投稿日の精度**：年のみ判明している記事は `isDateExact: false` として月日を仮に補完している．正確な日付が判明次第，直接書き換える．
- **未着手コンテンツ**：`introduction/index.html`（略歴），`research/index.html`（研究記録）は見出しのみで本文がない．研究記録は実記事が無いため，スコア譜上は `demo/` 以下のデモ記事（`dummy: true`）が代わりに表示されている．
- **Identity / Contact / Help の実内容**：index.html内の3セクションは英語見出し＋仮のプレースホルダー文章．Contactは実際の連絡先が未定（ダミーの `mail@example.invalid` を表示）．
- **作品集の未記入箇所**：`Lyric Pieces Op. 2` の解説文，「その他自作曲」2曲（staff meeting in progress，Five in a Row）の詳細情報が空欄．
- **連作（series）メタデータ**：現状は `score-data.js` に手動で連作IDを設定しているのみ．実運用でどう管理するか（記事本文中のfront-matter等）は未検討．
- **OGPタグ**：`meta description` は追加済みだが，`og:title`・`og:image` などSNSシェア向けのタグは未設定．

具体的な作業項目は `TODO.md` にチェックリストとしてまとめてある．

## git運用について

- リモート：`git@github.com:msw-dsch/msw-dsch.github.io.git`（SSH，`main`ブランチ）．
- Cowork（クラウド実行環境）のデバイスブリッジは，セキュリティ上の理由でGitHubへの外部ネットワークアクセスがサンドボックス側で遮断されている（`git push`はもちろん，`git ls-remote`によるSSH/HTTPS接続も`403 Forbidden`になる）．そのため，このセッションでは `git commit` までは実行できても，`git push` はユーザー自身のローカル端末（実際のWindows環境）で実行する必要がある．
