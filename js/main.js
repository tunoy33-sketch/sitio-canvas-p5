// main.js — comportamiento común a todas las páginas:
// 1) abre y cierra el menú en pantallas pequeñas
// 2) marca en el menú el enlace de la página actual

document.addEventListener('DOMContentLoaded', () => {
  const boton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');

  if (boton && menu) {
    boton.addEventListener('click', () => {
      const abierto = menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
    });
  }

  // Nombre del archivo actual (index.html si la URL termina en "/")
  const actual = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('#menu a').forEach((enlace) => {
    if (enlace.getAttribute('href') === actual) {
      enlace.setAttribute('aria-current', 'page');
    }
  });
});
