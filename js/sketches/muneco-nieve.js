// Muñeco de nieve — dibujo adaptado de Khan Academy a p5.js
// En p5.js el lienzo se crea dentro de setup(); las instrucciones de dibujo son las originales.

function setup() {
  createCanvas(400, 400).parent('lienzo');
  background(255); // en Khan Academy el fondo ya era blanco

  ellipse(200, 300, 150, 130);
  ellipse(200, 225, 115, 100);
  ellipse(200, 160, 90, 85);
}
