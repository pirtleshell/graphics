
// .xyz file format:
// numPoints
// comma-delimited list of points
// numPolys
// comma-delimited list of point indices

function readPolys(content) {
  const lines = content.split('\n');

  const numPoints = parseInt(lines[0]);
  const vertices = [];
  for (let i = 0; i < numPoints; i++) {
    let vertex = lines[i + 1];
    vertices.push(vertex.split(',').map(parseFloat));
  }

  const numFaces = parseInt(lines[numPoints + 1]);
  const faces = []
  for (let i = 0; i < numFaces; i++) {
    let face = lines[numPoints + i + 2];
    faces.push(face.split(',').map(p => parseInt(p)));
  }

  return `module.exports = () => (${JSON.stringify({vertices, faces})})`;
}

module.exports = readPolys;
