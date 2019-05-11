
import './style.css';
import Poly from './objs/Poly';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function init() {
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
}

function resizeCanvas(event) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  clear();
  drawStuff();
}

function clear() {
  ctx.clearRect(0, 0, canvas.height, canvas.width);
}

function drawStuff() {
  ctx.fillStyle = 'purple';
  let gradient = ctx.createLinearGradient(0, 10, 0, 50);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(1, '#fff');
  ctx.strokeStyle = gradient;
  ctx.font = '48px serif';
  ctx.fillText('Doing some graphics!', 10, 50);
  ctx.strokeText('Doing some graphics!', 10, 50);

  gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(0.5, 'purple');
  gradient.addColorStop(1, '#fff');

  let opts = {
    color: gradient,
    isFilled: true
  };
  let vertices = [[100,100], [500,100], [500,500], [300, 300], [100,500]];
  const poly = new Poly(vertices, opts);
  poly.draw(ctx);
}

init();
