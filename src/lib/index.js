import createCache from './createCache';
import createConfig from './createConfig';
import render from './render';

export default function canvasLightning(canvas, startingConfig = {}) {
  const { config } = createConfig(startingConfig);
  const cache = createCache(config.CACHE_COUNT);
  const ctx = canvas.getContext('2d');

  canvas.width = config.WIDTH;
  canvas.height = config.HEIGHT;
  ctx.lineWidth = config.LINE_WIDTH;
  ctx.strokeStyle = config.COLOR_LIGHT;
  ctx.lineJoin = config.LINE_JOIN;
  ctx.shadowColor = config.COLOR_BLUR;
  ctx.shadowBlur = config.LINE_BLUR;

  let currentFrame = 0;
  let timeout;

  function loop() {
    if (document.hasFocus()) {
      currentFrame++;

      /* Reset canvas.
       * Drawing transparent rect will not clear the canvas, so we have to be more tricky. */
      ctx.save();
      ctx.globalCompositeOperation = 'copy';
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, config.WIDTH, config.HEIGHT);
      ctx.restore();

      /* As an optimization, at some point start reusing existing images. */
      const cachedImage = cache.get(currentFrame);

      if (cachedImage) {
        ctx.drawImage(cachedImage, 0, 0);
      } else {
        render(ctx, config);

        cache.add(canvas);
      }
    }

    timeout = setTimeout(loop, config.LOOP_INTERVAL);
  }

  return {
    start: loop,
    stop: () => clearTimeout(timeout)
  };
}
