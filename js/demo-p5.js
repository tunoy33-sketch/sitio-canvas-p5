// Demostración de p5.js en "modo instancia":
// una estela de círculos sigue al mouse (o dibuja una curva sola si el mouse no está encima).

new p5((p) => {
  let estela = [];
  let encima = false;

  p.setup = () => {
    const lienzo = p.createCanvas(480, 260);
    lienzo.parent('demo-p5');
    lienzo.mouseOver(() => { encima = true; });
    lienzo.mouseOut(() => { encima = false; });
    p.colorMode(p.HSB, 360, 100, 100, 1);
    p.noStroke();
  };

  p.draw = () => {
    p.background(222, 40, 12);

    let objetivoX;
    let objetivoY;
    if (encima) {
      objetivoX = p.constrain(p.mouseX, 0, p.width);
      objetivoY = p.constrain(p.mouseY, 0, p.height);
    } else {
      objetivoX = p.width / 2 + p.sin(p.frameCount * 0.03) * p.width * 0.35;
      objetivoY = p.height / 2 + p.sin(p.frameCount * 0.05) * p.height * 0.3;
    }

    estela.push({ x: objetivoX, y: objetivoY });
    if (estela.length > 40) {
      estela.shift();
    }

    estela.forEach((punto, i) => {
      const t = i / estela.length;
      p.fill(200 + t * 80, 70, 100, t);
      p.circle(punto.x, punto.y, 6 + t * 26);
    });
  };
});
