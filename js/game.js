/* ════════════════════════════════════════════════════════
   CÓDIGO ROJO — motor principal del juego
   ════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const DIFFS = {
    facil:   { label: "FÁCIL",   time: 300, types: ["acertijo", "cables", "simon"] },
    normal:  { label: "NORMAL",  time: 330, types: ["acertijo", "cables", "simon", "boton", "keypad"] },
    experto: { label: "EXPERTO", time: 390, types: null }, /* se sortean 7 de 8 */
  };
  const MAX_STRIKES = 3;
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const state = {
    diff: null,
    modules: [],
    strikes: 0,
    endTime: 0,
    total: 0,
    running: false,
    timerId: null,
    lastTickSec: -1,
    lastRenderSec: -1,
    serial: null,   /* {full, digits, hasVowel, lastDigit} */
    batteries: 0,
    activeModule: null,
    startStamp: 0,
  };
  window.__game = state; /* hook para tests automatizados */

  /* ── Pantallas ─────────────────────────────────────── */
  function showScreen(id) {
    $$(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
  }

  /* ── Récords ───────────────────────────────────────── */
  function loadRecords() {
    try { return JSON.parse(localStorage.getItem("cr_records") || "{}"); }
    catch { return {}; }
  }
  function saveRecord(diff, remaining) {
    const recs = loadRecords();
    if (!recs[diff] || remaining > recs[diff]) {
      recs[diff] = remaining;
      localStorage.setItem("cr_records", JSON.stringify(recs));
      return true;
    }
    return false;
  }
  function renderRecords() {
    const recs = loadRecords();
    const el = $("#records");
    const parts = Object.entries(DIFFS).map(([k, d]) => {
      const t = recs[k] != null ? fmt(recs[k]) : "--:--";
      return `<span class="rec">${d.label}: <b>${t}</b></span>`;
    });
    el.innerHTML = parts.length
      ? `${ICON.trophy}<span> RÉCORDS — mayor tiempo restante: </span>` + parts.join(" · ")
      : "";
  }

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;

  /* ── Generadores de bomba ──────────────────────────── */
  function makeSerial() {
    const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
    const full = LETTERS[Math.floor(Math.random() * 26)] + LETTERS[Math.floor(Math.random() * 26)] + digits;
    const hasVowel = /[AEIOU]/.test(full);
    return { full, digits, hasVowel, lastDigit: +digits[3] };
  }

  function pickTypes(diff) {
    const d = DIFFS[diff];
    if (d.types) return d.types.slice();
    const all = Object.keys(ModuleDefs);
    /* experto: 7 de 8, siempre incluyendo acertijo y cables */
    const forced = ["acertijo", "cables"];
    const rest = all.filter((t) => !forced.includes(t));
    const extra = rest.sort(() => Math.random() - 0.5).slice(0, 5);
    return [...forced, ...extra];
  }

  /* ── Arranque de partida ───────────────────────────── */
  function startGame(diff) {
    Sfx.unlock();
    Sfx.click();
    state.diff = diff;
    state.strikes = 0;
    state.serial = makeSerial();
    state.batteries = Math.floor(Math.random() * 5);
    state.total = DIFFS[diff].time;
    state.endTime = Date.now() + state.total * 1000;
    state.startStamp = Date.now();
    state.running = true;
    state.lastTickSec = -1;
    state.lastRenderSec = -1;
    $("#timer").textContent = fmt(state.total);

    const types = pickTypes(diff);
    state.modules = types.map((type, i) => ({
      id: i,
      type,
      def: ModuleDefs[type],
      data: null,
      solved: false,
    }));
    state.modules.forEach((m) => (m.data = m.def.generate(makeCtxForGen())));

    /* HUD */
    $("#serial-display").textContent = state.serial.full;
    $("#batt-display").textContent = state.batteries;
    renderStrikes();
    renderModules();
    updateArmLabel();

    closeModule();
    closeManual();
    showScreen("#screen-game");
    updateTimerUI(state.total);

    clearInterval(state.timerId);
    state.timerId = setInterval(tick, 200);
  }

  /* ctx mínimo para generate() (cables/codigo usan serial y batteries) */
  function makeCtxForGen() {
    return { serial: state.serial, batteries: state.batteries };
  }

  /* ── Ctx completo para mount() ─────────────────────── */
  function makeCtx(module) {
    return {
      serial: state.serial,
      batteries: state.batteries,
      seconds: () => Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000)),
      strikes: () => state.strikes,
      onSolved: () => solveModule(module),
      onStrike: () => addStrike(),
      remount: () => {
        module.data = module.def.generate(makeCtxForGen());
        mountModule(module);
      },
      openManual: (id) => openManual(id),
    };
  }

  /* ── Módulos: UI ───────────────────────────────────── */
  function renderModules() {
    const grid = $("#modules-grid");
    grid.innerHTML = "";
    state.modules.forEach((m) => {
      const card = document.createElement("div");
      card.className = "module-card" + (m.solved ? " solved" : "");
      card.innerHTML = `
        <span class="m-led"></span>
        <span class="m-icon">${ICON[m.type] || ""}</span>
        <span class="m-name">${m.def.name}</span>`;
      card.onclick = () => {
        if (m.solved || !state.running) return;
        Sfx.click();
        openModule(m);
      };
      grid.appendChild(card);
    });
    updateProgress();
  }

  function updateProgress() {
    const done = state.modules.filter((m) => m.solved).length;
    $("#progress-label").textContent = `MÓDULOS: ${done}/${state.modules.length}`;
  }

  function updateArmLabel() {
    const el = $("#arm-label");
    const allDone = state.modules.every((m) => m.solved);
    el.textContent = allDone ? "● DESARMADA" : "● ARMADA";
    el.className = allDone ? "led-off" : "armed led-on";
  }

  function openModule(m) {
    state.activeModule = m;
    $("#module-title").innerHTML = `${ICON[m.type] || ""} ${m.def.name}`;
    $("#module-overlay").classList.remove("closed");
    mountModule(m);
  }

  function mountModule(m) {
    const body = $("#module-body");
    body.classList.remove("mod-flash-ok", "mod-flash-bad");
    body.innerHTML = "";
    m.def.mount(body, m.data, makeCtx(m));
  }

  function closeModule() {
    $("#module-overlay").classList.add("closed");
    $("#module-body").innerHTML = "";
    state.activeModule = null;
  }

  function solveModule(m) {
    if (m.solved) return;
    m.solved = true;
    const body = $("#module-body");
    body.classList.add("mod-flash-ok");

    /* marcar tarjeta */
    const cards = $$("#modules-grid .module-card");
    const card = cards[m.id];
    if (card) card.classList.add("solved");

    updateProgress();
    updateArmLabel();

    setTimeout(() => {
      closeModule();
      if (state.modules.every((x) => x.solved)) win();
    }, 550);
  }

  /* ── Strikes ───────────────────────────────────────── */
  function renderStrikes() {
    $$("#strikes .strike-box").forEach((el, i) =>
      el.classList.toggle("on", i < state.strikes));
  }

  function addStrike() {
    if (!state.running) return;
    state.strikes++;
    renderStrikes();
    document.body.classList.remove("shake-it");
    void document.body.offsetWidth; /* reflow para reiniciar animación */
    document.body.classList.add("shake-it");
    $("#module-body").classList.add("mod-flash-bad");
    setTimeout(() => $("#module-body").classList.remove("mod-flash-bad"), 450);
    if (state.strikes >= MAX_STRIKES) boom();
  }

  /* ── Temporizador ──────────────────────────────────── */
  function tick() {
    if (!state.running) return;
    const remain = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));
    updateTimerUI(remain);

    if (remain !== state.lastTickSec && remain > 0) {
      state.lastTickSec = remain;
      if (remain <= 5) Sfx.siren();
      else if (remain <= 10) Sfx.tick(true);
      else if (remain <= 30) Sfx.tick(false);
    }
    if (remain <= 0) boom();
  }

  function updateTimerUI(remain) {
    if (remain === state.lastRenderSec) return; /* solo repinta cuando cambia el segundo */
    state.lastRenderSec = remain;
    const el = $("#timer");
    el.textContent = fmt(remain);
    el.classList.toggle("danger", remain <= 30);
  }

  /* ── Final: victoria / explosión ───────────────────── */
  function stopGame() {
    state.running = false;
    clearInterval(state.timerId);
  }

  function boom() {
    if (!state.running) return;
    stopGame();
    closeModule();
    Sfx.boom();
    const flash = $("#fx-flash");
    flash.classList.add("boom");
    document.body.classList.add("shake-it");
    setTimeout(() => {
      flash.classList.remove("boom");
      document.body.classList.remove("shake-it");
      showResult(false);
    }, 1500);
  }

  function win() {
    if (!state.running) return;
    stopGame();
    closeModule();
    const remaining = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));
    const record = saveRecord(state.diff, remaining);
    Sfx.fanfare();
    const flash = $("#fx-flash");
    flash.classList.add("win");
    setTimeout(() => {
      flash.classList.remove("win");
      showResult(true, remaining, record);
    }, 900);
  }

  function showResult(won, remaining = 0, record = false) {
    const title = $("#result-title");
    const sub = $("#result-sub");
    const stats = $("#result-stats");

    if (won) {
      title.textContent = "DESACTIVADA";
      title.className = "win";
      sub.textContent = record
        ? "★ NUEVO RÉCORD — la bomba quedó inerte."
        : "La bomba quedó inerte. Buen trabajo, desarmador.";
      stats.innerHTML = `
        <div class="stat-card"><div class="n">${fmt(remaining)}</div><div class="l">TIEMPO RESTANTE</div></div>
        <div class="stat-card"><div class="n">${state.strikes}/${MAX_STRIKES}</div><div class="l">STRIKES</div></div>
        <div class="stat-card"><div class="n">${state.modules.length}</div><div class="l">MÓDULOS</div></div>`;
    } else {
      title.textContent = "DETENACIÓN";
      title.className = "lose";
      sub.textContent = "La bomba explotó. El manual estaba ahí, ¿lo viste?";
      stats.innerHTML = `
        <div class="stat-card"><div class="n">${state.modules.filter((m) => m.solved).length}/${state.modules.length}</div><div class="l">MÓDULOS RESUELTOS</div></div>
        <div class="stat-card"><div class="n">${state.strikes}</div><div class="l">ERRORES</div></div>
        <div class="stat-card"><div class="n">${DIFFS[state.diff].label}</div><div class="l">DIFICULTAD</div></div>`;
    }
    renderRecords();
    showScreen("#screen-result");
  }

  /* ── Manual ────────────────────────────────────────── */
  let manualRendered = false;
  function renderManualNav() {
    const nav = $("#manual-nav");
    nav.innerHTML = "";
    MANUAL.forEach((page) => {
      const b = document.createElement("button");
      b.innerHTML = (ICON[page.icon] || "") + `<span>${page.nav}</span>`;
      b.dataset.id = page.id;
      b.onclick = () => showManualPage(page.id);
      nav.appendChild(b);
    });
  }
  function showManualPage(id) {
    const page = MANUAL.find((p) => p.id === id) || MANUAL[0];
    $("#manual-content").innerHTML = page.html;
    if (page.id === "keypad") {
      const holder = $("#keypad-cols");
      if (holder) renderKeypadColumns(holder, KEYPAD_COLUMNS);
    }
    $$("#manual-nav button").forEach((b) =>
      b.classList.toggle("active", b.dataset.id === page.id));
    $("#manual-content").scrollTop = 0;
  }
  function openManual(id) {
    if (!manualRendered) {
      renderManualNav();
      manualRendered = true;
    }
    $("#manual-panel").classList.remove("closed");
    showManualPage(id || "general");
  }
  function closeManual() {
    $("#manual-panel").classList.add("closed");
  }

  /* ── Init / bindings ───────────────────────────────── */
  function paintIcons() {
    $("#btn-sound").innerHTML = Sfx.muted ? ICON.mute : ICON.sound;
    $("#btn-manual").innerHTML = ICON.book + "<span>MANUAL</span>";
    $("#manual-icon").innerHTML = ICON.book;
    $("#batt-icon").innerHTML = ICON.battery;
    $("#module-help").innerHTML = ICON.book;
    $("#btn-retry").innerHTML = ICON.retry + "<span>OTRA BOMBA</span>";
    $("#btn-menu").innerHTML = ICON.home + "<span>MENÚ</span>";
  }

  function init() {
    paintIcons();
    /* intro: dificultad */
    $$(".diff-btn").forEach((b) =>
      (b.onclick = () => startGame(b.dataset.diff)));
    renderRecords();

    /* HUD */
    $("#btn-sound").onclick = () => {
      Sfx.unlock();
      const muted = Sfx.toggleMute();
      $("#btn-sound").innerHTML = muted ? ICON.mute : ICON.sound;
      Sfx.click();
    };
    $("#btn-manual").onclick = () => {
      Sfx.unlock();
      Sfx.click();
      $("#manual-panel").classList.contains("closed") ? openManual("general") : closeManual();
    };
    $("#manual-close").onclick = () => { Sfx.click(); closeManual(); };

    /* búsqueda en manual */
    $("#manual-search").oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      $$("#manual-nav button").forEach((b) => {
        b.style.display = !q || b.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    };

    /* módulo overlay */
    $("#module-close").onclick = () => { Sfx.click(); closeModule(); };
    $("#module-help").onclick = () => {
      Sfx.click();
      const m = state.activeModule;
      openManual(m ? m.def.manual : "general");
    };

    /* resultado */
    $("#btn-retry").onclick = () => startGame(state.diff);
    $("#btn-menu").onclick = () => { Sfx.click(); showScreen("#screen-intro"); renderRecords(); };

    /* primer gesto → audio */
    document.addEventListener("pointerdown", () => Sfx.unlock(), { once: true });

    /* ESC cierra manual/overlay */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!$("#manual-panel").classList.contains("closed")) closeManual();
        else if (!$("#module-overlay").classList.contains("closed")) closeModule();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
