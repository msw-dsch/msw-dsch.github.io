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
├─ tools/
│   └─ build.py                      記事ページ生成スクリプト（後述）
├─ assets/
│   ├─ score.css                     全ページ共通スタイル（旧 style.css を置き換え）
│   ├─ score-data.js                 スコア譜のデータ（build.pyが自動生成，直接編集しない）
│   └─ score.js                      アイコンナビ／スコア譜・パート譜の描画エンジン
├─ introduction/index.html           略歴（本文未着手）
├─ research/index.html               研究記録（本文未着手。見出しのみ）
└─ contents/                         記事の実体はすべてここに平置き（カテゴリ別フォルダには分けない）
    ├─ festive-sonata-op1/           実記事：Festive Sonata Op. 1（パート譜＋楽譜PDF）
    │   ├─ source.html               ← 編集するのはこちら（メタデータ＋本文）
    │   ├─ index.html                ← build.pyが生成する実ページ（直接編集しない）
    │   └─ Festive_Sonata.pdf        資料（.resources のダウンロードリンクから参照）
    ├─ lyric-pieces-op2/              実記事：Lyric Pieces Op. 2（全5曲，各曲のデモ音源リンク付き）
    ├─ after-ciurlionis/             実記事：After Čiurlionis（チュルリョーニス絵画2点＋楽譜PDF2点）
    ├─ staff-meeting-in-progress/    実記事：staff meeting in progress（series: anti-composition）
    ├─ five-in-a-row/                実記事：Five in a Row（楽譜PDF＋対局盤面xlsx2点）
    ├─ anti-composition/             実記事：Anti Composition（staff meeting in progressと連作，スコア譜PDF＋演奏後パート譜写真を画像埋め込み）
    ├─ roslavets/                    実記事：ロースラヴェツ
    ├─ street-blockage-robot-1/      実記事：狭隘道路の道路閉塞評価モデル（卒業論文，series: street-blockage-robot）
    ├─ street-blockage-robot-2/      実記事：狭隘道路の試行的提案（卒業制作，模型写真＋ポスターPDF）
    ├─ street-blockage-robot-3/      実記事：耐災害スマートシティ（五月祭展示，series: street-blockage-robot）
    ├─ bn_discretization/            実記事：BNの限界状態面情報を用いた変数離散化（査読付論文，series: bn_research）
    ├─ bn_sampling/                  実記事：リスク適応型サンプリング・離散化（UQ Summer School ポスター，series: bn_research）
    └─ （研究メモ・エッセイ・日記のデモ記事3件，DEMO CONTENTバナー付き，dummy: true）
```

カテゴリ別の一覧ページ（旧 `music/index.html`，`composition/index.html`）は2026-08-23に廃止した．全記事への導線はスコア譜（index.html）と記事間の遷移（パート譜の「次の記事へ」など）に一本化している．カテゴリ（作品・楽曲探索・研究記録）はスコア譜の声部を決める要素ではないため，URL構造でもカテゴリを前提にしない．

## 記事の追加・編集（build.py）

記事ページ（`contents/<slug>/index.html`）とスコアデータ（`assets/score-data.js`）は，どちらも `tools/build.py` が `contents/<slug>/source.html` から自動生成する．**手で直接編集するのは `source.html` だけでよい**．ヘッダー（アイコンナビ）・フッター・`<head>`まわりの定型部分や，DEMO CONTENTバナー・`noindex`タグの付与も自動で行われる．

- 新しい記事を追加する：`contents/<新しいslug>/source.html` を新規作成し，`python tools/build.py` を実行する．
- 既存の記事を編集する：該当する `source.html` を書き換えてから，同じくビルドスクリプトを実行する．
- `source.html` の書式（メタデータの必須・省略可能項目，具体例）は `tools/build.py` 冒頭のdocstringに書いてある．
- ビルド後に生成される `index.html` や `assets/score-data.js` は，次のビルドで上書きされるため直接編集しないこと．

## スコア譜（楽譜としてのグラフ）の仕組み

- `assets/score-data.js` の `window.SCORE_DATA.nodes` が実行時の唯一のデータソース（ただし前述のとおりこのファイル自体はbuild.pyの生成物）．各記事は `id`（=フォルダ名のslug）・`title`・`url`（`/contents/<slug>/` 形式のサイトルート相対パス）・`date`・`kind`・`pc1`〜`pc4`（記事ベクトルの第1〜4主成分の仮値，各-1〜1）・`series`（連作ID，任意）・`dummy`（デモ記事かどうか）を持つ．
- `assets/score.js` は `window.SCORE_FOCUS_ID` が未設定なら「スコア譜」（index.html），設定済みなら「パート譜」（記事ページ）を描画する．記事ページは `<script>` で `window.SCORE_FOCUS_ID` をセットしてから `score.js` を読み込む．**両者は音高の決め方が異なる**：
  - **スコア譜（index.html）**：SATB4段はそれぞれ `pc1`→S，`pc2`→A，`pc3`→T，`pc4`→Bを直接・連続的な音高として表示する．つまり1記事＝4段すべてに同時に現れる「和音」．連桁（符幹をつなぐ太線）は同一 `series` の記事どうしに，4段すべてで並行して引かれる．
  - **パート譜（記事ページ）**：`pc1` のみを使い，1段の譜表に連続的な音高として表示する（4声部化しない）．どの記事も「主たる声部」（S/A/T/B）を1つだけ持ち，これは全記事の `pc1` の四分位から一度だけグローバルに決まる固定属性（`assignVoices()`）．パート譜の音部記号・符頭の形と色はこの声部のもの．
- 横位置はどちらも `date`．
- 音部記号は文字（S/A/Tなど）ではなく，五線の左に描く実際のグリフ（Google Fonts「Noto Music」，ト音記号＝U+1D11E／ヘ音記号＝U+1D122）．スコア譜では段ごとに1つ，パート譜ではその記事の声部の記号を1つだけ表示する．
- パート譜の末尾には，連作の重みと投稿日・pc1の近さから合成した確率で次の記事へ遷移する「次の記事へ」ボタンがある（`relationWeight()`）．
- 仕組みの説明はHELPセクション（index.html）にのみ書く．他のページ・セクションでは仕組みの説明を書かない方針．
- `pc1`〜`pc4` の値，および年のみ判明している記事の月日（`isDateExact: false`）は仮の値．`pc1` は各記事で人手で指定するが，`pc2`〜`pc4` は省略するとslugから決定論的に生成した仮値で自動的に埋まる（`tools/build.py` の `hash_pc()`）．実データが判明次第 `source.html` を直接書き換える．

## 技術構成・制約

- サイト自体はビルドツール，静的サイトジェネレータ（Jekyllなど）不使用で，GitHub Pagesにそのまま素のHTML/CSSを公開している．`tools/build.py` はこの方針に反するものではなく，記事追加時に手元で任意に実行するだけの補助スクリプト（実行しなくてもサイトの配信自体には影響しない）．
- 共通CSS/JS（`assets/score.css`・`assets/score.js`）は外部ファイル化して重複を避けている．記事ページ（`contents/<slug>/index.html`）のヘッダー等の定型部分は `tools/build.py` が自動生成するため重複の心配はないが，index.html・`introduction/`・`research/` の3ページは build.py の対象外で，`<header>` を今も手作業で複製している．ナビゲーションのリンク先を変えるにはこの3ページの修正が必要（後述の既知の課題を参照）．
- 改行コードは `.gitattributes` で LF に統一している．エディタ側の自動変換設定によってはCRLFで保存されることがあるため，コミット前に確認すること．

## 2026-08-22 に実施したリニューアル

複数セッションにわたる「グラフ＝楽譜」コンセプトの検討（Artifactでの試作を経て）を，実際のリポジトリに反映した．

- **デザイン一新**：レトロな紫×MS Pゴシックの配色を廃止．カンディンスキー《小さな世界 IV》とバウハウス色彩理論（三角形＝黄，円＝青，四角＝赤）を基調にした，紙のような暖色グレー地の配色に変更．書体は Jost（見出し）／PT Serif（本文）／PT Mono（データ表示）．
- **アイコンナビ**：カンディンスキー風の図形（円＝Abstract，三角形＝Identity，格子＝Contents，点＝Contact，線＝Help）をナビゲーションとして使用．index.htmlでは全面に，他ページではヘッダー右上に小さく配置．
- **スコア譜（楽譜としてのグラフ）**：index.htmlに全記事を含む「スコア譜」，各記事ページの末尾に周辺記事だけの「パート譜」を表示．音符をクリックするとその記事へ遷移する．詳しい仕組みは上記「スコア譜の仕組み」を参照．
- **記事の個別ページ化**：作品集の4作品，楽曲探索のロースラヴェツ記事を，それぞれ独立したページに分割．内容は一切創作しておらず，既存の実文章をそのまま移設している．
- **デモ記事6件を追加**（`dummy: true`）：研究記録にまだ実記事が無いため，スコア譜の仕組み（特に連桁＝連作関係）を一通り確認できるようにする目的のみで作成．すべて DEMO CONTENT バナー付きで，本人の実際の文章と誤解されないようにしている．
- `meta description` を全ページに追加．デモ記事には `<meta name="robots" content="noindex">` を付与．
- `style.css` を削除し，`assets/score.css` に統一．
- レスポンシブ対応：スマホ幅（375px）でのヘッダー崩れ・横スクロールが発生しないことを確認済み．
- **（同日追記）記事を `contents/` に平置き**：当初はカテゴリ別フォルダ（`composition/`，`music/`，`demo/`）に記事ページを置いていたが，カテゴリはスコア譜上の意味を持たないため，全記事を `contents/<slug>/` に統一．カテゴリの一覧ページはリンク集のみに．
- **（同日追記）パート譜を1段の譜表に変更**：各記事ページのパート譜は，SATB4段ではなく1段の五線に統一．近傍の記事は声部に関わらずこの1段上に，pc1の値をそのまま連続的な音高として配置する（声部バンドへの丸め込みをしない）．符頭の形・色で元の声部を示す．
- **（同日追記）音部記号の導入**：スコア譜・パート譜とも，声部を示すのに「S」「A」等の文字ラベルではなく，ト音記号／ヘ音記号を模した記号を使うように変更．
- **（さらに追記）音部記号を実際の字形に差し替え**：Canvas手描きの簡略記号をやめ，Google Fonts「Noto Music」（Unicode Musical Symbolsブロックの正式なグリフ）に変更．`ctx.measureText()` の `actualBoundingBoxAscent/Descent` を使って，フォントの行送りではなくグリフの実際の見た目の高さで五線に対する中心を合わせている．
- **（さらに追記）説明文をHELP以外から削減**：index.html・各一覧ページ・デモ記事の本文にあった「これは○○の仕組みを示すためのものです」といった仕組みの説明を撤去し，仕組みの説明はHELPセクションのみに集約．他の箇所は最小限の見出し・キャプションのみとした．
- **（さらに追記）パート譜に「次の記事へ」ボタンを追加**：連作の重み（あれば最優先）と，投稿日の近さ・pc1の近さから合成した確率で，重み付きランダムに次の記事へ遷移する．連作を持たない記事でも常に何らかの確率分布になるようフォールバックを用意している（`assets/score.js` の `relationWeight`）．

## 2026-08-23 に実施した作業

- **記事ページの自動生成（`tools/build.py`）を導入**：これまで記事ごとに手でHTMLを書いていたが，`contents/<slug>/source.html`（メタデータ＋本文だけ）から `contents/<slug>/index.html` と `assets/score-data.js` をまとめて生成するPython標準ライブラリのみのスクリプトを追加した．外部依存なし，実行しなくてもサイトの配信自体には影響しない（手元でのみ使う補助スクリプト）．
- これに伴い，各記事の `id` を（例：`comp-festive-sonata`のような接頭辞付きの手動ID）から，スラッグそのもの（例：`festive-sonata-op1`）に統一した．
- 既存の実記事5件・デモ記事6件はすべて `source.html` に移行し，生成結果が移行前と一致することを確認済み．
- **実記事を追加**：`staff meeting in progress`，`Five in a Row` の本文（本人による実際の作品解説）を追加．新規に `Anti Composition (2023)` を追加し，`staff meeting in progress` と `series: anti-composition` で連作として結んだ（実記事どうしの連作関係はこれが初めて）．
- **資料ダウンロード用のUI部品（`.resources`/`.resource-link`）を `assets/score.css` に追加**：PDF・XLSX・HEICなどの補助資料を，記事本文中に軽いチップ型のダウンロードリンクとして配置できるようにした．`<a>` に `download` 属性を付けており，ファイルは記事と同じ `contents/<slug>/` フォルダに置く運用．ファイル名に空白や日本語を含む場合はURLエンコードして `href` に書く（例：`Five%20in%20a%20Row_2.4.pdf`）．
- HEIC画像（iPhone標準形式）はブラウザによってはプレビューできないため，`<img>` では埋め込まずダウンロードリンクのみにしている．
- `.gitattributes` に `*.pdf`／`*.xlsx`／`*.HEIC`／`*.heic` のbinary指定を追加．
- **カテゴリラベルの表示を撤廃**：記事ページの見出し上のラベル（`eyebrow`）が既定で「作品 ｜ 2021」のように `kind`（内部分類）を名乗っていたのをやめ，年のみ（「2021」）に変更．スコア譜のツールチップも「S ｜ 作品 ｜ 2021-03-09」から `kind` を外し「S ｜ 2021-03-09（デモ）」のように，声部・日付・デモ表記のみにした．`kind` は `source.html` の中では作者向けの分類として引き続き必須項目だが，サイト上には表示しない．
- **カテゴリ別一覧ページ（`composition/index.html`・`music/index.html`）を廃止**：ディレクトリごと削除．受賞歴などの付随情報も移設せずそのまま削除した．全記事への導線はスコア譜と記事間遷移に一本化．
- **スコア譜を4声部の「和音」表示に変更**：index.htmlのSATB4段を，記事ベクトルの第1〜4主成分（`pc1`〜`pc4`）にそれぞれ直接対応させた．1記事が4段すべてに同時に音符として現れる「和音」になる．同一連作の連桁も4段で並行して引かれる．パート譜（記事ページ）側は変更なく，`pc1` のみを使った1段の譜表のまま．`pc2`〜`pc4` は `source.html` で省略可能で，省略時はslugから決定論的に生成した仮値（`tools/build.py` の `hash_pc()`）で自動的に埋まる．

## 2026-08-24 に実施した作業

- **スコア譜の和音を結ぶ縦線を削除**：4声（SATB）表示自体は正しく機能していたため，視覚的な補助線（`drawChordConnector`）のみ撤去．
- **研究記録の実記事を3件追加**：`street-blockage-robot-1`（狭隘道路の道路閉塞評価モデル，卒業論文），`street-blockage-robot-2`（狭隘道路に関する試行的提案，卒業制作），`street-blockage-robot-3`（ロボットと協働する耐災害スマートシティ，五月祭展示）．3記事は一連の卒業研究の続き物のため `series: street-blockage-robot` で統一し，連桁でつながるようにした．投稿日は本文中の記述（2024/11・2025/2・2025/5）に基づき仮に設定（`date_exact: false`）．
- **記事内に写真を埋め込む仕組みを追加**：`assets/score.css` に `.gallery`（複数枚を並べるグリッド）と `figure.figure-full`（1枚を大きく見せる）のスタイルを新設．サイトで写真を本文に埋め込むのはこれが初めて．
- **`street-blockage-robot-2` のポスターを合成**：卒業制作最終講評用に12枚に分割してエクスポートされていたPDF（`Presentation_no1〜12.pdf`）を，展示時の実物ポスター写真（`poster.JPG`）と照合して3列×4行の配置を特定し，1枚のポスターに合成．Pythonの `pymupdf`／`Pillow` を使い，Web表示用の縮小JPG（`poster_web.jpg`）とダウンロード用の高解像度PDF（`poster_full.pdf`，元の12分割PDFをラスタライズしてJPEG圧縮することで約57MBから約10MBに削減）を生成した．分割元の12個のPDFは合成後に不要となるため削除を推奨したが，削除は破壊的操作のためユーザーに確認を委ねた．
- `research/index.html` が参照していた `research-note-1`（廃止済みのデモ記事）へのリンクが壊れていたため除去．
- HEIC変換について：`pillow-heif` を導入し，HEIC→JPEG変換が可能な状態にした．ただし今回追加した写真はいずれも通常のJPEGであり，変換が必要なHEICファイルは無かった．既存の `contents/anti-composition/part-decomposed.HEIC`（ダウンロードのみでプレビュー不可）は今回は対象外．
- **（追記）`anti-composition` のHEIC画像をJPEGに変換して埋め込み**：`pillow-heif` で `part-decomposed.HEIC` → `part-decomposed.jpg` に変換（EXIF Orientationは1で回転補正不要，そのまま変換）．元のHEICは資料ダウンロードとして引き続き残している．
- **（追記）`anti-composition` のスコア譜PDFを画像化して埋め込み**：`score.pdf`（2ページ）を `pymupdf` で `score_p1.jpg`／`score_p2.jpg` にレンダリングし，`.gallery` で並べて表示．PDF自体も引き続きダウンロード資料として残している．
- **研究記録の実記事を2件追加（ベイジアンネットワーク研究）**：`bn_discretization`（限界状態面情報を用いた変数離散化，査読付論文），`bn_sampling`（リスク適応型サンプリング・離散化，UQ Summer Schoolポスター）．`series: bn_research` で連作として結んだ．`bn_sampling` はポスターPDFを画像化して埋め込み，PDF自体もダウンロード資料として提供．`bn_discretization` は投稿時点でタイトルが `bn_sampling` と同一のコピペミスになっていたため修正．
- **（追記）作品集を3件更新**：`Lyric Pieces Op. 2` に全5曲の解説文と各曲のデモ音源リンクを追加（それまで空欄だった）．新規に `After Čiurlionis: the diptych "Prelude. Fugue" Čt 88, 89` を追加し，チュルリョーニスの原画2点（`prelude.webp`／`fugue.webp`）を `.gallery` で引用表示，自作の楽譜PDF2点（Prelude／Fugue）をダウンロード資料として添付．`Festive Sonata Op. 1` の音源リンクも他記事と表記を揃えた（`target="_blank"` と矢印付きに統一）．
- **`street-blockage-robot-2` の分割元PDF（`Presentation_no1〜12.pdf`，計約57MB）を削除**：`poster_full.pdf` に合成済みで記事から参照されていなかったため，ユーザーの許可を得て削除．

## 2026-08-21 に実施した整理内容

- トップページ（`index.html`）のナビゲーションで，「略歴」リンクが `../introduction/index.html` となっており，サイト外に出る壊れたリンクになっていたバグを修正（`./introduction/index.html` に修正）．
- `composition/index.html` のナビゲーションで「楽曲探求」となっていた表記ゆれを，他ページと同じ「楽曲探索」に統一．
- `style.css` の `h2 { text-size: 20px; }` は無効なプロパティ名（正しくは `font-size`）で見出しサイズが反映されていなかったため修正．
- `style.css` の `.sticker::before` / `::after` にあった `boder: none;` のタイプミスを `border: none;` に修正（表示への影響はない無効プロパティだったが，コードの正確性のため）．
- `introduction/index.html`，`research/index.html` の `<title>` タグが両方とも `壮大なる愚作` のままで区別がつかなかったため，`楽曲探索`／`作品集` ページに合わせて `略歴 | 壮大なる愚作`／`研究記録 | 壮大なる愚作` に変更．
- `header.html`，`footer.html` を削除．過去にヘッダー／フッターを共通化しようとして作られたファイルだが，どのページからも読み込まれておらず（インクルードの仕組み自体が存在しない），中身も実際のページと食い違っていた（例：footer.htmlは「My Website」という仮の文言のまま，header.htmlのナビ表記は「プロフィール」で他ページの「略歴」と不一致）．死んでいて誤解を招くだけのファイルだったため整理．共通化そのものは今後の課題として下記に記載．
- `.gitattributes` を追加し，改行コードをLFに統一．編集済みファイルはLF化してコミットしている．

## 既知の課題・次のリニューアル作業で検討すべきこと

- **ヘッダーの重複（一部残存）**：記事ページ（`contents/`）は `tools/build.py` により重複の問題が解消された．一方 index.html・`introduction/index.html`・`research/index.html` の3ページは対象外で，`<header>` を今も手作業で複製している．これらもテンプレート化するか，静的サイトジェネレータの導入を検討．
- **`pc1`〜`pc4`（記事ベクトルの主成分）が仮値**：`contents/<slug>/source.html` の各記事に人手で -1〜1 の値を割り当てている（`pc2`〜`pc4`は省略時に自動生成される仮値）だけで，本文からベクトルを生成する仕組みはまだ無い．
- **投稿日の精度**：年のみ判明している記事は `date_exact: false` として月日を仮に補完している．正確な日付が判明次第，該当する `source.html` を直接書き換えて `python tools/build.py` を実行する．
- **未着手コンテンツ**：`introduction/index.html`（略歴），`research/index.html`（研究記録）は見出しのみで本文がない．研究記録の実記事は `street-blockage-robot-1〜3` として `contents/` に追加済みで，スコア譜上にも表示されるが，`research/index.html` 自体の本文はまだ書かれていない．
- **Identity / Contact / Help の実内容**：index.html内の3セクションは英語見出し＋仮のプレースホルダー文章．Contactは実際の連絡先が未定（ダミーの `mail@example.invalid` を表示）．
- **連作（series）メタデータ**：現状は各記事の `source.html` に手動で連作IDを設定しているのみ．記事数が増えた場合の管理方法は未検討．
- **OGPタグ**：`meta description` は追加済みだが，`og:title`・`og:image` などSNSシェア向けのタグは未設定．

具体的な作業項目は `TODO.md` にチェックリストとしてまとめてある．

## git運用について

- リモート：`git@github.com:msw-dsch/msw-dsch.github.io.git`（SSH，`main`ブランチ）．
- 作業完了後，`git push` まで実行．
