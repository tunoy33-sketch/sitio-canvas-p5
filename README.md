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

## Publicar en GitHub Pages (sin instalar nada)

1. Entra a https://github.com e inicia sesión (o crea una cuenta gratuita).
2. Arriba a la derecha pulsa **+ → New repository**.
3. En *Repository name* escribe un nombre sin espacios, por ejemplo `sitio-canvas-p5`.
4. Marca **Public**. No marques "Add a README" (ya tienes uno). Pulsa **Create repository**.
5. En la página del repositorio vacío pulsa el enlace **uploading an existing file**.
6. En tu computadora **extrae el ZIP** y abre la carpeta. Selecciona **todo su contenido** (`index.html`, las demás
   páginas, `css`, `js` y `README.md`) y arrástralo a la ventana de GitHub. No subas el ZIP sin extraer ni
   una carpeta contenedora: `index.html` debe quedar en la raíz del repositorio.
7. Espera a que terminen de cargar todos los archivos y pulsa **Commit changes**.
8. Ve a **Settings → Pages**. En *Build and deployment → Source* elige **Deploy from a branch**; en *Branch*
   elige `main` y la carpeta `/ (root)`; pulsa **Save**.
9. Espera de uno a tres minutos y recarga la página de Pages. Aparecerá la URL:
   `https://TU-USUARIO.github.io/sitio-canvas-p5/`. Ábrela y revisa que se vea el menú, los cinco dibujos y el
   DOM Inspector.
10. Esa URL es lo que debes entregar.

### Alternativa con Git

```bash
git init
git add .
git commit -m "Sitio web con dibujos en p5.js"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/sitio-canvas-p5.git
git push -u origin main
```

Después sigue desde el paso 8.

## Dependencias

p5.js 1.9.4, cargada desde cdnjs en las páginas que dibujan. No hay nada que instalar; el sitio necesita
conexión a internet para descargar p5.js.
