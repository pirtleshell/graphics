'use strict';

import Color from './objs/Color';
import Movement from './objs/Movement';
import Light from './objs/Light';
import Shape from './objs/Shape';
import View from './objs/View';
import World from './objs/World';

import diamond from './data/diamond.xyz';
import sphere from './data/sphere.xyz';
import stegosaurus from './data/stegosaurus.xyz';
import torus from './data/torus.xyz';
import './style.css';

function init() {
  const container = document.querySelector('#content');
  const stars = document.querySelector('#stars');
  const world = new World();
  setupObjects(world);

  const view = new View(container, [0, 0, 0], {
    clearFunc: ctx => {
      ctx.drawImage(stars, 0, 0, ctx.canvas.width, ctx.canvas.height)
    },
    postDraw: drawStuff,
  });

  // world.draw();
  view.animate(world, 360*3);
}

function setupObjects(world) {
  // 1 deg
  let deg = Math.PI / 180;
  let cs1 = Math.cos(3*deg);
  let sn1 = Math.sin(3*deg);
  let rotateX = new Movement().rotateX(cs1, sn1);
  let rotateY = new Movement().rotateY(cs1, sn1);

  let obj; let move;

  const light = new Light(10, 20, 0);
  world.light = light;

  obj = new Shape(torus());
  obj.inverted = 1;
  obj.color = '#bad';
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
  obj.color = '#00f';
  obj.onAnimate = o => {
    const trans = o.untranslate(1);
    o.move(rotateX);
    o.move(trans);
  };
  move = new Movement()
    .scale(2/5, 2/5, 2/5)
    .rotateY(0, 1)
    .translate(0, -7, 40);
  obj.move(move);
  world.add(obj);

  obj = new Shape(sphere());
  obj.color = '#ff0';
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

  // obj = new Shape(stegosaurus());
  // obj.inverted = true;
  // obj.color = '#5e9';
  // obj.onAnimate = o => {
  //   const trans = o.untranslate(1);
  //   o.move(rotateY);
  //   o.move(trans);
  // };
  // move = new Movement()
  //   .scale(3, 3, 3)
  //   .rotateX(Math.cos(-90*deg), Math.sin(-90*deg))
  //   .rotateZ(Math.cos(-12*deg), Math.sin(-12*deg))
  //   .rotateY(0, -1)
    // .translate(0, 20, 40);
  // obj.move(move);
  // world.add(obj);

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
