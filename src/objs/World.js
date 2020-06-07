
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
    let shapeNums = [];
    this.shapes.forEach((shape, shapeNum) => {
      // add vertices to full list
      shape.vertices.forEach(vertex => {
        vertices.push(vertex);
        shapeNums.push(shapeNum);
      });
      // offset faces to new collated index
      faces = faces.concat(shape.faces.map(indices => (
        indices.map(i => i+vertIndexOffset)
      )));
      vertIndexOffset += shape.vertices.length;
    });
    return [vertices, shapeNums, faces];
  }

  add(shape) {
    this.shapes.push(shape);
    this.numPolys += shape.numPolys;
  }
};

export default World;
