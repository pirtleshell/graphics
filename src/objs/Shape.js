
import Color from './Color';
import Poly from './Poly';
import Movement from './Movement';
import Vector3 from './Vector3';

class Shape {
  constructor(spec) {
    this.faces = spec.faces;
    this.vertices = spec.vertices;
    // this.vertices = spec.vertices.map(v => new Vector3(v));
    this.movement = new Movement();
    // this.normals = this.calcNormals();

    this.onAnimate = null;

    this.polyOptions = {
      color: new Color(0, 0, 0),
      isFilled: true,
      strokeColor: null,
    };
  }

  get color() { return this.polyOptions.color; }
  set color(c) { this.polyOptions.color = c === null ? null : new Color(c); }
  get isFilled() { return this.polyOptions.isFilled; }
  set isFilled(f) { this.polyOptions.isFilled = f;}
  get strokeColor() { return this.polyOptions.strokeColor; }
  set strokeColor(c) { this.polyOptions.strokeColor = c; }

  get inverted() { return this.polyOptions.inverted; }
  set inverted(i) { this.polyOptions.inverted = i; }

  get numPoints() { return this.vertices.length; }
  get numPolys() { return this.faces.length; }

  get polys() {
    return this.faces.map(face => {
      const vertices = face.map(i => this.vertices[i]);
      return new Poly(vertices, this.polyOptions);
    });
  }

  get center() {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];

    this.vertices.forEach(v => {
      for (var i = 0; i < 3; i++) {
        if(v[i] < min[i]) min[i] = v[i];
        if(v[i] > max[i]) max[i] = v[i];
      }
    });

    const out = [];
    for (var i = 0; i < 3; i++) {
      out[i] = (min[i] + max[i]) / 2;
    }

    return out;
  }

  move(movement, inverse) {
    let m = movement.move;
    if(inverse)
      m = movement.inv;
    const numPoints = this.numPoints;
    for(let i = 0; i < numPoints; i++) {
      let x = this.vertices[i][0];
      let y = this.vertices[i][1];
      let z = this.vertices[i][2];

      for (let c = 0; c < 3; c++) {
        this.vertices[i][c] = x*m[c][0] + y*m[c][1] + z*m[c][2] + m[c][3];
      }
    }
    this.movement.applyMovement(movement);
  }

  untranslate() {
    const center = this.center;
    const trans = new Movement().translate(center);
    this.move(new Movement(trans.inv, trans.move));
    return trans;
  }
};

export default Shape;
