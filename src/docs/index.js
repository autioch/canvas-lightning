import canvasLightning from '../lib';
import './styles.scss';

const canvas = document.querySelector('canvas');
let app;

function start() {
  app && app.stop();

  app = canvasLightning(canvas, {
    WIDTH: window.innerWidth,
    HEIGHT: window.innerHeight
  });

  app.start();
}

window.addEventListener('resize', start);

start();
