/*
 * 壮大なる愚作 — スコアデータ（楽譜としてのグラフ）
 *
 * 各ノードは実在する記事，またはダミーのデモ記事（dummy: true）のいずれか．
 * dummy: true の項目は実際の文章ではなく，仕組みを示すための仮データ．
 *
 * 記事のページはカテゴリ別のフォルダに分けず，すべて /contents/<slug>/ に平置きにしている．
 * カテゴリ（作品・楽曲探索・研究記録）はスコア譜の声部を決める要素ではないため，
 * URL構造でもカテゴリを前提にしない．
 *
 * pc1 は「記事ベクトルの主成分」の仮値．本文からベクトルを作る仕組みがまだ
 * ないため，人手で -1〜1 の適当な値を割り当てている．
 *
 * date が「年のみ判明」の項目は，その年の中頃を仮に補完している（isDateExact: false）．
 * 実際の日付が判明したら score-data.js のこの値を直接書き換えればよい．
 */

window.SCORE_DATA = {
  nodes: [
    {
      id: "comp-festive-sonata",
      title: "Festive Sonata Op. 1",
      url: "/contents/festive-sonata-op1/",
      date: "2021-03-09",
      isDateExact: true,
      kind: "作品",
      pc1: 0.60,
      series: null,
      dummy: false
    },
    {
      id: "comp-lyric-pieces",
      title: "Lyric Pieces Op. 2",
      url: "/contents/lyric-pieces-op2/",
      date: "2021-08-15",
      isDateExact: false,
      kind: "作品",
      pc1: 0.50,
      series: null,
      dummy: false
    },
    {
      id: "comp-staff-meeting",
      title: "staff meeting in progress",
      url: "/contents/staff-meeting-in-progress/",
      date: "2022-06-01",
      isDateExact: false,
      kind: "作品",
      pc1: -0.05,
      series: null,
      dummy: false
    },
    {
      id: "comp-five-in-a-row",
      title: "Five in a Row",
      url: "/contents/five-in-a-row/",
      date: "2024-06-01",
      isDateExact: false,
      kind: "作品",
      pc1: 0.70,
      series: null,
      dummy: false
    },
    {
      id: "music-roslavets",
      title: "ロースラヴェツ：音組織の新体系",
      url: "/contents/roslavets/",
      date: "2023-01-01",
      isDateExact: false,
      kind: "楽曲探索",
      pc1: 0.15,
      series: null,
      dummy: false
    },

    {
      id: "demo-research-1",
      title: "確率的リスク評価モデルの覚書（デモ）",
      url: "/contents/research-note-1/",
      date: "2023-09-12",
      isDateExact: false,
      kind: "研究メモ（デモ）",
      pc1: -0.42,
      series: "demo-research",
      dummy: true
    },
    {
      id: "demo-research-2",
      title: "空間構成とハザードマップ（デモ）",
      url: "/contents/research-note-2/",
      date: "2023-09-30",
      isDateExact: false,
      kind: "研究メモ（デモ）",
      pc1: -0.37,
      series: "demo-research",
      dummy: true
    },
    {
      id: "demo-research-3",
      title: "不確実性の記述について（デモ）",
      url: "/contents/research-note-3/",
      date: "2024-11-02",
      isDateExact: false,
      kind: "研究メモ（デモ）",
      pc1: -0.46,
      series: null,
      dummy: true
    },
    {
      id: "demo-essay-1",
      title: "ロシア構成主義と音楽（デモ）",
      url: "/contents/essay-1/",
      date: "2025-04-18",
      isDateExact: false,
      kind: "エッセイ（デモ）",
      pc1: 0.11,
      series: null,
      dummy: true
    },
    {
      id: "demo-diary-1",
      title: "楽譜と偶然性の覚書（デモ）",
      url: "/contents/diary-1/",
      date: "2020-06-15",
      isDateExact: false,
      kind: "日記（デモ）",
      pc1: -0.15,
      series: "demo-diary",
      dummy: true
    },
    {
      id: "demo-diary-2",
      title: "無題のスケッチ帳より（デモ）",
      url: "/contents/diary-2/",
      date: "2020-07-01",
      isDateExact: false,
      kind: "日記（デモ）",
      pc1: -0.25,
      series: "demo-diary",
      dummy: true
    }
  ]
};
