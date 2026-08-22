/*
 * 壮大なる愚作 — スコア譜／パート譜の描画エンジン（楽譜としてのグラフ）
 *
 * window.SCORE_DATA を読み込み，
 *   - window.SCORE_FOCUS_ID が未設定  → スコア譜（index.html。全ノード）
 *   - window.SCORE_FOCUS_ID が設定済 → パート譜（記事ページ。その記事を中心とした近傍のみ）
 * を #score-canvas-mount 内の <canvas> に描画する．
 *
 * 音高は各ノードのpc1（記事ベクトルの主成分の仮値）の四分位で
 * ソプラノ／アルト／テノール／バスの4声部に振り分ける．意味的な区分けは持たない．
 * 連桁（符幹をつなぐ太線）は，同一連作（series）の投稿どうしのみに限定．
 */
(function () {
  "use strict";

  function jump(target) {
    if (!target) return;
    if (target.charAt(0) === "#") {
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

  function initScore() {
    var mount = document.getElementById("score-canvas-mount");
    if (!mount || !window.SCORE_DATA) return;

    var VOICES = {
      S: { row: 0, shape: "triangle", color: "#e2a530" },
      A: { row: 1, shape: "circle",   color: "#3f6fa0" },
      T: { row: 2, shape: "circle",   color: "#1f3550" },
      B: { row: 3, shape: "diamond",  color: "#bd3a2a" }
    };

    var NODES = window.SCORE_DATA.nodes.map(function (n) {
      return {
        id: n.id, title: n.title, url: n.url, kind: n.kind, pc1: n.pc1,
        series: n.series, dummy: !!n.dummy,
        date: new Date(n.date + "T00:00:00")
      };
    });
    var byId = {};
    NODES.forEach(function (n) { byId[n.id] = n; });

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
    var PAD_L = 108, PAD_R = 40, PAD_TOP = 40, ROW_H = 132, LINE_GAP = 8, BOTTOM_AXIS = 34;

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

    function computeLayout(cssWidth, ids, rangeMin, rangeMax) {
      var innerW = cssWidth - PAD_L - PAD_R;
      var span = rangeMax.getTime() - rangeMin.getTime();
      var pc1ById = {};
      ids.forEach(function (id) { pc1ById[id] = byId[id].pc1; });
      var sorted = ids.slice().sort(function (a, b) { return pc1ById[a] - pc1ById[b]; });
      var n = sorted.length;
      var boundaries = [
        pc1ById[sorted[0]],
        pc1ById[sorted[Math.min(n - 1, Math.floor(n * 0.25))]],
        pc1ById[sorted[Math.min(n - 1, Math.floor(n * 0.5))]],
        pc1ById[sorted[Math.min(n - 1, Math.floor(n * 0.75))]],
        pc1ById[sorted[n - 1]]
      ];
      function bandOf(v) {
        if (v >= boundaries[3]) return 0; // S
        if (v >= boundaries[2]) return 1; // A
        if (v >= boundaries[1]) return 2; // T
        return 3; // B
      }
      var voiceKeys = ["S", "A", "T", "B"];
      var pos = {};
      ids.forEach(function (id) {
        var n2 = byId[id];
        var bandIdx = bandOf(n2.pc1);
        var voice = voiceKeys[bandIdx];
        var v = VOICES[voice];
        var lo = boundaries[3 - bandIdx], hi = boundaries[4 - bandIdx];
        var local = hi > lo ? (n2.pc1 - lo) / (hi - lo) : 0.5;

        var t = span > 0 ? (n2.date.getTime() - rangeMin.getTime()) / span : 0.5;
        var jitterX = (mulberry32(hashStr(id + "x"))() - 0.5) * 10;
        var x = PAD_L + clamp(t, 0, 1) * innerW + jitterX;

        var step = 1 + Math.round(clamp(local, 0, 1) * 3);
        var dir = (voice === "S" || voice === "A") ? -1 : 1;
        var baseY = PAD_TOP + v.row * ROW_H + 2 * LINE_GAP;
        var y = baseY + dir * step * (LINE_GAP / 2);

        pos[id] = { x: x, y: y, step: dir * step, voice: voice, baseY: baseY };
      });
      return { pos: pos, width: cssWidth, height: PAD_TOP + 3 * ROW_H + 4 * LINE_GAP + 40 + BOTTOM_AXIS };
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

    function updateChrome() {
      controls.innerHTML = "";
      if (mode === "score") {
        toolbarLabel.textContent = "スコア譜 — " + NODES.length + "件（うちデモ" + NODES.filter(function (n) { return n.dummy; }).length + "件）";
        var wanderBtn = document.createElement("button");
        wanderBtn.className = "act"; wanderBtn.type = "button"; wanderBtn.textContent = "さまよう";
        wanderBtn.addEventListener("click", function () {
          var pick = NODES[Math.floor(Math.random() * NODES.length)];
          location.href = pick.url;
        });
        controls.appendChild(wanderBtn);
        readout.innerHTML = "<b>スコア譜．</b> 音符をクリックすると，その記事へ移動します．破線の輪郭はデモ用の仮記事です．";
      } else {
        var n = byId[focusId];
        toolbarLabel.textContent = "パート譜 — 「" + n.title + "」を起点に";
        var backLink = document.createElement("a");
        backLink.className = "act"; backLink.href = homeHref; backLink.textContent = "◀ スコア譜（全体）へ";
        controls.appendChild(backLink);
        readout.innerHTML = "<b>パート譜．</b> " + fmtDate(n.date) + (n.isDateExact === false ? "（推定）" : "") + " を中心に，時系列・連作関係の近い" + (activeIds.length - 1) + "件を抽出．";
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

    function staffBaseY(row) { return PAD_TOP + row * ROW_H + 2 * LINE_GAP; }

    function drawStaff(voiceKey) {
      var v = VOICES[voiceKey];
      var baseY = staffBaseY(v.row);
      ctx.strokeStyle = "#b9b19a"; ctx.lineWidth = 1;
      for (var l = -2; l <= 2; l++) {
        var y = baseY - l * LINE_GAP;
        ctx.beginPath(); ctx.moveTo(PAD_L - 24, Math.round(y) + 0.5); ctx.lineTo(layout.width - PAD_R, Math.round(y) + 0.5); ctx.stroke();
      }
      ctx.font = "600 13px 'Jost', sans-serif"; ctx.fillStyle = v.color; ctx.textBaseline = "middle"; ctx.textAlign = "left";
      ctx.fillText(voiceKey, PAD_L - 24, baseY - 2 * LINE_GAP - 10);
    }

    function drawTimeAxis() {
      var startY = PAD_TOP - 12, endY = staffBaseY(3) + 2 * LINE_GAP + 14;
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

    function drawNotehead(n, p, opts) {
      opts = opts || {};
      var v = VOICES[p.voice];
      var color = opts.active ? "#bd3a2a" : v.color;
      var r = 5.6;

      if (opts.focus) {
        ctx.beginPath(); ctx.arc(p.x, p.y, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(28,26,23,0.5)"; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
      }
      if (Math.abs(p.step) > 2) {
        var dir = p.step > 0 ? 1 : -1;
        ctx.strokeStyle = "#b9b19a"; ctx.lineWidth = 1;
        for (var l = 3; l <= Math.abs(p.step); l++) {
          var ly = p.baseY + dir * l * LINE_GAP;
          ctx.beginPath(); ctx.moveTo(p.x - 9, ly + 0.5); ctx.lineTo(p.x + 9, ly + 0.5); ctx.stroke();
        }
      }

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

    function drawBeam(e) {
      var a = layout.pos[e[0]], b = layout.pos[e[1]];
      if (!a || !a._stemTop || !b || !b._stemTop) return;
      var w = e[2];
      ctx.beginPath(); ctx.moveTo(a._stemTop.x, a._stemTop.y); ctx.lineTo(b._stemTop.x, b._stemTop.y);
      ctx.strokeStyle = "rgba(28,26,23," + (0.35 + w * 0.45) + ")";
      ctx.lineWidth = 3 + w * 2.2; ctx.lineCap = "butt"; ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, layout.width, layout.height);
      ["S", "A", "T", "B"].forEach(drawStaff);
      drawTimeAxis();
      activeIds.forEach(function (id) { drawNotehead(byId[id], layout.pos[id], {}); });
      EDGES.forEach(function (e) { if (layout.pos[e[0]] && layout.pos[e[1]]) drawBeam(e); });
      if (mode === "part") drawNotehead(byId[focusId], layout.pos[focusId], { focus: true });
    }

    function hitTest(mx, my) {
      var best = null, bestD = 12;
      activeIds.forEach(function (id) {
        var p = layout.pos[id];
        var d = Math.hypot(p.x - mx, p.y - my);
        if (d < bestD) { bestD = d; best = id; }
      });
      return best;
    }

    canvas.addEventListener("mousemove", function (ev) {
      var rect = canvas.getBoundingClientRect();
      var mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      var hit = hitTest(mx, my);
      if (hit) {
        var n = byId[hit];
        var wrapRect = wrap.getBoundingClientRect();
        tooltip.style.opacity = "1";
        tooltip.style.left = (rect.left - wrapRect.left + layout.pos[hit].x) + "px";
        tooltip.style.top = (rect.top - wrapRect.top + layout.pos[hit].y - 20) + "px";
        tooltip.querySelector(".cat").textContent = layout.pos[hit].voice + " ｜ " + n.kind + " ｜ " + fmtDate(n.date) + (n.isDateExact === false ? "（推定）" : "");
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
      if (hit && hit !== focusId) location.href = byId[hit].url;
    });

    window.addEventListener("resize", resize);
    resize();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHotspots();
    initScore();
  });
})();
