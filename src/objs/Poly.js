
const defaultOptions = {
  color: '#000',
  isFilled: false,
  strokeColor: null,
};

class Poly {
  constructor(vertices, options) {
    if (!vertices || !Array.isArray(vertices) || vertices.length < 3)
      throw 'Polys require at least three vertices';

    this.options = Object.assign(defaultOptions, options);
    this.vertices = vertices;
  }

  get color() { return this.options.color; }
  set color(c) { this.options.color = c;}
  get strokeColor() { return this.options.strokeColor; }
  set strokeColor(c) { this.options.strokeColor = c; }
  get isFilled() { return this.options.isFilled; }
  set isFilled(fill) { this.options.isFilled = fill; }

  get numPoints() { return this.vertices.length; }

  finishDraw(ctx) {
    if (this.options.isFilled)
      ctx.fill();
      if(this.options.strokeColor) {
        ctx.strokeStyle = this.options.strokeColor;
        ctx.stroke();
      }
    else
      ctx.stroke();
  }

  setStyle(ctx) {
    if(this.options.isFilled)
      ctx.fillStyle = this.options.color;
    else
      ctx.strokeStyle = this.options.color;
  }
}

export default Poly;
