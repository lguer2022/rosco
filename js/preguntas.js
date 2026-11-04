/*
 * Rosco Radiológico
 * Bancos de preguntas precargados.
 * Autor: Mg. Lic. Prof. Leandro Guerschberg
 *
 * Formato de cada pregunta: [letra, tipo, definición, respuesta]
 *   tipo: "E" = Empieza por · "C" = Contiene
 */
(function () {
  "use strict";

  function armar(lista) {
    return lista.map(function (p) {
      return {
        letra: p[0],
        tipo: p[1] === "C" ? "contiene" : "empieza",
        pregunta: p[2],
        respuesta: p[3]
      };
    });
  }

  var NIVEL_1_A = [
    ["A", "E", "Primera vértebra cervical, sobre la que se apoya el cráneo.", "Atlas"],
    ["B", "E", "Término alemán que significa \"radiación de frenado\": rayos X producidos cuando el electrón se desvía cerca del núcleo del ánodo.", "Bremsstrahlung"],
    ["C", "E", "Electrodo negativo del tubo de rayos X, donde se encuentra el filamento.", "Cátodo"],
    ["D", "E", "Músculo principal de la respiración que separa la cavidad torácica de la abdominal.", "Diafragma"],
    ["E", "E", "Partícula de carga negativa que, acelerada dentro del tubo, da origen a los rayos X.", "Electrón"],
    ["F", "E", "Hueso más largo del cuerpo humano.", "Fémur"],
    ["G", "E", "Unidad del Sistema Internacional de dosis absorbida, equivalente a un julio por kilogramo.", "Gray (Gy)"],
    ["H", "E", "Hueso largo del brazo, entre el hombro y el codo.", "Húmero"],
    ["I", "E", "Átomo de un mismo elemento químico que tiene distinto número de neutrones.", "Isótopo"],
    ["J", "E", "Unidad de energía del Sistema Internacional.", "Julio (joule)"],
    ["L", "E", "Nombre de las cinco vértebras situadas entre las dorsales y el sacro.", "Lumbares"],
    ["M", "E", "Único hueso móvil del cráneo, que forma el maxilar inferior.", "Mandíbula"],
    ["N", "E", "Partícula subatómica sin carga eléctrica que se encuentra en el núcleo.", "Neutrón"],
    ["Ñ", "C", "Órgano par retroperitoneal que filtra la sangre y produce la orina.", "Riñón"],
    ["O", "E", "Hueso que forma la parte posterior e inferior del cráneo.", "Occipital"],
    ["P", "E", "Partícula con carga positiva del núcleo atómico.", "Protón"],
    ["Q", "C", "Conducto del aparato respiratorio que va desde la laringe hasta los bronquios.", "Tráquea"],
    ["R", "E", "Físico alemán que descubrió los rayos X en 1895.", "Röntgen"],
    ["S", "E", "Unidad del Sistema Internacional de dosis equivalente y de dosis efectiva.", "Sievert (Sv)"],
    ["T", "E", "Hueso de la pierna que soporta el peso del cuerpo, ubicado medial al peroné.", "Tibia"],
    ["U", "E", "Hueso del antebrazo ubicado del lado del dedo meñique, también llamado cúbito.", "Ulna"],
    ["V", "E", "Cada uno de los huesos que forman la columna vertebral.", "Vértebra"],
    ["X", "C", "Región del cuerpo delimitada por las costillas, el esternón y el diafragma.", "Tórax"],
    ["Y", "C", "Condición de no haber ingerido alimentos, solicitada antes de muchos estudios contrastados.", "Ayuno"],
    ["Z", "E", "Hueso del pómulo, también llamado malar.", "Zigomático (cigomático)"]
  ];

  var NIVEL_1_B = [
    ["A", "E", "Electrodo positivo del tubo de rayos X, donde impactan los electrones.", "Ánodo"],
    ["B", "E", "Conductos en los que se divide la tráquea al ingresar a los pulmones.", "Bronquios"],
    ["C", "E", "Hueso largo y par que une el esternón con la escápula.", "Clavícula"],
    ["D", "E", "Cantidad de energía de radiación depositada por unidad de masa.", "Dosis"],
    ["E", "E", "Hueso plano de la parte anterior del tórax, al que se unen las costillas.", "Esternón"],
    ["F", "E", "Cuanto o partícula de radiación electromagnética.", "Fotón"],
    ["G", "E", "Radiación electromagnética de origen nuclear y alta energía (rayos ...).", "Gamma"],
    ["H", "E", "Órgano macizo más grande del abdomen, ubicado en el hipocondrio derecho.", "Hígado"],
    ["I", "E", "Porción ancha y superior del hueso coxal, que forma el ala de la pelvis.", "Ilion (ilíaco)"],
    ["J", "E", "Instrumento con émbolo que se usa para administrar manualmente el medio de contraste.", "Jeringa"],
    ["L", "E", "Órgano del cuello que contiene las cuerdas vocales.", "Laringe"],
    ["M", "E", "Estudio radiológico específico de la glándula mamaria.", "Mamografía"],
    ["N", "E", "Parte central del átomo donde se concentran protones y neutrones.", "Núcleo"],
    ["Ñ", "C", "Región articular que une el antebrazo con la mano.", "Muñeca"],
    ["O", "E", "Cavidad ósea del cráneo que aloja el globo ocular.", "Órbita"],
    ["P", "E", "Metal pesado utilizado en delantales y blindajes de protección radiológica.", "Plomo"],
    ["Q", "C", "Conjunto de todos los huesos del cuerpo.", "Esqueleto"],
    ["R", "E", "Hueso del antebrazo ubicado del lado del pulgar.", "Radio"],
    ["S", "E", "Hueso triangular de la base de la columna, ubicado entre ambos ilíacos.", "Sacro"],
    ["T", "E", "Glándula endocrina del cuello, muy sensible a la radiación.", "Tiroides"],
    ["U", "E", "Conducto que lleva la orina desde el riñón hasta la vejiga.", "Uréter"],
    ["V", "E", "Órgano muscular hueco que almacena la orina.", "Vejiga"],
    ["X", "C", "Hueso par de la cadera formado por la fusión del ilion, el isquion y el pubis.", "Coxal"],
    ["Y", "E", "Porción del intestino delgado comprendida entre el duodeno y el íleon.", "Yeyuno"],
    ["Z", "C", "Órgano linfoide ubicado en el hipocondrio izquierdo.", "Bazo"]
  ];

  var NIVEL_2_A = [
    ["A", "E", "Disminución de la intensidad del haz de rayos X al atravesar la materia.", "Atenuación"],
    ["B", "E", "Dispositivo que aloja la rejilla antidifusora móvil, bajo la mesa o en el soporte mural; lleva el apellido de su inventor.", "Bucky"],
    ["C", "E", "Dispositivo con láminas de plomo que delimita el tamaño del campo de radiación.", "Colimador"],
    ["D", "E", "Posición del paciente acostado; puede ser supino, prono o lateral.", "Decúbito"],
    ["E", "E", "Desviación lateral de la columna vertebral que se evalúa con telerradiografía de columna completa.", "Escoliosis"],
    ["F", "E", "Pequeña área del ánodo donde impactan los electrones y se generan los rayos X; puede ser fino o grueso.", "Foco"],
    ["G", "E", "Tipo de protector de plomo que se coloca para resguardar los órganos reproductores.", "Gonadal"],
    ["H", "E", "Gráfico de la distribución de los valores de píxel, utilizado en el procesamiento de la imagen digital.", "Histograma"],
    ["I", "E", "Elemento químico en el que se basan los medios de contraste positivos hidrosolubles.", "Iodo (yodo)"],
    ["J", "E", "Conjunto formado por costillas, esternón y vértebras dorsales (... torácica).", "Jaula"],
    ["L", "E", "Proyección en la que el haz atraviesa al paciente de un lado al otro, también llamada perfil.", "Lateral"],
    ["M", "E", "Producto de la corriente del tubo por el tiempo de exposición, que regula la cantidad de fotones.", "Miliamperio-segundo (mAs)"],
    ["N", "E", "Interfase horizontal aire-líquido que se observa en radiografías con haz horizontal (... hidroaéreo).", "Nivel"],
    ["Ñ", "C", "Filtro de espesor variable que compensa diferencias de grosor de la anatomía, por ejemplo en el pie.", "Cuña"],
    ["O", "E", "Proyección en la que el paciente está rotado en un ángulo intermedio entre el frente y el perfil.", "Oblicua"],
    ["P", "E", "Menor elemento de una imagen digital bidimensional.", "Píxel"],
    ["Q", "C", "Sinónimo de columna vertebral.", "Raquis"],
    ["R", "E", "Dispositivo de láminas de plomo que absorbe la radiación dispersa antes de que llegue al receptor.", "Rejilla"],
    ["S", "E", "Estructura del esfenoides que aloja la hipófisis (... turca).", "Silla"],
    ["T", "E", "Efecto por el cual la intensidad del haz es mayor del lado del cátodo que del ánodo (efecto ...).", "Talón (anódico)"],
    ["U", "E", "Estudio contrastado de las vías urinarias con contraste endovenoso.", "Urografía"],
    ["V", "E", "Condición del interior del tubo de rayos X que permite que los electrones viajen sin chocar con moléculas de gas.", "Vacío"],
    ["X", "C", "Movimiento opuesto a la flexión, utilizado en las radiografías dinámicas de columna cervical.", "Extensión"],
    ["Y", "C", "Línea imaginaria hacia la que se dirige el centro del haz (... central).", "Rayo"],
    ["Z", "C", "Conjunto de rayos X que salen del tubo hacia el paciente (... primario o útil).", "Haz"]
  ];

  var NIVEL_2_B = [
    ["A", "E", "Proyección en la que el haz ingresa por la cara anterior del paciente y sale por la posterior.", "Anteroposterior (AP)"],
    ["B", "E", "Elemento del medio de contraste positivo más usado en estudios del tubo digestivo, en forma de sulfato.", "Bario"],
    ["C", "E", "Diferencia de densidades o tonos de gris entre estructuras adyacentes de la imagen.", "Contraste"],
    ["D", "E", "Radiación que cambia de dirección al interactuar con el paciente y degrada la imagen.", "Dispersa"],
    ["E", "E", "Estudio contrastado del esófago con sulfato de bario.", "Esofagograma"],
    ["F", "E", "Lámina metálica, generalmente de aluminio, que elimina los fotones de baja energía del haz.", "Filtro"],
    ["G", "E", "Equipo que suministra al tubo la alta tensión y la corriente necesarias para producir rayos X.", "Generador"],
    ["H", "E", "Biotipo corporal robusto, de tórax ancho y corto.", "Hiperesténico"],
    ["I", "E", "Fase respiratoria en la que se realiza la radiografía de tórax de rutina.", "Inspiración"],
    ["J", "E", "Apellido que da nombre a las proyecciones oblicuas de pelvis para evaluar el acetábulo.", "Judet"],
    ["L", "E", "Curvatura de la columna cervical y lumbar, cóncava hacia posterior.", "Lordosis"],
    ["M", "E", "Conjunto de filas y columnas de píxeles que forman la imagen digital.", "Matriz"],
    ["N", "E", "Grado de definición de los bordes de las estructuras en una imagen.", "Nitidez"],
    ["Ñ", "C", "En la relación ...-ruido, componente útil de la información que capta el receptor.", "Señal"],
    ["O", "E", "Línea craneal de referencia que une el canto externo del ojo con el conducto auditivo externo.", "Orbitomeatal"],
    ["P", "E", "Proyección de rutina en tórax de pie, en la que el haz ingresa por la espalda.", "Posteroanterior (PA)"],
    ["Q", "C", "Hueso que forma la parte posteroinferior del coxal y sobre el que nos sentamos.", "Isquion"],
    ["R", "E", "Dispositivo que capta la radiación remanente para formar la imagen.", "Receptor"],
    ["S", "E", "Estudio contrastado de esófago, estómago y duodeno.", "Seriada (SEGD)"],
    ["T", "E", "Radiografía tomada a 1,80 m o más de distancia foco-receptor para reducir la magnificación.", "Telerradiografía"],
    ["U", "E", "Desviación de la muñeca hacia el lado del meñique, usada para visualizar mejor el escafoides.", "Ulnar (cubital)"],
    ["V", "E", "Maniobra de espiración forzada con la glotis cerrada.", "Valsalva"],
    ["X", "C", "El control automático de ... corta el disparo al alcanzar la dosis adecuada en el receptor.", "Exposición"],
    ["Y", "E", "Material de inmovilización que obliga a aumentar los factores de exposición.", "Yeso"],
    ["Z", "C", "En el colimador, haz luminoso que indica el área que será irradiada.", "Luz"]
  ];

  var NIVEL_3_A = [
    ["A", "E", "Estudio de los vasos sanguíneos mediante la inyección de medio de contraste.", "Angiografía"],
    ["B", "E", "Antena de resonancia magnética que emite y/o recibe la señal de radiofrecuencia.", "Bobina"],
    ["C", "E", "Imagen obtenida en medicina nuclear con una gammacámara.", "Centellograma"],
    ["D", "E", "Efecto por el cual cambia la frecuencia de una onda reflejada por un objeto en movimiento; permite medir flujos.", "Doppler"],
    ["E", "E", "Técnica de diagnóstico por imágenes que utiliza ultrasonido.", "Ecografía"],
    ["F", "E", "Sigla del radiofármaco más usado en PET, análogo de la glucosa.", "FDG (fluorodesoxiglucosa)"],
    ["G", "E", "Elemento paramagnético en el que se basan los contrastes de resonancia magnética.", "Gadolinio"],
    ["H", "E", "Apellido que da nombre a la escala de densidades en tomografía computada.", "Hounsfield"],
    ["I", "E", "Punto de intersección de los ejes de rotación del gantry, la camilla y el colimador en radioterapia.", "Isocentro"],
    ["J", "E", "Recinto metálico que aísla la sala de resonancia de las radiofrecuencias externas (... de Faraday).", "Jaula"],
    ["L", "E", "Apellido que da nombre a la frecuencia de precesión de los protones en un campo magnético.", "Larmor"],
    ["M", "E", "Tipo de reconstrucción que permite ver los datos tomográficos en planos coronal y sagital (sigla MPR).", "Multiplanar"],
    ["N", "E", "Fase de la tomografía con contraste en la que el parénquima renal se realza en forma homogénea.", "Nefrográfica"],
    ["Ñ", "C", "Lesión que produce la radiación en el ADN, por acción directa o indirecta.", "Daño"],
    ["O", "E", "Estudio que mide la densidad mineral ósea.", "Osteodensitometría"],
    ["P", "E", "Antipartícula del electrón cuya aniquilación se detecta en la tomografía PET.", "Positrón"],
    ["Q", "C", "Radioterapia con fuentes colocadas dentro del tumor o en contacto con él.", "Braquiterapia"],
    ["R", "E", "Compuesto radiactivo utilizado con fines diagnósticos o terapéuticos en medicina nuclear.", "Radiofármaco"],
    ["S", "E", "Técnica angiográfica digital que elimina las estructuras óseas restando una imagen máscara.", "Sustracción"],
    ["T", "E", "Elemento del radioisótopo más utilizado en medicina nuclear diagnóstica, de símbolo 99mTc.", "Tecnecio"],
    ["U", "E", "Onda mecánica de frecuencia superior a 20 kHz, inaudible para el ser humano.", "Ultrasonido"],
    ["V", "E", "Ajuste de ancho y nivel de grises con el que se visualiza una imagen de tomografía.", "Ventana"],
    ["X", "C", "Plano de corte transversal, el de adquisición habitual en tomografía computada.", "Axial"],
    ["Y", "E", "Elemento cuyo isótopo 131 se usa para tratar el hipertiroidismo y el cáncer de tiroides.", "Yodo"],
    ["Z", "C", "Unidad de frecuencia; los transductores ecográficos trabajan en millones de ella.", "Hertz (hercio)"]
  ];

  var NIVEL_3_B = [
    ["A", "E", "Imagen o alteración que no corresponde a la anatomía real del paciente.", "Artefacto"],
    ["B", "E", "Unidad del Sistema Internacional de actividad radiactiva.", "Becquerel (Bq)"],
    ["C", "E", "Hallazgo mamográfico cuya forma y distribución se describen en el sistema BI-RADS.", "Calcificaciones"],
    ["D", "E", "Tipo de efecto biológico de la radiación que tiene umbral y cuya gravedad aumenta con la dosis.", "Determinista"],
    ["E", "E", "Tipo de efecto biológico de la radiación sin umbral, cuya probabilidad aumenta con la dosis.", "Estocástico"],
    ["F", "E", "Técnica que permite obtener imágenes radiológicas en tiempo real.", "Fluoroscopía"],
    ["G", "E", "Equipo de medicina nuclear que detecta la radiación gamma emitida por el paciente.", "Gammacámara"],
    ["H", "E", "Tipo de adquisición tomográfica en la que la camilla avanza en forma continua mientras el tubo gira.", "Helicoidal"],
    ["I", "E", "Equipo que administra el medio de contraste con flujo y volumen controlados.", "Inyector"],
    ["J", "C", "Movimiento de la sangre dentro de los vasos, que se evalúa con Doppler.", "Flujo"],
    ["L", "E", "Tipo de acelerador usado en radioterapia externa con fotones de megavoltaje.", "Lineal"],
    ["M", "E", "Dispositivo cardíaco implantable que requiere evaluación especial antes de una resonancia.", "Marcapasos"],
    ["N", "E", "Valor central de la ventana de grises en tomografía computada.", "Nivel"],
    ["Ñ", "C", "Paciente pediátrico para quien deben ajustarse los protocolos de tomografía para reducir la dosis.", "Niño"],
    ["O", "E", "Tipo de exposición de los trabajadores, controlada mediante dosímetro personal.", "Ocupacional"],
    ["P", "E", "En tomografía, relación entre el avance de la camilla por rotación y el ancho del haz.", "Pitch"],
    ["Q", "E", "Pérdida brusca de la superconductividad del imán de resonancia con liberación de helio.", "Quench"],
    ["R", "E", "Proceso por el cual los protones vuelven al equilibrio, caracterizado por los tiempos T1 y T2.", "Relajación"],
    ["S", "E", "Sigla de la tomografía computada por emisión de fotón único.", "SPECT"],
    ["T", "E", "Unidad de intensidad del campo magnético.", "Tesla"],
    ["U", "E", "Valor de dosis por encima del cual aparecen los efectos deterministas.", "Umbral"],
    ["V", "E", "Elemento de volumen de una imagen tomográfica.", "Vóxel"],
    ["X", "C", "Daño renal que puede producir el medio de contraste yodado.", "Nefrotoxicidad"],
    ["Y", "C", "Técnica de reconstrucción MIP: ... de máxima intensidad.", "Proyección"],
    ["Z", "E", "Ampliación electrónica de una zona de la imagen.", "Zoom"]
  ];

  window.BANCOS_PRECARGADOS = [
    {
      id: "nivel-1",
      nombre: "Nivel 1 · Fundamentos",
      descripcion: "Primer año: anatomía, física de las radiaciones y conceptos básicos.",
      precargado: true,
      equipos: { A: armar(NIVEL_1_A), B: armar(NIVEL_1_B) }
    },
    {
      id: "nivel-2",
      nombre: "Nivel 2 · Técnica radiológica",
      descripcion: "Años intermedios: equipos, incidencias, técnica e imagen digital.",
      precargado: true,
      equipos: { A: armar(NIVEL_2_A), B: armar(NIVEL_2_B) }
    },
    {
      id: "nivel-3",
      nombre: "Nivel 3 · Modalidades avanzadas",
      descripcion: "Años superiores: TC, RM, ecografía, medicina nuclear, radioterapia y radiobiología.",
      precargado: true,
      equipos: { A: armar(NIVEL_3_A), B: armar(NIVEL_3_B) }
    }
  ];
})();
