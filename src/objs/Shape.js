
import { Poly3D } from './Poly';

class Shape {
  constructor(spec) {
    this.faces = spec.faces;
    this.vertices = spec.vertices;

    this.draw = this.draw.bind(this);
  }

  draw(ctx) {
    this.faces.forEach(face => {
      const vertices = face.map(index => this.vertices[index]);
      const poly = new Poly3D(vertices);
      poly.draw(ctx);
    });
  }

  // sortVertices() {
  //   const compare = (a, b) => {
  //     if(a[2] < b[2])
  //       return -1;
  //     else if(a[2] == b[2])
  //       return 0;
  //     else
  //       return 1;
  //   };
  //
  //   this.vertices.sort(compare);
  // }
}

export default Shape;
