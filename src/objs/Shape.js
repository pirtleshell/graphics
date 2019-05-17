
import Color from './Color';
import Poly3d from './Poly3d';
import Movement from './Movement';

class Shape {
  constructor(spec) {
    this.faces = spec.faces;
    this.vertices = spec.vertices;
    this.movement = new Movement();

    this.onAnimate = null;

    this.polyOptions = {
      color: new Color(255, 255, 255),
      isFilled: true,
    };

    this.draw = this.draw.bind(this);
  }

  get color() { return this.polyOptions.color; }
  set color(c) { this.polyOptions.color = new Color(c); }
  get isFilled() { return this.polyOptions.isFilled; }
  set isFilled(f) { this.polyOptions.isFilled = f;}
  get strokeColor() { return this.polyOptions.strokeColor; }
  set strokeColor(c) { this.polyOptions.strokeColor = c; }

  get inverted() { return this.polyOptions.inverted; }
  set inverted(i) { this.polyOptions.inverted = i; }

  get numPoints() { return this.vertices.length; }
  get numPolys() { return this.faces.length; }

  get sortedPolys() {
    return this.faces.map(face => {
      const vertices = face.map(i => this.vertices[i]);
      return new Poly3d(vertices, this.polyOptions);
    }).sort((a, b) => {
      if (a.dist > b.dist)
        return -1;
      else if (a.dist < b.dist)
        return 1;
      return 0;
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

  draw(ctx) {
    this.sortedPolys.forEach(poly => poly.draw(ctx));
  }

  move(movement) {
    const m = movement.move;
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
