// Rana — dibujo adaptado de Khan Academy a p5.js
// En p5.js el lienzo se crea dentro de setup(); las instrucciones de dibujo son las originales.

function setup() {
  createCanvas(400, 400).parent('lienzo');
  background(255); // en Khan Academy el fondo ya era blanco

  var x = 200;
  var y = 250;

  noStroke();
  fill(30, 204, 91); // a nice froggy green!

  ellipse(x, y, 200, 100); // face
  ellipse(x - 50, y - 50, 40, 40); // left eye socket
  ellipse(x + 50, y - 50, 40, 40); // right eye socket

  fill(0, 0, 0);
  ellipse(x, y, 100, 60);

  fill(255, 255, 255); // for the whites of the eyes!
  ellipse(x - 50, y - 50, 30, 30); // left eyeball
  ellipse(x + 50, y - 50, 30, 30); // right eyeball
  fill(0, 0, 0);
  rect(x + 53, y - 55, 10, 10);
  rect(x - 64, y - 55, 10, 10);
}
