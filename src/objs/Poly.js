
import Matrix from './Matrix';
const matrix = new Matrix();

const defaultOptions = {
  color: '#000',
  isFilled: false
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

  beforeDraw(ctx) {

  }

  finishDraw(ctx) {
    if (this.options.isFilled)
      ctx.fill();
    else
      ctx.stroke();
  }

  setStyle() {
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
    this.beforeDraw(ctx);

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

    this.draw = this.draw.bind(this);
    this.project3d = this.project3d.bind(this);
  }

  draw(ctx) {
    // DEBUG:
    // 15 deg
    let cs15 = 0.9659258;
    let sn15 = 0.2588190;
    let move = matrix.identity();
    let inv = matrix.identity();
    [move, inv] = matrix.rotateX(move, inv, 0, 1);
    [move, inv] = matrix.rotateY(move, inv, cs15, sn15);
    [move, inv] = matrix.translate(move, inv, 0, 0, 60);

    let points = matrix.multiplyPoints(move, this.vertices);
    let projected = points.map(vertex => this.project3d(vertex, ctx));

    const poly2d = new Poly2D(projected);
    poly2d.draw(ctx)
  }

  project3d(point, ctx) {
    const maxX = ctx.canvas.width / 2;
    const maxY = ctx.canvas.height / 2;
    let scale = Math.min(maxX, maxY);

    const px = (scale / this.fov) * point[0]/point[2] + maxX;
    const py = (scale / this.fov) * point[1]/point[2] + maxY;

    return [px, py];
  }
}

export { Poly2D, Poly3D };
