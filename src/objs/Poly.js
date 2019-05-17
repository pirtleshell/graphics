
import Color from './Color';

class Poly {
  constructor(vertices, options) {
    if (!vertices || !Array.isArray(vertices) || vertices.length < 3)
      throw 'Polys require at least three vertices';

    let defaultOptions = {
      color: new Color(0, 0, 0),
      isFilled: false,
      strokeColor: null,
    };
    this.options = Object.assign(defaultOptions, options);
    this.vertices = vertices;
  }

  get color() { return this.options.color; }
  set color(c) { this.options.color = new Color(c);}
  get strokeColor() { return this.options.strokeColor; }
  set strokeColor(c) { this.options.strokeColor = c; }
  get isFilled() { return this.options.isFilled; }
  set isFilled(fill) { this.options.isFilled = fill; }

  get numPoints() { return this.vertices.length; }

  doDraw(ctx) {
    ctx.fillStyle = this.color.hexStr;
    ctx.strokeStyle = this.strokeColor;
    if (this.options.isFilled)
      ctx.fill();
    if(this.options.strokeColor)
      ctx.stroke();
  }
}

export default Poly;
