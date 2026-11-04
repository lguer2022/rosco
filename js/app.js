/*
 * Rosco Radiológico · Navegación y menú principal.
 * Autor: Mg. Lic. Prof. Leandro Guerschberg
 */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(function (p) {
      p.classList.toggle("activa", p.id === id);
    });
    window.scrollTo(0, 0);
  }

  function modoElegido() {
    var marcado = document.querySelector('input[name="modo"]:checked');
    return marcado ? marcado.value : "preguntas";
  }

  function cargarSelectorBancos(seleccion) {
    var sel = $("sel-banco");
    var bancos = Almacen.todosLosBancos();
    var actual = seleccion || sel.value;
    sel.innerHTML = "";

    var grupos = [
      ["Precargados", function (b) { return b.precargado; }],
      ["Publicados", function (b) { return b.publicado; }],
      ["Propios (solo en este navegador)", function (b) { return !b.precargado && !b.publicado; }]
    ];
    grupos.forEach(function (grupo) {
      var lista = bancos.filter(grupo[1]);
      if (!lista.length) return;
      var og = document.createElement("optgroup");
      og.label = grupo[0];
      lista.forEach(function (b) {
        var op = document.createElement("option");
        op.value = b.id;
        op.textContent = b.nombre;
        og.appendChild(op);
      });
      sel.appendChild(og);
    });

    if (actual && Almacen.obtener(actual)) sel.value = actual;
    actualizarDescripcion();
  }

  function actualizarDescripcion() {
    var b = Almacen.obtener($("sel-banco").value);
    $("desc-banco").textContent = b ? b.descripcion : "";
  }

  function actualizarFormulario() {
    $("grupo-banco").hidden = modoElegido() !== "preguntas";
    var conReloj = $("con-reloj").checked;
    $("segundos").disabled = !conReloj;
    $("segundos").closest(".campo").style.opacity = conReloj ? 1 : 0.45;
  }

  function aplicarConfigGuardada() {
    var c = Almacen.cargarConfig();
    if (c.modo) {
      var radio = document.querySelector('input[name="modo"][value="' + c.modo + '"]');
      if (radio) radio.checked = true;
    }
    if (c.nombres) {
      if (c.nombres[0]) $("nombre-a").value = c.nombres[0];
      if (c.nombres[1]) $("nombre-b").value = c.nombres[1];
    }
    if (typeof c.conReloj === "boolean") $("con-reloj").checked = c.conReloj;
    if (c.segundos) $("segundos").value = c.segundos;
    if (typeof c.sonido === "boolean") {
      Sonidos.fijar(c.sonido);
      $("btn-sonido").classList.toggle("silenciado", !c.sonido);
    }
    cargarSelectorBancos(c.banco);
  }

  function comenzar(e) {
    e.preventDefault();
    var modo = modoElegido();
    var segundos = Math.round(Number($("segundos").value));
    if (!(segundos >= 10)) segundos = 150;
    segundos = Math.min(segundos, 900);
    $("segundos").value = segundos;

    var opciones = {
      modo: modo,
      banco: modo === "preguntas" ? Almacen.obtener($("sel-banco").value) : null,
      nombres: [
        $("nombre-a").value.trim() || "Equipo 1",
        $("nombre-b").value.trim() || "Equipo 2"
      ],
      conReloj: $("con-reloj").checked,
      segundos: segundos
    };

    if (modo === "preguntas" && !opciones.banco) {
      Juego.aviso("Elegí un banco de preguntas.", true);
      return;
    }

    Almacen.guardarConfig({
      modo: modo,
      banco: $("sel-banco").value,
      nombres: opciones.nombres,
      conReloj: opciones.conReloj,
      segundos: segundos,
      sonido: Sonidos.estaActivo()
    });

    mostrarPantalla("pantalla-juego");
    Juego.iniciar(opciones);
  }

  function iniciarApp() {
    Juego.enlazar();
    Juego.alSalir(function () {
      var c = Almacen.cargarConfig();
      c.sonido = Sonidos.estaActivo();
      Almacen.guardarConfig(c);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      mostrarPantalla("pantalla-inicio");
    });

    Gestor.enlazar({
      alCambiar: function () { cargarSelectorBancos(); },
      alVolver: function () { mostrarPantalla("pantalla-inicio"); },
      irAEditor: function () { mostrarPantalla("pantalla-editor"); },
      irALista: function () { mostrarPantalla("pantalla-preguntas"); }
    });

    aplicarConfigGuardada();
    actualizarFormulario();

    Publicados.cargar().then(function (n) {
      if (!n) return;
      var c = Almacen.cargarConfig();
      cargarSelectorBancos(c.banco);
      Gestor.renderLista();
    });

    $("form-inicio").addEventListener("submit", comenzar);
    $("form-inicio").addEventListener("change", actualizarFormulario);
    $("sel-banco").addEventListener("change", actualizarDescripcion);
    $("btn-ir-preguntas").addEventListener("click", function () {
      Gestor.renderLista();
      mostrarPantalla("pantalla-preguntas");
    });
    $("btn-ayuda").addEventListener("click", function () { $("capa-ayuda").hidden = false; });
    $("btn-cerrar-ayuda").addEventListener("click", function () { $("capa-ayuda").hidden = true; });
    $("capa-ayuda").addEventListener("click", function (e) {
      if (e.target === this) this.hidden = true;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") $("capa-ayuda").hidden = true;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarApp);
  } else {
    iniciarApp();
  }
})();
