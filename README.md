# Canvas y p5.js — Sitio web de dibujos

Sitio estático hecho con HTML, CSS y JavaScript. Reúne los cinco dibujos de Khan Academy adaptados a p5.js
(1. Rana, 2. Dientes de conejo, 3. ¿Qué hay de cena?, 4. Día nevado soleado, 5. Muñeco de nieve), dos páginas
teóricas (`<canvas>` y p5.js) y una página `dom-inspector.html` que dibuja el árbol del DOM de cada página.

## Estructura

```
index.html
rana.html · dientes-conejo.html · cena.html · dia-nevado.html · muneco-nieve.html
teoria-canvas.html · teoria-p5.html · dom-inspector.html
css/style.css
js/main.js            menú y página activa
js/dom-inspector.js   árbol del DOM en SVG
js/demo-canvas.js     demo con la API nativa de canvas
js/demo-p5.js         demo de p5.js en modo instancia
js/sketches/*.js      un archivo por dibujo
```

## Probar en local

El DOM Inspector usa `fetch()`, así que conviene servir la carpeta en vez de abrir los archivos con doble clic:

```bash
python -m http.server 8000
# abrir http://localhost:8000
```

## Dependencias

p5.js 1.9.4
