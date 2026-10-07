/* ════════════════════════════════════════════════════════
   CÓDIGO ROJO — definición de módulos (puzzles)
   Cada módulo: { name, icon, tier, generate(ctx), mount(body, data, ctx) }
   ctx = { serial, batteries, strikes, onSolved, onStrike, openManual(id) }
   ════════════════════════════════════════════════════════ */

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* instancia activa de Simon: los timers de un montaje viejo (overlay
   cerrado y reabierto) se descartan y no suenan ni tocan la UI */
let simonInstance = 0;

/* ── Columnas fijas del teclado (deben coincidir con el manual) ── */
const KEYPAD_COLUMNS = [
  ["♠", "★", "☾", "⚙"],
  ["♥", "◆", "✿", "☠"],
  ["♣", "▲", "☂", "⌘"],
  ["♦", "●", "☀", "☰"],
];

/* ── Palabras de contraseña (5 letras, coinciden con manual) ── */
const PASSWORD_WORDS = [
  "BOMBA", "CLAVE", "PISTA", "FUEGO", "MORSE", "CABLE",
  "LLAVE", "PULSO", "RADIO", "SEÑAL", "TURNO", "VALOR",
];

/* ── Acertijos escritos ── */
const RIDDLES = [
  {
    q: "Tengo ciudades, pero no casas. Tengo montañas, pero no árboles. Tengo agua, pero no peces. ¿Qué soy?",
    o: ["Un mapa", "Un acuario", "Un libro de geografía", "Una ventana"], a: 0,
  },
  {
    q: "Cuanto más me quitas, más grande me vuelvo. ¿Qué soy?",
    o: ["Un regalo", "Un hoyo", "Una deuda", "Un secreto"], a: 1,
  },
  {
    q: "Tengo dientes, pero nunca muerdo. ¿Qué soy?",
    o: ["Un peine", "Una serpiente", "Una sierra", "Un perro"], a: 0,
  },
  {
    q: "Vuelo sin alas y lloro sin ojos. ¿Qué soy?",
    o: ["Una nube", "Un pájaro", "El río", "Una hoja"], a: 0,
  },
  {
    q: "Tengo llaves, pero no abro ninguna puerta. ¿Qué soy?",
    o: ["Un piano", "Una cerradura", "Un reloj", "Un mapa"], a: 0,
  },
  {
    q: "¿Qué se rompe sin que nadie lo toque?",
    o: ["El hielo", "El silencio", "El espejo", "La cuerda"], a: 1,
  },
  {
    q: "Tengo ojos, pero no veo. Pueden esconderme bajo la tierra. ¿Qué soy?",
    o: ["Una aguja", "Una papa", "Un pez", "Una moneda"], a: 1,
  },
  {
    q: "Tengo un cuello, pero no tengo cabeza. ¿Qué soy?",
    o: ["Una botella", "Un camello", "Una camisa", "Un jarrón"], a: 0,
  },
  {
    q: "Si me preguntan cuántos meses del año tienen 28 días, ¿cuál es la respuesta correcta?",
    o: ["Solo febrero", "Dos", "Todos", "Ninguno"], a: 2,
  },
  {
    q: "Lo alargas sobre el piso y se hace más corto. ¿Qué es?",
    o: ["Una soga", "Tu sombra", "El día", "Una espera"], a: 1,
  },
];

/* ── Deducción lógica ── */
const LOGIC = [
  {
    q: "Diego llegó antes que Ana. Ana llegó antes que Bruno. Carla llegó después que Bruno. ¿Quién llegó primero?",
    o: ["Ana", "Bruno", "Carla", "Diego"], a: 3,
  },
  {
    q: "En el equipo hay una programadora, una diseñadora y un tester. PISTAS: 1) La programadora no es Lucía. 2) El tester se llama Marco. 3) Paula no es la diseñadora. ¿Quién es la diseñadora?",
    o: ["Lucía", "Paula", "Marco", "No se puede saber"], a: 0,
  },
  {
    q: "Si llueve, la callejuela se cierra. Hoy la callejuela está abierta. ¿Qué se concluye?",
    o: ["Que va a llover", "Que no está lloviendo", "Que la callejuela siempre cierra", "No se puede concluir nada"], a: 1,
  },
  {
    q: "Hay tres lugares: la colina, el faro y el río. PISTAS: 1) El tesoro NO está en la colina. 2) El tesoro está en el faro. 3) El tesoro NO está en el faro. Solo UNA pista es verdadera. ¿Dónde está el tesoro?",
    o: ["En la colina", "En el faro", "En el río", "No se puede saber"], a: 0,
  },
];

/* ── Cables: motor de reglas ── */
function wiresSolution(wires, lastDigit) {
  const n = wires.length;
  const has = (c) => wires.includes(c);
  const cnt = (c) => wires.filter((w) => w === c).length;
  const lastIdx = (c) => wires.lastIndexOf(c);
  const first = wires[0];
  const last = wires[n - 1];
  const odd = lastDigit % 2 === 1;

  if (n === 3) {
    if (first === "rojo") return 1;
    if (cnt("azul") > 1) return lastIdx("azul");
    if (last === "blanco") return n - 1;
    return 0;
  }
  if (n === 4) {
    if (cnt("rojo") > 1 && odd) return lastIdx("rojo");
    if (last === "amarillo" && !has("rojo")) return 0;
    if (cnt("azul") === 1) return 0;
    if (cnt("amarillo") > 1) return lastIdx("amarillo");
    return 1;
  }
  if (n === 5) {
    if (last === "negro" && odd) return 3;
    if (cnt("rojo") === 1 && cnt("amarillo") > 1) return 0;
    if (!has("negro")) return 1;
    return 0;
  }
  /* n === 6 */
  if (!has("amarillo") && odd) return 2;
  if (cnt("amarillo") === 1 && cnt("blanco") > 1) return 3;
  if (!has("rojo")) return n - 1;
  return 3;
}

const WIRE_COLORS = ["rojo", "azul", "blanco", "negro", "amarillo"];

/* ══════════════ DEFINICIONES DE MÓDULOS ══════════════ */
const ModuleDefs = {
  /* ── 1. ACERTIJO (escrito) ── */
  acertijo: {
    name: "ACERTIJO",
    icon: "📜",
    tier: 1,
    manual: "acertijo",
    generate() { return { used: [] }; },
    mount(body, data, ctx) {
      const newRiddle = () => {
        let avail = RIDDLES.map((_, i) => i).filter((i) => !data.used.includes(i));
        if (!avail.length) { data.used = []; avail = RIDDLES.map((_, i) => i); }
        const idx = pick(avail);
        data.used.push(idx);
        const r = RIDDLES[idx];
        body.innerHTML = `
          <p class="mod-instruction">RESOLVÉ EL ENIGMA — UNA SOLA RESPUESTA</p>
          <div class="riddle-text">${r.q}</div>
          <div class="opts"></div>
          <div class="mod-status"></div>`;
        const opts = body.querySelector(".opts");
        const status = body.querySelector(".mod-status");
        r.o.forEach((text, i) => {
          const b = document.createElement("button");
          b.className = "opt-btn";
          b.innerHTML = `<span class="key">${"ABCD"[i]}</span>${text}`;
          b.onclick = () => {
            if (i === r.a) {
              b.classList.add("correct");
              status.textContent = "✓ MÓDULO DESACTIVADO";
              status.className = "mod-status ok";
              Sfx.success();
              setTimeout(() => ctx.onSolved(), 450);
            } else {
              b.classList.add("wrong");
              status.textContent = "✗ RESPUESTA INCORRECTA — nuevo enigma";
              status.className = "mod-status bad";
              Sfx.error();
              ctx.onStrike();
              setTimeout(newRiddle, 900);
            }
          };
          opts.appendChild(b);
        });
      };
      newRiddle();
    },
  },

  /* ── 2. LÓGICA ── */
  logica: {
    name: "DEDUCCIÓN",
    icon: "🧩",
    tier: 3,
    manual: "logica",
    generate() { return { idx: rand(LOGIC.length) }; },
    mount(body, data, ctx) {
      const p = LOGIC[data.idx];
      body.innerHTML = `
        <p class="mod-instruction">ANALIZÁ LAS PISTAS — HAY UNA ÚNICA RESPUESTA</p>
        <div class="riddle-text">${p.q}</div>
        <div class="opts"></div>
        <div class="mod-status"></div>`;
      const opts = body.querySelector(".opts");
      const status = body.querySelector(".mod-status");
      let done = false;
      p.o.forEach((text, i) => {
        const b = document.createElement("button");
        b.className = "opt-btn";
        b.innerHTML = `<span class="key">${"ABCD"[i]}</span>${text}`;
        b.onclick = () => {
          if (done) return;
          if (i === p.a) {
            done = true;
            b.classList.add("correct");
            status.textContent = "✓ MÓDULO DESACTIVADO";
            status.className = "mod-status ok";
            Sfx.success();
            setTimeout(() => ctx.onSolved(), 450);
          } else {
            b.classList.add("wrong");
            status.textContent = "✗ ESO CONTRADICE LAS PISTAS";
            status.className = "mod-status bad";
            Sfx.error();
            ctx.onStrike();
          }
        };
        opts.appendChild(b);
      });
    },
  },

  /* ── 3. CABLES ── */
  cables: {
    name: "CABLES",
    icon: "🔌",
    tier: 1,
    manual: "cables",
    generate(ctx) {
      const n = pick([3, 4, 4, 5, 5, 6]);
      const wires = Array.from({ length: n }, () => pick(WIRE_COLORS));
      return { wires, correct: wiresSolution(wires, ctx.serial.lastDigit) };
    },
    mount(body, data, ctx) {
      body.innerHTML = `
        <p class="mod-instruction">CORTÁ UN ÚNICO CABLE — REVISÁ EL MANUAL (PÁG. 6)</p>
        <div class="wires-box"></div>
        <div class="mod-status"></div>`;
      const box = body.querySelector(".wires-box");
      const status = body.querySelector(".mod-status");
      let done = false;
      data.wires.forEach((color, i) => {
        const w = document.createElement("div");
        w.className = `wire wire-${color}`;
        w.title = `Cable ${i + 1} (${color})`;
        w.onclick = () => {
          if (done) return;
          done = true;
          w.classList.add("cut");
          if (i === data.correct) {
            status.textContent = "✓ CABLE CORRECTO — MÓDULO DESACTIVADO";
            status.className = "mod-status ok";
            Sfx.success();
            setTimeout(() => ctx.onSolved(), 450);
          } else {
            status.textContent = "✗ CABLE EQUIVOCADO";
            status.className = "mod-status bad";
            Sfx.error();
            ctx.onStrike();
            setTimeout(() => ctx.remount(), 900); /* módulo se regenera */
          }
        };
        box.appendChild(w);
      });
    },
  },

  /* ── 4. BOTÓN ── */
  boton: {
    name: "BOTÓN",
    icon: "🔴",
    tier: 2,
    manual: "boton",
    generate(ctx) {
      const color = pick(["rojo", "azul", "amarillo", "blanco"]);
      const label = pick(["DETONAR", "MANTENER", "PRESIONAR", "ABORTAR"]);
      const strip = pick(["rojo", "azul", "amarillo", "blanco"]);
      /* aplicar reglas del manual */
      let action;
      if (label === "DETONAR" && ctx.batteries >= 2) action = "tap";
      else if (color === "azul" && label === "MANTENER") action = "hold";
      else if (ctx.batteries > 2) action = "tap";
      else action = "hold";
      return { color, label, strip, action };
    },
    mount(body, data, ctx) {
      body.innerHTML = `
        <p class="mod-instruction">REGLAS EN PÁG. 7 — MIRÁ LA TIRA DE COLOR</p>
        <div class="big-button-wrap">
          <button class="big-bomb-button bbtn-${data.color}">${data.label}</button>
          <div class="color-strip strip-${data.strip}" title="Tira de color: ${data.strip}"></div>
          <div class="hold-hint">${data.action === "hold"
            ? "MANTENÉ presionado y soltá en el momento exacto"
            : "PULSÁ y soltá"}</div>
        </div>
        <div class="mod-status"></div>`;
      const btn = body.querySelector(".big-bomb-button");
      const status = body.querySelector(".mod-status");
      let done = false;
      let holding = false;

      const stripCond = () => {
        const sec = ctx.seconds() % 60;
        switch (data.strip) {
          case "rojo":     return sec % 2 === 0;
          case "azul":     return sec % 10 === 4;
          case "amarillo": return sec % 10 === 7;
          case "blanca":
          default:         return sec % 10 === 0;
        }
      };

      btn.onpointerdown = (e) => {
        e.preventDefault();
        if (done) return;
        holding = true;
        btn.classList.add("holding");
        Sfx.beep();
      };
      btn.onpointerup = (e) => {
        e.preventDefault();
        if (done || !holding) return;
        holding = false;
        btn.classList.remove("holding");
        if (data.action === "tap") {
          done = true;
          status.textContent = "✓ MÓDULO DESACTIVADO";
          status.className = "mod-status ok";
          Sfx.success();
          setTimeout(() => ctx.onSolved(), 350);
        } else {
          if (stripCond()) {
            done = true;
            status.textContent = "✓ SOLTASTE EN EL MOMENTO EXACTO";
            status.className = "mod-status ok";
            Sfx.success();
            setTimeout(() => ctx.onSolved(), 350);
          } else {
            status.textContent = "✗ MOMENTO INCORRECTO — mirá la tira y el reloj";
            status.className = "mod-status bad";
            Sfx.error();
            ctx.onStrike();
          }
        }
      };
      btn.onpointerleave = () => {
        if (holding && !done) {
          holding = false;
          btn.classList.remove("holding");
        }
      };
    },
  },

  /* ── 5. TECLADO DE SÍMBOLOS ── */
  keypad: {
    name: "SÍMBOLOS",
    icon: "🔣",
    tier: 2,
    manual: "keypad",
    generate() {
      const col = rand(4);
      return { col, solution: KEYPAD_COLUMNS[col] };
    },
    mount(body, data, ctx) {
      const shown = shuffle(data.solution);
      body.innerHTML = `
        <p class="mod-instruction">PRESIONALOS EN EL ORDEN DE LA COLUMNA CORRECTA (PÁG. 9)</p>
        <div class="keypad-grid"></div>
        <div class="mod-status"></div>`;
      const grid = body.querySelector(".keypad-grid");
      const status = body.querySelector(".mod-status");
      let step = 0;
      let done = false;
      shown.forEach((sym) => {
        const b = document.createElement("button");
        b.className = "key-sym";
        b.textContent = sym;
        b.onclick = () => {
          if (done) return;
          if (sym === data.solution[step]) {
            b.classList.add("pressed", "correct");
            Sfx.click();
            step++;
            if (step === 4) {
              done = true;
              status.textContent = "✓ SECUENCIA CORRECTA";
              status.className = "mod-status ok";
              Sfx.success();
              setTimeout(() => ctx.onSolved(), 400);
            }
          } else {
            status.textContent = "✗ ORDEN INCORRECTO — empezá de nuevo";
            status.className = "mod-status bad";
            Sfx.error();
            ctx.onStrike();
            step = 0;
            grid.querySelectorAll(".key-sym").forEach((el) => el.classList.remove("pressed", "correct"));
          }
        };
        grid.appendChild(b);
      });
    },
  },

  /* ── 6. SIMON ── */
  simon: {
    name: "SIMON",
    icon: "🎯",
    tier: 1,
    manual: "simon",
    generate() {
      return { seq: [], round: 0 };
    },
    mount(body, data, ctx) {
      const COLORS = ["rojo", "azul", "verde", "amarillo"];
      body.innerHTML = `
        <p class="mod-instruction">REPETÍ LA SECUENCIA CON EL COLOR MAPEADO (PÁG. 11)</p>
        <div class="simon-wrap">
          <button class="simon-pad sp-rojo" data-c="rojo"></button>
          <button class="simon-pad sp-azul" data-c="azul"></button>
          <button class="simon-pad sp-verde" data-c="verde"></button>
          <button class="simon-pad sp-amarillo" data-c="amarillo"></button>
        </div>
        <div class="simon-status play">OBSERVANDO...</div>`;
      const status = body.querySelector(".simon-status");
      const pads = {};
      body.querySelectorAll(".simon-pad").forEach((p) => (pads[p.dataset.c] = p));

      const hasVowel = ctx.serial.hasVowel;
      const mapping = () => {
        const strikes = ctx.strikes();
        if (hasVowel) {
          if (strikes === 0) return { rojo: "azul", azul: "rojo", verde: "amarillo", amarillo: "verde" };
          return { rojo: "amarillo", azul: "verde", verde: "azul", amarillo: "rojo" };
        }
        if (strikes === 0) return { rojo: "azul", azul: "amarillo", verde: "verde", amarillo: "rojo" };
        return { rojo: "rojo", azul: "azul", verde: "amarillo", amarillo: "verde" };
      };

      let inputIdx = 0;
      let accepting = false;
      let done = false;

      /* instancia viva: callbacks de montajes anteriores se ignoran */
      const inst = ++simonInstance;
      const alive = () => inst === simonInstance;

      /* la ronda 1 solo se siembra si no existe: reabrir el módulo
         (p. ej. para mirar el manual) conserva el progreso */
      if (data.seq.length === 0) {
        data.seq = [pick(COLORS), pick(COLORS), pick(COLORS)];
        data.round = 0;
      }

      const playSequence = async () => {
        accepting = false;
        inputIdx = 0;
        status.className = "simon-status play";
        status.textContent = `RONDA ${data.round + 1}/3 — OBSERVANDO...`;
        const STEP = 620, DUR = 420;
        /* timing ABSOLUTO: cada flash se programa desde ahora (500 + i*620),
           no desde que terminó el anterior — antes los intervalos crecían
           +620ms por paso y la ronda 3 tardaba ~20 segundos */
        await Promise.all(
          data.seq.map((c, i) =>
            new Promise((res) => {
              setTimeout(() => {
                if (!alive() || done) return res();
                pads[c].classList.add("lit");
                Sfx.beep();
                setTimeout(() => {
                  if (alive()) pads[c].classList.remove("lit");
                  res();
                }, DUR);
              }, 500 + i * STEP);
            })
          )
        );
        if (!alive() || done) return;
        accepting = true;
        status.textContent = `RONDA ${data.round + 1}/3 — TOCÁ (mapeado)`;
        status.classList.remove("play");
      };

      const nextRound = () => {
        data.round++;
        if (data.round >= 3) {
          done = true;
          status.className = "simon-status ok";
          status.textContent = "✓ SECUENCIA COMPLETA — MÓDULO DESACTIVADO";
          Sfx.success();
          setTimeout(() => ctx.onSolved(), 450);
          return;
        }
        data.seq.push(pick(COLORS), pick(COLORS)); /* +2 por ronda */
        playSequence();
      };

      Object.entries(pads).forEach(([color, pad]) => {
        pad.onclick = () => {
          if (!accepting || done) return;
          const expected = mapping()[data.seq[inputIdx]];
          if (color === expected) {
            pad.classList.add("lit");
            setTimeout(() => pad.classList.remove("lit"), 220);
            Sfx.click();
            inputIdx++;
            if (inputIdx >= data.seq.length) {
              accepting = false;
              setTimeout(nextRound, 500);
            }
          } else {
            done = true;
            accepting = false;
            status.className = "simon-status bad";
            status.textContent = "✗ COLOR EQUIVOCADO — volvés a la ronda 1";
            Sfx.error();
            ctx.onStrike();
            /* datos reiniciados YA: ronda 1 = 3 flashes, igual que el arranque */
            data.round = 0;
            data.seq = [pick(COLORS), pick(COLORS), pick(COLORS)];
            setTimeout(() => {
              if (!alive()) return;
              done = false;
              playSequence();
            }, 1200);
          }
        };
      });

      playSequence();
    },
  },

  /* ── 7. CONTRASEÑA ── */
  password: {
    name: "CONTRASEÑA",
    icon: "🔤",
    tier: 3,
    manual: "password",
    generate() {
      const word = pick(PASSWORD_WORDS);
      const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
      const slots = [];
      for (const ch of word) {
        const decoys = [];
        while (decoys.length < 5) {
          const d = pick(letters);
          if (d !== ch && !decoys.includes(d)) decoys.push(d);
        }
        slots.push(shuffle([ch, ...decoys]));
      }
      return { word, slots, pos: slots.map(() => 0) };
    },
    mount(body, data, ctx) {
      body.innerHTML = `
        <p class="mod-instruction">FORMÁ UNA PALABRA DE LA LISTA DEL MANUAL (PÁG. 12)</p>
        <div class="password-slots"></div>
        <button class="pw-submit">ENVIAR</button>
        <div class="mod-status"></div>`;
      const wrap = body.querySelector(".password-slots");
      const status = body.querySelector(".mod-status");
      let done = false;

      data.slots.forEach((col, i) => {
        const slot = document.createElement("div");
        slot.className = "pw-slot";
        slot.innerHTML = `
          <button class="pw-arrow" data-dir="1">▲</button>
          <div class="pw-letter">${col[data.pos[i]]}</div>
          <button class="pw-arrow" data-dir="-1">▼</button>`;
        slot.querySelectorAll(".pw-arrow").forEach((a) => {
          a.onclick = () => {
            if (done) return;
            const dir = +a.dataset.dir;
            data.pos[i] = (data.pos[i] + dir + col.length) % col.length;
            slot.querySelector(".pw-letter").textContent = col[data.pos[i]];
            Sfx.click();
          };
        });
        wrap.appendChild(slot);
      });

      body.querySelector(".pw-submit").onclick = () => {
        if (done) return;
        const word = data.pos.map((p, i) => data.slots[i][p]).join("");
        if (PASSWORD_WORDS.includes(word)) {
          done = true;
          status.textContent = `✓ PALABRA "${word}" ACEPTADA`;
          status.className = "mod-status ok";
          Sfx.success();
          setTimeout(() => ctx.onSolved(), 450);
        } else {
          status.textContent = `✗ "${word}" NO ESTÁ EN LA LISTA`;
          status.className = "mod-status bad";
          Sfx.error();
          ctx.onStrike();
        }
      };
    },
  },

  /* ── 8. CÓDIGO NUMÉRICO ── */
  codigo: {
    name: "CÓDIGO",
    icon: "🔢",
    tier: 3,
    manual: "codigo",
    generate(ctx) {
      const kind = pick(["serial-inv", "serial-fwd", "m1", "m2", "m3", "m4"]);
      const d = ctx.serial.digits; /* string de 4 dígitos */
      switch (kind) {
        case "serial-inv":
          return { clue: "El código son los <b>dígitos del número de serie</b>, <b>invertidos</b> (del último al primero).", answer: d.split("").reverse().join("") };
        case "serial-fwd":
          return { clue: "El código son los <b>4 dígitos del número de serie</b>, en el mismo orden.", answer: d };
        case "m1":
          return { clue: "miles = raíz de <b>81</b> · centenas = <b>4 + 5</b> · decenas = <b>2³</b> · unidades = <b>9 − 6</b>", answer: "9983" };
        case "m2":
          return { clue: "El primer dígito es <b>4</b>. El segundo es <b>la mitad</b> del primero. El tercero es <b>la suma</b> de los dos anteriores. El cuarto es <b>el doble</b> del primero.", answer: "4268" };
        case "m3":
          return { clue: "<b>Todos</b> los dígitos son iguales a la <b>raíz de 49</b>.", answer: "7777" };
        default:
          return { clue: "Cuatro dígitos <b>consecutivos descendentes</b> que empiezan en <b>9</b>.", answer: "9876" };
      }
    },
    mount(body, data, ctx) {
      body.innerHTML = `
        <p class="mod-instruction">LEÉ LA PISTA Y ESCRIBÍ EL CÓDIGO DE 4 DÍGITOS</p>
        <div class="code-clue">${data.clue}</div>
        <div class="code-display">
          <div class="code-digit empty">–</div>
          <div class="code-digit empty">–</div>
          <div class="code-digit empty">–</div>
          <div class="code-digit empty">–</div>
        </div>
        <div class="keypad-nums"></div>
        <div class="mod-status"></div>`;

      const digits = body.querySelectorAll(".code-digit");
      const status = body.querySelector(".mod-status");
      const pad = body.querySelector(".keypad-nums");
      let entry = "";
      let done = false;

      const render = () => {
        digits.forEach((el, i) => {
          el.textContent = entry[i] || "–";
          el.classList.toggle("empty", !entry[i]);
        });
      };

      const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"];
      keys.forEach((k) => {
        const b = document.createElement("button");
        b.className = "num-key" + (k === "OK" ? " ok" : "");
        b.textContent = k;
        b.onclick = () => {
          if (done) return;
          Sfx.click();
          if (k === "C") entry = "";
          else if (k === "OK") {
            if (entry.length === 4) {
              if (entry === data.answer) {
                done = true;
                status.textContent = "✓ CÓDIGO ACEPTADO";
                status.className = "mod-status ok";
                Sfx.success();
                setTimeout(() => ctx.onSolved(), 450);
              } else {
                status.textContent = "✗ CÓDIGO INCORRECTO";
                status.className = "mod-status bad";
                Sfx.error();
                ctx.onStrike();
                entry = "";
              }
            } else {
              status.textContent = "— faltan dígitos —";
              status.className = "mod-status";
            }
          } else if (entry.length < 4) entry += k;
          render();
        };
        pad.appendChild(b);
      });
      render();
    },
  },
};
