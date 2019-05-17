
import Poly from './Poly';
import Poly2d from './Poly2d';
import Vector3 from './Vector3';

class Poly3d extends Poly {
  constructor(vertices, options) {
    super(vertices, options);

    this.vertices = vertices.map(v => new Vector3(v))
    this.fov = Math.tan(Math.PI / 4);

    this.calcCenterOfMass();
    this.dist = this.CoM.magnitude();

    this.draw = this.draw.bind(this);
    this.project3d = this.project3d.bind(this);
  }

  calcCenterOfMass() {
    let vertices = this.vertices;
    let avgX = vertices.reduce((sum, v) => sum+v.x, 0) / vertices.length;
    let avgY = vertices.reduce((sum, v) => sum+v.y, 0) / vertices.length;
    let avgZ = vertices.reduce((sum, v) => sum+v.z, 0) / vertices.length;
    this.CoM = new Vector3(avgX, avgY, avgZ);
    return this.CoM;
  }

  draw(ctx) {
    // this.setStyle(ctx);
    let projected = this.vertices.map(vertex => this.project3d(vertex, ctx));
    const poly2d = new Poly2d(projected, this.options);
    poly2d.draw(ctx)
  }

  normal() {
    const v1 = this.vertices[0].to(this.vertices[1]);
    const v2 = this.vertices[0].to(this.vertices[2]);
    return v1.cross(v2);
  }

  project3d(point, ctx) {
    const maxX = ctx.canvas.width / 2;
    const maxY = ctx.canvas.height / 2;
    let scale = Math.min(maxX, maxY);

    const px = (scale / this.fov) * point.x/point.z + maxX;
    const py = (scale / this.fov) * -point.y/point.z + maxY;

    return [px, py];
  }
}

export default Poly3d;
