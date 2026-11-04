<p align="center"><img src="img/rosco-radiologico-animado.gif" alt="Rosco Radiológico" width="320"></p>

# Rosco Radiológico

Juego de rosco de preguntas para estudiantes de la **Licenciatura en Producción de Bioimágenes** (Departamento de Ciencias de la Salud y Deporte, UNPAZ). Dos equipos compiten, cada uno con su propio rosco de 25 letras y su propio reloj.

**Autor:** Mg. Lic. Prof. Leandro Guerschberg · 2026

---

## Modalidades

- **Con preguntas.** Cada equipo tiene un rosco con definiciones de la A a la Z. La pregunta se muestra al costado del rosco y quien conduce puede revelar la respuesta.
- **Sin preguntas.** Se muestran solo el rosco y las letras. Quien conduce lee sus propias preguntas y marca cada resultado.

## Reglas

| Marca | Significado | Qué pasa |
|---|---|---|
| 🟢 Verde | Correcta | El equipo sigue con la letra siguiente |
| 🟡 Amarillo | Pasapalabra | La letra queda pendiente y el turno pasa al otro equipo |
| 🔴 Rojo | Incorrecta | La letra se pierde y el turno pasa al otro equipo |

- El reloj de cada equipo corre solo durante su turno. Si se agota, ese equipo termina.
- Cuando un equipo vuelve a jugar, retoma sus letras pendientes.
- Si un equipo ya terminó, el otro sigue jugando hasta completar su rosco o agotar su tiempo.
- **Gana el equipo con más respuestas correctas.** Si empatan, gana el que tenga menos incorrectas.

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `Enter` | Correcta / comenzar turno |
| `⌫` (Retroceso) | Incorrecta |
| `P` | Pasapalabra |
| `Espacio` | Pausa / reanudar / comenzar turno |
| `R` | Mostrar u ocultar la respuesta |
| `Ctrl + Z` | Deshacer la última jugada |
| `F` | Pantalla completa |
| `S` | Activar o silenciar el sonido |

## Bancos de preguntas

El juego incluye tres bancos precargados, cada uno con un rosco para cada equipo:

1. **Nivel 1 · Fundamentos:** anatomía, física de las radiaciones y conceptos básicos.
2. **Nivel 2 · Técnica radiológica:** equipos, incidencias, técnica e imagen digital.
3. **Nivel 3 · Modalidades avanzadas:** TC, RM, ecografía, medicina nuclear, radioterapia y radiobiología.

### Cargar preguntas propias

Desde **Gestionar preguntas** se puede:

- **Descargar la plantilla Excel**, completarla y subirla con **Importar Excel / CSV**.
- **Crear o editar** un banco directamente en el editor de la aplicación.
- **Duplicar** un banco precargado para adaptarlo.
- **Exportar** cualquier banco a Excel.

Formato del archivo (una fila por letra y por equipo):

| Equipo | Letra | Tipo | Pregunta | Respuesta |
|---|---|---|---|---|
| A | A | Empieza | Primera vértebra cervical… | Atlas |
| A | Ñ | Contiene | Órgano par retroperitoneal… | Riñón |
| B | A | Empieza | Electrodo positivo del tubo… | Ánodo |

En [`plantilla/plantilla-preguntas.csv`](plantilla/plantilla-preguntas.csv) hay una plantilla vacía.

Los bancos importados o creados desde la aplicación se guardan **solo en el navegador** donde se cargaron. Sirven para preparar y probar preguntas. Para usarlos en otra computadora, exportalos a Excel e importalos allí.

### Publicar un banco para todos los usuarios

Los archivos de Excel o CSV que se suban a la carpeta [`bancos/`](bancos/) aparecen para cualquiera que entre al sitio, en el grupo **Publicados** del menú:

1. En GitHub, entrar a la carpeta `bancos`, elegir **Add file → Upload files** y arrastrar el Excel.
2. Confirmar con **Commit changes**.
3. Netlify vuelve a publicar el sitio en uno o dos minutos.

El nombre del archivo es el nombre del banco. Para corregirlo, se sube de nuevo con el mismo nombre; para quitarlo, se borra de la carpeta. La lista de bancos (`bancos/indice.json`) la genera Netlify en cada publicación con `scripts/indice-bancos.js`.

## Uso local

No requiere instalación: abrir `index.html` en un navegador moderno (Chrome, Edge, Firefox o Safari).

Al abrir el archivo directamente, los bancos de la carpeta `bancos/` no se cargan (el navegador lo impide por seguridad). Para verlos en la computadora, servir la carpeta y abrir `http://localhost:8000`:

```
node scripts/indice-bancos.js
python3 -m http.server 8000
```

## Publicación en Netlify

1. Subir este repositorio a GitHub.
2. En [Netlify](https://app.netlify.com), elegir **Add new site → Import an existing project** y conectar el repositorio.
3. Netlify toma la configuración del archivo `netlify.toml`; no hace falta completar nada más. Elegir **Deploy**.
4. Cada cambio que se suba a GitHub se publica automáticamente.

## Estructura

```
index.html            Pantallas del juego
css/estilos.css       Estilos
js/preguntas.js       Bancos precargados
js/almacen.js         Guardado local de bancos y preferencias
js/juego.js           Lógica de la partida
js/gestor.js          Editor, importación y exportación
js/sonidos.js         Efectos de sonido
js/publicados.js      Lectura de los bancos de la carpeta bancos/
js/app.js             Menú y navegación
bancos/               Bancos publicados (Excel/CSV) para todos los usuarios
scripts/indice-bancos.js  Genera la lista de bancos publicados
netlify.toml          Configuración de publicación
img/                  Logo (SVG, PNG) y animación
vendor/xlsx.full.min.js  Lectura y escritura de Excel (SheetJS, Apache 2.0)
plantilla/            Plantilla CSV de preguntas
```

## Licencia

Código bajo licencia [MIT](LICENSE) © 2026 Leandro Guerschberg.
