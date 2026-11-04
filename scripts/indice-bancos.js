/*
 * Rosco Radiológico · Genera bancos/indice.json con la lista de archivos
 * de preguntas de la carpeta bancos/. Netlify lo ejecuta en cada publicación.
 * Uso manual: node scripts/indice-bancos.js
 * Autor: Mg. Lic. Prof. Leandro Guerschberg
 */
"use strict";

const fs = require("fs");
const path = require("path");

const carpeta = path.join(__dirname, "..", "bancos");
const extensiones = [".xlsx", ".xls", ".ods", ".csv"];

if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta);

const archivos = fs.readdirSync(carpeta)
  .filter((nombre) => extensiones.includes(path.extname(nombre).toLowerCase()))
  .filter((nombre) => !nombre.startsWith(".") && !nombre.startsWith("~$"))
  .sort((a, b) => a.localeCompare(b, "es"));

fs.writeFileSync(path.join(carpeta, "indice.json"), JSON.stringify(archivos, null, 2) + "\n");
console.log("Bancos publicados: " + archivos.length);
archivos.forEach((a) => console.log("  · " + a));
