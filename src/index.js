'use strict';

import Shape from './objs/Shape';
import World from './objs/World';

import diamond from './data/diamond.xyz';
import sphere from './data/sphere.xyz';
import './style.css';

function init() {
  const body = document.querySelector('body')
  const world = new World(body, drawStuff);
  world.init();
  setupObjects(world);
}

function setupObjects(world) {
  const obj = new Shape(sphere);
  world.add(obj);
  world.draw();
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

  // gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  // gradient.addColorStop(0, '#000');
  // gradient.addColorStop(0.5, 'purple');
  // gradient.addColorStop(1, '#fff');
  //
  // let opts = {
  //   color: gradient,
  //   isFilled: true
  // };
  // let vertices = [[100,100], [500,100], [500,500], [300, 300], [100,500]];
  // let poly = new Poly2D(vertices, opts);
  // poly.draw(ctx);
  //
  // window.diamond = diamond
  //
  // ctx.fillStyle = '#f00'
  // ctx.beginPath();
  // ctx.arc(300, 300, 50, 0, 2*Math.PI);
  // ctx.closePath();
  // ctx.fill();

  // window.sphere = sphere;
  //
  // sphere.faces.forEach(face => {
  //   const vertices = face.map(index => sphere.vertices[index]);
  //   const poly = new Poly3D(vertices);
  //   poly.draw(ctx);
  // });
}

window.onload = init;
