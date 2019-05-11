
import './style.css';

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


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
  ctx.font = '48px serif';
  ctx.fillText('Doing some graphics!', 10, 50);
}

init();
