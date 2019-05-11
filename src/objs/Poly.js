
const defaultOptions = {
  color: '#000',
  isFilled: false,
};

class Poly {
  constructor(vertices, options) {
    if (!vertices || !Array.isArray(vertices) || vertices.length < 3)
      throw 'Polys require at least three vertices';

    this.options = Object.assign(defaultOptions, options);
    this.vertices = vertices;

    this.draw = this.draw.bind(this);
  }

  get color() { return this.options.color; }
  set color(color) { this.options.color = color; }
  get numPoints() { return this.vertices.length; }

  draw(ctx) {
    if(this.options.isFilled)
      ctx.fillStyle = this.options.color;
    else
      ctx.strokeStyle = this.options.color;

    ctx.beginPath();
    ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
    this.vertices.slice(1, this.numPoints).forEach(vertex => {
      ctx.lineTo(vertex[0], vertex[1]);
    });
    ctx.closePath();

    if (this.options.isFilled)
      ctx.fill();
    else
      ctx.stroke();
  }
}

export default Poly;
