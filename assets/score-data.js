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
 * 語彙 830 語／正規化 peak／寄与率 pc1 12.2%，pc2 9.4%，pc3 8.9%，pc4 7.4%
 */

window.SCORE_DATA = {
  nodes: [
    {
      id: "festive-sonata-op1",
      title: "Festive Sonata Op. 1",
      url: "/contents/festive-sonata-op1/",
      date: "2021-03-09",
      kind: "作品",
      pc1: -0.4181,
      pc2: -0.1104,
      pc3: -0.0186,
      pc4: -0.0695,
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
      pc1: -0.2253,
      pc2: -0.0963,
      pc3: -0.0334,
      pc4: 0.0022,
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
      pc1: -0.3513,
      pc2: -0.008,
      pc3: -0.0236,
      pc4: 0.2517,
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
      pc1: -0.0953,
      pc2: 0.1521,
      pc3: 0.0271,
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
      pc1: -0.0868,
      pc2: 0.0269,
      pc3: 0.019,
      pc4: 0.9681,
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
      pc1: 0.0221,
      pc2: 0.0829,
      pc3: -0.0165,
      pc4: 0.7644,
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
      pc1: 0.9527,
      pc2: -0.1889,
      pc3: -0.6148,
      pc4: -0.1565,
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
      pc2: -0.1748,
      pc3: -0.6209,
      pc4: -0.1681,
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
      pc1: 0.0004,
      pc2: 1.0,
      pc3: -0.0735,
      pc4: -0.4411,
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
      pc1: -0.0607,
      pc2: 0.9875,
      pc3: -0.029,
      pc4: -0.4446,
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
      pc1: 0.6875,
      pc2: -0.1292,
      pc3: -0.4824,
      pc4: -0.0689,
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
      pc1: -0.2361,
      pc2: -0.1126,
      pc3: -0.0633,
      pc4: 0.2483,
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
      pc1: 0.7162,
      pc2: -0.1104,
      pc3: 1.0,
      pc4: -0.1741,
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
      pc1: 0.7451,
      pc2: -0.1212,
      pc3: 0.9625,
      pc4: -0.1978,
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
      pc1: -0.5819,
      pc2: -0.3262,
      pc3: -0.0181,
      pc4: -0.7298,
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
      pc1: -0.4053,
      pc2: -0.1008,
      pc3: -0.0302,
      pc4: 0.2685,
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
      pc1: -0.4963,
      pc2: -0.1104,
      pc3: -0.0503,
      pc4: 0.0432,
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
      pc1: -0.1536,
      pc2: -0.0844,
      pc3: 0.1516,
      pc4: 0.1383,
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
      pc1: -0.5449,
      pc2: -0.2876,
      pc3: -0.0616,
      pc4: -0.5137,
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
      pc1: -0.4685,
      pc2: -0.2883,
      pc3: -0.024,
      pc4: -0.7204,
      series: null,
      expression: "improvisation",
      dummy: false
    }
  ],

  // パート譜の音高：projections[焦点の記事][相手の記事]
  projections: {
    "festive-sonata-op1": { "festive-sonata-op1": 5.6426, "shostakovich-symphony-7": -0.1012, "lyric-pieces-op2": 0.3203, "staff-meeting-in-progress": -0.4503, "anti-composition": -0.1503, "five-in-a-row": -0.5691, "street-blockage-robot-1": -0.885, "street-blockage-robot-2": -1.0, "ohenro-r1d0": -0.4561, "ohenro-r1d1": -0.5004, "street-blockage-robot-3": -0.5882, "after-ciurlionis": -0.0285, "bn_discretization": -0.7782, "bn_sampling": -0.7384, "dukas": 0.3126, "mosolov": 0.0004, "popov": 0.21, "roslavets": -0.3836, "hindemith": 0.3178, "janacek": -0.1742 },
    "shostakovich-symphony-7": { "festive-sonata-op1": -0.1368, "shostakovich-symphony-7": 8.2897, "lyric-pieces-op2": -0.4759, "staff-meeting-in-progress": -0.7994, "anti-composition": -0.8442, "five-in-a-row": -0.5608, "street-blockage-robot-1": -0.8638, "street-blockage-robot-2": -0.8562, "ohenro-r1d0": -0.6938, "ohenro-r1d1": -0.6373, "street-blockage-robot-3": -0.4087, "after-ciurlionis": -0.5515, "bn_discretization": -0.7552, "bn_sampling": -0.7161, "dukas": -0.7273, "mosolov": 0.6429, "popov": 1.0, "roslavets": -0.3451, "hindemith": 0.1344, "janacek": -0.695 },
    "lyric-pieces-op2": { "festive-sonata-op1": 0.3576, "shostakovich-symphony-7": -0.393, "lyric-pieces-op2": 6.6101, "staff-meeting-in-progress": -0.4166, "anti-composition": -0.0043, "five-in-a-row": -0.4555, "street-blockage-robot-1": -0.8238, "street-blockage-robot-2": -1.0, "ohenro-r1d0": -0.3304, "ohenro-r1d1": -0.4557, "street-blockage-robot-3": -0.8416, "after-ciurlionis": 0.1971, "bn_discretization": -0.8314, "bn_sampling": -0.8149, "dukas": -0.2925, "mosolov": 0.0477, "popov": 0.3747, "roslavets": -0.4271, "hindemith": -0.0797, "janacek": -0.4207 },
    "staff-meeting-in-progress": { "festive-sonata-op1": -0.4506, "shostakovich-symphony-7": -0.5918, "lyric-pieces-op2": -0.3734, "staff-meeting-in-progress": 6.1936, "anti-composition": 1.0, "five-in-a-row": 0.271, "street-blockage-robot-1": -0.6532, "street-blockage-robot-2": -0.7543, "ohenro-r1d0": -0.33, "ohenro-r1d1": -0.1122, "street-blockage-robot-3": -0.3439, "after-ciurlionis": -0.4236, "bn_discretization": -0.5355, "bn_sampling": -0.5813, "dukas": -0.6159, "mosolov": -0.276, "popov": -0.3771, "roslavets": -0.1081, "hindemith": -0.6478, "janacek": -0.29 },
    "anti-composition": { "festive-sonata-op1": -0.1504, "shostakovich-symphony-7": -0.6249, "lyric-pieces-op2": -0.0039, "staff-meeting-in-progress": 1.0, "anti-composition": 6.0024, "five-in-a-row": 0.2464, "street-blockage-robot-1": -0.5304, "street-blockage-robot-2": -0.4942, "ohenro-r1d0": -0.4957, "ohenro-r1d1": -0.5464, "street-blockage-robot-3": -0.5403, "after-ciurlionis": -0.404, "bn_discretization": -0.3828, "bn_sampling": -0.5837, "dukas": -0.3324, "mosolov": -0.1788, "popov": -0.5351, "roslavets": -0.4625, "hindemith": -0.5173, "janacek": -0.4661 },
    "five-in-a-row": { "festive-sonata-op1": -0.9224, "shostakovich-symphony-7": -0.6724, "lyric-pieces-op2": -0.6613, "staff-meeting-in-progress": 0.439, "anti-composition": 0.3991, "five-in-a-row": 9.8202, "street-blockage-robot-1": -0.4906, "street-blockage-robot-2": -0.6911, "ohenro-r1d0": -0.3986, "ohenro-r1d1": -0.6126, "street-blockage-robot-3": -0.5806, "after-ciurlionis": 0.2622, "bn_discretization": -0.7017, "bn_sampling": -0.6417, "dukas": -0.9449, "mosolov": -0.3414, "popov": -0.9627, "roslavets": -0.4711, "hindemith": -1.0, "janacek": -0.8273 },
    "street-blockage-robot-1": { "festive-sonata-op1": -0.2347, "shostakovich-symphony-7": -0.1695, "lyric-pieces-op2": -0.1957, "staff-meeting-in-progress": -0.1731, "anti-composition": -0.1406, "five-in-a-row": -0.0803, "street-blockage-robot-1": 1.6117, "street-blockage-robot-2": 1.0, "ohenro-r1d0": -0.1623, "ohenro-r1d1": -0.1885, "street-blockage-robot-3": 0.2968, "after-ciurlionis": -0.1776, "bn_discretization": 0.0233, "bn_sampling": -0.0324, "dukas": -0.2662, "mosolov": -0.2406, "popov": -0.2561, "roslavets": -0.1651, "hindemith": -0.2465, "janacek": -0.2026 },
    "street-blockage-robot-2": { "festive-sonata-op1": -0.2652, "shostakovich-symphony-7": -0.168, "lyric-pieces-op2": -0.2376, "staff-meeting-in-progress": -0.1999, "anti-composition": -0.131, "five-in-a-row": -0.1131, "street-blockage-robot-1": 1.0, "street-blockage-robot-2": 1.527, "ohenro-r1d0": -0.1346, "ohenro-r1d1": -0.1854, "street-blockage-robot-3": 0.5025, "after-ciurlionis": -0.1674, "bn_discretization": -0.0475, "bn_sampling": 0.0733, "dukas": -0.2887, "mosolov": -0.2453, "popov": -0.2597, "roslavets": -0.1569, "hindemith": -0.2651, "janacek": -0.2374 },
    "ohenro-r1d0": { "festive-sonata-op1": -0.1247, "shostakovich-symphony-7": -0.1404, "lyric-pieces-op2": -0.0809, "staff-meeting-in-progress": -0.0902, "anti-composition": -0.1355, "five-in-a-row": -0.0673, "street-blockage-robot-1": -0.1674, "street-blockage-robot-2": -0.1388, "ohenro-r1d0": 1.6726, "ohenro-r1d1": 1.0, "street-blockage-robot-3": -0.1094, "after-ciurlionis": -0.18, "bn_discretization": -0.1652, "bn_sampling": -0.1715, "dukas": -0.2296, "mosolov": -0.1695, "popov": -0.1643, "roslavets": -0.1406, "hindemith": -0.211, "janacek": -0.1863 },
    "ohenro-r1d1": { "festive-sonata-op1": -0.1369, "shostakovich-symphony-7": -0.129, "lyric-pieces-op2": -0.1117, "staff-meeting-in-progress": -0.0307, "anti-composition": -0.1493, "five-in-a-row": -0.1034, "street-blockage-robot-1": -0.1944, "street-blockage-robot-2": -0.1912, "ohenro-r1d0": 1.0, "ohenro-r1d1": 1.6517, "street-blockage-robot-3": -0.1892, "after-ciurlionis": -0.1459, "bn_discretization": -0.1568, "bn_sampling": -0.1659, "dukas": -0.1785, "mosolov": -0.1487, "popov": -0.1198, "roslavets": -0.1391, "hindemith": -0.1916, "janacek": -0.1698 },
    "street-blockage-robot-3": { "festive-sonata-op1": -0.3104, "shostakovich-symphony-7": -0.1596, "lyric-pieces-op2": -0.3979, "staff-meeting-in-progress": -0.1814, "anti-composition": -0.285, "five-in-a-row": -0.189, "street-blockage-robot-1": 0.5907, "street-blockage-robot-2": 1.0, "ohenro-r1d0": -0.2111, "ohenro-r1d1": -0.3651, "street-blockage-robot-3": 3.3132, "after-ciurlionis": -0.1978, "bn_discretization": -0.1186, "bn_sampling": -0.0372, "dukas": -0.4456, "mosolov": -0.3748, "popov": -0.4989, "roslavets": -0.3699, "hindemith": -0.4024, "janacek": -0.3592 },
    "after-ciurlionis": { "festive-sonata-op1": -0.041, "shostakovich-symphony-7": -0.5865, "lyric-pieces-op2": 0.2539, "staff-meeting-in-progress": -0.6086, "anti-composition": -0.5803, "five-in-a-row": 0.2326, "street-blockage-robot-1": -0.9626, "street-blockage-robot-2": -0.9071, "ohenro-r1d0": -0.9462, "ohenro-r1d1": -0.7669, "street-blockage-robot-3": -0.5387, "after-ciurlionis": 8.5126, "bn_discretization": -1.0, "bn_sampling": -0.9468, "dukas": -0.4026, "mosolov": -0.4996, "popov": 0.1298, "roslavets": -0.014, "hindemith": 0.3498, "janacek": -0.6776 },
    "bn_discretization": { "festive-sonata-op1": -0.1946, "shostakovich-symphony-7": -0.1397, "lyric-pieces-op2": -0.1862, "staff-meeting-in-progress": -0.1338, "anti-composition": -0.0956, "five-in-a-row": -0.1083, "street-blockage-robot-1": 0.022, "street-blockage-robot-2": -0.0448, "ohenro-r1d0": -0.1511, "ohenro-r1d1": -0.1433, "street-blockage-robot-3": -0.0562, "after-ciurlionis": -0.1739, "bn_discretization": 1.5427, "bn_sampling": 1.0, "dukas": -0.2335, "mosolov": -0.2234, "popov": -0.2339, "roslavets": -0.0479, "hindemith": -0.2274, "janacek": -0.171 },
    "bn_sampling": { "festive-sonata-op1": -0.1846, "shostakovich-symphony-7": -0.1325, "lyric-pieces-op2": -0.1825, "staff-meeting-in-progress": -0.1452, "anti-composition": -0.1459, "five-in-a-row": -0.099, "street-blockage-robot-1": -0.0306, "street-blockage-robot-2": 0.0691, "ohenro-r1d0": -0.1568, "ohenro-r1d1": -0.1516, "street-blockage-robot-3": -0.0176, "after-ciurlionis": -0.1647, "bn_discretization": 1.0, "bn_sampling": 1.5263, "dukas": -0.2189, "mosolov": -0.2064, "popov": -0.251, "roslavets": -0.0741, "hindemith": -0.2254, "janacek": -0.2086 },
    "dukas": { "festive-sonata-op1": 0.1466, "shostakovich-symphony-7": -0.2524, "lyric-pieces-op2": -0.1229, "staff-meeting-in-progress": -0.2888, "anti-composition": -0.1558, "five-in-a-row": -0.2735, "street-blockage-robot-1": -0.4708, "street-blockage-robot-2": -0.5107, "ohenro-r1d0": -0.3938, "ohenro-r1d1": -0.3061, "street-blockage-robot-3": -0.3961, "after-ciurlionis": -0.1314, "bn_discretization": -0.4381, "bn_sampling": -0.4106, "dukas": 2.5768, "mosolov": -0.0619, "popov": -0.0868, "roslavets": -0.0074, "hindemith": 0.5837, "janacek": 1.0 },
    "mosolov": { "festive-sonata-op1": 0.0004, "shostakovich-symphony-7": 0.5142, "lyric-pieces-op2": 0.0462, "staff-meeting-in-progress": -0.2982, "anti-composition": -0.1932, "five-in-a-row": -0.2277, "street-blockage-robot-1": -0.9808, "street-blockage-robot-2": -1.0, "ohenro-r1d0": -0.67, "ohenro-r1d1": -0.5878, "street-blockage-robot-3": -0.7678, "after-ciurlionis": -0.3758, "bn_discretization": -0.966, "bn_sampling": -0.8925, "dukas": -0.1427, "mosolov": 6.197, "popov": 0.543, "roslavets": 0.1333, "hindemith": -0.2361, "janacek": -0.0954 },
    "popov": { "festive-sonata-op1": 0.2092, "shostakovich-symphony-7": 0.7369, "lyric-pieces-op2": 0.3343, "staff-meeting-in-progress": -0.3754, "anti-composition": -0.5327, "five-in-a-row": -0.5916, "street-blockage-robot-1": -0.9618, "street-blockage-robot-2": -0.9753, "ohenro-r1d0": -0.5982, "ohenro-r1d1": -0.4362, "street-blockage-robot-3": -0.9417, "after-ciurlionis": 0.09, "bn_discretization": -0.9319, "bn_sampling": -1.0, "dukas": -0.1843, "mosolov": 0.5003, "popov": 5.2621, "roslavets": 0.123, "hindemith": 0.5428, "janacek": -0.2694 },
    "roslavets": { "festive-sonata-op1": -0.5472, "shostakovich-symphony-7": -0.3642, "lyric-pieces-op2": -0.5458, "staff-meeting-in-progress": -0.1542, "anti-composition": -0.6593, "five-in-a-row": -0.4146, "street-blockage-robot-1": -0.8881, "street-blockage-robot-2": -0.8438, "ohenro-r1d0": -0.7334, "ohenro-r1d1": -0.7254, "street-blockage-robot-3": -1.0, "after-ciurlionis": -0.0139, "bn_discretization": -0.2736, "bn_sampling": -0.4226, "dukas": -0.0224, "mosolov": 0.1759, "popov": 0.1762, "roslavets": 8.2705, "hindemith": -0.6584, "janacek": -0.3557 },
    "hindemith": { "festive-sonata-op1": 0.2554, "shostakovich-symphony-7": 0.0799, "lyric-pieces-op2": -0.0574, "staff-meeting-in-progress": -0.5203, "anti-composition": -0.4155, "five-in-a-row": -0.4959, "street-blockage-robot-1": -0.747, "street-blockage-robot-2": -0.8034, "ohenro-r1d0": -0.6199, "ohenro-r1d1": -0.5629, "street-blockage-robot-3": -0.6129, "after-ciurlionis": 0.1956, "bn_discretization": -0.731, "bn_sampling": -0.7247, "dukas": 1.0, "mosolov": -0.1755, "popov": 0.438, "roslavets": -0.3709, "hindemith": 4.3835, "janacek": 0.4849 },
    "janacek": { "festive-sonata-op1": -0.0817, "shostakovich-symphony-7": -0.2412, "lyric-pieces-op2": -0.1768, "staff-meeting-in-progress": -0.136, "anti-composition": -0.2185, "five-in-a-row": -0.2394, "street-blockage-robot-1": -0.3584, "street-blockage-robot-2": -0.42, "ohenro-r1d0": -0.3196, "ohenro-r1d1": -0.2913, "street-blockage-robot-3": -0.3193, "after-ciurlionis": -0.2211, "bn_discretization": -0.3208, "bn_sampling": -0.3913, "dukas": 1.0, "mosolov": -0.0414, "popov": -0.1269, "roslavets": -0.117, "hindemith": 0.283, "janacek": 2.7376 }
  }
};
