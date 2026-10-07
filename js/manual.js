/* ════════════════════════════════════════════════════════
   CÓDIGO ROJO — Manual del Desarmador (contenido)
   Cada entrada: { id, nav, icon, html }
   ════════════════════════════════════════════════════════ */
const MANUAL = [
  {
    id: "general",
    nav: "General",
    icon: "home",
    html: `
      <h3>MANUAL DEL DESARMADOR</h3>
      <p>Leé esto <b>antes</b> de tocar un módulo. Cada módulo tiene reglas
      distintas y <span class="r">un error equivale a un strike</span>.
      Con <b>3 strikes</b> la bomba detona.</p>
      <h4>DATOS DE LA BOMBA</h4>
      <p>Arriba de la carcasa encontrás:</p>
      <ul>
        <li><b>Número de serie</b> — 6 caracteres (2 letras + 4 dígitos), ej. <span class="k">KX4729</span></li>
        <li><b>Baterías</b> — cantidad de celdas instaladas (0 a 4)</li>
      </ul>
      <div class="note">Muchas reglas dependen de si el número de serie tiene
      <b>vocales</b> (A E I O U) y del <b>último dígito</b> (par o impar).
      Anotalos, van a necesitarlos.</div>
      <h4>ESTRATEGIA</h4>
      <ol>
        <li>Primero los módulos que entendés rápido.</li>
        <li>Si dudás, <b>cerrá el módulo</b> (✕) y resolvé otro — el tiempo sigue corriendo.</li>
        <li>Los errores no se acumulan al cerrar: si abrís un módulo sin tocar nada, no pasa nada.</li>
      </ol>`
  },
  {
    id: "acertijo",
    nav: "Acertijo",
    icon: "acertijo",
    html: `
      <h3>PÁG. 4 — ACERTIJO</h3>
      <p>Un enigma escrito con <b>4 opciones</b>. No hay trampa de datos:
      se resuelve pensando, no con la tabla.</p>
      <h4>PROCEDIMIENTO</h4>
      <ol>
        <li>Leé el enigma completo <b>dos veces</b>.</li>
        <li>Descartá las opciones imposibles.</li>
        <li>Presioná <b>una sola</b> opción.</li>
      </ol>
      <div class="note">Si fallás, el módulo <b>no</b> se reinicia: podés
      intentar de nuevo con otro enigma. No hay paraguas.</div>
      <h4>PISTAS GENÉRICAS</h4>
      <ul>
        <li>"Tengo X pero no Y" → casi siempre es un objeto que <b>imita</b> esa función.</li>
        <li>"Cuanto más quitas, más grande" → pensá en <b>huecos</b>, no en objetos.</li>
        <li>Preguntas con <b>ciudades / agua / montañas</b> → pensá en representaciones.</li>
      </ul>`
  },
  {
    id: "logica",
    nav: "Lógica",
    icon: "logica",
    html: `
      <h3>PÁG. 5 — DEDUCCIÓN LÓGICA</h3>
      <p>Un caso con <b>pistas</b> y <b>4 sospechosos/opciones</b>. Solo una
      combinación de pistas es consistente.</p>
      <h4>PROCEDIMIENTO</h4>
      <ol>
        <li>Leé <b>todas</b> las pistas antes de descartar nada.</li>
        <li>Descartá lo que contradiga <b>cualquier</b> pista.</li>
        <li>La respuesta correcta es la <b>única</b> que no contradice nada.</li>
      </ol>
      <div class="note">Si dos opciones parecen válidas, releé: casi siempre
      hay una pista absoluta ("ninguno", "todos menos uno") que la tumba.</div>`
  },
  {
    id: "cables",
    nav: "Cables",
    icon: "cables",
    html: `
      <h3>PÁG. 6 — CABLES</h3>
      <p>De 3 a 6 cables de colores. <b>Cortá UNO solo.</b>
      Aplicá las reglas <b>de arriba a abajo</b> y cortá en la
      <b>primera que se cumpla</b>.</p>

      <h4>3 CABLES</h4>
      <table>
        <tr><th>#</th><th>Si...</th><th>Cortá</th></tr>
        <tr><td>1</td><td>el cable de ARRIBA es rojo</td><td>el 2.º</td></tr>
        <tr><td>2</td><td>hay más de un cable azul</td><td>el último azul</td></tr>
        <tr><td>3</td><td>el último es blanco</td><td>el último</td></tr>
        <tr><td>4</td><td>si no</td><td>el 1.º</td></tr>
      </table>

      <h4>4 CABLES</h4>
      <table>
        <tr><th>#</th><th>Si...</th><th>Cortá</th></tr>
        <tr><td>1</td><td>hay más de un rojo y el último dígito de la serie es <b>impar</b></td><td>el último rojo</td></tr>
        <tr><td>2</td><td>el último es amarillo y no hay rojos</td><td>el 1.º</td></tr>
        <tr><td>3</td><td>hay exactamente un azul</td><td>el 1.º</td></tr>
        <tr><td>4</td><td>hay más de un amarillo</td><td>el último amarillo</td></tr>
        <tr><td>5</td><td>si no</td><td>el 2.º</td></tr>
      </table>

      <h4>5 CABLES</h4>
      <table>
        <tr><th>#</th><th>Si...</th><th>Cortá</th></tr>
        <tr><td>1</td><td>el último es negro y el último dígito de la serie es <b>impar</b></td><td>el 4.º</td></tr>
        <tr><td>2</td><td>hay exactamente un rojo y más de un amarillo</td><td>el 1.º</td></tr>
        <tr><td>3</td><td>no hay cables negros</td><td>el 2.º</td></tr>
        <tr><td>4</td><td>si no</td><td>el 1.º</td></tr>
      </table>

      <h4>6 CABLES</h4>
      <table>
        <tr><th>#</th><th>Si...</th><th>Cortá</th></tr>
        <tr><td>1</td><td>no hay amarillos y el último dígito de la serie es <b>impar</b></td><td>el 3.º</td></tr>
        <tr><td>2</td><td>hay exactamente un amarillo y más de un blanco</td><td>el 4.º</td></tr>
        <tr><td>3</td><td>no hay rojos</td><td>el último</td></tr>
        <tr><td>4</td><td>si no</td><td>el 4.º</td></tr>
      </table>
      <div class="note">Posiciones contadas de <b>arriba hacia abajo</b>.
      "Último rojo" = el rojo más abajo.</div>`
  },
  {
    id: "boton",
    nav: "Botón",
    icon: "boton",
    html: `
      <h3>PÁG. 7 — BOTÓN</h3>
      <p>Un botón grande de un color, con una <b>etiqueta</b> y una
      <b>tira de color</b> al lado. Aplicá la <b>primera regla</b> que coincida.</p>
      <h4>ACCIÓN INICIAL</h4>
      <table>
        <tr><th>#</th><th>Si...</th><th>Hacé</th></tr>
        <tr><td>1</td><td>etiqueta = <b>DETONAR</b> y hay <b>2 o más baterías</b></td><td>pulsá y soltá YA</td></tr>
        <tr><td>2</td><td>color = <b>azul</b> y etiqueta = <b>MANTENER</b></td><td><b>mantené</b> presionado</td></tr>
        <tr><td>3</td><td>hay <b>más de 2 baterías</b></td><td>pulsá y soltá YA</td></tr>
        <tr><td>4</td><td>si no</td><td><b>mantené</b> presionado</td></tr>
      </table>
      <h4>AL SOLTAR (solo si mantuviste)</h4>
      <p>Mirá la <b>tira de color</b> y soltá cuando el <b>temporizador</b>
      cumpla esa condición:</p>
      <table>
        <tr><th>Tira</th><th>Soltá cuando los segundos...</th></tr>
        <tr><td>roja</td><td>sean <b>pares</b> (02, 04, 06...)</td></tr>
        <tr><td>azul</td><td>termínen en <b>4</b> (:14, :24, :34...)</td></tr>
        <tr><td>amarilla</td><td>termínen en <b>7</b> (:07, :17, :27...)</td></tr>
        <tr><td>blanca</td><td>termínen en <b>0</b> (:10, :20, :30...)</td></tr>
      </table>
      <div class="note">Si soltás en el momento equivoco → <span class="r">strike</span>.
      Si la acción inicial fue "pulsá y soltá ya", no mirás la tira.</div>`
  },
  {
    id: "keypad",
    nav: "Teclado",
    icon: "keypad",
    html: `
      <h3>PÁG. 9 — TECLADO DE SÍMBOLOS</h3>
      <p>4 símbolos en desorden. En esta página hay <b>4 columnas</b>.
      Solo <b>una columna contiene los 4 símbolos del módulo</b>.</p>
      <h4>PROCEDIMIENTO</h4>
      <ol>
        <li>Buscá la columna cuyos 4 símbolos coincidan con los del módulo.</li>
        <li>Presionalos <b>de arriba hacia abajo</b> según el orden de esa columna.</li>
      </ol>
      <div class="col-diagram" id="keypad-cols"></div>
      <div class="note">El orden importa. Un símbolo fuera de secuencia →
      <span class="r">strike</span> y hay que empezar de nuevo.</div>`
  },
  {
    id: "simon",
    nav: "Simon",
    icon: "simon",
    html: `
      <h3>PÁG. 11 — SIMON DIGITAL</h3>
      <p>Los colores <b>parpadean una secuencia</b>. Vos tenés que repetirla
      <b>con el color MAPEADO</b>, no con el original.</p>
      <h4>TABLA DE MAPEO</h4>
      <p>Elegí la tabla según si el número de serie tiene
      <b>vocales</b> (A E I O U) y tus <b>strikes</b>:</p>
      <h4>Serie CON vocal</h4>
      <table>
        <tr><th>Si tenés...</th><th>Rojo →</th><th>Azul →</th><th>Verde →</th><th>Amarillo →</th></tr>
        <tr><td>0 strikes</td><td>azul</td><td>rojo</td><td>amarillo</td><td>verde</td></tr>
        <tr><td>1+ strikes</td><td>amarillo</td><td>verde</td><td>azul</td><td>rojo</td></tr>
      </table>
      <h4>Serie SIN vocal</h4>
      <table>
        <tr><th>Si tenés...</th><th>Rojo →</th><th>Azul →</th><th>Verde →</th><th>Amarillo →</th></tr>
        <tr><td>0 strikes</td><td>azul</td><td>amarillo</td><td>verde</td><td>rojo</td></tr>
        <tr><td>1+ strikes</td><td>rojo</td><td>azul</td><td>amarillo</td><td>verde</td></tr>
      </table>
      <p>Ejemplo: con serie sin vocal y 0 strikes, si el módulo parpadea
      <b>ROJO</b>, vos presionás <span class="k">AZUL</span>.</p>
      <h4>PROCEDIMIENTO</h4>
      <ol>
        <li>Mirá la secuencia completa (dura 2-4 segundos).</li>
        <li>Presioná cada paso <b>con el color mapeado</b>.</li>
        <li>Secuencia correcta → la siguiente ronda es <b>más larga</b>.
        Completar <b>3 rondas</b> desactiva el módulo.</li>
      </ol>
      <div class="note">Presionaste mal → <span class="r">strike</span>, perdés
      la ronda y volvés a empezar de la ronda 1.</div>`
  },
  {
    id: "password",
    nav: "Contraseña",
    icon: "password",
    html: `
      <h3>PÁG. 12 — CONTRASEÑA</h3>
      <p>5 columnas de letras rotables. Formá <b>una palabra de 5 letras</b>
      de la lista y presioná <b>ENVIAR</b>.</p>
      <h4>PALABRAS VÁLIDAS</h4>
      <p>La contraseña <b>siempre</b> está en esta lista:</p>
      <table>
        <tr><td class="k">BOMBA</td><td class="k">CLAVE</td><td class="k">PISTA</td><td class="k">FUEGO</td></tr>
        <tr><td class="k">MORSE</td><td class="k">CABLE</td><td class="k">LLAVE</td><td class="k">PULSO</td></tr>
        <tr><td class="k">RADIO</td><td class="k">SEÑAL</td><td class="k">TURNO</td><td class="k">VALOR</td></tr>
      </table>
      <div class="note">Ojo: hay letras <b>trampa</b> en las columnas.
      Podés formar palabras que <b>no</b> están en la lista — esas no sirven.
      Usá las flechas ▲▼ para rotar cada columna.</div>`
  },
  {
    id: "codigo",
    nav: "Código",
    icon: "codigo",
    html: `
      <h3>PÁG. 13 — CÓDIGO NUMÉRICO</h3>
      <p>Un panel muestra una <b>pista</b> y un teclado numérico.
      Ingresá el código de <b>4 dígitos</b> y presioná <b>OK</b>.</p>
      <h4>TIPOS DE PISTA</h4>
      <ul>
        <li><b>Serial:</b> "usá los dígitos del número de serie, invertidos"
        → leé la serie de derecha a izquierda.</li>
        <li><b>Matemática:</b> operaciones con dígitos fijos. Resolvé en orden
        (miles, centenas, decenas, unidades).</li>
        <li><b>Relación:</b> pistas encadenadas ("el segundo es el doble del primero").</li>
      </ul>
      <div class="note">La pista del módulo es la única fuente de verdad.
      Si dice "invertido", invertí. Si dice "suma", sumá. No adivines.</div>
      <h4>PROCEDIMIENTO</h4>
      <ol>
        <li>Leé la pista completa.</li>
        <li>Calculá los 4 dígitos.</li>
        <li>Ingresalos y presioná <b>OK</b>.</li>
      </ol>`
  },
];

/** Rellena el diagrama de columnas del teclado (dinámico según el símbolo set) */
function renderKeypadColumns(container, columns) {
  container.innerHTML = "";
  columns.forEach((col, i) => {
    const box = document.createElement("div");
    box.className = "col-box";
    box.innerHTML = `<div class="cap">COL ${i + 1}</div>` +
      col.map(s => `<span class="sym">${s}</span>`).join("");
    container.appendChild(box);
  });
}
