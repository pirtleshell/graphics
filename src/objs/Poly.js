
import Color from './Color';
import Vector3 from './Vector3';

class Poly {
  constructor(vertices, options) {
    if (!vertices || !Array.isArray(vertices) || vertices.length < 3)
      throw 'Polys require at least three vertices';

    let defaultOptions = {
      color: new Color(0, 0, 0),
      isFilled: false,
      inverted: false,
      strokeColor: null,
    };
    this.options = Object.assign(defaultOptions, options);
    this.vertices = [];
    this.minZ = Infinity;
    vertices.forEach(v => {
      this.vertices.push(new Vector3(v));
      if(v[2] < this.minZ) this.minZ = v[2];
    });

    this.CoM = this.calcCenterOfMass();
  }

  get dist() { return this.CoM.magnitude(); }

  get color() { return this.options.color; }
  set color(c) { this.options.color = new Color(c);}
  get strokeColor() { return this.options.strokeColor; }
  set strokeColor(c) { this.options.strokeColor = c; }
  get isFilled() { return this.options.isFilled; }
  set isFilled(fill) { this.options.isFilled = fill; }

  get numPoints() { return this.vertices.length; }

  calcCenterOfMass() {
    const vertices = this.vertices;
    const avgX = vertices.reduce((sum, v) => sum+v[0], 0) / vertices.length;
    const avgY = vertices.reduce((sum, v) => sum+v[1], 0) / vertices.length;
    const avgZ = vertices.reduce((sum, v) => sum+v[2], 0) / vertices.length;
    const CoM = new Vector3(avgX, avgY, avgZ);
    return CoM;
  }

  normal() {
    const v1 = this.vertices[0].to(this.vertices[1]);
    const v2 = this.vertices[0].to(this.vertices[2]);
    let unit = v1.cross(v2).direction();
    if(this.options.inverted)
      return unit.scale(-1);
    return unit;
  }
};

export default Poly;
