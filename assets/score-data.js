/*
 * 壮大なる愚作 — スコアデータ（楽譜としてのグラフ）
 *
 * このファイルは tools/build.py が contents 以下の各 source.html から自動生成する。
 * 直接編集しないこと（次回 `python tools/build.py` を実行すると上書きされる）。
 * 記事を追加・編集するには，該当する contents/<slug>/source.html を書き換えてから
 * ビルドスクリプトを実行する。
 *
 * pc1〜pc4 は tools/vectorize.py が全記事の本文から求めた第1〜第4主成分
 * （TF-IDF＋主成分分析。軸ごとに -1〜1 へ正規化してある）。スコア譜の
 * ソプラノ＝pc1／アルト＝pc4／テノール＝pc3／バス＝pc2 の音高になる。
 * projections は，各記事のベクトルの向きを軸として全記事を射影した値で，
 * その記事のページのパート譜の音高になる（焦点自身は必ず譜表の一番上）。
 * similarity は記事どうしのコサイン類似度（0〜1，最も似た相手が1）で，
 * 記事ページの「次の音へ」が次の記事を選ぶ確率の重みになる。
 * 語彙 919 語／正規化 peak／寄与率 pc1 11.5%，pc2 10.1%，pc3 8.3%，pc4 7.1%
 */

window.SCORE_DATA = {
  nodes: [
    {
      id: "festive-sonata-op1",
      title: "Festive Sonata Op. 1",
      url: "/contents/festive-sonata-op1/",
      date: "2021-03-09",
      kind: "作品",
      pc1: -0.4308,
      pc2: -0.1347,
      pc3: -0.0239,
      pc4: -0.0733,
      series: null,
      expression: "composition",
      dummy: false
    },
    {
      id: "shostakovich-symphony-7",
      title: "なぜ私は「壮大なる愚作」を名乗るのか",
      url: "/contents/shostakovich-symphony-7/",
      date: "2021-04-01",
      kind: "エッセイ",
      pc1: -0.2431,
      pc2: -0.1211,
      pc3: -0.0328,
      pc4: 0.0046,
      series: null,
      expression: "impression",
      dummy: false
    },
    {
      id: "lyric-pieces-op2",
      title: "Lyric Pieces Op. 2",
      url: "/contents/lyric-pieces-op2/",
      date: "2021-08-15",
      kind: "作品",
      pc1: -0.3658,
      pc2: -0.0719,
      pc3: -0.0188,
      pc4: 0.2691,
      series: null,
      expression: "composition",
      dummy: false
    },
    {
      id: "staff-meeting-in-progress",
      title: "staff meeting in progress",
      url: "/contents/staff-meeting-in-progress/",
      date: "2022-07-01",
      kind: "作品",
      pc1: -0.0867,
      pc2: 0.045,
      pc3: 0.0444,
      pc4: 1.0,
      series: "anti-composition",
      expression: "composition",
      dummy: false
    },
    {
      id: "anti-composition",
      title: "Anti Composition",
      url: "/contents/anti-composition/",
      date: "2023-07-01",
      kind: "作品",
      pc1: -0.0831,
      pc2: -0.018,
      pc3: 0.0306,
      pc4: 0.9296,
      series: "anti-composition",
      expression: "composition",
      dummy: false
    },
    {
      id: "five-in-a-row",
      title: "Five in a Row",
      url: "/contents/five-in-a-row/",
      date: "2024-07-01",
      kind: "作品",
      pc1: 0.0214,
      pc2: 0.0071,
      pc3: -0.014,
      pc4: 0.7587,
      series: null,
      expression: "composition",
      dummy: false
    },
    {
      id: "street-blockage-robot-1",
      title: "狭隘道路を多く有する地区における震災時の道路閉塞評価モデルの提案",
      url: "/contents/street-blockage-robot-1/",
      date: "2024-11-01",
      kind: "研究紹介",
      pc1: 0.9529,
      pc2: -0.2323,
      pc3: -0.6213,
      pc4: -0.1653,
      series: "street-blockage-robot",
      expression: "composition",
      dummy: false
    },
    {
      id: "street-blockage-robot-2",
      title: "狭隘道路に関する試⾏的提案 --デジタルツインと「外構ロボット」によるシステム構築--",
      url: "/contents/street-blockage-robot-2/",
      date: "2025-02-01",
      kind: "研究紹介",
      pc1: 1.0,
      pc2: -0.2226,
      pc3: -0.6308,
      pc4: -0.167,
      series: "street-blockage-robot",
      expression: "composition",
      dummy: false
    },
    {
      id: "ohenro-r1d0",
      title: "お遍路旅行記 第1回 第0日 — 品川駅 → 太平洋",
      url: "/contents/ohenro-r1d0/",
      date: "2025-02-11",
      kind: "旅行記",
      pc1: 0.06,
      pc2: 0.8608,
      pc3: -0.0236,
      pc4: -0.2067,
      series: "ohenro",
      expression: "improvisation",
      dummy: false
    },
    {
      id: "ohenro-r1d1",
      title: "お遍路旅行記 第1回 第1日 — 太平洋 → 霊山寺",
      url: "/contents/ohenro-r1d1/",
      date: "2025-02-12",
      kind: "旅行記",
      pc1: 0.0112,
      pc2: 1.0,
      pc3: 0.0195,
      pc4: -0.2881,
      series: "ohenro",
      expression: "improvisation",
      dummy: false
    },
    {
      id: "ohenro-r1d2",
      title: "お遍路旅行記 第1回 第2日 — 霊山寺 → 安楽寺",
      url: "/contents/ohenro-r1d2/",
      date: "2025-02-13",
      kind: "旅行記",
      pc1: 0.0531,
      pc2: 0.8549,
      pc3: -0.0198,
      pc4: -0.2135,
      series: "ohenro",
      expression: "improvisation",
      dummy: false
    },
    {
      id: "street-blockage-robot-3",
      title: "ロボットと協働する耐災害スマートシティ",
      url: "/contents/street-blockage-robot-3/",
      date: "2025-05-01",
      kind: "研究紹介",
      pc1: 0.6846,
      pc2: -0.1716,
      pc3: -0.4991,
      pc4: -0.0653,
      series: "street-blockage-robot",
      expression: "composition",
      dummy: false
    },
    {
      id: "after-ciurlionis",
      title: "After Čiurlionis: the diptych “Prelude. Fugue” Čt 88, 89",
      url: "/contents/after-ciurlionis/",
      date: "2026-04-10",
      kind: "作品",
      pc1: -0.259,
      pc2: -0.144,
      pc3: -0.0641,
      pc4: 0.2294,
      series: null,
      expression: "composition",
      dummy: false
    },
    {
      id: "bn_discretization",
      title: "構造物のシステム信頼性評価のための限界状態面情報を用いたベイジアンネットワーク変数離散化",
      url: "/contents/bn_discretization/",
      date: "2026-08-01",
      kind: "研究紹介",
      pc1: 0.7087,
      pc2: -0.2068,
      pc3: 1.0,
      pc4: -0.195,
      series: "bn_research",
      expression: "composition",
      dummy: false
    },
    {
      id: "bn_sampling",
      title: "リスク情報を用いた拡張ベイジアンネットワークの適応的構築 --サンプリング・変数離散化・CPT学習によるシステム信頼性評価--",
      url: "/contents/bn_sampling/",
      date: "2026-08-01",
      kind: "研究紹介",
      pc1: 0.74,
      pc2: -0.21,
      pc3: 0.9612,
      pc4: -0.2197,
      series: "bn_research",
      expression: "composition",
      dummy: false
    },
    {
      id: "dukas",
      title: "ポール・デュカス",
      url: "/contents/dukas/",
      date: "2026-08-25",
      kind: "楽曲探索",
      pc1: -0.603,
      pc2: -0.2811,
      pc3: -0.0423,
      pc4: -0.765,
      series: null,
      expression: "improvisation",
      dummy: false
    },
    {
      id: "mosolov",
      title: "アレクサンドル・モソロフ",
      url: "/contents/mosolov/",
      date: "2026-08-25",
      kind: "楽曲探索",
      pc1: -0.413,
      pc2: -0.1324,
      pc3: -0.0328,
      pc4: 0.2575,
      series: null,
      expression: "improvisation",
      dummy: false
    },
    {
      id: "popov",
      title: "ガヴリイル・ポポーフ",
      url: "/contents/popov/",
      date: "2026-08-25",
      kind: "楽曲探索",
      pc1: -0.5175,
      pc2: -0.1598,
      pc3: -0.0524,
      pc4: 0.0568,
      series: null,
      expression: "improvisation",
      dummy: false
    },
    {
      id: "roslavets",
      title: "ニコライ・ロースラヴェツ",
      url: "/contents/roslavets/",
      date: "2026-08-25",
      kind: "楽曲探索",
      pc1: -0.166,
      pc2: -0.1422,
      pc3: 0.1495,
      pc4: 0.1216,
      series: null,
      expression: "improvisation",
      dummy: false
    },
    {
      id: "hindemith",
      title: "パウル・ヒンデミット",
      url: "/contents/hindemith/",
      date: "2026-08-30",
      kind: "楽曲探索",
      pc1: -0.5714,
      pc2: -0.2554,
      pc3: -0.082,
      pc4: -0.5349,
      series: null,
      expression: "improvisation",
      dummy: false
    },
    {
      id: "janacek",
      title: "レオシュ・ヤナーチェク",
      url: "/contents/janacek/",
      date: "2026-08-30",
      kind: "楽曲探索",
      pc1: -0.4925,
      pc2: -0.2639,
      pc3: -0.0477,
      pc4: -0.7334,
      series: null,
      expression: "improvisation",
      dummy: false
    }
  ],

  // パート譜の音高：projections[焦点の記事][相手の記事]
  projections: {
    "festive-sonata-op1": { "festive-sonata-op1": 6.0214, "shostakovich-symphony-7": -0.0546, "lyric-pieces-op2": 0.3508, "staff-meeting-in-progress": -0.4429, "anti-composition": -0.1488, "five-in-a-row": -0.5495, "street-blockage-robot-1": -0.8862, "street-blockage-robot-2": -1.0, "ohenro-r1d0": -0.4885, "ohenro-r1d1": -0.6446, "ohenro-r1d2": -0.6327, "street-blockage-robot-3": -0.5738, "after-ciurlionis": -0.0022, "bn_discretization": -0.7629, "bn_sampling": -0.7321, "dukas": 0.3709, "mosolov": 0.0311, "popov": 0.2579, "roslavets": -0.3631, "hindemith": 0.3665, "janacek": -0.1167 },
    "shostakovich-symphony-7": { "festive-sonata-op1": -0.0636, "shostakovich-symphony-7": 7.5761, "lyric-pieces-op2": -0.3892, "staff-meeting-in-progress": -0.6791, "anti-composition": -0.7256, "five-in-a-row": -0.4963, "street-blockage-robot-1": -0.75, "street-blockage-robot-2": -0.7328, "ohenro-r1d0": -0.6715, "ohenro-r1d1": -0.6836, "ohenro-r1d2": -0.5938, "street-blockage-robot-3": -0.3734, "after-ciurlionis": -0.4754, "bn_discretization": -0.6313, "bn_sampling": -0.6019, "dukas": -0.6016, "mosolov": 0.6162, "popov": 1.0, "roslavets": -0.3224, "hindemith": 0.1754, "janacek": -0.5764 },
    "lyric-pieces-op2": { "festive-sonata-op1": 0.384, "shostakovich-symphony-7": -0.3657, "lyric-pieces-op2": 6.8767, "staff-meeting-in-progress": -0.3746, "anti-composition": -0.0051, "five-in-a-row": -0.4318, "street-blockage-robot-1": -0.8046, "street-blockage-robot-2": -1.0, "ohenro-r1d0": -0.4271, "ohenro-r1d1": -0.6289, "ohenro-r1d2": -0.5939, "street-blockage-robot-3": -0.8253, "after-ciurlionis": 0.2706, "bn_discretization": -0.8056, "bn_sampling": -0.7895, "dukas": -0.2561, "mosolov": 0.0738, "popov": 0.4809, "roslavets": -0.3973, "hindemith": -0.002, "janacek": -0.3785 },
    "staff-meeting-in-progress": { "festive-sonata-op1": -0.4352, "shostakovich-symphony-7": -0.5727, "lyric-pieces-op2": -0.3363, "staff-meeting-in-progress": 6.4706, "anti-composition": 1.0, "five-in-a-row": 0.3228, "street-blockage-robot-1": -0.6358, "street-blockage-robot-2": -0.7299, "ohenro-r1d0": -0.3849, "ohenro-r1d1": -0.2463, "ohenro-r1d2": -0.4815, "street-blockage-robot-3": -0.3186, "after-ciurlionis": -0.3981, "bn_discretization": -0.4991, "bn_sampling": -0.5533, "dukas": -0.6063, "mosolov": -0.263, "popov": -0.3673, "roslavets": -0.0794, "hindemith": -0.6281, "janacek": -0.2575 },
    "anti-composition": { "festive-sonata-op1": -0.1462, "shostakovich-symphony-7": -0.6119, "lyric-pieces-op2": -0.0046, "staff-meeting-in-progress": 1.0, "anti-composition": 6.3013, "five-in-a-row": 0.2541, "street-blockage-robot-1": -0.5355, "street-blockage-robot-2": -0.4843, "ohenro-r1d0": -0.5366, "ohenro-r1d1": -0.6491, "ohenro-r1d2": -0.281, "street-blockage-robot-3": -0.5296, "after-ciurlionis": -0.3774, "bn_discretization": -0.3561, "bn_sampling": -0.5657, "dukas": -0.3333, "mosolov": -0.1776, "popov": -0.5045, "roslavets": -0.4818, "hindemith": -0.5298, "janacek": -0.4505 },
    "five-in-a-row": { "festive-sonata-op1": -0.8855, "shostakovich-symphony-7": -0.6863, "lyric-pieces-op2": -0.6356, "staff-meeting-in-progress": 0.5293, "anti-composition": 0.4167, "five-in-a-row": 10.3316, "street-blockage-robot-1": -0.4655, "street-blockage-robot-2": -0.6554, "ohenro-r1d0": -0.4586, "ohenro-r1d1": -0.9059, "ohenro-r1d2": -0.5359, "street-blockage-robot-3": -0.5798, "after-ciurlionis": 0.2828, "bn_discretization": -0.7209, "bn_sampling": -0.6336, "dukas": -0.9335, "mosolov": -0.2835, "popov": -0.9912, "roslavets": -0.4107, "hindemith": -1.0, "janacek": -0.7787 },
    "street-blockage-robot-1": { "festive-sonata-op1": -0.2256, "shostakovich-symphony-7": -0.1638, "lyric-pieces-op2": -0.1871, "staff-meeting-in-progress": -0.1647, "anti-composition": -0.1387, "five-in-a-row": -0.0735, "street-blockage-robot-1": 1.6432, "street-blockage-robot-2": 1.0, "ohenro-r1d0": -0.1688, "ohenro-r1d1": -0.2084, "ohenro-r1d2": -0.1458, "street-blockage-robot-3": 0.3028, "after-ciurlionis": -0.1724, "bn_discretization": 0.0394, "bn_sampling": -0.0206, "dukas": -0.2543, "mosolov": -0.2297, "popov": -0.2461, "roslavets": -0.1576, "hindemith": -0.2374, "janacek": -0.1909 },
    "street-blockage-robot-2": { "festive-sonata-op1": -0.2545, "shostakovich-symphony-7": -0.1601, "lyric-pieces-op2": -0.2325, "staff-meeting-in-progress": -0.1891, "anti-composition": -0.1254, "five-in-a-row": -0.1035, "street-blockage-robot-1": 1.0, "street-blockage-robot-2": 1.5605, "ohenro-r1d0": -0.1407, "ohenro-r1d1": -0.2071, "ohenro-r1d2": -0.1467, "street-blockage-robot-3": 0.5074, "after-ciurlionis": -0.1664, "bn_discretization": -0.038, "bn_sampling": 0.0835, "dukas": -0.2756, "mosolov": -0.2341, "popov": -0.2498, "roslavets": -0.1439, "hindemith": -0.2547, "janacek": -0.2292 },
    "ohenro-r1d0": { "festive-sonata-op1": -0.1751, "shostakovich-symphony-7": -0.2066, "lyric-pieces-op2": -0.1399, "staff-meeting-in-progress": -0.1404, "anti-composition": -0.1958, "five-in-a-row": -0.102, "street-blockage-robot-1": -0.2377, "street-blockage-robot-2": -0.1982, "ohenro-r1d0": 2.2872, "ohenro-r1d1": 1.0, "ohenro-r1d2": 0.5367, "street-blockage-robot-3": -0.1517, "after-ciurlionis": -0.2593, "bn_discretization": -0.2279, "bn_sampling": -0.2372, "dukas": -0.3169, "mosolov": -0.2455, "popov": -0.2283, "roslavets": -0.1995, "hindemith": -0.2968, "janacek": -0.2652 },
    "ohenro-r1d1": { "festive-sonata-op1": -0.2139, "shostakovich-symphony-7": -0.1947, "lyric-pieces-op2": -0.1907, "staff-meeting-in-progress": -0.0832, "anti-composition": -0.2192, "five-in-a-row": -0.1866, "street-blockage-robot-1": -0.2717, "street-blockage-robot-2": -0.2701, "ohenro-r1d0": 0.9259, "ohenro-r1d1": 2.0696, "ohenro-r1d2": 1.0, "street-blockage-robot-3": -0.2556, "after-ciurlionis": -0.2236, "bn_discretization": -0.2231, "bn_sampling": -0.2332, "dukas": -0.2574, "mosolov": -0.2288, "popov": -0.2017, "roslavets": -0.217, "hindemith": -0.2765, "janacek": -0.2485 },
    "ohenro-r1d2": { "festive-sonata-op1": -0.21, "shostakovich-symphony-7": -0.1691, "lyric-pieces-op2": -0.18, "staff-meeting-in-progress": -0.1626, "anti-composition": -0.0949, "five-in-a-row": -0.1104, "street-blockage-robot-1": -0.1901, "street-blockage-robot-2": -0.1913, "ohenro-r1d0": 0.4969, "ohenro-r1d1": 1.0, "ohenro-r1d2": 2.0269, "street-blockage-robot-3": -0.1879, "after-ciurlionis": -0.1879, "bn_discretization": -0.2233, "bn_sampling": -0.2043, "dukas": -0.2495, "mosolov": -0.1908, "popov": -0.2691, "roslavets": -0.2129, "hindemith": -0.2278, "janacek": -0.262 },
    "street-blockage-robot-3": { "festive-sonata-op1": -0.2878, "shostakovich-symphony-7": -0.1607, "lyric-pieces-op2": -0.3782, "staff-meeting-in-progress": -0.1626, "anti-composition": -0.2704, "five-in-a-row": -0.1805, "street-blockage-robot-1": 0.5968, "street-blockage-robot-2": 1.0, "ohenro-r1d0": -0.2123, "ohenro-r1d1": -0.3864, "ohenro-r1d2": -0.284, "street-blockage-robot-3": 3.351, "after-ciurlionis": -0.1832, "bn_discretization": -0.1119, "bn_sampling": -0.0236, "dukas": -0.4189, "mosolov": -0.3484, "popov": -0.4718, "roslavets": -0.3479, "hindemith": -0.3854, "janacek": -0.3337 },
    "after-ciurlionis": { "festive-sonata-op1": -0.003, "shostakovich-symphony-7": -0.5639, "lyric-pieces-op2": 0.3417, "staff-meeting-in-progress": -0.5601, "anti-composition": -0.5308, "five-in-a-row": 0.2426, "street-blockage-robot-1": -0.936, "street-blockage-robot-2": -0.9038, "ohenro-r1d0": -1.0, "ohenro-r1d1": -0.9312, "ohenro-r1d2": -0.7825, "street-blockage-robot-3": -0.5047, "after-ciurlionis": 8.6754, "bn_discretization": -0.9517, "bn_sampling": -0.9063, "dukas": -0.3332, "mosolov": -0.4537, "popov": 0.21, "roslavets": 0.0509, "hindemith": 0.4457, "janacek": -0.6054 },
    "bn_discretization": { "festive-sonata-op1": -0.1841, "shostakovich-symphony-7": -0.1307, "lyric-pieces-op2": -0.1776, "staff-meeting-in-progress": -0.1226, "anti-composition": -0.0875, "five-in-a-row": -0.108, "street-blockage-robot-1": 0.0373, "street-blockage-robot-2": -0.036, "ohenro-r1d0": -0.1534, "ohenro-r1d1": -0.1623, "ohenro-r1d2": -0.1624, "street-blockage-robot-3": -0.0538, "after-ciurlionis": -0.1662, "bn_discretization": 1.5839, "bn_sampling": 1.0, "dukas": -0.2234, "mosolov": -0.2127, "popov": -0.2227, "roslavets": -0.0371, "hindemith": -0.2178, "janacek": -0.1629 },
    "bn_sampling": { "festive-sonata-op1": -0.1767, "shostakovich-symphony-7": -0.1247, "lyric-pieces-op2": -0.1741, "staff-meeting-in-progress": -0.1359, "anti-composition": -0.1389, "five-in-a-row": -0.0949, "street-blockage-robot-1": -0.0195, "street-blockage-robot-2": 0.0792, "ohenro-r1d0": -0.1597, "ohenro-r1d1": -0.1696, "ohenro-r1d2": -0.1485, "street-blockage-robot-3": -0.0114, "after-ciurlionis": -0.1582, "bn_discretization": 1.0, "bn_sampling": 1.5685, "dukas": -0.2082, "mosolov": -0.1965, "popov": -0.2423, "roslavets": -0.0675, "hindemith": -0.2201, "janacek": -0.201 },
    "dukas": { "festive-sonata-op1": 0.1624, "shostakovich-symphony-7": -0.226, "lyric-pieces-op2": -0.1024, "staff-meeting-in-progress": -0.2701, "anti-composition": -0.1485, "five-in-a-row": -0.2536, "street-blockage-robot-1": -0.4373, "street-blockage-robot-2": -0.4739, "ohenro-r1d0": -0.3871, "ohenro-r1d1": -0.3395, "ohenro-r1d2": -0.3291, "street-blockage-robot-3": -0.3655, "after-ciurlionis": -0.1055, "bn_discretization": -0.4052, "bn_sampling": -0.3777, "dukas": 2.5703, "mosolov": -0.0464, "popov": -0.0668, "roslavets": 0.0227, "hindemith": 0.5793, "janacek": 1.0 },
    "mosolov": { "festive-sonata-op1": 0.0339, "shostakovich-symphony-7": 0.5751, "lyric-pieces-op2": 0.0733, "staff-meeting-in-progress": -0.2911, "anti-composition": -0.1965, "five-in-a-row": -0.1913, "street-blockage-robot-1": -0.9814, "street-blockage-robot-2": -1.0, "ohenro-r1d0": -0.7449, "ohenro-r1d1": -0.7496, "ohenro-r1d2": -0.625, "street-blockage-robot-3": -0.7553, "after-ciurlionis": -0.3569, "bn_discretization": -0.9583, "bn_sampling": -0.8853, "dukas": -0.1152, "mosolov": 6.6436, "popov": 0.6168, "roslavets": 0.177, "hindemith": -0.2057, "janacek": -0.0631 },
    "popov": { "festive-sonata-op1": 0.2569, "shostakovich-symphony-7": 0.8549, "lyric-pieces-op2": 0.4376, "staff-meeting-in-progress": -0.3724, "anti-composition": -0.5115, "five-in-a-row": -0.6128, "street-blockage-robot-1": -0.963, "street-blockage-robot-2": -0.9775, "ohenro-r1d0": -0.6344, "ohenro-r1d1": -0.6054, "ohenro-r1d2": -0.8077, "street-blockage-robot-3": -0.9369, "after-ciurlionis": 0.1514, "bn_discretization": -0.9194, "bn_sampling": -1.0, "dukas": -0.1521, "mosolov": 0.565, "popov": 5.6257, "roslavets": 0.2056, "hindemith": 0.618, "janacek": -0.222 },
    "roslavets": { "festive-sonata-op1": -0.5235, "shostakovich-symphony-7": -0.3989, "lyric-pieces-op2": -0.5233, "staff-meeting-in-progress": -0.1166, "anti-composition": -0.707, "five-in-a-row": -0.3675, "street-blockage-robot-1": -0.8928, "street-blockage-robot-2": -0.8151, "ohenro-r1d0": -0.8026, "ohenro-r1d1": -0.943, "ohenro-r1d2": -0.925, "street-blockage-robot-3": -1.0, "after-ciurlionis": 0.0531, "bn_discretization": -0.2217, "bn_sampling": -0.4034, "dukas": 0.0747, "mosolov": 0.2347, "popov": 0.2977, "roslavets": 8.9022, "hindemith": -0.6326, "janacek": -0.2893 },
    "hindemith": { "festive-sonata-op1": 0.2769, "shostakovich-symphony-7": 0.1138, "lyric-pieces-op2": -0.0014, "staff-meeting-in-progress": -0.4831, "anti-composition": -0.4075, "five-in-a-row": -0.469, "street-blockage-robot-1": -0.7048, "street-blockage-robot-2": -0.7562, "ohenro-r1d0": -0.6258, "ohenro-r1d1": -0.6295, "ohenro-r1d2": -0.5187, "street-blockage-robot-3": -0.5805, "after-ciurlionis": 0.2436, "bn_discretization": -0.6819, "bn_sampling": -0.6892, "dukas": 1.0, "mosolov": -0.1429, "popov": 0.4688, "roslavets": -0.3315, "hindemith": 4.4006, "janacek": 0.5182 },
    "janacek": { "festive-sonata-op1": -0.0511, "shostakovich-symphony-7": -0.2165, "lyric-pieces-op2": -0.1513, "staff-meeting-in-progress": -0.1147, "anti-composition": -0.2007, "five-in-a-row": -0.2115, "street-blockage-robot-1": -0.3283, "street-blockage-robot-2": -0.3942, "ohenro-r1d0": -0.3238, "ohenro-r1d1": -0.3277, "ohenro-r1d2": -0.3455, "street-blockage-robot-3": -0.2912, "after-ciurlionis": -0.1917, "bn_discretization": -0.2954, "bn_sampling": -0.3645, "dukas": 1.0, "mosolov": -0.0254, "popov": -0.0975, "roslavets": -0.0878, "hindemith": 0.3002, "janacek": 2.7189 }
  },

  // 「次の音へ」の重み：similarity[今の記事][候補の記事]（コサイン類似度）
  similarity: {
    "festive-sonata-op1": { "shostakovich-symphony-7": 0.5549, "lyric-pieces-op2": 0.8566, "staff-meeting-in-progress": 0.3032, "anti-composition": 0.5258, "five-in-a-row": 0.2915, "street-blockage-robot-1": 0.0815, "street-blockage-robot-2": 0.11, "ohenro-r1d0": 0.3362, "ohenro-r1d1": 0.2873, "ohenro-r1d2": 0.3319, "street-blockage-robot-3": 0.1988, "after-ciurlionis": 0.6516, "bn_discretization": 0.1223, "bn_sampling": 0.159, "dukas": 0.9884, "mosolov": 0.7199, "popov": 0.9879, "roslavets": 0.4703, "hindemith": 1.0, "janacek": 0.6036 },
    "shostakovich-symphony-7": { "festive-sonata-op1": 0.4629, "lyric-pieces-op2": 0.2628, "staff-meeting-in-progress": 0.0672, "anti-composition": 0.0898, "five-in-a-row": 0.1862, "street-blockage-robot-1": 0.0691, "street-blockage-robot-2": 0.1557, "ohenro-r1d0": 0.1202, "ohenro-r1d1": 0.1506, "ohenro-r1d2": 0.2196, "street-blockage-robot-3": 0.1722, "after-ciurlionis": 0.228, "bn_discretization": 0.0927, "bn_sampling": 0.1206, "dukas": 0.2739, "mosolov": 0.7263, "popov": 1.0, "roslavets": 0.3172, "hindemith": 0.6114, "janacek": 0.2015 },
    "lyric-pieces-op2": { "festive-sonata-op1": 0.8416, "shostakovich-symphony-7": 0.3095, "staff-meeting-in-progress": 0.2808, "anti-composition": 0.5245, "five-in-a-row": 0.3007, "street-blockage-robot-1": 0.0921, "street-blockage-robot-2": 0.0829, "ohenro-r1d0": 0.3119, "ohenro-r1d1": 0.2477, "ohenro-r1d2": 0.303, "street-blockage-robot-3": 0.0167, "after-ciurlionis": 0.7087, "bn_discretization": 0.0608, "bn_sampling": 0.0875, "dukas": 0.5482, "mosolov": 0.6532, "popov": 1.0, "roslavets": 0.3872, "hindemith": 0.6957, "janacek": 0.3863 },
    "staff-meeting-in-progress": { "festive-sonata-op1": 0.2905, "shostakovich-symphony-7": 0.0772, "lyric-pieces-op2": 0.2739, "anti-composition": 1.0, "five-in-a-row": 0.6137, "street-blockage-robot-1": 0.0541, "street-blockage-robot-2": 0.0915, "ohenro-r1d0": 0.2183, "ohenro-r1d1": 0.3381, "ohenro-r1d2": 0.2399, "street-blockage-robot-3": 0.1723, "after-ciurlionis": 0.2401, "bn_discretization": 0.1021, "bn_sampling": 0.089, "dukas": 0.2347, "mosolov": 0.364, "popov": 0.4341, "roslavets": 0.4508, "hindemith": 0.2359, "janacek": 0.3386 },
    "anti-composition": { "festive-sonata-op1": 0.5038, "shostakovich-symphony-7": 0.1031, "lyric-pieces-op2": 0.5116, "staff-meeting-in-progress": 1.0, "five-in-a-row": 0.6228, "street-blockage-robot-1": 0.1596, "street-blockage-robot-2": 0.2801, "ohenro-r1d0": 0.1799, "ohenro-r1d1": 0.1565, "ohenro-r1d2": 0.4026, "street-blockage-robot-3": 0.1002, "after-ciurlionis": 0.3003, "bn_discretization": 0.232, "bn_sampling": 0.1302, "dukas": 0.4389, "mosolov": 0.4611, "popov": 0.4041, "roslavets": 0.2694, "hindemith": 0.3403, "janacek": 0.2767 },
    "five-in-a-row": { "festive-sonata-op1": 0.4485, "shostakovich-symphony-7": 0.3434, "lyric-pieces-op2": 0.4708, "staff-meeting-in-progress": 0.9854, "anti-composition": 1.0, "street-blockage-robot-1": 0.4876, "street-blockage-robot-2": 0.5278, "ohenro-r1d0": 0.5251, "ohenro-r1d1": 0.3404, "ohenro-r1d2": 0.6051, "street-blockage-robot-3": 0.3227, "after-ciurlionis": 0.9867, "bn_discretization": 0.2965, "bn_sampling": 0.374, "dukas": 0.489, "mosolov": 0.7453, "popov": 0.5578, "roslavets": 0.6452, "hindemith": 0.4736, "janacek": 0.4226 },
    "street-blockage-robot-1": { "festive-sonata-op1": 0.0284, "shostakovich-symphony-7": 0.0289, "lyric-pieces-op2": 0.0327, "staff-meeting-in-progress": 0.0197, "anti-composition": 0.0581, "five-in-a-row": 0.1105, "street-blockage-robot-2": 1.0, "ohenro-r1d0": 0.0372, "ohenro-r1d1": 0.0203, "ohenro-r1d2": 0.0836, "street-blockage-robot-3": 0.3849, "after-ciurlionis": 0.0451, "bn_discretization": 0.1856, "bn_sampling": 0.144, "dukas": 0.0206, "mosolov": 0.0161, "popov": 0.0501, "roslavets": 0.0673, "hindemith": 0.0391, "janacek": 0.0368 },
    "street-blockage-robot-2": { "festive-sonata-op1": 0.0384, "shostakovich-symphony-7": 0.0651, "lyric-pieces-op2": 0.0294, "staff-meeting-in-progress": 0.0333, "anti-composition": 0.1019, "five-in-a-row": 0.1196, "street-blockage-robot-1": 1.0, "ohenro-r1d0": 0.0929, "ohenro-r1d1": 0.0545, "ohenro-r1d2": 0.116, "street-blockage-robot-3": 0.5821, "after-ciurlionis": 0.083, "bn_discretization": 0.1567, "bn_sampling": 0.2607, "dukas": 0.0367, "mosolov": 0.0458, "popov": 0.0803, "roslavets": 0.1115, "hindemith": 0.0584, "janacek": 0.0393 },
    "ohenro-r1d0": { "festive-sonata-op1": 0.1533, "shostakovich-symphony-7": 0.0657, "lyric-pieces-op2": 0.1448, "staff-meeting-in-progress": 0.1039, "anti-composition": 0.0856, "five-in-a-row": 0.1556, "street-blockage-robot-1": 0.0486, "street-blockage-robot-2": 0.1215, "ohenro-r1d1": 1.0, "ohenro-r1d2": 0.672, "street-blockage-robot-3": 0.0828, "after-ciurlionis": 0.0565, "bn_discretization": 0.0417, "bn_sampling": 0.0433, "dukas": 0.0676, "mosolov": 0.0891, "popov": 0.1636, "roslavets": 0.1148, "hindemith": 0.0891, "janacek": 0.0609 },
    "ohenro-r1d1": { "festive-sonata-op1": 0.1196, "shostakovich-symphony-7": 0.0751, "lyric-pieces-op2": 0.1049, "staff-meeting-in-progress": 0.1468, "anti-composition": 0.068, "five-in-a-row": 0.0921, "street-blockage-robot-1": 0.0242, "street-blockage-robot-2": 0.065, "ohenro-r1d0": 0.9123, "ohenro-r1d2": 1.0, "street-blockage-robot-3": 0.0087, "after-ciurlionis": 0.0814, "bn_discretization": 0.0468, "bn_sampling": 0.0472, "dukas": 0.1058, "mosolov": 0.0979, "popov": 0.1741, "roslavets": 0.0987, "hindemith": 0.0978, "janacek": 0.071 },
    "ohenro-r1d2": { "festive-sonata-op1": 0.1381, "shostakovich-symphony-7": 0.1095, "lyric-pieces-op2": 0.1283, "staff-meeting-in-progress": 0.1042, "anti-composition": 0.1748, "five-in-a-row": 0.1636, "street-blockage-robot-1": 0.0998, "street-blockage-robot-2": 0.1385, "ohenro-r1d0": 0.6131, "ohenro-r1d1": 1.0, "street-blockage-robot-3": 0.0741, "after-ciurlionis": 0.1233, "bn_discretization": 0.0623, "bn_sampling": 0.0841, "dukas": 0.1273, "mosolov": 0.1415, "popov": 0.1402, "roslavets": 0.1174, "hindemith": 0.1491, "janacek": 0.0768 },
    "street-blockage-robot-3": { "festive-sonata-op1": 0.1191, "shostakovich-symphony-7": 0.1236, "lyric-pieces-op2": 0.0102, "staff-meeting-in-progress": 0.1077, "anti-composition": 0.0626, "five-in-a-row": 0.1256, "street-blockage-robot-1": 0.6612, "street-blockage-robot-2": 1.0, "ohenro-r1d0": 0.1087, "ohenro-r1d1": 0.0126, "ohenro-r1d2": 0.1066, "after-ciurlionis": 0.1475, "bn_discretization": 0.147, "bn_sampling": 0.22, "dukas": 0.0537, "mosolov": 0.0613, "popov": 0.056, "roslavets": 0.0503, "hindemith": 0.0856, "janacek": 0.0537 },
    "after-ciurlionis": { "festive-sonata-op1": 0.7244, "shostakovich-symphony-7": 0.3039, "lyric-pieces-op2": 0.8019, "staff-meeting-in-progress": 0.2786, "anti-composition": 0.3484, "five-in-a-row": 0.7129, "street-blockage-robot-1": 0.1436, "street-blockage-robot-2": 0.2646, "ohenro-r1d0": 0.1378, "ohenro-r1d1": 0.2175, "ohenro-r1d2": 0.3293, "street-blockage-robot-3": 0.2738, "bn_discretization": 0.1014, "bn_sampling": 0.1435, "dukas": 0.6175, "mosolov": 0.4835, "popov": 0.9463, "roslavets": 0.7001, "hindemith": 1.0, "janacek": 0.3788 },
    "bn_discretization": { "festive-sonata-op1": 0.0429, "shostakovich-symphony-7": 0.0389, "lyric-pieces-op2": 0.0217, "staff-meeting-in-progress": 0.0373, "anti-composition": 0.0848, "five-in-a-row": 0.0675, "street-blockage-robot-1": 0.1864, "street-blockage-robot-2": 0.1574, "ohenro-r1d0": 0.032, "ohenro-r1d1": 0.0394, "ohenro-r1d2": 0.0525, "street-blockage-robot-3": 0.086, "after-ciurlionis": 0.0319, "bn_sampling": 1.0, "dukas": 0.0248, "mosolov": 0.0095, "popov": 0.0484, "roslavets": 0.1521, "hindemith": 0.0345, "janacek": 0.0414 },
    "bn_sampling": { "festive-sonata-op1": 0.0557, "shostakovich-symphony-7": 0.0506, "lyric-pieces-op2": 0.0312, "staff-meeting-in-progress": 0.0325, "anti-composition": 0.0476, "five-in-a-row": 0.0852, "street-blockage-robot-1": 0.1447, "street-blockage-robot-2": 0.2619, "ohenro-r1d0": 0.0332, "ohenro-r1d1": 0.0397, "ohenro-r1d2": 0.0708, "street-blockage-robot-3": 0.1287, "after-ciurlionis": 0.0452, "bn_discretization": 1.0, "dukas": 0.0442, "mosolov": 0.0298, "popov": 0.0383, "roslavets": 0.1328, "hindemith": 0.0391, "janacek": 0.0156 },
    "dukas": { "festive-sonata-op1": 0.4814, "shostakovich-symphony-7": 0.1599, "lyric-pieces-op2": 0.2718, "staff-meeting-in-progress": 0.1193, "anti-composition": 0.2231, "five-in-a-row": 0.1548, "street-blockage-robot-1": 0.0288, "street-blockage-robot-2": 0.0513, "ohenro-r1d0": 0.0722, "ohenro-r1d1": 0.1239, "ohenro-r1d2": 0.149, "street-blockage-robot-3": 0.0437, "after-ciurlionis": 0.2706, "bn_discretization": 0.0345, "bn_sampling": 0.0615, "mosolov": 0.3329, "popov": 0.3854, "roslavets": 0.3687, "hindemith": 0.7812, "janacek": 1.0 },
    "mosolov": { "festive-sonata-op1": 0.6298, "shostakovich-symphony-7": 0.7616, "lyric-pieces-op2": 0.5816, "staff-meeting-in-progress": 0.3323, "anti-composition": 0.421, "five-in-a-row": 0.4237, "street-blockage-robot-1": 0.0404, "street-blockage-robot-2": 0.1148, "ohenro-r1d0": 0.1709, "ohenro-r1d1": 0.2058, "ohenro-r1d2": 0.2974, "street-blockage-robot-3": 0.0895, "after-ciurlionis": 0.3804, "bn_discretization": 0.0238, "bn_sampling": 0.0745, "dukas": 0.5978, "popov": 1.0, "roslavets": 0.6581, "hindemith": 0.5676, "janacek": 0.5354 },
    "popov": { "festive-sonata-op1": 0.7853, "shostakovich-symphony-7": 0.9528, "lyric-pieces-op2": 0.8091, "staff-meeting-in-progress": 0.3601, "anti-composition": 0.3352, "five-in-a-row": 0.2882, "street-blockage-robot-1": 0.1143, "street-blockage-robot-2": 0.1831, "ohenro-r1d0": 0.2852, "ohenro-r1d1": 0.3325, "ohenro-r1d2": 0.2679, "street-blockage-robot-3": 0.0743, "after-ciurlionis": 0.6766, "bn_discretization": 0.1097, "bn_sampling": 0.0869, "dukas": 0.629, "mosolov": 0.9087, "roslavets": 0.7258, "hindemith": 1.0, "janacek": 0.5173 },
    "roslavets": { "festive-sonata-op1": 0.515, "shostakovich-symphony-7": 0.4164, "lyric-pieces-op2": 0.4316, "staff-meeting-in-progress": 0.5152, "anti-composition": 0.3079, "five-in-a-row": 0.4593, "street-blockage-robot-1": 0.2115, "street-blockage-robot-2": 0.3503, "ohenro-r1d0": 0.2756, "ohenro-r1d1": 0.2597, "ohenro-r1d2": 0.3089, "street-blockage-robot-3": 0.092, "after-ciurlionis": 0.6897, "bn_discretization": 0.4756, "bn_sampling": 0.4152, "dukas": 0.8289, "mosolov": 0.8239, "popov": 1.0, "hindemith": 0.53, "janacek": 0.5582 },
    "hindemith": { "festive-sonata-op1": 0.6235, "shostakovich-symphony-7": 0.457, "lyric-pieces-op2": 0.4415, "staff-meeting-in-progress": 0.1535, "anti-composition": 0.2214, "five-in-a-row": 0.1919, "street-blockage-robot-1": 0.07, "street-blockage-robot-2": 0.1045, "ohenro-r1d0": 0.1218, "ohenro-r1d1": 0.1465, "ohenro-r1d2": 0.2235, "street-blockage-robot-3": 0.0891, "after-ciurlionis": 0.5608, "bn_discretization": 0.0615, "bn_sampling": 0.0696, "dukas": 1.0, "mosolov": 0.4046, "popov": 0.7844, "roslavets": 0.3017, "janacek": 0.7053 },
    "janacek": { "festive-sonata-op1": 0.294, "shostakovich-symphony-7": 0.1177, "lyric-pieces-op2": 0.1915, "staff-meeting-in-progress": 0.1721, "anti-composition": 0.1407, "five-in-a-row": 0.1338, "street-blockage-robot-1": 0.0514, "street-blockage-robot-2": 0.0548, "ohenro-r1d0": 0.065, "ohenro-r1d1": 0.0831, "ohenro-r1d2": 0.0899, "street-blockage-robot-3": 0.0437, "after-ciurlionis": 0.166, "bn_discretization": 0.0576, "bn_sampling": 0.0217, "dukas": 1.0, "mosolov": 0.2981, "popov": 0.317, "roslavets": 0.2483, "hindemith": 0.551 }
  }
};
