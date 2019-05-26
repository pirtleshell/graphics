
class Movement {
  constructor(moveMatrix, invMatrix) {
    this.move = moveMatrix ? moveMatrix : this.identity();
    this.inv = invMatrix ? invMatrix : this.identity();
  }

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

  applyMatrix(move, inv) {
    this.move = this.multiply(move, this.move);
    this.inv = this.multiply(this.inv, inv);
    return this;
  }

  applyMovement(movement) {
    this.applyMatrix(movement.move, movement.inv);
    return this;
  }

  invert() {
    let move = this.move;
    this.move = this.inv;
    this.inv = move;
    return this;
  }

  translate(dx, dy, dz) {
    let trans = this.identity();
    let transinv = this.identity();

    if(dx.length == 3) {
      dy = dx[1];
      dz = dx[2];
      dx = dx[0];
    }

    trans[0][3] = dx;
    trans[1][3] = dy;
    trans[2][3] = dz;

    transinv[0][3] = -dx;
    transinv[1][3] = -dy;
    transinv[2][3] = -dz;

    this.applyMatrix(trans, transinv)

    return this;
  }

  translateX(dx) {
    return this.translate(dx, 0, 0);
  }
  translateY(dy) {
    return this.translate(0, dy, 0);
  }
  translateZ(dz) {
    return this.translate(0, 0, dz);
  }

  scale(sx, sy, sz) {
    let scale = this.identity();
    let scaleinv = this.identity();

    scale[0][0] = sx;
    scale[1][1] = sy;
    scale[2][2] = sz;

    scaleinv[0][0] = -sx;
    scaleinv[1][1] = -sy;
    scaleinv[2][2] = -sz;

    this.applyMatrix(scale, scaleinv)

    return this;
  }

  scaleX(sx) {
    return this.scale(sx, 0, 0);
  }
  scaleY(sy) {
    return this.scale(0, sy, 0);
  }
  scaleZ(sz) {
    return this.scale(0, 0, sz);
  }

  // takes the cos & sin of the rotation angle
  rotateX(cs, sn) {
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

    this.applyMatrix(rotate, rotateinv);

    return this;
  }

  rotateY(cs, sn) {
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

    this.applyMatrix(rotate, rotateinv);

    return this;
  }

  rotateZ(cs, sn) {
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

    this.applyMatrix(rotate, rotateinv);

    return this;
  }
}

module.exports = Movement;
