
import { Poly3D } from './Poly';
import Movement from './Movement';

class Shape {
  constructor(spec) {
    this.faces = spec.faces;
    this.vertices = spec.vertices;
    this.movement = new Movement();

    this.onAnimate = null;

    this.draw = this.draw.bind(this);
  }

  get numPoints() { return this.vertices.length; }

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
    this.sortFaces();
    this.faces.forEach(face => {
      const vertices = face.map(index => this.vertices[index]);
      const poly = new Poly3D(vertices, {
        isFilled: true,
        strokeColor: '#000'
      });
      poly.color = '#bad';
      poly.draw(ctx);
    });
  }

  move(movement, noSort) {
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
    if(!noSort)
      this.sortFaces();
  }

  sortFaces() {
    const vertices = this.vertices;
    const getAvgZ = verts => {
      let min = Infinity;
      let max = -Infinity;
      verts.forEach( v => {
        if(vertices[v][2] < min) min = vertices[v][2];
        if(vertices[v][2] > max) max = vertices[v][2];
      });
      return (min + max) / 2;
    };
    const compare = (faceA, faceB) => {
      const avgA = getAvgZ(faceA);
      const avgB = getAvgZ(faceB);
      if (avgA < avgB)
        return 1;
      else if (avgA == avgB)
        return 0;
      else
        return -1;
    };

    this.faces.sort(compare);
  }

  untranslate(noSort) {
    const center = this.center;
    const trans = new Movement().translate(center);
    this.move(new Movement(trans.inv, trans.move), noSort);
    return trans;
  }
};

export default Shape;
