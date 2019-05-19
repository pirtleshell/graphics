
class World {
  constructor() {
    this.shapes = [];
    this.numPolys = 0;
    this.light = null;
  }

  get numShapes() { return this.shapes.length; }

  get sortedPolys() {
    const polys = this.shapes.map(shape => shape.sortedPolys);
    let sortedPolys = [];

    const mergeSortedPolyLists = (A, B) => {
      const out = [];
      const size = A.length + B.length;
      let [a, b] = [0, 0];
      for (var i = 0; i < size; i++) {
        if(a == A.length) return out.concat(B.slice(b));
        if(b == B.length) return out.concat(A.slice(a));

        if(A[a].dist >= B[b].dist)
          out.push(A[a++]);
        else
          out.push(B[b++]);
      }
      return out;
    }
    polys.forEach((p, i) => {
      sortedPolys = mergeSortedPolyLists(sortedPolys, p);
    });

    return sortedPolys;
  }

  add(shape) {
    this.shapes.push(shape);
    this.numPolys += shape.numPolys;
  }
}

export default World;
