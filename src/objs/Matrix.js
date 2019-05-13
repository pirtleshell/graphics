
// library for 4x4 matrices
// column vectors: x | y | z | translation

class Matrix {
  identity() {
    let identity = [[],[],[],[]];
    for(let i = 0; i < 4; i++) {
      for(let j = 0; j < 4; j++) {
        identity[i][j] = i==j ? 1 : 0;
      }
    }
    return identity;
  }

  multiply(A, B) {
    let out = [[],[],[],[]];
    for(let i = 0; i < 4; i++) {
      for(let j = 0; j < 4; j++) {
        out[i][j] = A[i][0]*B[0][j] + A[i][1]*B[1][j] +
                    A[i][2]*B[2][j] + A[i][3]*B[3][j];
      }
    }
    return out;
  }

  translate(mat, inv, dx, dy, dz) {
    let trans = this.identity();
    let transinv = this.identity();

    trans[0][3] = dx;
    trans[1][3] = dy;
    trans[2][3] = dz;

    transinv[0][3] = -dx;
    transinv[1][3] = -dy;
    transinv[2][3] = -dz;

    mat = this.multiply(trans, mat);
    inv = this.multiply(inv, transinv);

    return [mat, inv];
  }

  scale(mat, inv, sx, sy, sz) {
    let scale = this.identity();
    let scaleinv = this.identity();

    scale[0][0] = sx;
    scale[1][1] = sy;
    scale[2][2] = sz;

    scaleinv[0][0] = -sx;
    scaleinv[1][1] = -sy;
    scaleinv[2][2] = -sz;

    mat = this.multiply(scale, mat);
    inv = this.multiply(inv, scaleinv);

    return [mat, inv];
  }

  // takes the cos & sin of the rotation angle
  rotateX(mat, inv, cs, sn) {
    let rotate = this.identity();
    let rotateinv = this.identity();

    rotate[1][1] = cs;
    rotate[1][2] = -sn;
    rotate[2][1] = sn;
    rotate[2][2] = cs;

    rotateinv[1][1] = cs;
    rotateinv[1][2] = sn;
    rotateinv[2][1] = -sn;
    rotateinv[2][2] = cs;

    mat = this.multiply(rotate, mat);
    inv = this.multiply(inv, rotateinv);

    return [mat, inv];
  }

  rotateY(mat, inv, cs, sn) {
    let rotate = this.identity();
    let rotateinv = this.identity();

    rotate[0][0] = cs;
    rotate[0][2] = sn;
    rotate[2][0] = -sn;
    rotate[2][2] = cs;

    rotateinv[0][0] = cs;
    rotateinv[0][2] = -sn;
    rotateinv[2][0] = sn;
    rotateinv[2][2] = cs;

    mat = this.multiply(rotate, mat);
    inv = this.multiply(inv, rotateinv);

    return [mat, inv];
  }

  rotateZ(mat, inv, cs, sn) {
    let rotate = this.identity();
    let rotateinv = this.identity();

    rotate[0][0] = cs;
    rotate[0][1] = -sn;
    rotate[1][0] = sn;
    rotate[1][1] = cs;

    rotateinv[0][0] = cs;
    rotateinv[0][1] = sn;
    rotateinv[1][0] = -sn;
    rotateinv[1][1] = cs;

    mat = this.multiply(rotate, mat);
    inv = this.multiply(inv, rotateinv);

    return [mat, inv];
  }

  multiplyPoints(mat, points) {
    const numPoints = points.length;
    const out = [];
    for(let i = 0; i < numPoints; i++) {
      let x = points[i][0];
      let y = points[i][1];
      let z = points[i][2];
      out[i] = [];

      for (let c = 0; c < 3; c++) {
        out[i][c] = x*mat[c][0] + y*mat[c][1] + z*mat[c][2] + mat[c][3]
      }
    }
    return out;
  }
}

module.exports = Matrix
