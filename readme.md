# Canvas lightning app

Canvas lightning generator.

See the [example](https://autioch.github.io/lightning).

## Installation

Run command:
`npm i canvas-lightning`

## Usage
```javascript
import canvasLightning from 'canvas-lightning';

const canvasEl = document.querySelector('canvas');

const app = canvasLightning(canvasEl, {
  WIDTH: 100,
  HEIGHT: 200
});

app.start();

window.addEventListener('resize', start);

/* Cleanup*/
app.stop();

```

## Configuration


```javascript
{
  /* Minimal deviation from center */
  MIN_X: 1,

  /* Maximum deviation from center */
  MAX_X: 10,

  /* Minimum step down */
  MIN_Y: 2,

  /* Maximum step down */
  MAX_Y: 10,

  /* Refresh interval. */
  LOOP_INTERVAL: 100,

  /* Thickness of the lightning. */
  LINE_WIDTH: 3,

  /* Blur surrounding the line. */
  LINE_BLUR: 10,

  /* How are the curves rounded? */
  LINE_JOIN: 'miter',

  /* Color of the lightning */
  COLOR_LIGHT: '#fff',

  /* Color of the surrounding blur. */
  COLOR_BLUR: '#0ff',

  /* Background color.  */
  COLOR_BG: 'transparent',

  /* How many images should be cached.
   * After filing in the cache, no more renders will be done,
   * but existing snapshots will be used. */
  CACHE_COUNT: 10,

  /* Size of the canvas to be set. */
  WIDTH: 2,
  HEIGHT: 2
}
```
