// dom-inspector.js — dibuja el árbol del DOM de cada página del sitio como un gráfico SVG.

const PAGINAS = [
  { archivo: 'index.html', nombre: 'index' },
  { archivo: 'rana.html', nombre: 'rana' },
  { archivo: 'dientes-conejo.html', nombre: 'dientes-conejo' },
  { archivo: 'cena.html', nombre: 'cena' },
  { archivo: 'dia-nevado.html', nombre: 'dia-nevado' },
  { archivo: 'muneco-nieve.html', nombre: 'muneco-nieve' },
  { archivo: 'teoria-canvas.html', nombre: 'teoria-canvas' },
  { archivo: 'teoria-p5.html', nombre: 'teoria-p5' },
  { archivo: 'dom-inspector.html', nombre: 'dom-inspector' },
];

// Medidas del dibujo (en píxeles del SVG)
const SEPARACION_X = 18;
const ALTO_NIVEL = 84;
const ALTO_NODO = 52;
const MARGEN = 24;
const PROFUNDIDAD_INICIAL = 3; // los nodos de esta profundidad en adelante empiezan contraídos

const SEMANTICOS = new Set(['header', 'main', 'nav', 'footer', 'section', 'article', 'aside']);
const NS_SVG = 'http://www.w3.org/2000/svg';

const pestanas = document.getElementById('pestanas');
const contenedor = document.getElementById('arbol');
const estado = document.getElementById('estado');

let raiz = null;
let paginaActual = null;
let cursor = 0;
let ajustarAlAncho = true;

// ---------- Construcción del modelo ----------

function nombreDeArchivo(ruta) {
  return (ruta || '').split('/').pop();
}

function subtitulo(el) {
  if (el.id) return '#' + el.id;
  if (el.classList.length) return '.' + el.classList[0];

  const etiqueta = el.tagName.toLowerCase();
  if (etiqueta === 'meta') {
    return el.getAttribute('charset') || el.getAttribute('name') || '';
  }
  if (etiqueta === 'link') return nombreDeArchivo(el.getAttribute('href'));
  if (etiqueta === 'script') return nombreDeArchivo(el.getAttribute('src'));

  if (el.children.length === 0) {
    const texto = el.textContent.trim().replace(/\s+/g, ' ');
    if (texto) return '"' + (texto.length > 14 ? texto.slice(0, 13) + '…' : texto) + '"';
  }
  return '';
}

function crearNodo(el, profundidad) {
  const hijos = [...el.children].map((hijo) => crearNodo(hijo, profundidad + 1));
  const tag = el.tagName.toLowerCase();
  const etiqueta = '<' + tag + '>';
  const sub = subtitulo(el);
  const ancho = Math.max(etiqueta.length, sub.length) * 9.2 + 34;

  return {
    tag,
    etiqueta,
    sub,
    hijos,
    profundidad,
    ancho,
    colapsado: profundidad >= PROFUNDIDAD_INICIAL && hijos.length > 0,
    x: 0,
    nivel: 0,
  };
}

function recorrer(nodo, accion) {
  accion(nodo);
  nodo.hijos.forEach((hijo) => recorrer(hijo, accion));
}

// ---------- Distribución (posiciones x de cada nodo) ----------

function desplazar(nodo, dx) {
  nodo.x += dx;
  if (!nodo.colapsado) {
    nodo.hijos.forEach((hijo) => desplazar(hijo, dx));
  }
}

function distribuir(nodo, nivel) {
  nodo.nivel = nivel;
  const inicio = cursor;

  if (nodo.colapsado || nodo.hijos.length === 0) {
    nodo.x = cursor + nodo.ancho / 2;
    cursor += nodo.ancho + SEPARACION_X;
    return;
  }

  nodo.hijos.forEach((hijo) => distribuir(hijo, nivel + 1));

  // El padre queda centrado sobre sus hijos
  const primero = nodo.hijos[0];
  const ultimo = nodo.hijos[nodo.hijos.length - 1];
  nodo.x = (primero.x + ultimo.x) / 2;

  // Si el padre es más ancho que el espacio de sus hijos, se desplaza todo el grupo
  const izquierda = nodo.x - nodo.ancho / 2;
  if (izquierda < inicio) {
    const dx = inicio - izquierda;
    desplazar(nodo, dx);
    cursor += dx;
  }
  cursor = Math.max(cursor, nodo.x + nodo.ancho / 2 + SEPARACION_X);
}

// ---------- Dibujo SVG ----------

function crearSVG(nombre, atributos = {}) {
  const el = document.createElementNS(NS_SVG, nombre);
  for (const [clave, valor] of Object.entries(atributos)) {
    el.setAttribute(clave, valor);
  }
  return el;
}

function alternar(nodo) {
  if (nodo.hijos.length === 0) return;
  nodo.colapsado = !nodo.colapsado;
  dibujar();
}

function dibujar() {
  contenedor.replaceChildren();
  cursor = 0;
  distribuir(raiz, 0);

  const visibles = [];
  const reunir = (nodo) => {
    visibles.push(nodo);
    if (!nodo.colapsado) nodo.hijos.forEach(reunir);
  };
  reunir(raiz);

  const maxNivel = Math.max(...visibles.map((n) => n.nivel));
  const ancho = cursor - SEPARACION_X + MARGEN * 2;
  const alto = maxNivel * ALTO_NIVEL + ALTO_NODO + MARGEN * 2 + 8;

  const svg = crearSVG('svg', {
    viewBox: `0 0 ${ancho} ${alto}`,
    role: 'img',
    'aria-label': `Árbol del DOM de ${paginaActual.archivo}`,
  });
  if (ajustarAlAncho) {
    // Se reduce para caber en el contenedor, pero nunca se agranda más que su tamaño real
    svg.style.width = '100%';
    svg.style.maxWidth = ancho + 'px';
    svg.style.height = 'auto';
  } else {
    svg.setAttribute('width', ancho);
    svg.setAttribute('height', alto);
  }

  // Líneas de conexión (se dibujan primero para quedar detrás de los nodos)
  const capaLineas = crearSVG('g');
  visibles.forEach((nodo) => {
    if (nodo.colapsado || nodo.hijos.length === 0) return;
    const x1 = nodo.x + MARGEN;
    const y1 = nodo.nivel * ALTO_NIVEL + MARGEN + ALTO_NODO;
    const yMedio = y1 + (ALTO_NIVEL - ALTO_NODO) / 2;
    const yHijo = (nodo.nivel + 1) * ALTO_NIVEL + MARGEN;

    let d = `M${x1} ${y1} V${yMedio}`;
    nodo.hijos.forEach((hijo) => {
      d += ` M${x1} ${yMedio} H${hijo.x + MARGEN} V${yHijo}`;
    });
    capaLineas.appendChild(crearSVG('path', { d, class: 'linea' }));
  });
  svg.appendChild(capaLineas);

  // Nodos
  visibles.forEach((nodo) => {
    const clases = ['nodo'];
    if (SEMANTICOS.has(nodo.tag)) clases.push('sem');
    if (nodo.tag === 'canvas') clases.push('cv');
    if (nodo.hijos.length) clases.push('con-hijos');

    const g = crearSVG('g', {
      class: clases.join(' '),
      transform: `translate(${nodo.x - nodo.ancho / 2 + MARGEN} ${nodo.nivel * ALTO_NIVEL + MARGEN})`,
    });

    g.appendChild(crearSVG('rect', { width: nodo.ancho, height: ALTO_NODO, rx: 10 }));

    const yTag = nodo.sub ? 22 : 31;
    const tag = crearSVG('text', { class: 'tag', x: nodo.ancho / 2, y: yTag });
    tag.textContent = nodo.etiqueta;
    g.appendChild(tag);

    if (nodo.sub) {
      const sub = crearSVG('text', { class: 'sub', x: nodo.ancho / 2, y: 40 });
      sub.textContent = nodo.sub;
      g.appendChild(sub);
    }

    if (nodo.hijos.length) {
      const total = contarDescendientes(nodo);
      const insignia = crearSVG('g', { class: 'toggle' });
      insignia.appendChild(crearSVG('circle', { cx: nodo.ancho / 2, cy: ALTO_NODO, r: 10 }));
      const signo = crearSVG('text', { x: nodo.ancho / 2, y: ALTO_NODO + 4.5 });
      signo.textContent = nodo.colapsado ? '+' : '−';
      insignia.appendChild(signo);
      g.appendChild(insignia);

      const titulo = crearSVG('title');
      titulo.textContent = `${nodo.etiqueta} · ${nodo.hijos.length} hijo(s) directo(s), ${total} descendiente(s)`;
      g.appendChild(titulo);

      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-expanded', String(!nodo.colapsado));
      g.addEventListener('click', () => alternar(nodo));
      g.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          alternar(nodo);
        }
      });
    }

    svg.appendChild(g);
  });

  contenedor.classList.toggle('real', !ajustarAlAncho);
  contenedor.appendChild(svg);

  // En tamaño real, el árbol puede ser más ancho que la pantalla: se centra sobre la raíz
  contenedor.scrollLeft = (contenedor.scrollWidth - contenedor.clientWidth) / 2;
  actualizarEstado();
}

function contarDescendientes(nodo) {
  let total = 0;
  recorrer(nodo, () => { total += 1; });
  return total - 1;
}

function actualizarEstado() {
  let total = 0;
  let maxima = 0;
  recorrer(raiz, (n) => {
    total += 1;
    maxima = Math.max(maxima, n.profundidad);
  });
  estado.textContent =
    `${paginaActual.archivo}: ${total} elementos en total · profundidad máxima ${maxima} (la raíz es el nivel 0).`;
}

// ---------- Carga de páginas ----------

async function cargar(pagina) {
  paginaActual = pagina;
  marcarPestana(pagina);
  estado.textContent = 'Cargando ' + pagina.archivo + '…';

  try {
    const respuesta = await fetch(pagina.archivo, { cache: 'no-cache' });
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

    const html = await respuesta.text();
    const documento = new DOMParser().parseFromString(html, 'text/html');
    raiz = crearNodo(documento.documentElement, 0);
    dibujar();
    history.replaceState(null, '', '#' + pagina.nombre);
  } catch (error) {
    raiz = null;
    contenedor.replaceChildren();
    estado.textContent =
      'No se pudo cargar ' + pagina.archivo + ' (' + error.message + '). ' +
      'Si abriste el archivo con doble clic, usa un servidor local (por ejemplo "python -m http.server") ' +
      'o consulta el sitio publicado en GitHub Pages.';
  }
}

function marcarPestana(pagina) {
  pestanas.querySelectorAll('button').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(boton.dataset.archivo === pagina.archivo));
  });
}

function crearPestanas() {
  PAGINAS.forEach((pagina) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = pagina.archivo;
    boton.dataset.archivo = pagina.archivo;
    boton.setAttribute('aria-pressed', 'false');
    boton.addEventListener('click', () => cargar(pagina));
    pestanas.appendChild(boton);
  });
}

// ---------- Controles ----------

function fijarColapso(regla) {
  if (!raiz) return;
  recorrer(raiz, (nodo) => {
    nodo.colapsado = nodo.hijos.length > 0 && regla(nodo);
  });
  dibujar();
}

const botonTamano = document.getElementById('btn-tamano');
botonTamano.addEventListener('click', () => {
  ajustarAlAncho = !ajustarAlAncho;
  botonTamano.textContent = ajustarAlAncho ? 'Ver tamaño real' : 'Ajustar al ancho';
  if (raiz) dibujar();
});

document.getElementById('btn-expandir').addEventListener('click', () => fijarColapso(() => false));
document.getElementById('btn-contraer').addEventListener('click', () => fijarColapso((n) => n.profundidad >= 1));
document.getElementById('btn-inicial').addEventListener('click', () =>
  fijarColapso((n) => n.profundidad >= PROFUNDIDAD_INICIAL));

// ---------- Inicio ----------

crearPestanas();
const desdeHash = PAGINAS.find((p) => '#' + p.nombre === location.hash);
cargar(desdeHash || PAGINAS[0]);
