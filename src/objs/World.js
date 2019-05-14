
class World {
  constructor(div, customDrawFunc) {
    while(div.firstChild) div.removeChild(div.firstChild);

    this.container = div;
    this.initialized = false;
    this.customDrawFunc = customDrawFunc;
    this.shapes = [];
  }

  init() {
    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.container.addEventListener('resize', this.resize, false);
    this.resize();

    this.initialized = true;
  }

  add(shape, doRedraw) {
    this.shapes.push(shape);
    if(doRedraw)
      this.draw();
  }

  clearScreen() {
    this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width);
  }

  draw() {
    if(this.initialized)
    {
      // handle drawing things
      this.shapes.forEach(obj => obj.draw(this.ctx));
      if(this.customDrawFunc)
        this.customDrawFunc(this.ctx);
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    this.clearScreen();
    this.draw();
  }
}

export default World;
