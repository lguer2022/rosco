/*
 * Rosco Radiológico · Almacenamiento local de bancos y configuración.
 * Autor: Mg. Lic. Prof. Leandro Guerschberg
 */
(function () {
  "use strict";

  var LETRAS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L", "M", "N", "Ñ",
    "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"];

  var CLAVE_BANCOS = "roscoRadiologico.bancos";
  var CLAVE_CONFIG = "roscoRadiologico.config";
  var publicados = [];   // bancos leídos de la carpeta bancos/ del sitio

  function leer(clave, porDefecto) {
    try {
      var valor = localStorage.getItem(clave);
      return valor ? JSON.parse(valor) : porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }

  function escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Devuelve un rosco con las 25 letras en orden; completa las faltantes vacías. */
  function normalizarRosco(lista) {
    var porLetra = {};
    (lista || []).forEach(function (p) {
      if (p && p.letra) porLetra[String(p.letra).toUpperCase()] = p;
    });
    return LETRAS.map(function (letra) {
      var p = porLetra[letra] || {};
      return {
        letra: letra,
        tipo: p.tipo === "contiene" ? "contiene" : "empieza",
        pregunta: String(p.pregunta || "").trim(),
        respuesta: String(p.respuesta || "").trim()
      };
    });
  }

  function normalizarBanco(banco) {
    return {
      id: banco.id,
      nombre: banco.nombre || "Banco sin nombre",
      descripcion: banco.descripcion || "",
      precargado: !!banco.precargado,
      publicado: !!banco.publicado,
      equipos: {
        A: normalizarRosco(banco.equipos && banco.equipos.A),
        B: normalizarRosco(banco.equipos && banco.equipos.B)
      }
    };
  }

  function contarCompletas(banco) {
    var n = 0;
    ["A", "B"].forEach(function (eq) {
      banco.equipos[eq].forEach(function (p) {
        if (p.pregunta && p.respuesta) n++;
      });
    });
    return n;
  }

  function cargarPropios() {
    var lista = leer(CLAVE_BANCOS, []);
    if (!Array.isArray(lista)) return [];
    return lista.map(function (b) {
      var n = normalizarBanco(b);
      n.precargado = false;
      return n;
    });
  }

  function guardarPropios(lista) {
    return escribir(CLAVE_BANCOS, lista);
  }

  function todosLosBancos() {
    var pre = (window.BANCOS_PRECARGADOS || []).map(normalizarBanco);
    return pre.concat(publicados, cargarPropios());
  }

  function obtener(id) {
    var todos = todosLosBancos();
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id === id) return todos[i];
    }
    return null;
  }

  function guardarBanco(banco) {
    var propios = cargarPropios();
    var i = propios.findIndex(function (b) { return b.id === banco.id; });
    var limpio = normalizarBanco(banco);
    limpio.precargado = false;
    limpio.publicado = false;
    if (i >= 0) propios[i] = limpio; else propios.push(limpio);
    return guardarPropios(propios);
  }

  function eliminarBanco(id) {
    return guardarPropios(cargarPropios().filter(function (b) { return b.id !== id; }));
  }

  function nuevoId() {
    return "banco-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function bancoVacio() {
    return normalizarBanco({ id: nuevoId(), nombre: "", descripcion: "", equipos: {} });
  }

  window.Almacen = {
    LETRAS: LETRAS,
    normalizarBanco: normalizarBanco,
    contarCompletas: contarCompletas,
    todosLosBancos: todosLosBancos,
    cargarPropios: cargarPropios,
    obtener: obtener,
    guardarBanco: guardarBanco,
    eliminarBanco: eliminarBanco,
    nuevoId: nuevoId,
    bancoVacio: bancoVacio,
    registrarPublicados: function (lista) {
      publicados = lista.map(function (b) {
        var n = normalizarBanco(b);
        n.publicado = true;
        return n;
      });
    },
    cargarConfig: function () { return leer(CLAVE_CONFIG, {}); },
    guardarConfig: function (c) { return escribir(CLAVE_CONFIG, c); }
  };
})();
