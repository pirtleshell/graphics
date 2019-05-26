
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

    this.x = x;
    this[0] = x;

    this.y = y;
    this[1] = y;

    this.z = z;
    this[2] = z;

    this.length = 3;
  }

  // returns unit vector of direction
  direction() {
    const magnitude = this.magnitude();
    return new Vector3(
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude
    );
  }

  // returns vector length
  magnitude() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  }

  // distance from this to target
  distance(target) {
    const v = this.to(target);
    return v.magnitude();
  }

  // dot product
  dot(v) {
    return v.x*this.x + v.y*this.y + v.z*this.z;
  }

  // cross product
  cross(v) {
    const a = this.y*v.z - this.z*v.y;
    const b = this.z*v.x - this.x*v.z;
    const c = this.x*v.y - this.y*v.x;
    return new this.constructor(a, b, c);
  }

  scale(s) {
    return new this.constructor(this.x*s, this.y*s, this.z*s);
  }

  // returns a vector pointing from this to target
  to(target) {
    return new this.constructor(
      target.x - this.x,
      target.y - this.y,
      target.z - this.z
    );
  }
}

export default Vector3;
