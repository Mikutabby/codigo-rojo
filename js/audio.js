/* ════════════════════════════════════════════════════════
   CÓDIGO ROJO — motor de sonido procedural (WebAudio)
   Sin archivos externos: osciladores + buffers de ruido.
   ════════════════════════════════════════════════════════ */
const Sfx = (() => {
  let ctx = null;
  let master = null;
  let muted = localStorage.getItem("cr_muted") === "1";

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function env(node, t0, attack, decay, peak = 1) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    node.connect(g);
    g.connect(master);
    return g;
  }

  function tone(freq, type, attack, decay, peak = 1, when = 0) {
    if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    env(o, t0, attack, decay, peak);
    o.start(t0);
    o.stop(t0 + attack + decay + 0.05);
    return o;
  }

  function noiseBuffer(dur) {
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  return {
    /** Llamar en el primer gesto del usuario (autoplay policy) */
    unlock() { try { ensure(); } catch (e) { /* noop */ } },

    get muted() { return muted; },
    toggleMute() {
      muted = !muted;
      localStorage.setItem("cr_muted", muted ? "1" : "0");
      if (master) master.gain.value = muted ? 0 : 0.55;
      return muted;
    },

    /** Tick del cronómetro */
    tick(urgent = false) {
      ensure();
      tone(urgent ? 1750 : 1250, "square", 0.001, urgent ? 0.09 : 0.05, urgent ? 0.5 : 0.28);
    },

    /** Clic de interfaz */
    click() {
      ensure();
      tone(880, "square", 0.001, 0.05, 0.25);
      tone(440, "triangle", 0.001, 0.04, 0.12);
    },

    /** Módulo resuelto */
    success() {
      ensure();
      [523, 659, 784, 1047].forEach((f, i) =>
        tone(f, "triangle", 0.01, 0.28, 0.4, i * 0.09));
    },

    /** Error / strike — buzz desafinado */
    error() {
      ensure();
      tone(110, "square", 0.005, 0.32, 0.5);
      tone(117, "square", 0.005, 0.32, 0.5);
      // ráfaga de ruido
      const t0 = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(0.25);
      const f = ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = 900;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.35, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t0);
    },

    /** Sirena wobble (últimos segundos) */
    siren() {
      if (!ctx) return;
      const t0 = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(440, t0);
      o.frequency.linearRampToValueAtTime(880, t0 + 0.25);
      o.frequency.linearRampToValueAtTime(440, t0 + 0.5);
      env(o, t0, 0.01, 0.5, 0.22);
      o.start(t0); o.stop(t0 + 0.55);
    },

    /** Explosión: ruido filtrado + boom grave */
    boom() {
      ensure();
      const t0 = ctx.currentTime;
      // capa de ruido
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(1.4);
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(2200, t0);
      f.frequency.exponentialRampToValueAtTime(90, t0 + 1.2);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.9, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.35);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t0);
      // boom grave
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(70, t0);
      o.frequency.exponentialRampToValueAtTime(28, t0 + 0.9);
      env(o, t0, 0.005, 1.0, 0.9);
      o.start(t0); o.stop(t0 + 1.1);
    },

    /** Triunfo */
    fanfare() {
      ensure();
      const seq = [523, 659, 784, 1047, 784, 1047, 1319];
      seq.forEach((fr, i) => tone(fr, "triangle", 0.01, 0.3, 0.42, i * 0.11));
    },

    /** Beep de botón mantenido */
    beep() {
      ensure();
      tone(660, "sine", 0.005, 0.12, 0.3);
    },
  };
})();
