/*
 * Rosco Radiológico · Gestión de bancos de preguntas
 * (editor, importación y exportación Excel/CSV).
 * Autor: Mg. Lic. Prof. Leandro Guerschberg
 */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return Juego.escapar(t); };

  var editando = null;      // copia del banco en edición
  var pestana = "A";
  var alCambiar = function () {};
  var alVolver = function () {};
  var irAEditor = function () {};
  var irALista = function () {};

  var ENCABEZADOS = ["Equipo", "Letra", "Tipo", "Pregunta", "Respuesta"];

  /* ---------- Lista de bancos ---------- */

  function renderLista() {
    var html = Almacen.todosLosBancos().map(function (b) {
      var completas = Almacen.contarCompletas(b);
      var total = Almacen.LETRAS.length * 2;
      var soloLectura = b.precargado || b.publicado;
      var acciones = soloLectura
        ? '<button class="btn btn-secundario btn-chico" data-accion="duplicar" data-id="' + b.id + '">Duplicar y editar</button>' +
          '<button class="btn btn-secundario btn-chico" data-accion="exportar" data-id="' + b.id + '">Exportar Excel</button>'
        : '<button class="btn btn-secundario btn-chico" data-accion="editar" data-id="' + b.id + '">Editar</button>' +
          '<button class="btn btn-secundario btn-chico" data-accion="exportar" data-id="' + b.id + '">Exportar Excel</button>' +
          '<button class="btn btn-secundario btn-chico" data-accion="duplicar" data-id="' + b.id + '">Duplicar</button>' +
          '<button class="btn btn-peligro btn-chico" data-accion="eliminar" data-id="' + b.id + '">Eliminar</button>';
      return '<article class="banco">' +
        '<span class="etiqueta' + (b.publicado ? " publicado" : b.precargado ? "" : " propio") + '">' +
        (b.publicado ? "Publicado" : b.precargado ? "Precargado" : "Propio") + "</span>" +
        "<h3>" + esc(b.nombre) + "</h3>" +
        (b.descripcion ? "<p>" + esc(b.descripcion) + "</p>" : "") +
        '<span class="estado' + (completas < total ? " incompleto" : "") + '">' +
        completas + " de " + total + " preguntas completas</span>" +
        '<div class="banco-acciones">' + acciones + "</div>" +
        "</article>";
    }).join("");
    $("lista-bancos").innerHTML = html;
  }

  function accionLista(e) {
    var btn = e.target.closest("button[data-accion]");
    if (!btn) return;
    var banco = Almacen.obtener(btn.dataset.id);
    if (!banco) return;

    switch (btn.dataset.accion) {
      case "editar":
        abrirEditor(banco, false);
        break;
      case "duplicar":
        var copia = JSON.parse(JSON.stringify(banco));
        copia.id = Almacen.nuevoId();
        copia.nombre = "Copia de " + banco.nombre;
        copia.precargado = false;
        copia.publicado = false;
        abrirEditor(copia, true);
        break;
      case "exportar":
        exportar(banco);
        break;
      case "eliminar":
        if (confirm("¿Eliminar el banco \"" + banco.nombre + "\"? Esta acción no se puede deshacer.")) {
          Almacen.eliminarBanco(banco.id);
          renderLista();
          alCambiar();
          Juego.aviso("Banco eliminado");
        }
        break;
    }
  }

  /* ---------- Editor ---------- */

  function abrirEditor(banco, esNuevo) {
    editando = Almacen.normalizarBanco(JSON.parse(JSON.stringify(banco)));
    editando.precargado = false;
    pestana = "A";
    $("editor-titulo").textContent = esNuevo ? "Nuevo banco" : "Editar banco";
    $("editor-nombre").value = editando.nombre;
    $("editor-desc").value = editando.descripcion;
    marcarPestana();
    renderTabla();
    irAEditor();
  }

  function marcarPestana() {
    document.querySelectorAll(".pestana").forEach(function (p) {
      p.classList.toggle("activa", p.dataset.equipo === pestana);
    });
  }

  function renderTabla() {
    var filas = editando.equipos[pestana].map(function (p, i) {
      var falta = !(p.pregunta && p.respuesta);
      return '<div class="fila-editor' + (falta ? " falta" : "") + '" data-i="' + i + '">' +
        '<span class="letra-editor">' + p.letra + "</span>" +
        '<select data-campo="tipo" aria-label="Tipo para la letra ' + p.letra + '">' +
        '<option value="empieza"' + (p.tipo === "empieza" ? " selected" : "") + ">Empieza por</option>" +
        '<option value="contiene"' + (p.tipo === "contiene" ? " selected" : "") + ">Contiene</option>" +
        "</select>" +
        '<textarea data-campo="pregunta" rows="2" placeholder="Definición o pregunta" aria-label="Pregunta para la letra ' + p.letra + '">' + esc(p.pregunta) + "</textarea>" +
        '<input class="resp" type="text" data-campo="respuesta" placeholder="Respuesta" aria-label="Respuesta para la letra ' + p.letra + '" value="' + esc(p.respuesta) + '">' +
        "</div>";
    }).join("");
    $("tabla-editor").innerHTML = filas;
    actualizarEstadoEditor();
  }

  function editarCampo(e) {
    var campo = e.target.dataset.campo;
    if (!campo) return;
    var fila = e.target.closest(".fila-editor");
    var p = editando.equipos[pestana][Number(fila.dataset.i)];
    p[campo] = e.target.value;
    fila.classList.toggle("falta", !(p.pregunta.trim() && p.respuesta.trim()));
    actualizarEstadoEditor();
  }

  function actualizarEstadoEditor() {
    var copia = Almacen.normalizarBanco(editando);
    var n = Almacen.contarCompletas(copia);
    $("editor-estado").textContent = n + " de " + (Almacen.LETRAS.length * 2) +
      " preguntas completas. Las letras sin pregunta se juegan sin definición.";
  }

  function guardarEditor() {
    editando.nombre = $("editor-nombre").value.trim();
    editando.descripcion = $("editor-desc").value.trim();
    if (!editando.nombre) {
      Juego.aviso("Poné un nombre al banco antes de guardar.", true);
      $("editor-nombre").focus();
      return;
    }
    if (!Almacen.guardarBanco(editando)) {
      Juego.aviso("No se pudo guardar. Revisá que el navegador permita el almacenamiento local.", true);
      return;
    }
    Juego.aviso("Banco \"" + editando.nombre + "\" guardado");
    editando = null;
    alCambiar();
    renderLista();
    irALista();
  }

  /* ---------- Excel / CSV ---------- */

  function normalizarTexto(t) {
    return String(t == null ? "" : t)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-̂̄-ͯ]/g, "") // conserva la tilde de la ñ (U+0303)
      .normalize("NFC");
  }

  function columna(fila, opciones) {
    var claves = Object.keys(fila);
    for (var i = 0; i < claves.length; i++) {
      var n = normalizarTexto(claves[i]).replace(/̃/g, "");
      if (opciones.indexOf(n) >= 0) return fila[claves[i]];
    }
    return undefined;
  }

  function interpretarEquipo(valor) {
    var v = normalizarTexto(valor);
    if (!v) return "A";
    var ultimo = v.charAt(v.length - 1);
    if (ultimo === "b" || ultimo === "2") return "B";
    return "A";
  }

  function interpretarLetra(valor) {
    var v = String(valor == null ? "" : valor).trim().toUpperCase().normalize("NFC");
    if (!v) return "";
    var c = v.charAt(0);
    var sinTilde = { "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U", "Ü": "U" };
    return sinTilde[c] || c;
  }

  function leerArchivo(archivo) {
    return new Promise(function (ok, error) {
      var lector = new FileReader();
      var esCsv = /\.csv$/i.test(archivo.name);
      lector.onerror = function () { error(new Error("No se pudo leer el archivo.")); };
      lector.onload = function () {
        try {
          var libro = esCsv
            ? XLSX.read(lector.result, { type: "string", raw: true })
            : XLSX.read(lector.result, { type: "array" });
          ok(libro);
        } catch (e) {
          error(new Error("El archivo no tiene un formato válido."));
        }
      };
      if (esCsv) lector.readAsText(archivo, "UTF-8"); else lector.readAsArrayBuffer(archivo);
    });
  }

  /* Convierte un libro de Excel/CSV en un banco. Lanza un error si no es válido. */
  function bancoDesdeLibro(libro) {
    // Usa la primera hoja que tenga columnas de pregunta y respuesta.
    var filas = null;
    for (var i = 0; i < libro.SheetNames.length && !filas; i++) {
      var datos = XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[i]], { defval: "" });
      if (datos.length && columna(datos[0], ["pregunta", "definicion"]) !== undefined &&
          columna(datos[0], ["respuesta"]) !== undefined) {
        filas = datos;
      }
    }
    if (!filas) throw new Error("No se encontraron las columnas Pregunta y Respuesta. Usá la plantilla.");

    var banco = Almacen.bancoVacio();
    var validas = 0;
    var ignoradas = [];
    filas.forEach(function (f, n) {
      var letra = interpretarLetra(columna(f, ["letra"]));
      var pregunta = String(columna(f, ["pregunta", "definicion"]) || "").trim();
      var respuesta = String(columna(f, ["respuesta"]) || "").trim();
      if (!letra && !pregunta && !respuesta) return;
      var idx = Almacen.LETRAS.indexOf(letra);
      if (idx < 0) { ignoradas.push(n + 2); return; }
      var equipo = interpretarEquipo(columna(f, ["equipo", "rosco"]));
      var tipo = normalizarTexto(columna(f, ["tipo"])).charAt(0) === "c" ? "contiene" : "empieza";
      banco.equipos[equipo][idx] = { letra: letra, tipo: tipo, pregunta: pregunta, respuesta: respuesta };
      if (pregunta && respuesta) validas++;
    });

    if (!validas) throw new Error("El archivo no tiene preguntas completas.");
    return { banco: banco, validas: validas, ignoradas: ignoradas };
  }

  function importar(archivo) {
    if (typeof XLSX === "undefined") {
      Juego.aviso("No se pudo cargar el lector de Excel.", true);
      return;
    }
    leerArchivo(archivo).then(function (libro) {
      var r = bancoDesdeLibro(libro);
      var banco = r.banco;
      banco.nombre = archivo.name.replace(/\.[^.]+$/, "");
      banco.descripcion = "Importado de " + archivo.name;
      Almacen.guardarBanco(banco);
      alCambiar();
      renderLista();

      var total = Almacen.LETRAS.length * 2;
      var msj = "Se importaron " + r.validas + " de " + total + " preguntas.";
      if (r.ignoradas.length) msj += " Filas ignoradas por letra inválida: " + r.ignoradas.slice(0, 6).join(", ") + (r.ignoradas.length > 6 ? "…" : "") + ".";
      Juego.aviso(msj, r.validas < total);
    }).catch(function (e) {
      Juego.aviso(e.message, true);
    });
  }

  function filasDeBanco(banco) {
    var filas = [ENCABEZADOS];
    ["A", "B"].forEach(function (eq) {
      banco.equipos[eq].forEach(function (p) {
        filas.push([eq, p.letra, p.tipo === "contiene" ? "Contiene" : "Empieza", p.pregunta, p.respuesta]);
      });
    });
    return filas;
  }

  function hojaPreguntas(filas) {
    var hoja = XLSX.utils.aoa_to_sheet(filas);
    hoja["!cols"] = [{ wch: 8 }, { wch: 7 }, { wch: 10 }, { wch: 80 }, { wch: 28 }];
    return hoja;
  }

  function nombreArchivo(t) {
    return (t || "banco").replace(/[\\/:*?"<>|]+/g, "").trim().slice(0, 60) || "banco";
  }

  function exportar(banco) {
    if (typeof XLSX === "undefined") return;
    var libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hojaPreguntas(filasDeBanco(banco)), "Preguntas");
    XLSX.writeFile(libro, nombreArchivo(banco.nombre) + ".xlsx");
  }

  function descargarPlantilla() {
    if (typeof XLSX === "undefined") return;
    var vacio = Almacen.bancoVacio();
    var libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hojaPreguntas(filasDeBanco(vacio)), "Preguntas");
    var instrucciones = XLSX.utils.aoa_to_sheet([
      ["Rosco Radiológico · Plantilla de preguntas"],
      [""],
      ["1. Completá la hoja \"Preguntas\": una fila por letra y por equipo (25 letras para el equipo A y 25 para el B)."],
      ["2. Equipo: A o B. Letra: la letra del rosco (incluye Ñ; no se usan K ni W)."],
      ["3. Tipo: \"Empieza\" si la respuesta empieza con la letra, \"Contiene\" si solo la contiene."],
      ["4. Pregunta: la definición que lee quien conduce. Respuesta: la palabra correcta."],
      ["5. Guardá el archivo y subilo desde Gestionar preguntas → Importar Excel / CSV."],
      ["   El nombre del archivo será el nombre del banco."],
      [""],
      ["También podés guardar la hoja como CSV (UTF-8) e importarla."]
    ]);
    instrucciones["!cols"] = [{ wch: 110 }];
    XLSX.utils.book_append_sheet(libro, instrucciones, "Instrucciones");
    XLSX.writeFile(libro, "plantilla-rosco-radiologico.xlsx");
  }

  /* ---------- Enlaces ---------- */

  function enlazar(opciones) {
    alCambiar = opciones.alCambiar || alCambiar;
    alVolver = opciones.alVolver || alVolver;
    irAEditor = opciones.irAEditor || irAEditor;
    irALista = opciones.irALista || irALista;

    $("lista-bancos").addEventListener("click", accionLista);
    $("btn-volver-preguntas").addEventListener("click", function () { alVolver(); });
    $("btn-nuevo-banco").addEventListener("click", function () {
      abrirEditor(Almacen.bancoVacio(), true);
      setTimeout(function () { $("editor-nombre").focus(); }, 50);
    });
    $("btn-plantilla").addEventListener("click", descargarPlantilla);
    $("input-importar").addEventListener("change", function () {
      if (this.files && this.files[0]) importar(this.files[0]);
      this.value = "";
    });

    document.querySelectorAll(".pestana").forEach(function (p) {
      p.addEventListener("click", function () {
        pestana = p.dataset.equipo;
        marcarPestana();
        renderTabla();
      });
    });
    $("tabla-editor").addEventListener("input", editarCampo);
    $("tabla-editor").addEventListener("change", editarCampo);
    $("btn-guardar-banco").addEventListener("click", guardarEditor);
    $("btn-cancelar-editor").addEventListener("click", function () {
      editando = null;
      irALista();
    });
  }

  window.Gestor = {
    enlazar: enlazar,
    bancoDesdeLibro: bancoDesdeLibro,
    renderLista: renderLista
  };
})();
