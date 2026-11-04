/*
 * Rosco Radiológico · Lógica de la partida.
 * Autor: Mg. Lic. Prof. Leandro Guerschberg
 *
 * Reglas:
 *  - Verde (correcta): el equipo sigue con la siguiente letra pendiente.
 *  - Amarillo (pasapalabra): la letra queda pendiente y el turno pasa al otro equipo.
 *  - Rojo (incorrecta): la letra se pierde y el turno pasa al otro equipo.
 *  - Si el otro equipo ya terminó, el equipo actual sigue jugando.
 *  - Un equipo termina cuando no le quedan letras o se le agota el reloj.
 *  - Gana quien tiene más correctas; si empatan, quien tiene menos incorrectas.
 */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var CIRCUNFERENCIA = 2 * Math.PI * 45;

  var estado = null;
  var historial = [];
  var intervalo = null;
  var ultimoTic = 0;
  var ultimoSegundo = null;
  var nodosLetras = [];
  var alSalir = function () {};

  /* ---------- Creación ---------- */

  function crearEquipo(nombre, rosco, segundos) {
    return {
      nombre: nombre,
      letras: Almacen.LETRAS.map(function (letra, i) {
        return { letra: letra, estado: "pendiente", datos: rosco ? rosco[i] : null };
      }),
      idx: 0,
      tiempo: segundos * 1000,
      terminado: false,
      motivoFin: ""
    };
  }

  function iniciar(opciones) {
    detenerReloj();
    var banco = opciones.banco;
    estado = {
      opciones: opciones,
      modo: opciones.modo,
      conReloj: opciones.conReloj,
      segundos: opciones.segundos,
      equipos: [
        crearEquipo(opciones.nombres[0], banco ? banco.equipos.A : null, opciones.segundos),
        crearEquipo(opciones.nombres[1], banco ? banco.equipos.B : null, opciones.segundos)
      ],
      turno: 0,
      vista: 0,
      fase: "turno",
      respuestaVisible: false
    };
    historial = [];
    $("pantalla-juego").classList.toggle("modo-libre", estado.modo === "libre");
    $("pantalla-juego").classList.remove("fin-juego");
    $("contador-tiempo").classList.toggle("sin-reloj", !estado.conReloj);
    construirRosco();
    ocultarCapas();
    mostrarCapaTurno("Comienza el juego");
    render();
    iniciarReloj();
  }

  function construirRosco() {
    var rosco = $("rosco");
    nodosLetras.forEach(function (n) { n.remove(); });
    nodosLetras = Almacen.LETRAS.map(function (letra, i) {
      var angulo = (-90 + (360 / Almacen.LETRAS.length) * i) * Math.PI / 180;
      var radio = 44;
      var nodo = document.createElement("div");
      nodo.className = "letra";
      nodo.textContent = letra;
      nodo.style.left = (50 + radio * Math.cos(angulo)) + "%";
      nodo.style.top = (50 + radio * Math.sin(angulo)) + "%";
      rosco.appendChild(nodo);
      return nodo;
    });
  }

  /* ---------- Reloj ---------- */

  function iniciarReloj() {
    detenerReloj();
    ultimoTic = performance.now();
    intervalo = setInterval(tic, 100);
  }

  function detenerReloj() {
    if (intervalo) clearInterval(intervalo);
    intervalo = null;
  }

  function tic() {
    var ahora = performance.now();
    var dt = ahora - ultimoTic;
    ultimoTic = ahora;
    if (!estado || estado.fase !== "jugando" || !estado.conReloj) return;

    var eq = estado.equipos[estado.turno];
    eq.tiempo = Math.max(0, eq.tiempo - dt);

    var segundo = Math.ceil(eq.tiempo / 1000);
    if (segundo !== ultimoSegundo) {
      ultimoSegundo = segundo;
      if (segundo <= 5 && segundo > 0) Sonidos.reproducir("tic");
    }

    if (eq.tiempo <= 0) {
      eq.terminado = true;
      eq.motivoFin = "tiempo";
      Sonidos.reproducir("tiempo");
      finDeTurno("tiempo");
      return;
    }
    renderContadores();
    renderMarcador();
  }

  /* ---------- Acciones ---------- */

  function guardarHistorial() {
    historial.push(JSON.stringify({ equipos: estado.equipos, turno: estado.turno }));
    if (historial.length > 200) historial.shift();
  }

  function siguientePendiente(eq) {
    var n = eq.letras.length;
    for (var k = 1; k <= n; k++) {
      var j = (eq.idx + k) % n;
      var e = eq.letras[j].estado;
      if (e === "pendiente" || e === "pasada") return j;
    }
    return -1;
  }

  function avanzar(eq) {
    var j = siguientePendiente(eq);
    if (j === -1) {
      eq.terminado = true;
      eq.motivoFin = "completo";
    } else {
      eq.idx = j;
    }
  }

  function marcar(resultado) {
    if (!estado || estado.fase !== "jugando") return;
    guardarHistorial();
    var eq = estado.equipos[estado.turno];
    var letra = eq.letras[eq.idx];
    estado.respuestaVisible = false;

    if (resultado === "correcta") {
      letra.estado = "correcta";
      Sonidos.reproducir("correcta");
      avanzar(eq);
      if (eq.terminado) finDeTurno("completo"); else render();
    } else if (resultado === "incorrecta") {
      letra.estado = "incorrecta";
      Sonidos.reproducir("incorrecta");
      avanzar(eq);
      finDeTurno(eq.terminado ? "completo" : "incorrecta");
    } else if (resultado === "pasapalabra") {
      letra.estado = "pasada";
      Sonidos.reproducir("pasapalabra");
      avanzar(eq);
      finDeTurno("pasapalabra");
    }
  }

  function finDeTurno(motivo) {
    var actual = estado.equipos[estado.turno];
    var otro = estado.equipos[1 - estado.turno];

    if (actual.terminado && otro.terminado) {
      terminar();
      return;
    }
    if (otro.terminado) {
      // El rival ya terminó: el equipo actual sigue jugando.
      render();
      return;
    }

    var textos = {
      pasapalabra: "Pasapalabra de " + actual.nombre,
      incorrecta: "Respuesta incorrecta de " + actual.nombre,
      completo: actual.nombre + " completó su rosco",
      tiempo: "Se agotó el tiempo de " + actual.nombre
    };
    estado.turno = 1 - estado.turno;
    estado.vista = estado.turno;
    estado.fase = "turno";
    mostrarCapaTurno(textos[motivo] || "");
    render();
  }

  function mostrarCapaTurno(motivo) {
    var eq = estado.equipos[estado.turno];
    var pendientes = eq.letras.filter(function (l) {
      return l.estado === "pendiente" || l.estado === "pasada";
    }).length;
    $("turno-motivo").textContent = motivo;
    $("turno-titulo").textContent = "Turno de " + eq.nombre;
    var detalle = pendientes + (pendientes === 1 ? " letra pendiente" : " letras pendientes");
    if (estado.conReloj) detalle += " · " + formatoTiempo(eq.tiempo) + " de reloj";
    $("turno-detalle").textContent = detalle;
    $("capa-turno").hidden = false;
  }

  function comenzarTurno() {
    if (!estado || estado.fase !== "turno") return;
    $("capa-turno").hidden = true;
    estado.fase = "jugando";
    ultimoTic = performance.now();
    ultimoSegundo = null;
    render();
  }

  function alternarPausa() {
    if (!estado) return;
    if (estado.fase === "turno") { comenzarTurno(); return; }
    if (estado.fase === "jugando") {
      estado.fase = "pausa";
      $("capa-pausa").hidden = false;
    } else if (estado.fase === "pausa") {
      estado.fase = "jugando";
      $("capa-pausa").hidden = true;
      ultimoTic = performance.now();
    }
    render();
  }

  function deshacer() {
    if (!estado || !historial.length) return;
    var previo = JSON.parse(historial.pop());
    var tiempos = estado.equipos.map(function (e) { return e.tiempo; });
    estado.equipos = previo.equipos;
    estado.equipos.forEach(function (e, i) {
      e.tiempo = Math.max(tiempos[i], e.terminado ? 0 : 1000);
    });
    estado.turno = previo.turno;
    estado.vista = previo.turno;
    estado.respuestaVisible = false;
    estado.fase = "jugando";
    ocultarCapas();
    $("pantalla-juego").classList.remove("fin-juego");
    ultimoTic = performance.now();
    render();
    aviso("Se deshizo la última jugada");
  }

  function mostrarRespuesta() {
    if (!estado || estado.modo === "libre" || estado.fase === "turno") return;
    estado.respuestaVisible = !estado.respuestaVisible;
    renderPanel();
  }

  /* ---------- Fin del juego ---------- */

  function resumen(eq) {
    var r = { correctas: 0, incorrectas: 0, pendientes: 0 };
    eq.letras.forEach(function (l) {
      if (l.estado === "correcta") r.correctas++;
      else if (l.estado === "incorrecta") r.incorrectas++;
      else r.pendientes++;
    });
    return r;
  }

  function ganador() {
    var a = resumen(estado.equipos[0]);
    var b = resumen(estado.equipos[1]);
    if (a.correctas !== b.correctas) return a.correctas > b.correctas ? 0 : 1;
    if (a.incorrectas !== b.incorrectas) return a.incorrectas < b.incorrectas ? 0 : 1;
    return -1;
  }

  function terminar() {
    estado.fase = "fin";
    $("pantalla-juego").classList.add("fin-juego");
    Sonidos.reproducir("fin");
    var g = ganador();
    if (g >= 0) estado.vista = g;
    render();
    mostrarResultados();
  }

  function mostrarResultados() {
    var g = ganador();
    $("final-titulo").textContent = g === -1 ? "¡Empate!" : "Gana " + estado.equipos[g].nombre;
    var html = estado.equipos.map(function (eq, i) {
      var r = resumen(eq);
      return '<div class="resultado-equipo' + (i === g ? " ganador" : "") + '">' +
        "<h3>" + escapar(eq.nombre) + "</h3>" +
        '<div class="cifras">' +
        '<div class="cifra ok"><b>' + r.correctas + "</b><small>Correctas</small></div>" +
        '<div class="cifra mal"><b>' + r.incorrectas + "</b><small>Incorrectas</small></div>" +
        '<div class="cifra pend"><b>' + r.pendientes + "</b><small>Sin responder</small></div>" +
        "</div></div>";
    }).join("");
    $("tabla-final").innerHTML = html;
    $("capa-final").hidden = false;
  }

  function verRoscos() {
    $("capa-final").hidden = true;
    aviso("Tocá el nombre de un equipo para ver su rosco. Enter vuelve a los resultados.");
  }

  /* ---------- Render ---------- */

  function render() {
    if (!estado) return;
    renderMarcador();
    renderRosco();
    renderContadores();
    renderPanel();
    renderControles();
  }

  function renderMarcador() {
    var html = estado.equipos.map(function (eq, i) {
      var r = resumen(eq);
      var clases = "equipo-chip";
      if (estado.fase === "fin" ? i === estado.vista : i === estado.turno) clases += " activo";
      if (eq.terminado && estado.fase !== "fin") clases += " terminado";
      return '<button type="button" class="' + clases + '" data-equipo="' + i + '">' +
        '<span class="nombre">' + escapar(eq.nombre) + "</span>" +
        '<span class="datos">' +
        '<span class="ok">✓ ' + r.correctas + "</span>" +
        '<span class="mal">✗ ' + r.incorrectas + "</span>" +
        (estado.conReloj ? '<span class="tiempo">' + formatoTiempo(eq.tiempo) + "</span>" : "") +
        "</span></button>";
    }).join("");
    var cont = $("marcador");
    if (cont.innerHTML !== html) cont.innerHTML = html;
  }

  function equipoVisible() {
    return estado.equipos[estado.fase === "fin" ? estado.vista : estado.turno];
  }

  function renderRosco() {
    var eq = equipoVisible();
    var enJuego = estado.fase !== "fin" && !eq.terminado;
    eq.letras.forEach(function (l, i) {
      var n = nodosLetras[i];
      n.className = "letra" +
        (l.estado !== "pendiente" ? " " + l.estado : "") +
        (enJuego && i === eq.idx ? " actual" : "");
    });

    var actual = eq.letras[eq.idx];
    $("rosco-equipo").textContent = eq.nombre;
    if (estado.fase === "fin" || eq.terminado) {
      $("rosco-letra").textContent = resumen(eq).correctas;
      $("rosco-tipo").textContent = "correctas";
    } else {
      $("rosco-letra").textContent = actual.letra;
      $("rosco-tipo").textContent = estado.modo === "libre" ? "" :
        (actual.datos && actual.datos.tipo === "contiene" ? "Contiene" : "Empieza por");
    }
  }

  function renderContadores() {
    var eq = equipoVisible();
    var r = resumen(eq);
    var aroT = $("aro-tiempo");
    var valorT = $("valor-tiempo");
    if (estado.conReloj) {
      var seg = Math.ceil(eq.tiempo / 1000);
      valorT.textContent = seg;
      var frac = estado.segundos > 0 ? eq.tiempo / (estado.segundos * 1000) : 0;
      aroT.style.strokeDashoffset = (CIRCUNFERENCIA * (1 - frac)).toFixed(2);
      $("contador-tiempo").classList.toggle("critico", estado.fase === "jugando" && seg <= 10);
    } else {
      valorT.textContent = "∞";
      aroT.style.strokeDashoffset = 0;
    }
    $("valor-aciertos").textContent = r.correctas;
    $("aro-aciertos").style.strokeDashoffset =
      (CIRCUNFERENCIA * (1 - r.correctas / eq.letras.length)).toFixed(2);
  }

  function renderPanel() {
    if (estado.modo === "libre") return;
    var eq = equipoVisible();
    var l = eq.letras[eq.idx];
    var datos = l.datos || {};
    var fin = estado.fase === "fin" || eq.terminado;

    var badge = $("pregunta-letra");
    badge.textContent = l.letra;
    badge.classList.toggle("pasada", l.estado === "pasada" && !fin);

    if (fin) {
      $("pregunta-tipo").textContent = eq.nombre;
      $("pregunta-texto").textContent = "Rosco finalizado.";
      $("pregunta-texto").classList.add("vacia");
      $("btn-respuesta").hidden = true;
      $("respuesta-texto").hidden = true;
      return;
    }

    $("pregunta-tipo").textContent = (datos.tipo === "contiene" ? "Contiene la " : "Empieza con la ") + l.letra;
    var texto = $("pregunta-texto");
    if (datos.pregunta) {
      texto.textContent = datos.pregunta;
      texto.classList.remove("vacia");
    } else {
      texto.textContent = "No hay pregunta cargada para esta letra.";
      texto.classList.add("vacia");
    }
    $("btn-respuesta").hidden = false;
    $("btn-respuesta").firstChild.textContent = estado.respuestaVisible ? "Ocultar respuesta " : "Mostrar respuesta ";
    var resp = $("respuesta-texto");
    resp.textContent = datos.respuesta || "—";
    resp.hidden = !estado.respuestaVisible;
  }

  function renderControles() {
    var jugando = estado.fase === "jugando";
    ["btn-correcta", "btn-incorrecta", "btn-pasapalabra"].forEach(function (id) {
      $(id).disabled = !jugando;
    });
    $("btn-pausa").disabled = estado.fase === "fin";
    $("btn-pausa").classList.toggle("en-pausa", estado.fase === "pausa" || estado.fase === "turno");
    $("btn-deshacer").disabled = historial.length === 0;
  }

  /* ---------- Utilidades ---------- */

  function formatoTiempo(ms) {
    var s = Math.ceil(ms / 1000);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function escapar(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function aviso(texto, esError) {
    var a = $("aviso");
    a.textContent = texto;
    a.classList.toggle("error", !!esError);
    a.classList.add("visible");
    clearTimeout(aviso.t);
    aviso.t = setTimeout(function () { a.classList.remove("visible"); }, 3200);
  }

  function ocultarCapas() {
    ["capa-turno", "capa-pausa", "capa-final"].forEach(function (id) { $(id).hidden = true; });
  }

  function salir() {
    detenerReloj();
    ocultarCapas();
    estado = null;
    alSalir();
  }

  function pantallaCompleta() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen && document.exitFullscreen();
    }
  }

  /* ---------- Eventos ---------- */

  function teclado(e) {
    if (!estado) return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    var k = e.key;

    if ((e.ctrlKey || e.metaKey) && (k === "z" || k === "Z")) { e.preventDefault(); deshacer(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (estado.fase === "fin") {
      if (k === "Enter") { e.preventDefault(); mostrarResultados(); }
      return;
    }

    switch (k) {
      case " ": e.preventDefault(); alternarPausa(); break;
      case "Enter": e.preventDefault(); if (estado.fase === "turno") comenzarTurno(); else marcar("correcta"); break;
      case "Backspace": case "Delete": e.preventDefault(); marcar("incorrecta"); break;
      case "p": case "P": marcar("pasapalabra"); break;
      case "r": case "R": mostrarRespuesta(); break;
      case "s": case "S": $("btn-sonido").click(); break;
      case "f": case "F": pantallaCompleta(); break;
    }
  }

  function enlazar() {
    $("btn-correcta").addEventListener("click", function () { marcar("correcta"); });
    $("btn-incorrecta").addEventListener("click", function () { marcar("incorrecta"); });
    $("btn-pasapalabra").addEventListener("click", function () { marcar("pasapalabra"); });
    $("btn-pausa").addEventListener("click", alternarPausa);
    $("btn-reanudar").addEventListener("click", alternarPausa);
    $("btn-comenzar-turno").addEventListener("click", comenzarTurno);
    $("btn-deshacer").addEventListener("click", deshacer);
    $("btn-respuesta").addEventListener("click", mostrarRespuesta);
    $("btn-pantalla").addEventListener("click", pantallaCompleta);
    $("btn-sonido").addEventListener("click", function () {
      var activo = Sonidos.alternar();
      this.classList.toggle("silenciado", !activo);
      aviso(activo ? "Sonido activado" : "Sonido silenciado");
    });
    $("btn-salir").addEventListener("click", function () {
      if (estado && estado.fase !== "fin" &&
          !confirm("¿Salir de la partida? Se perderá el progreso.")) return;
      salir();
    });
    $("btn-menu-final").addEventListener("click", salir);
    $("btn-ver-roscos").addEventListener("click", verRoscos);
    $("btn-revancha").addEventListener("click", function () {
      if (estado) iniciar(estado.opciones);
    });
    $("rosco-centro").addEventListener("click", function () {
      if (estado && estado.fase === "fin") mostrarResultados();
    });
    $("marcador").addEventListener("click", function (e) {
      var chip = e.target.closest(".equipo-chip");
      if (!chip || !estado || estado.fase !== "fin") return;
      estado.vista = Number(chip.dataset.equipo);
      render();
    });
    document.addEventListener("keydown", teclado);
  }

  window.Juego = {
    enlazar: enlazar,
    iniciar: iniciar,
    alSalir: function (fn) { alSalir = fn; },
    aviso: aviso,
    escapar: escapar
  };
})();
