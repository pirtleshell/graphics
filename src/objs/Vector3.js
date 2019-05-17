
class Vector3 {
  constructor(x, y, z) {
    this.type = 'vector';
    this.x = x;
    this.y = y;
    this.z = z;
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
