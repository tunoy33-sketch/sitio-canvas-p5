// Dientes de conejo — dibujo adaptado de Khan Academy a p5.js
// En p5.js el lienzo se crea dentro de setup(); las instrucciones de dibujo son las originales.

function setup() {
  createCanvas(400, 400).parent('lienzo');
  background(255); // en Khan Academy el fondo ya era blanco

  var eyze = 43;
  var tooth = 50;

  ellipse(150, 70, 32, 113); // left ear
  ellipse(240, 70, 32, 113); // right ear

  ellipse(200, 170, 150, 150); // face

  fill(0, 0, 0);
  ellipse(170, 150, eyze, eyze); // left eye
  ellipse(230, 150, eyze, eyze); // right eye

  line(150, 200, 250, 200); // mouth

  noFill();

  rect(185, 200, 15, tooth); // left tooth
  rect(200, 200, 15, tooth); // right tooth
}
