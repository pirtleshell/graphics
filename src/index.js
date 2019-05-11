'use strict';

import { Poly2D, Poly3D } from './objs/Poly';
import World from './objs/World';

import diamond from './data/diamond.xyz'
import './style.css';

function init() {
  const body = document.querySelector('body')
  const world = new World(body, drawStuff);
  world.init();
}

function drawStuff(ctx) {
  ctx.fillStyle = 'purple';
  let gradient = ctx.createLinearGradient(0, 10, 0, 50);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(1, '#fff');
  ctx.strokeStyle = gradient;
  ctx.font = '48px serif';
  ctx.fillText('Doing some graphics!', 10, 50);
  ctx.strokeText('Doing some graphics!', 10, 50);

  gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(0.5, 'purple');
  gradient.addColorStop(1, '#fff');

  let opts = {
    color: gradient,
    isFilled: true
  };
  let vertices = [[100,100], [500,100], [500,500], [300, 300], [100,500]];
  let poly = new Poly2D(vertices, opts);
  poly.draw(ctx);

  window.diamond = diamond
}

window.onload = init;
