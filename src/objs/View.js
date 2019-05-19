
import Vector3 from './Vector3';

class View {
  constructor(displayDiv, position, options) {
    this.container = displayDiv;
    this.position = new Vector3(position);

    this.options = Object.assign({
      clearFunc: null,
      postDraw: null,
    }, options);

    this.canvas = this.getCanvas();
    this.resizeCanvas();

    this.ctx = this.canvas.getContext('2d');

    this.container.addEventListener('resize', this.resizeCanvas, false);
  }

  animate(world, maxSteps) {
    let currStep = 0;
    const doStep = () => {
      world.shapes.forEach(shape => {
        if(shape.onAnimate)
          shape.onAnimate(shape, world);
      })
      this.clear();
      this.draw(world);
      if (currStep++ < maxSteps)
        window.requestAnimationFrame(doStep);
    };

    window.requestAnimationFrame(doStep);
  }

  clear() {
    if (this.options.clearFunc)
      return this.options.clearFunc(this.ctx);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(world) {
    this.clear();
    if((world.shapes || []).length) {
      world.sortedPolys.forEach((poly, i) => {
        if(world.light != null)
        {
          let initColor = poly.color;
          const normal = poly.normal();
          poly.color = world.light.calcColor(
            poly.vertices[0], normal, initColor
          );
        }
        poly.draw(this.ctx)
      });
    }

    if(this.options.postDraw)
      this.options.postDraw(this.ctx);
  }

  getCanvas() {
    if (this.canvas != null) return this.canvas;
    if (this.container.constructor.name === 'HTMLCanvasElement')
      return this.container;
    if (this.container.querySelector('canvas') !== null)
      return this.container.querySelector('canvas');

    // empty container
    while(this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);
    return canvas;
  }

  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
}

export default View;
