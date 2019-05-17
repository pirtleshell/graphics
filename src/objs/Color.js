
import Vector3 from './Vector3';

class Color extends Vector3 {
  constructor(r, g, b) {
    if (typeof r === 'string' && r[0] === '#') {
      if (r.length === 4) {
        g = parseInt(r[2], 16) / 15;
        b = parseInt(r[3], 16) / 15;
        r = parseInt(r[1], 16) / 15;
      } else if (r.length == 7) {
        g = parseInt(r[3] + r[4], 16) / 255;
        b = parseInt(r[5] + r[6], 16) / 255;
        r = parseInt(r[1] + r[2], 16) / 255;
      }
    } else if (r.constructor.name === 'Color' || r.constructor.name === 'Vector3') {
      g = r[1];
      b = r[2];
      r = r[0];
    }

    super(r, g, b);
  }

  get hexStr() {
    return '#' +
      parseInt(this[0]*255).toString(16).padStart(2, '0') +
      parseInt(this[1]*255).toString(16).padStart(2, '0') +
      parseInt(this[2]*255).toString(16).padStart(2, '0');
  }
}

export default Color;
