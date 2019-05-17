
class Vector3 {
  constructor(x, y, z) {
    if(Array.isArray(x)) {
      if(x.length !== 3)
        throw `Vector3 expects an array of length 3, got ${x.length}.`;
      y = x[1];
      z = x[2];
      x = x[0];
    }
    else if(x.constructor.name === 'Vector3') {
      y = x.y;
      z = x.z;
      x = x.x;
    }

    this.type = 'vector';

    this.x = x;
    this[0] = x;

    this.y = y;
    this[1] = y;

    this.z = z;
    this[2] = z;
  }

  direction() {
    const magnitude = this.magnitude;
    return new Vector3(
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude
    );
  }

  magnitude() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  }

  distanceFrom(v) {
    const i = v.x - this.x;
    const j = v.y - this.y;
    const k = v.z - this.z;
    return Math.sqrt(i*i + j*j + k*k);
  }

  dot(v) {
    return v.x*this.x + v.y*this.y + v.z*this.z;
  }

  cross(v) {
    const a = this.y*v.z - this.z*v.y;
    const b = this.z*v.x - this.x*v.z;
    const c = this.x*v.y - this.y*v.x;
    return new Vector3(a, b, c);
  }

  to(v) {
    return new Vector3(
      this.x - v.x,
      this.y - v.y,
      this.z - v.z
    );
  }
}

export default Vector3;
