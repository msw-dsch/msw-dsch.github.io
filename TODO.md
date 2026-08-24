# サイトリニューアル TODO

「壮大なる愚作」ホームページのリニューアルに向けた作業リストです．詳しい経緯や技術的な背景は `CLAUDE.md` を参照してください．

## コンテンツ

- [ ] 略歴（`introduction/`）ページの本文を作成する
- [x] 研究記録の実記事を追加する（2026-08-24，`street-blockage-robot-1〜3`：狭隘道路の道路閉塞評価モデル〜卒業制作〜五月祭展示の一連の卒業研究／`bn_discretization`・`bn_sampling`：ベイジアンネットワーク研究．対応するデモ記事 research-note-* は削除済み）
- [x] `anti-composition` のHEIC写真をJPEGに変換して本文に埋め込み，スコアPDFも画像化して埋め込み（2026-08-24）
- [ ] `research/index.html` ページ自体の前文・見出し文を作成する（現状は見出しのみ）
- [x] 作品集：`staff meeting in progress`，`Five in a Row` の詳細情報を追加する（2026-08-23，`Anti Composition` も新規追加）
- [x] 作品集：`Lyric Pieces Op. 2` の解説文を追加，新規に `After Čiurlionis` を追加（2026-08-24）
- [ ] 楽曲探索：ロースラヴェツ以外の記事を追加するか検討する
- [x] Identity / Contact の実際の文面を書く（Contactは実際のメールアドレスに変更済み）
- [ ] Abstract（index.html内）の本文を書く（2026-08-24，旧「前文」は `shostakovich-symphony-7` 記事として分離し，Abstractはプレースホルダーのまま）

## スコア譜（楽譜としてのグラフ）

- [ ] `pc1`〜`pc4`（記事ベクトルの主成分）を仮値から実際の計算に置き換える（本文からの推定方法を検討）。将来的には本文をベクトル化してPCAで求める方針で合意済み
- [x] スコア譜（index.html）のSATB4段をpc1〜pc4に対応させ，1記事＝1和音の表示に変更（2026-08-23）
- [ ] 各記事の正確な投稿日を確定する（`date_exact: false` の項目）
- [ ] 連作（series）メタデータの管理方法を検討する（現状は各 `source.html` への手動記入のみ）
- [ ] パート譜の「近傍」抽出ロジック（時間的近さ・連作関係の重み付け）を調整する
- [ ] 生成楽譜を音で鳴らす（Web Audio API）。記事が増えて聴き応えが出てから着手

## デザイン

- [x] 全体の配色・フォントの方向性を決める（2026-08-22，カンディンスキー《小さな世界》＋バウハウス色彩理論を基調に一新）
- [x] レスポンシブ対応（スマホ幅でのヘッダー崩れを解消する）
- [x] 音部記号を実際のグリフに（Noto Music）
- [x] Abstract/Identity/Contact/Helpをアコーディオン化（既定は非表示，アイコンクリックで展開）／スコア譜パネルをスクロールでフェードイン表示（2026-08-24）
- [ ] サイトアイコン（`icon.JPG`）を差し替えるか検討する

## 技術

- [x] 記事ページの重複を解消する仕組みを導入する（`tools/build.py`）
- [ ] index.html・introduction/・research/ のヘッダー重複を解消する（build.py の対象外として残っている）
- [x] `meta description` を追加する
- [x] カテゴリ別一覧ページ（composition/・music/）を廃止（2026-08-23）
- [ ] OGPタグ（`og:title`，`og:image`など）を追加する（SNSシェア時の見栄え向上）
- [ ] 独自ドメインの要否を検討する
- [x] `contents/street-blockage-robot-2/Presentation_no1〜12.pdf`（分割元，計約57MB）を削除（2026-08-24，ユーザー許可済み）

## 公開

- [ ] 今回の変更分を `git push` する
