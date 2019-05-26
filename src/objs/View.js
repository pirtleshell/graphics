
import Movement from './Movement';
import Poly from './Poly';
import Shape from './Shape';
import Vector3 from './Vector3';

class View {
  constructor(displayDiv, eyePosition, options) {
    this.container = displayDiv;
    this.eye = new Vector3(eyePosition);
    this.fov = Math.tan(Math.PI / 4);

    this.options = Object.assign({
      clearFunc: null,
      postDraw: null,
    }, options);

    this.canvas = this.getCanvas();
    this.resizeCanvas();

    this.ctx = this.canvas.getContext('2d');

    this.container.addEventListener('resize', this.resizeCanvas, false);
    this.projection = this.projection.bind(this);
  }

  set fillStyle(c) { this.ctx.fillStyle = c; }
  set strokeStyle(c) { this.ctx.strokeStyle = c; }

  animate(world, maxSteps) {
    let currStep = 0;
    const doStep = () => {
      world.shapes.forEach(shape => {
        if(shape.onAnimate)
          shape.onAnimate(shape, world);
      })
      this.clear();
      this.draw(world);
      if (currStep++ < maxSteps)
        window.requestAnimationFrame(doStep);
    };

    window.requestAnimationFrame(doStep);
  }

  clear() {
    if (this.options.clearFunc)
      return this.options.clearFunc(this.ctx);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(world) {
    this.clear();
    let minZ = 1;

    let [vertices, faces] = world.polys;

    // translate to eye's location
    let s = new Shape({vertices, faces});
    const m = new Movement().translate(this.eye.scale(-1));
    s.move(m);
    vertices = s.vertices;

    const projected = vertices.map(this.projection);
    // sort em
    let dists = [];
    faces.forEach((face, num) => {
      const poly = new Poly(face[0].map(i => vertices[i]), world.shapes[face[1]].polyOptions);
      const normal = poly.normal();
      if(poly.minZ > minZ)
        dists.push([num, poly.dist, normal]);
    });
    dists = dists.sort((a, b) => {
      if (a[1] < b[1]) return 1;
      if (a[1] > b[1]) return -1;
      return 0;
    });

    // render em
    dists.forEach(item => {
      const num = item[0];
      const face = faces[num][0];
      const shape = world.shapes[faces[num][1]];
      const normal = item[2];

      let color = shape.color;
      if(world.light != null) {
        color = world.light.calcColor(
          this, vertices[face[0]], normal, color
        );
      }
      this.drawPoly2d(face.map(i => projected[i]), normal, color.hexStr, shape);
    });

    s.move(m, 1);

    if(this.options.postDraw)
      this.options.postDraw(this.ctx);
  }

  drawPoly2d(vertices, normal, color, shape) {
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0][0], vertices[0][1]);
    vertices.forEach(vertex => {
      this.ctx.lineTo(vertex[0], vertex[1]);
    });
    this.ctx.closePath();

    this.fillStyle = color;
    this.strokeStyle = shape.strokeColor;

    if(shape.isFilled)
      this.ctx.fill();
    if(shape.strokeColor)
      this.ctx.stroke();
  }

  drawVec(v, pos, color) {
    let start = this.projection(pos);
    let endPoint = [];
    for (var i = 0; i < 3; i++) {
      endPoint[i] = pos[i] + v[1];
    }
    let end = this.projection(endPoint);
    this.line2d(start, end, color);
    this.rect(end[0] - 2, end[1] - 2, 4, 4);
  }

  line2d(start, finish, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(start[0], start[1]);
    this.ctx.lineTo(finish[0], finish[1]);
    this.ctx.closePath();
    this.ctx.strokeStyle = color ? color : '#fff';
    this.ctx.stroke();
  }

  point2d(px, py, color) {
    this.rect(px - 5, py - 5, 10, 10, color);
  }

  point3d(x, y, z, color) {
    const [px, py] = this.projection(new Vector3(x, y, z));
    this.point2d(px, py, color);
  }

  rect(px, py, w, h, color, stroke) {
    if(!color) color = '#fff';
    let func;
    if (stroke) {
      this.strokeStyle = color;
      func = this.ctx.strokeRect;
    } else {
      this.fillStyle = color;
      func = this.ctx.fillRect;
    }

    func.call(this.ctx, px, py, w, h);
  }

  getCanvas() {
    if (this.canvas != null) return this.canvas;
    if (this.container.constructor.name === 'HTMLCanvasElement')
      return this.container;
    if (this.container.querySelector('canvas') !== null)
      return this.container.querySelector('canvas');

    // empty container
    while(this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);
    return canvas;
  }

  projection(point) {
    const maxX = this.canvas.width / 2;
    const maxY = this.canvas.height / 2;
    let scale = Math.min(maxX, maxY);

    const px = (scale / this.fov) * point[0]/point[2] + maxX;
    const py = (scale / this.fov) * -point[1]/point[2] + maxY;

    return [px, py];
  }

  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
}

export default View;
