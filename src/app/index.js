import createCache from './createCache';
import createConfig from './createConfig';
import render from './render';

export default function lightning(canvas, startingConfig = {}) {
  const { config } = createConfig(startingConfig);
  const cache = createCache(config.CACHE_COUNT);
  const ctx = canvas.getContext('2d');

  ctx.lineWidth = config.LINE_WIDTH;
  ctx.strokeStyle = config.COLOR;
  ctx.lineJoin = config.LINE_JOIN;

  let currentFrame = 0;
  let timeout;

  function loop() {
    if (document.hasFocus()) {
      currentFrame++;

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
