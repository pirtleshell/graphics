
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
  }

  get color() { return this.options.color; }
  set color(color) { this.options.color = color; }
  get numPoints() { return this.vertices.length; }
}

class Poly2D extends Poly {
  constructor(vertices, options) {
    super(vertices, options);
    this.draw = this.draw.bind(this);
  }

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

class Poly3D extends Poly {
  constructor(vertices, options) {
    super(vertices, options);

    this.fov = Math.PI / 4.0

    this.draw = this.draw.bind(this);
    this.project3d = this.project3d.bind(this);
  }

  draw(ctx) {
    const projected = this.vertices.map(vertex => this.project3d(vertex, ctx));
    const poly2d = new Poly2D(projected);
    poly2d.draw(ctx)
  }

  project3d(point, ctx) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    // linear alebra goes here
  }
}

export { Poly2D, Poly3D };
