
class World {
  constructor() {
    this.shapes = [];
    this.numPolys = 0;
    this.light = null;
  }

  get numShapes() { return this.shapes.length; }

  get polys() {
    let vertIndexOffset = 0;
    let vertices = [];
    let faces = [];
    this.shapes.forEach((shape, shapeNum) => {
      // add vertices to full list
      vertices = vertices.concat(shape.vertices);
      // offset faces to proper index and return as [vertIndices, shapeNum]
      faces = faces.concat(shape.faces.map(indices => (
        [indices.map(i => i+vertIndexOffset), shapeNum]
      )));
      vertIndexOffset += shape.vertices.length;
    });
    return [vertices, faces];
  }

  add(shape) {
    this.shapes.push(shape);
    this.numPolys += shape.numPolys;
  }
}

export default World;
