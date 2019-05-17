'use strict';

import Movement from './objs/Movement';
import Shape from './objs/Shape';
import World from './objs/World';

import diamond from './data/diamond.xyz';
import sphere from './data/sphere.xyz';
import stegosaurus from './data/stegosaurus.xyz';
import torus from './data/torus.xyz';
import './style.css';

function init() {
  const body = document.querySelector('body')
  const world = new World(body, drawStuff);
  world.init();

  setupObjects(world);

  // world.draw();
  world.animate(360*3);
}

function setupObjects(world) {
  // 1 deg
  let deg = Math.PI / 180;
  let cs1 = Math.cos(deg);
  let sn1 = Math.sin(deg);
  let rotateX = new Movement().rotateX(cs1, sn1);
  let rotateY = new Movement().rotateY(cs1, sn1);

  let obj; let move;

  obj = new Shape(torus());
  obj.onAnimate = o => {
    const trans = o.untranslate(1);
    o.move(rotateY);
    o.move(trans);
  };
  move = new Movement()
    .scale(3, 10, 10)
    .rotateZ(0, 1)
    .rotateX(Math.cos(-15*deg), Math.sin(-15*deg))
    .translate(0, -7, 40);
  obj.move(move);
  world.add(obj);

  obj = new Shape(sphere());
  obj.onAnimate = o => {
    const trans = o.untranslate(1);
    o.move(rotateX);
    o.move(trans);
  };
  move = new Movement()
    .scale(2/5, 2/5, 2/5)
    .translate(0, -7, 40);
  obj.move(move);
  world.add(obj);

  obj = new Shape(sphere());
  obj.onAnimate = o => {
    const trans = o.untranslate(1);
    o.move(rotateX);
    o.move(trans);
  };
  move = new Movement()
    .scale(1/5, 1/5, 1/5)
    .translate(30, 0, 40);
  obj.move(move);
  world.add(obj);

  obj = new Shape(stegosaurus());
  obj.onAnimate = o => {
    const trans = o.untranslate(1);
    o.move(rotateY);
    o.move(trans);
  };
  move = new Movement()
    .scale(3, 3, 3)
    .rotateX(Math.cos(-90*deg), Math.sin(-90*deg))
    .rotateZ(Math.cos(-12*deg), Math.sin(-12*deg))
    .rotateY(0, -1)
    .translate(0, 20, 40);
  obj.move(move);
  world.add(obj);

  console.log(world);
}

function drawStuff(ctx) {
  ctx.fillStyle = 'purple';
  let gradient = ctx.createLinearGradient(0, 10, 0, 50);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(1, '#fff');
  ctx.strokeStyle = gradient;
  ctx.font = '48px serif';
  const str = 'Doing some graphics!'
  ctx.fillText(str, 10, 50);
  ctx.strokeText(str, 10, 50);
}

window.onload = init;
