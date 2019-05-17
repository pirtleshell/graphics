
import Vector3 from './Vector3';

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


class Poly2D extends Poly {
  constructor(vertices, options) {
    super(vertices, options);
    this.draw = this.draw.bind(this);
  }

  draw(ctx) {
    this.setStyle(ctx);

    ctx.beginPath();
    ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
    this.vertices.slice(1, this.numPoints).forEach(vertex => {
      ctx.lineTo(vertex[0], vertex[1]);
    });
    ctx.closePath();

    this.finishDraw(ctx);
  }
}


class Poly3D extends Poly {
  constructor(vertices, options) {
    super(vertices, options);

    this.fov = Math.tan(Math.PI / 4);

    this.calcCenter();
    this.dist = this.center.magnitude();

    this.draw = this.draw.bind(this);
    this.project3d = this.project3d.bind(this);
  }

  calcCenter() {
    let vertices = this.vertices;
    let avgX = vertices.reduce((sum, v) => sum+v[0], 0) / vertices.length;
    let avgY = vertices.reduce((sum, v) => sum+v[1], 0) / vertices.length;
    let avgZ = vertices.reduce((sum, v) => sum+v[2], 0) / vertices.length;
    this.center = new Vector3(avgX, avgY, avgZ);
    return this.center;
  }

  draw(ctx) {
    // this.setStyle(ctx);
    let projected = this.vertices.map(vertex => this.project3d(vertex, ctx));
    const poly2d = new Poly2D(projected, this.options);
    poly2d.draw(ctx)
  }

  project3d(point, ctx) {
    const maxX = ctx.canvas.width / 2;
    const maxY = ctx.canvas.height / 2;
    let scale = Math.min(maxX, maxY);

    const px = (scale / this.fov) * point[0]/point[2] + maxX;
    const py = (scale / this.fov) * -point[1]/point[2] + maxY;

    return [px, py];
  }
}

export { Poly2D, Poly3D };
