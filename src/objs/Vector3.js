
class Vector3 {
  constructor(xi, yi, zi) {
    let [x, y, z] = [xi, yi, zi];
    if(Array.isArray(x)) {
      if(xi.length !== 3)
        throw `Vector3 expects an array of length 3, got ${xi.length}.`;
      x = xi[0];
      y = xi[1];
      z = xi[2];
    }
    else if(xi.constructor.name === 'Vector3') {
      x = xi.x;
      y = xi.y;
      z = xi.z;
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
    if (magnitude === 0) {
      // TODO: ???
      return new Vector3(0, 0, 0);
    }
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
};

export default Vector3;
