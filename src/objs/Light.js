
import Color from './Color';
import Vector3 from './Vector3';

class Light extends Vector3 {
  constructor(x, y, z) {
    super(x, y, z);
    this.ambient = 0.2;
    this.diffusion = 0.7;
    this.specularPower = 70;
  }

  calcColor(eyePosition, positionIn, unitNormal, colorIn) {
    const color = new Color(colorIn);
    const position = new Vector3(positionIn);

    const light = position.to(this).direction();
    const eye = position.to(eyePosition).direction();

    const alpha = unitNormal.dot(light);
    const diffuse = alpha > 0 ? alpha * this.diffusion : 0;

    const r =  light.to(unitNormal.scale(2*alpha));
    const beta = eye.dot(r);
    const specular = beta > 0 ? Math.pow(beta, this.specularPower) : 0;

    const intensity = this.ambient + diffuse + (1 - this.ambient - this.diffusion) * specular;
    return color.scale(intensity);
  }
}

export default Light;
