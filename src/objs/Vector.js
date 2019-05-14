
class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  direction() {
    const magnitude = Math.sqrt(x*x + y*y + z*z);
    return new Vector(
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude
    );
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
    return new Vector(a, b, c);
  }
}
