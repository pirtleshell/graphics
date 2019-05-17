
class World {
  constructor(div, customDrawFunc) {
    while(div.firstChild) div.removeChild(div.firstChild);

    this.container = div;
    this.initialized = false;
    this.customDrawFunc = customDrawFunc;

    this.shapes = [];
    this.numPolys = 0;
  }

  get numShapes() { return this.shapes.length; }
  get sortedPolys() {
    const polys = this.shapes.map(shape => shape.sortedPolys);
    let sortedPolys = [];

    const mergeSortedPolyLists = (A, B) => {
      const out = [];
      const size = A.length + B.length;
      let [a, b] = [0, 0];
      for (var i = 0; i < size; i++) {
        if(a == A.length) return out.concat(B.slice(b));
        if(b == B.length) return out.concat(A.slice(a));

        if(A[a].dist >= B[b].dist)
          out.push(A[a++]);
        else
          out.push(B[b++]);
      }
      return out;
    }
    polys.forEach((p, i) => {
      sortedPolys = mergeSortedPolyLists(sortedPolys, p);
    });

    return sortedPolys;
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
    this.numPolys += shape.numPolys;
    if(doRedraw)
      this.draw();
  }

  animate(maxSteps) {
    let currStep = 0;
    const doStep = () => {
      this.shapes.forEach(shape => {
        if(shape.onAnimate)
          shape.onAnimate(shape, this);
      })
      this.clearScreen();
      this.draw();
      if (currStep++ < maxSteps)
        window.requestAnimationFrame(doStep);
    };

    window.requestAnimationFrame(doStep);
  }

  clearScreen() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    if(this.initialized && this.shapes.length)
      this.sortedPolys.forEach(poly => {
        poly.draw(this.ctx)
      });

    if(this.customDrawFunc)
      this.customDrawFunc(this.ctx);
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
