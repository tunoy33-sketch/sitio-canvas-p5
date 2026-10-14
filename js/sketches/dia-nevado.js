// Día nevado soleado — dibujo adaptado de Khan Academy a p5.js
// En p5.js el lienzo se crea dentro de setup(); las instrucciones de dibujo son las originales.

function setup() {
  createCanvas(400, 400).parent('lienzo');

  background(74, 204, 247);

  // The ground
  fill(51, 219, 48);
  rect(0, 300, 400, 100);

  // The sun
  fill(255, 255, 0);
  ellipse(80, 64, 100, 100);

  // The snowman
  fill(255, 255, 255);
  ellipse(200, 300, 150, 150);
  ellipse(200, 200, 100, 100);
  ellipse(200, 120, 75, 75);
}
