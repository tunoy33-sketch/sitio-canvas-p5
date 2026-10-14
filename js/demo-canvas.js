// Demostración con la API nativa de canvas (sin p5.js):
// una pelota que rebota, animada con requestAnimationFrame.

const lienzo = document.getElementById('demo-canvas');
const ctx = lienzo.getContext('2d');

const radio = 22;
let x = 60;
let y = 60;
let vx = 2.4;
let vy = 1.8;

function animar() {
  // 1) Borrar el cuadro anterior
  ctx.fillStyle = '#0b1222';
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);

  // 2) Actualizar la posición y rebotar en los bordes
  x += vx;
  y += vy;
  if (x < radio || x > lienzo.width - radio) vx *= -1;
  if (y < radio || y > lienzo.height - radio) vy *= -1;

  // 3) Dibujar la pelota con un degradado radial
  const degradado = ctx.createRadialGradient(x - 6, y - 6, 3, x, y, radio);
  degradado.addColorStop(0, '#bfe3ff');
  degradado.addColorStop(1, '#2f7fd1');
  ctx.beginPath();
  ctx.arc(x, y, radio, 0, Math.PI * 2);
  ctx.fillStyle = degradado;
  ctx.fill();

  requestAnimationFrame(animar);
}

animar();
