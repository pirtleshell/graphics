
import { Poly3D } from './Poly';

class Shape {
  constructor(spec) {
    this.faces = spec.faces;
    this.vertices = spec.vertices;
    this.moves = []

    this.draw = this.draw.bind(this);
  }

  get numPoints() { return this.vertices.length; }

  draw(ctx) {
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

    this.moves.push(movement);
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
}

export default Shape;
