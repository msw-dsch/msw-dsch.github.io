/*
 * 壮大なる愚作 — スコア譜／パート譜の描画エンジン（楽譜としてのグラフ）
 *
 * window.SCORE_DATA を読み込み，
 *   - window.SCORE_FOCUS_ID が未設定  → スコア譜（index.html）
 *   - window.SCORE_FOCUS_ID が設定済 → パート譜（記事ページ）
 * を #score-canvas-mount 内の <canvas> に描画する．
 *
 * スコア譜（index.html）：4段（S/A/T/B）はそれぞれ記事ベクトルの第1〜4主成分
 * （pc1〜pc4）の音高を表す．つまり1つの記事＝1つの和音として，同じ横位置に
 * 4つの音符が同時に鳴る．
 * 連桁（符幹をつなぐ太線）は，同一連作（series）の記事どうしに，4段すべてで
 * 並行して引かれる．
 *
 * パート譜（記事ページ）：声部（S/A/T/B）はpc1の四分位から決まる固定属性で，
 * 1段の譜表にpc1のみを連続的な音高として表示する（4声部化はしない）．
 *
 * index.htmlのAbstract/Identity/Contact/Helpはアコーディオン式（既定で折りたたみ，
 * 対応するアイコンのクリックで1つだけ展開）．スコア譜パネルはスクロールで
 * 画面内に入った時にフェードインする（initScrollReveal）．
 */
(function () {
  "use strict";

  // Abstract/Identity/Contact/Help はアコーディオン式：既定で折りたたまれており，
  // 対応するアイコンのクリックで1つだけ展開する（他は自動的に閉じる）．
  function toggleSiteSection(id) {
    var el = document.getElementById(id);
    if (!el || !el.classList.contains("site-section")) return false;
    var willOpen = !el.classList.contains("is-open");
    document.querySelectorAll("section.site-section.is-open").forEach(function (s) {
      s.classList.remove("is-open");
    });
    if (willOpen) {
      el.classList.add("is-open");
      requestAnimationFrame(function () {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    return true;
  }

  function initAccordion() {
    if (!document.querySelector("section.site-section")) return;
    var hash = location.hash.replace("#", "");
    if (hash) {
      var el = document.getElementById(hash);
      if (el && el.classList.contains("site-section")) {
        el.classList.add("is-open");
        setTimeout(function () { el.scrollIntoView({ behavior: "auto", block: "start" }); }, 60);
      }
    }
  }

  function jump(target) {
    if (!target) return;
    if (target.charAt(0) === "#") {
      var id = target.slice(1);
      if (toggleSiteSection(id)) return;
      var el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      location.href = target;
    }
  }

  function initHotspots() {
    var caption = document.querySelector(".icon-caption");
    var defaultCaption = caption ? caption.textContent : "";
    document.querySelectorAll(".hotspot").forEach(function (el) {
      el.addEventListener("mouseenter", function () { if (caption) caption.innerHTML = "→ <b>" + el.dataset.label + "</b>"; });
      el.addEventListener("focus", function () { if (caption) caption.innerHTML = "→ <b>" + el.dataset.label + "</b>"; });
      el.addEventListener("mouseleave", function () { if (caption) caption.textContent = defaultCaption; });
      el.addEventListener("blur", function () { if (caption) caption.textContent = defaultCaption; });
      el.addEventListener("click", function () { jump(el.dataset.target); });
      el.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); jump(el.dataset.target); }
      });
    });
  }

  function initScrollReveal() {
    var frame = document.querySelector(".score-frame");
    if (!frame) return;
    if (!("IntersectionObserver" in window)) { frame.classList.add("is-visible"); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          frame.classList.add("is-visible");
          io.unobserve(frame);
        }
      });
    }, { threshold: 0.15 });
    io.observe(frame);
  }

  function initScore() {
    var mount = document.getElementById("score-canvas-mount");
    if (!mount || !window.SCORE_DATA) return;

    var VOICES = {
      S: { row: 0, shape: "triangle", color: "#e2a530", clef: "treble", clefScale: 1.15 },
      A: { row: 1, shape: "circle",   color: "#3f6fa0", clef: "treble", clefScale: 0.85 },
      T: { row: 2, shape: "circle",   color: "#1f3550", clef: "bass",   clefScale: 0.85 },
      B: { row: 3, shape: "diamond",  color: "#bd3a2a", clef: "bass",   clefScale: 1.15 }
    };
    var VOICE_KEYS = ["S", "A", "T", "B"];
    var PC_KEY = { S: "pc1", A: "pc2", T: "pc3", B: "pc4" };

    var NODES = window.SCORE_DATA.nodes.map(function (n) {
      return {
        id: n.id, title: n.title, url: n.url, kind: n.kind,
        pc1: n.pc1, pc2: n.pc2, pc3: n.pc3, pc4: n.pc4,
        series: n.series, dummy: !!n.dummy,
        date: new Date(n.date + "T00:00:00")
      };
    });
    var byId = {};
    NODES.forEach(function (n) { byId[n.id] = n; });

    // パート譜用の「主たる声部」は，pc1の四分位から一度だけグローバルに決める
    // （スコア譜の4段はpc1〜pc4を直接使うので，この声部分類は使わない）
    (function assignVoices() {
      var sorted = NODES.slice().sort(function (a, b) { return a.pc1 - b.pc1; });
      var n = sorted.length;
      var b0 = sorted[0].pc1;
      var b1 = sorted[Math.min(n - 1, Math.floor(n * 0.25))].pc1;
      var b2 = sorted[Math.min(n - 1, Math.floor(n * 0.5))].pc1;
      var b3 = sorted[Math.min(n - 1, Math.floor(n * 0.75))].pc1;
      var b4 = sorted[n - 1].pc1;
      NODES.forEach(function (node) {
        var v = node.pc1;
        var bandIdx = v >= b3 ? 0 : v >= b2 ? 1 : v >= b1 ? 2 : 3; // 0=S 1=A 2=T 3=B
        var lo = [b3, b2, b1, b0][bandIdx], hi = [b4, b3, b2, b1][bandIdx];
        node.voice = VOICE_KEYS[bandIdx];
        node.bandLocal = hi > lo ? (v - lo) / (hi - lo) : 0.5;
      });
    })();

    var bySeries = {};
    NODES.forEach(function (n) { if (n.series) (bySeries[n.series] = bySeries[n.series] || []).push(n); });
    var EDGES = [];
    Object.keys(bySeries).forEach(function (key) {
      var group = bySeries[key].slice().sort(function (a, b) { return a.date - b.date; });
      for (var i = 0; i < group.length - 1; i++) EDGES.push([group[i].id, group[i + 1].id, 0.9]);
    });
    var adj = {};
    NODES.forEach(function (n) { adj[n.id] = []; });
    EDGES.forEach(function (e) {
      adj[e[0]].push({ to: e[1], w: e[2] });
      adj[e[1]].push({ to: e[0], w: e[2] });
    });

    var focusId = window.SCORE_FOCUS_ID || null;
    var homeHref = window.SCORE_HOME_HREF || "/index.html#score-frame";
    var mode = focusId ? "part" : "score";

    function hashStr(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function fmtDate(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    function mulberry32(seed) {
      return function () {
        seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
        var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    mount.innerHTML =
      '<div class="score-toolbar">' +
        '<span class="label" id="scoreToolbarLabel"></span>' +
        '<div class="controls" id="scoreControls"></div>' +
      '</div>' +
      '<div class="canvas-wrap">' +
        '<svg class="kandinsky-bg" id="scoreKbg" viewBox="0 0 1000 620" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>' +
        '<canvas id="scoreCanvas" class="score-canvas" role="img" aria-label="生成楽譜。ノートをクリックするとその記事へ移動する。"></canvas>' +
        '<div class="tooltip" id="scoreTooltip"><span class="cat"></span><span class="title"></span></div>' +
      '</div>' +
      '<div class="readout" id="scoreReadout"></div>';

    var canvas = document.getElementById("scoreCanvas");
    var ctx = canvas.getContext("2d");
    var tooltip = document.getElementById("scoreTooltip");
    var readout = document.getElementById("scoreReadout");
    var wrap = mount.querySelector(".canvas-wrap");
    var kbg = document.getElementById("scoreKbg");
    var toolbarLabel = document.getElementById("scoreToolbarLabel");
    var controls = document.getElementById("scoreControls");

    var layout = null, activeIds = [], activeMin, activeMax;
    var DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    var PAD_L = 108, PAD_R = 40, PAD_TOP = 40, ROW_H = 150, LINE_GAP = 8, BOTTOM_AXIS = 34;
    var PART_BASE_OFFSET = 110, PART_MARGIN = 110;

    var fullMinDate = new Date(Math.min.apply(null, NODES.map(function (n) { return n.date.getTime(); })));
    var fullMaxDate = new Date(Math.max.apply(null, NODES.map(function (n) { return n.date.getTime(); })));

    function pickPartNeighborhood(id) {
      var focus = byId[id];
      var neighborIds = adj[id].map(function (o) { return o.to; });
      var others = NODES
        .filter(function (n) { return n.id !== id && neighborIds.indexOf(n.id) === -1; })
        .sort(function (a, b) { return Math.abs(a.date - focus.date) - Math.abs(b.date - focus.date); })
        .slice(0, 5)
        .map(function (n) { return n.id; });
      var ids = [id].concat(neighborIds, others);
      var before = 1000 * 60 * 60 * 24 * 30, after = 1000 * 60 * 60 * 24 * 30;
      ids.forEach(function (nid) {
        var d = byId[nid].date.getTime() - focus.date.getTime();
        if (d < 0) before = Math.max(before, -d); else after = Math.max(after, d);
      });
      return { ids: ids, min: new Date(focus.date.getTime() - before * 1.15), max: new Date(focus.date.getTime() + after * 1.15) };
    }

    function currentIds() { return mode === "score" ? NODES.map(function (n) { return n.id; }) : pickPartNeighborhood(focusId).ids; }
    function currentRange() {
      if (mode === "score") return { min: fullMinDate, max: fullMaxDate };
      var nb = pickPartNeighborhood(focusId);
      return { min: nb.min, max: nb.max };
    }

    function staffBaseY(row) { return PAD_TOP + row * ROW_H + 2 * LINE_GAP; }

    function computeLayout(cssWidth, ids, rangeMin, rangeMax) {
      var innerW = cssWidth - PAD_L - PAD_R;
      var span = rangeMax.getTime() - rangeMin.getTime();
      var pos = {};
      var maxAbsStep = 0;

      ids.forEach(function (id) {
        var n2 = byId[id];
        var t = span > 0 ? (n2.date.getTime() - rangeMin.getTime()) / span : 0.5;
        var jitterX = (mulberry32(hashStr(id + "x"))() - 0.5) * 10;
        var x = PAD_L + clamp(t, 0, 1) * innerW + jitterX;

        if (mode === "score") {
          var voicesPos = {};
          VOICE_KEYS.forEach(function (vk) {
            var pcVal = n2[PC_KEY[vk]] || 0;
            var step = clamp(Math.round(pcVal * 8), -16, 16);
            var baseY = staffBaseY(VOICES[vk].row);
            maxAbsStep = Math.max(maxAbsStep, Math.abs(step));
            voicesPos[vk] = { x: x, y: baseY - step * (LINE_GAP / 2), step: step, baseY: baseY };
          });
          pos[id] = voicesPos;
        } else {
          var step = clamp(Math.round(n2.pc1 * 8), -16, 16);
          var baseY = PAD_TOP + PART_BASE_OFFSET;
          maxAbsStep = Math.max(maxAbsStep, Math.abs(step));
          pos[id] = { x: x, y: baseY - step * (LINE_GAP / 2), step: step, baseY: baseY };
        }
      });

      var height = mode === "score"
        ? PAD_TOP + 3 * ROW_H + 4 * LINE_GAP + 40 + BOTTOM_AXIS
        : PAD_TOP + PART_BASE_OFFSET + Math.max(PART_MARGIN, maxAbsStep * (LINE_GAP / 2) + 40) + BOTTOM_AXIS;

      return { pos: pos, width: cssWidth, height: height };
    }

    function resize() {
      var cssWidth = Math.max(560, wrap.clientWidth - 12);
      var range = currentRange();
      activeIds = currentIds();
      activeMin = range.min; activeMax = range.max;
      layout = computeLayout(cssWidth, activeIds, activeMin, activeMax);
      canvas.width = Math.floor(layout.width * DPR);
      canvas.height = Math.floor(layout.height * DPR);
      canvas.style.width = layout.width + "px";
      canvas.style.height = layout.height + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      drawKandinskyBg();
      draw();
      updateChrome();
    }

    // 関連の強さ（連作＞時期の近さ・pc1の近さ）から，次の記事への遷移確率を決める
    function relationWeight(focus, other) {
      var edge = adj[focus.id].filter(function (o) { return o.to === other.id; })[0];
      if (edge) return edge.w;
      var dayDiff = Math.abs(focus.date.getTime() - other.date.getTime()) / 86400000;
      var timeScore = 1 / (1 + dayDiff / 180);
      var pc1Score = 1 / (1 + Math.abs(focus.pc1 - other.pc1) * 3);
      return 0.12 * (timeScore * 0.5 + pc1Score * 0.5);
    }
    function pickNextByRelation(focus) {
      var candidates = NODES.filter(function (n) { return n.id !== focus.id; });
      var weights = candidates.map(function (n) { return relationWeight(focus, n); });
      var total = weights.reduce(function (a, b) { return a + b; }, 0);
      var r = Math.random() * total;
      for (var i = 0; i < candidates.length; i++) { r -= weights[i]; if (r <= 0) return candidates[i]; }
      return candidates[candidates.length - 1];
    }

    function updateChrome() {
      controls.innerHTML = "";
      readout.innerHTML = "";
      if (mode === "score") {
        toolbarLabel.textContent = "スコア譜 — " + NODES.length + "件（うちデモ" + NODES.filter(function (n) { return n.dummy; }).length + "件）";
        var wanderBtn = document.createElement("button");
        wanderBtn.className = "act"; wanderBtn.type = "button"; wanderBtn.textContent = "さまよう";
        wanderBtn.addEventListener("click", function () {
          var pick = NODES[Math.floor(Math.random() * NODES.length)];
          location.href = pick.url;
        });
        controls.appendChild(wanderBtn);
      } else {
        var n = byId[focusId];
        toolbarLabel.textContent = "パート譜 — 「" + n.title + "」を起点に";
        var backLink = document.createElement("a");
        backLink.className = "act"; backLink.href = homeHref; backLink.textContent = "◀ スコア譜（全体）へ";
        controls.appendChild(backLink);

        var nextBtn = document.createElement("button");
        nextBtn.className = "act next-btn"; nextBtn.type = "button"; nextBtn.textContent = "次の記事へ →";
        nextBtn.addEventListener("click", function () {
          location.href = pickNextByRelation(n).url;
        });
        readout.appendChild(nextBtn);
      }
    }

    function drawKandinskyBg() {
      kbg.innerHTML =
        '<circle cx="860" cy="120" r="150" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.18"></circle>' +
        '<circle cx="860" cy="120" r="150" fill="var(--k-blue)" opacity="0.05"></circle>' +
        '<polygon points="60,470 190,380 120,560" fill="var(--k-yellow)" opacity="0.10" stroke="var(--ink)" stroke-width="1" stroke-opacity="0.18"></polygon>' +
        '<line x1="0" y1="560" x2="480" y2="60" stroke="var(--ink)" stroke-width="1" opacity="0.08"></line>' +
        '<line x1="80" y1="600" x2="620" y2="20" stroke="var(--ink)" stroke-width="1" opacity="0.06"></line>' +
        checkerboard(720, 470, 26, 5, 5) +
        '<circle cx="330" cy="70" r="7" fill="var(--k-red)" opacity="0.16"></circle>';
    }
    function checkerboard(ox, oy, cell, cols, rows) {
      var s = "";
      for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) if ((i + j) % 2 === 0)
        s += '<rect x="' + (ox + i * cell) + '" y="' + (oy + j * cell) + '" width="' + cell + '" height="' + cell + '" fill="var(--ink)" opacity="0.07"></rect>';
      return s;
    }

    // 音部記号は Noto Music（Unicode Musical Symbols）の実際の字形を使用する。
    // フォントの行送り基準ではなく，実際のグリフの見た目の高さ（actualBoundingBox）を
    // 測定して中心を合わせる（フォントごとの余白の違いに影響されないようにするため）。
    var CLEF_GLYPH = { treble: "\u{1D11E}", bass: "\u{1D122}" };
    var CLEF_BASE_SIZE = { treble: 50, bass: 38 };
    function drawClef(cx, cy, kind, color, scale) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = Math.round(CLEF_BASE_SIZE[kind] * scale) + "px 'Noto Music'";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      var glyph = CLEF_GLYPH[kind];
      var m = ctx.measureText(glyph);
      var visualCenterOffset = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      ctx.fillText(glyph, cx, cy + visualCenterOffset);
      ctx.restore();
    }

    function drawStaffLines(baseY, width) {
      ctx.strokeStyle = "#b9b19a"; ctx.lineWidth = 1;
      for (var l = -2; l <= 2; l++) {
        var y = baseY - l * LINE_GAP;
        ctx.beginPath(); ctx.moveTo(PAD_L - 24, Math.round(y) + 0.5); ctx.lineTo(width - PAD_R, Math.round(y) + 0.5); ctx.stroke();
      }
    }

    function drawStaves() {
      if (mode === "score") {
        VOICE_KEYS.forEach(function (key) {
          var v = VOICES[key];
          var baseY = staffBaseY(v.row);
          drawStaffLines(baseY, layout.width);
          drawClef(PAD_L - 46, baseY, v.clef, v.color, v.clefScale);
        });
      } else {
        var baseY = PAD_TOP + PART_BASE_OFFSET;
        drawStaffLines(baseY, layout.width);
        var fv = VOICES[byId[focusId].voice];
        drawClef(PAD_L - 46, baseY, fv.clef, fv.color, fv.clefScale * 1.1);
      }
    }

    function drawTimeAxis() {
      var startY = PAD_TOP - 12, endY = layout.height - BOTTOM_AXIS + 6;
      var span = activeMax.getTime() - activeMin.getTime();
      if (span <= 0) return;
      var startYear = activeMin.getFullYear(), endYear = activeMax.getFullYear();
      ctx.font = "11px 'PT Mono', monospace"; ctx.fillStyle = "#8b8579"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var y = startYear; y <= endYear; y++) {
        for (var q = 0; q < (endYear > startYear ? 1 : 4); q++) {
          var md = endYear > startYear ? (y + "-01-01") : (y + "-0" + (q * 3 + 1) + "-01");
          var t = (new Date(md).getTime() - activeMin.getTime()) / span;
          if (t < 0 || t > 1) continue;
          var x = PAD_L + t * (layout.width - PAD_L - PAD_R);
          ctx.strokeStyle = "#c9c2ac"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, startY); ctx.lineTo(Math.round(x) + 0.5, endY); ctx.stroke();
          ctx.fillText(endYear > startYear ? String(y) : md.slice(0, 7), x, endY + 6);
        }
      }
    }

    function drawLedgerLines(p) {
      var absS = Math.abs(p.step);
      if (absS < 5) return;
      var dir = p.step >= 0 ? 1 : -1;
      var maxK = Math.floor(absS / 2) * 2;
      ctx.strokeStyle = "#b9b19a"; ctx.lineWidth = 1;
      for (var k = 6; k <= maxK; k += 2) {
        var ly = p.baseY - dir * k * (LINE_GAP / 2);
        ctx.beginPath(); ctx.moveTo(p.x - 9, ly + 0.5); ctx.lineTo(p.x + 9, ly + 0.5); ctx.stroke();
      }
    }

    function drawNotehead(n, p, voiceKey, opts) {
      opts = opts || {};
      var v = VOICES[voiceKey];
      var color = opts.active ? "#bd3a2a" : v.color;
      var r = 5.6;

      if (opts.focus) {
        ctx.beginPath(); ctx.arc(p.x, p.y, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(28,26,23,0.5)"; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
      }
      drawLedgerLines(p);

      var stemUp = p.step >= 0;
      var stemTopY = stemUp ? p.y - 24 : p.y + 24;
      ctx.strokeStyle = color; ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(p.x + (stemUp ? r - 1 : -(r - 1)), p.y);
      ctx.lineTo(p.x + (stemUp ? r - 1 : -(r - 1)), stemTopY);
      ctx.stroke();

      ctx.fillStyle = color; ctx.globalAlpha = n.dummy ? 0.5 : 1; ctx.beginPath();
      if (v.shape === "triangle") {
        ctx.moveTo(p.x, p.y - r); ctx.lineTo(p.x + r * 0.95, p.y + r * 0.7); ctx.lineTo(p.x - r * 0.95, p.y + r * 0.7); ctx.closePath();
      } else if (v.shape === "diamond") {
        ctx.moveTo(p.x, p.y - r * 1.05); ctx.lineTo(p.x + r * 1.05, p.y); ctx.lineTo(p.x, p.y + r * 1.05); ctx.lineTo(p.x - r * 1.05, p.y); ctx.closePath();
      } else {
        ctx.arc(p.x, p.y, r * 0.92, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
      if (n.dummy) { ctx.lineWidth = 1; ctx.strokeStyle = color; ctx.setLineDash([2, 2]); ctx.stroke(); ctx.setLineDash([]); }
      if (opts.active || opts.focus) { ctx.lineWidth = 1.6; ctx.strokeStyle = "#1c1a17"; ctx.stroke(); }
      p._stemTop = { x: p.x + (stemUp ? r - 1 : -(r - 1)), y: stemTopY };
    }

    function drawBeamSegment(p1, p2, w) {
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = "rgba(28,26,23," + (0.35 + w * 0.45) + ")";
      ctx.lineWidth = 3 + w * 2.2; ctx.lineCap = "butt"; ctx.stroke();
    }
    function drawBeam(e) {
      var w = e[2];
      if (mode === "score") {
        VOICE_KEYS.forEach(function (vk) {
          var a = layout.pos[e[0]] && layout.pos[e[0]][vk];
          var b = layout.pos[e[1]] && layout.pos[e[1]][vk];
          if (a && a._stemTop && b && b._stemTop) drawBeamSegment(a._stemTop, b._stemTop, w);
        });
      } else {
        var a = layout.pos[e[0]], b = layout.pos[e[1]];
        if (a && a._stemTop && b && b._stemTop) drawBeamSegment(a._stemTop, b._stemTop, w);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, layout.width, layout.height);
      drawStaves();
      drawTimeAxis();
      if (mode === "score") {
        activeIds.forEach(function (id) {
          var n = byId[id], voicesPos = layout.pos[id];
          VOICE_KEYS.forEach(function (vk) { drawNotehead(n, voicesPos[vk], vk, {}); });
        });
        EDGES.forEach(function (e) { if (layout.pos[e[0]] && layout.pos[e[1]]) drawBeam(e); });
      } else {
        activeIds.forEach(function (id) { drawNotehead(byId[id], layout.pos[id], byId[id].voice, {}); });
        EDGES.forEach(function (e) { if (layout.pos[e[0]] && layout.pos[e[1]]) drawBeam(e); });
        drawNotehead(byId[focusId], layout.pos[focusId], byId[focusId].voice, { focus: true });
      }
    }

    function hitTest(mx, my) {
      var best = null, bestVoice = null, bestD = 12;
      if (mode === "score") {
        activeIds.forEach(function (id) {
          VOICE_KEYS.forEach(function (vk) {
            var p = layout.pos[id][vk];
            var d = Math.hypot(p.x - mx, p.y - my);
            if (d < bestD) { bestD = d; best = id; bestVoice = vk; }
          });
        });
      } else {
        activeIds.forEach(function (id) {
          var p = layout.pos[id];
          var d = Math.hypot(p.x - mx, p.y - my);
          if (d < bestD) { bestD = d; best = id; bestVoice = byId[id].voice; }
        });
      }
      return best ? { id: best, voice: bestVoice } : null;
    }

    canvas.addEventListener("mousemove", function (ev) {
      var rect = canvas.getBoundingClientRect();
      var mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      var hit = hitTest(mx, my);
      if (hit) {
        var n = byId[hit.id];
        var p = mode === "score" ? layout.pos[hit.id][hit.voice] : layout.pos[hit.id];
        var wrapRect = wrap.getBoundingClientRect();
        tooltip.style.opacity = "1";
        tooltip.style.left = (rect.left - wrapRect.left + p.x) + "px";
        tooltip.style.top = (rect.top - wrapRect.top + p.y - 20) + "px";
        tooltip.querySelector(".cat").textContent = hit.voice + " ｜ " + fmtDate(n.date) + (n.isDateExact === false ? "（推定）" : "") + (n.dummy ? "（デモ）" : "");
        tooltip.querySelector(".title").textContent = n.title + (n.id === focusId ? "（この記事）" : "");
        canvas.style.cursor = n.id === focusId ? "default" : "pointer";
      } else {
        tooltip.style.opacity = "0";
        tooltip.querySelector(".title").textContent = "";
        canvas.style.cursor = "crosshair";
      }
    });
    canvas.addEventListener("mouseleave", function () { tooltip.style.opacity = "0"; });
    canvas.addEventListener("click", function (ev) {
      var rect = canvas.getBoundingClientRect();
      var hit = hitTest(ev.clientX - rect.left, ev.clientY - rect.top);
      if (hit && hit.id !== focusId) location.href = byId[hit.id].url;
    });

    window.addEventListener("resize", resize);
    resize();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(draw); }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHotspots();
    initAccordion();
    initScore();
    initScrollReveal();
  });
})();
