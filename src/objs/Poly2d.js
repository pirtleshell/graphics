
import Poly from './Poly';

class Poly2d extends Poly {
  constructor(vertices, options) {
    super(vertices, options);
    this.draw = this.draw.bind(this);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
    this.vertices.slice(1, this.numPoints).forEach(vertex => {
      ctx.lineTo(vertex[0], vertex[1]);
    });
    ctx.closePath();

    this.doDraw(ctx);
  }
}

export default Poly2d;
