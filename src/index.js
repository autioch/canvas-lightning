import lightningApp from './app';
import './styles.scss';

const canvas = document.querySelector('canvas');
let app;

function setupApp() {
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  return lightningApp(canvas, {
    WIDTH,
    HEIGHT
  });
}

function start() {
  app && app.stop();
  app = setupApp();
  app.start();
}

window.addEventListener('resize', start);

start();
