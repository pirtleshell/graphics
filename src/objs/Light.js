
import Vector3 from './Vector3';

class Light extends Vector3 {
  constructor(x, y, z) {
    super(x, y, z);
    this.ambient = 0.2;
    this.diffusion = 0.7;
    this.specularPower = 70;
  }

  calcColor(position, unitNormal, color) {
    let diffuse, specular;
    const light = position.to(this).direction();
    const eye = position.to(new Vector3(0, 0, 0)).direction();

    const alpha = unitNormal.dot(light);
    if (alpha > 0)
      diffuse = alpha * this.diffusion;
    else
      diffuse = 0;

    const r =  light.to(unitNormal.scale(2*alpha));
    const beta = eye.dot(r);
    if (beta > 0)
      specular = Math.pow(beta, this.specularPower);
    else
      specular = 0;

    const intensity = this.ambient + diffuse + (1 - this.ambient - this.diffusion)*specular;
    return color.scale(intensity);
  }
}

export default Light;
