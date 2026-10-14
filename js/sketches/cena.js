// ¿Qué hay de cena? — dibujo adaptado de Khan Academy a p5.js
// En p5.js el lienzo se crea dentro de setup(); las instrucciones de dibujo son las originales.

function setup() {
  createCanvas(400, 400).parent('lienzo');

  background(186, 145, 20); // wooden table
  ellipse(200, 200, 350, 350); // plate
  ellipse(200, 200, 300, 300);

  //posicion
  var pizzax = 200;
  var pizzay = 150;

  fill(255, 242, 0);
  triangle(pizzax, pizzay, pizzax + 80, pizzay + 130, pizzax - 80, pizzay + 130);

  var x = 20;
  fill(240, 76, 0);
  ellipse(pizzax, pizzay + 30, x, x);
  ellipse(pizzax + 20, pizzay + 50, x, x);
  ellipse(pizzax - 30, pizzay + 80, x, x);
  ellipse(pizzax, pizzay + 100, x, x);
  ellipse(pizzax + 30, pizzay + 90, x, x);
  ellipse(pizzax - 20, pizzay + 110, x, x);
  ellipse(pizzax + 50, pizzay + 100, x, x);
  ellipse(pizzax + 20, pizzay + 120, x, x);
}
