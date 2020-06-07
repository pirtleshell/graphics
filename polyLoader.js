
// .xyz file format:
// numPoints
// comma-delimited list of points
// numPolys
// comma-delimited list of point indices

function readPolys(content) {
  const lines = content.split('\n').filter(l => l.length > 0);

  const numPoints = parseInt(lines[0]);
  const vertices = [];
  for (let i = 0; i < numPoints; i++) {
    let vertex = lines[i + 1];
    vertices.push(vertex.split(',').map(parseFloat));
  }

  const numFaces = parseInt(lines[numPoints + 1]);
  let faces = [];
  for (let i = 0; i < numFaces; i++) {
    let face = lines[numPoints + i + 2].split(',').map(p => parseInt(p));
    if(face.length < 3)
        console.warn(`WARNING! face ${i} has insufficent vertices in current polygon`);
    else if(face.length === 3)
      faces.push(face);
    else
      faces = faces.concat(trianglify(face));
  }

  return `module.exports = () => (${JSON.stringify({vertices, faces})});`;
}

// take a poly of >3 sides and convert it into subtriangles
function trianglify(face) {
  const numTris = face.length - 2;
  const triangles = [];
  for (let i = 1; i <= numTris; i++) {
    const tri = [face[0], face[i], face[i+1]];
    triangles.push(tri);
  }
  return triangles;
}

module.exports = readPolys;
