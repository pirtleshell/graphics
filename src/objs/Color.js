
import Vector3 from './Vector3';

const parseHex = (hexStr) => {
  let r, g, b;
  if (hexStr.length === 4) {
    r = parseInt(hexStr[1], 16) / 15;
    g = parseInt(hexStr[2], 16) / 15;
    b = parseInt(hexStr[3], 16) / 15;
  } else if (hexStr.length == 7) {
    r = parseInt(hexStr[1] + hexStr[2], 16) / 255;
    g = parseInt(hexStr[3] + hexStr[4], 16) / 255;
    b = parseInt(hexStr[5] + hexStr[6], 16) / 255;
  }
  return [r, g, b];
};

class Color extends Vector3 {
  constructor(rIn, gIn, bIn) {
    let [r, g, b] = [rIn, gIn, bIn];
    // let r, g, b;
    if (typeof rIn === 'string' && rIn[0] === '#') {
      [r, g, b] = parseHex(rIn);
    } else if (rIn.constructor.name === 'Color' || rIn.constructor.name === 'Vector3') {
      r = rIn[0];
      g = rIn[1];
      b = rIn[2];
    }

    super(r, g, b);
  }

  get hexStr() {
    return '#' +
      parseInt(this[0] * 255).toString(16).padStart(2, '0') +
      parseInt(this[1] * 255).toString(16).padStart(2, '0') +
      parseInt(this[2] * 255).toString(16).padStart(2, '0');
  }
}

export default Color;
