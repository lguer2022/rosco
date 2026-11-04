/*
 * Rosco Radiológico · Efectos de sonido sintetizados (sin archivos externos).
 * Autor: Mg. Lic. Prof. Leandro Guerschberg
 */
(function () {
  "use strict";

  var ctx = null;
  var activo = true;

  function contexto() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tono(frecuencia, inicio, duracion, tipo, volumen) {
    var c = contexto();
    if (!c) return;
    var t = c.currentTime + inicio;
    var osc = c.createOscillator();
    var gan = c.createGain();
    osc.type = tipo || "sine";
    osc.frequency.setValueAtTime(frecuencia, t);
    gan.gain.setValueAtTime(0.0001, t);
    gan.gain.exponentialRampToValueAtTime(volumen || 0.2, t + 0.015);
    gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion);
    osc.connect(gan).connect(c.destination);
    osc.start(t);
    osc.stop(t + duracion + 0.05);
  }

  var efectos = {
    correcta: function () {
      tono(660, 0, 0.18, "triangle", 0.25);
      tono(990, 0.1, 0.3, "triangle", 0.25);
    },
    incorrecta: function () {
      tono(220, 0, 0.35, "sawtooth", 0.12);
      tono(160, 0.12, 0.45, "sawtooth", 0.12);
    },
    pasapalabra: function () {
      tono(520, 0, 0.12, "sine", 0.22);
      tono(780, 0.09, 0.12, "sine", 0.22);
      tono(520, 0.18, 0.18, "sine", 0.18);
    },
    tic: function () { tono(1200, 0, 0.06, "square", 0.06); },
    fin: function () {
      [523, 659, 784, 1046].forEach(function (f, i) { tono(f, i * 0.12, 0.4, "triangle", 0.2); });
    },
    tiempo: function () {
      tono(440, 0, 0.25, "square", 0.1);
      tono(440, 0.3, 0.25, "square", 0.1);
      tono(330, 0.6, 0.6, "square", 0.1);
    }
  };

  window.Sonidos = {
    reproducir: function (nombre) {
      if (!activo || !efectos[nombre]) return;
      try { efectos[nombre](); } catch (e) { /* sin audio */ }
    },
    alternar: function () { activo = !activo; return activo; },
    estaActivo: function () { return activo; },
    fijar: function (v) { activo = !!v; }
  };
})();
