/*
 * Rosco Radiológico · Bancos publicados en la carpeta bancos/ del sitio.
 * El archivo bancos/indice.json se genera al publicar (scripts/indice-bancos.js).
 * Autor: Mg. Lic. Prof. Leandro Guerschberg
 */
(function () {
  "use strict";

  function idDesdeArchivo(archivo) {
    return "publicado-" + archivo.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function leerBanco(archivo) {
    var url = "bancos/" + encodeURIComponent(archivo);
    var esCsv = /\.csv$/i.test(archivo);
    return fetch(url, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("No se encontró " + archivo);
        return esCsv ? r.text() : r.arrayBuffer();
      })
      .then(function (datos) {
        var libro = esCsv
          ? XLSX.read(datos, { type: "string", raw: true })
          : XLSX.read(datos, { type: "array" });
        var banco = Gestor.bancoDesdeLibro(libro).banco;
        banco.id = idDesdeArchivo(archivo);
        banco.nombre = archivo.replace(/\.[^.]+$/, "");
        banco.descripcion = "Banco publicado en el sitio.";
        return banco;
      });
  }

  /* Devuelve una promesa con la cantidad de bancos cargados (0 si no hay o falla). */
  function cargar() {
    if (location.protocol === "file:" || typeof XLSX === "undefined" || !window.fetch) {
      return Promise.resolve(0);
    }
    return fetch("bancos/indice.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (indice) {
        var archivos = Array.isArray(indice) ? indice : [];
        return Promise.all(archivos.map(function (a) {
          return leerBanco(a).catch(function (e) {
            if (window.console) console.warn("Banco omitido:", a, e.message);
            return null;
          });
        }));
      })
      .then(function (bancos) {
        var validos = bancos.filter(Boolean);
        Almacen.registrarPublicados(validos);
        return validos.length;
      })
      .catch(function () { return 0; });
  }

  window.Publicados = { cargar: cargar };
})();
