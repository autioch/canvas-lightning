/* eslint-disable max-lines */
/* eslint-disable id-length */
/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-statements */
/* eslint-disable no-use-before-define */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-unused-vars */
/* eslint-disable one-var */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable no-shadow */
/* eslint-disable max-params */
/* eslint-disable func-names */
/* eslint-disable no-invalid-this */
/* eslint-disable sort-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-multi-assign */
/* eslint-disable no-loop-func */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undefined */
/* eslint-disable vars-on-top */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-var */
/* eslint-disable no-negated-condition */

// forked from akm2's "Lightning Points (Lightning 2)" https://jsdo.it/akm2/amk0
// https://codepen.io/anon/pen/EOvOrX?editors=0010

/**
 * Using PerlinNoise class
 * Using Point class
 * @see https://jsdo.it/akm2/fhMC
 */

const DRAG_POINT_NUM = 4;
const DRAG_POINT_MAX_NUM = 8;
const CHILD_NUM = 2;
const BACKGROUND_COLOR = 'rgba(0, 15, 20, 0.8)';

// Color
const H = 195;
const S = 100;
const L_MAX = 85;
const L_MIN = 45;

let canvas;
let context;
const dragPoints = [];
const mouse = new Point();
let baseLine;
let lightningLine;

// alias
const random = Math.random;
const floor = Math.floor;

function init() {
  document.body.style.backgroundColor = BACKGROUND_COLOR;
  canvas = document.getElementById('c');

  document.addEventListener('resize', resize, false);
  resize();

  let i;

  for (i = 0; i < DRAG_POINT_NUM; i++) {
    dragPoints.push(new DragPoint(canvas.width * random(), canvas.height * random()));
  }

  const baseNoiseOpts = {
    base: 100000,
    amplitude: 0.6,
    speed: 0.02
  };
  const lightningNoiseOpts = {
    base: 90,
    amplitude: 0.2,
    speed: 0.05
  };
  const childNoiseOpts = {
    base: 60,
    amplitude: 0.8,
    speed: 0.08
  };

  baseLine = new NoiseLine(8, baseNoiseOpts);
  lightningLine = new NoiseLine(16, lightningNoiseOpts);
  for (i = 0; i < CHILD_NUM; i++) {
    lightningLine.createChild(childNoiseOpts);
  }

  // *** Debug
  baseLine.debug = true;

  // *********

  document.addEventListener('mousemove', mouseMove, false);
  document.addEventListener('mousedown', mouseDown, false);
  document.addEventListener('mouseup', mouseUp, false);
  document.addEventListener('dblclick', doubleClick, false);
  document.addEventListener('keydown', keyDown, false);

  setInterval(loop, 1000 / 30);
}

function resize(e) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext('2d');
  context.lineCap = 'round';
}

function mouseMove(e) {
  mouse.set(e.clientX, e.clientY);

  let hit = false;

  for (let i = 0, len = dragPoints.length; i < len; i++) {
    if (dragPoints[i].hitTest(mouse)) {
      hit = true;
      break;
    }
  }
  document.body.style.cursor = hit ? 'pointer' : 'default';
}

function mouseDown(e) {
  let i,
      len;

  for (i = 0, len = dragPoints.length; i < len; i++) {
    if (dragPoints[i].dragStart(mouse)) {
      return;
    }
  }

  for (i = 0; i < len; i++) {
    if (dragPoints[i].hitTest(mouse)) {
      if (len > 1) {
        dragPoints.splice(i, 1);
      }

      return;
    }
  }

  if (len < DRAG_POINT_MAX_NUM) {
    dragPoints.push(new DragPoint(e.clientX, e.clientY));
  } else {
    for (i = 0; i < len - 2; i++) {
      dragPoints[i].kill();
    }
  }
}

function mouseUp(e) {
  for (let i = 0, len = dragPoints.length; i < len; i++) {
    dragPoints[i].dragEnd(mouse);
  }
}

function doubleClick(e) {
  const len = dragPoints.length;

  if (len < 3) {
    return;
  }
  for (let i = 0; i < len; i++) {
    if (dragPoints[i].hitTest(mouse)) {
      dragPoints[i].kill();

      return;
    }
  }
}

function keyDown(e) {
  if (e.keyCode === 68) { // d key
    Debug.enabled = !Debug.enabled;
  }
}

function loop() {
  context.globalCompositeOperation = 'source-over';
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = 'lighter';

  let i,
      len,
      p;

  const controls = [];

  for (i = 0, len = dragPoints.length; i < len; i++) {
    p = dragPoints[i];
    p.update();
    p.alpha = p.hitTest(mouse) ? 0.75 : 0.2;
    p.draw(context);
    if (p.dead) {
      dragPoints.splice(i, 1);
      i--;
      len--;
      continue;
    }
    if (!p.dying) {
      controls.push(p);
    }
  }

  // 原点からの距離でソート
  controls.sort(sortPoints);

  baseLine.update(controls);

  lightningLine.update(baseLine.points);
  drawLightningBlur(lightningLine, 50, 30);
  drawLightningLine(lightningLine, 0.75, 1, 1, 5);
  drawLightningCap(lightningLine);

  lightningLine.eachChild((child, i) => {
    drawLightningLine(child, 0, 1, 0, 4);
    drawLightningBlur(child, 50, 30);
  });

  Color.l = randomRange(L_MIN, L_MAX);

  // * debug
  Debug.exec();
}

// Array sort callback
function sortPoints(p1, p2) {
  return p1.length() - p2.length();
}

// Lightning draw methods

function drawLightningLine(line, maxAlpha, minAlpha, maxLineW, minLineW) {
  context.beginPath();
  context.strokeStyle = Color.setAlphaToString(randomRange(minAlpha, maxAlpha));
  context.lineWidth = randomRange(minLineW, maxLineW);
  line.eachPoints((p, i) => {
    context[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
  });
  context.stroke();
}

function drawLightningBlur(line, blur, maxSize) {
  let dist;

  context.save();
  context.fillStyle = 'rgba(0, 0, 0, 1)';
  context.shadowBlur = blur;
  context.shadowColor = Color.setAlphaToString();
  context.beginPath();
  line.eachPoints(function(p, i, len) {
    dist = len > 1 ? p.distance(this[i === len - 1 ? i - 1 : i + 1]) : 0;
    if (dist > maxSize) {
      dist = maxSize;
    }
    context.moveTo(p.x + dist, p.y);
    context.arc(p.x, p.y, dist, 0, Math.PI * 2, false);
  });
  context.fill();
  context.restore();
}

function drawLightningCap(line) {
  const points = line.points;
  let p,
      radius,
      gradient;

  for (let i = 0, len = points.length; i < len; i += len - 1) {
    p = points[i];
    radius = randomRange(3, 8);
    gradient = context.createRadialGradient(p.x, p.y, radius / 3, p.x, p.y, radius);
    gradient.addColorStop(0, Color.setAlphaToString(1));
    gradient.addColorStop(1, Color.setAlphaToString(0));
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
    context.fill();
  }
}

// Helper

function randomRange(min, max) {
  return random() * (max - min) + min;
}

(function(window) {
  // PerlinNoise.useClassic = true;
  const perlinNoise = new PerlinNoise();

  perlinNoise.octaves(3);

  /**
     * NoiseLine
     *
     * @param segmentsNum 制御点間の分割数
     * @param noiseOptions ノイズのオプション
     */
  function NoiseLine(segmentsNum, noiseOptions) {
    this.segmentsNum = segmentsNum;

    this.noiseOptions = extend({
      base: 30,
      amplitude: 0.5,
      speed: 0.002,
      offset: 0
    }, noiseOptions);

    this.points = [];
    this.lineLength = 0;
    this.children = [];
  }

  NoiseLine.prototype = {
    createChild(noiseOptions) {
      const child = new NoiseLineChild(this, noiseOptions || this.noiseOptions);

      this.children.push(child);

      return child;
    },

    eachChild(callback) {
      const children = this.children;

      for (let i = 0, len = children.length; i < len; i++) {
        callback.call(children, children[i], i, len);
      }
    },

    eachPoints(callback) {
      const points = this.points;

      for (let i = 0, len = points.length; i < len; i++) {
        callback.call(points, points[i], i, len);
      }
    },

    update(controls) {
      let i,
          len;

      // 振り幅の係数として使用するため制御点を全て直線で結んだ距離を取得する
      let lineLength = 0;

      for (i = 0, len = controls.length; i < len; i++) {
        if (i === len - 1) {
          break;
        }
        lineLength += controls[i].distance(controls[i + 1]);
      }
      this.lineLength = lineLength;

      // スプライン曲線を生成してノイズを適用
      this.noise(spline(controls, this.segmentsNum), lineLength);

      // *** Debug
      if (Debug.enabled && this.debug) {
        this.eachPoints((p, i) => {
          Debug.addCommand(() => {
            Debug.point(p.x, p.y, 3, 'blue');
          });
        });
      }

      // *********

      // 最短距離を取得
      this.points = shortest(this.points);

      // *** Debug
      if (Debug.enabled && this.debug) {
        this.eachPoints((p, i) => {
          Debug.addCommand(() => {
            Debug.point(p.x, p.y, 3, 'red');
          });
        });
      }

      // *********

      // 子を更新
      const children = this.children;

      for (i = 0, len = children.length; i < len; i++) {
        children[i].update();
      }
    },

    noise(bases, range) {
      const pointsOld = this.points;
      const points = this.points = [];

      const opts = this.noiseOptions;
      const base = opts.base;
      const amp = opts.amplitude;
      const speed = opts.speed;
      const offset = opts.offset += random() * speed;

      let p,
          next,
          angle,
          sin,
          cos,
          av,
          ax,
          ay,
          bv,
          bx,
          by,
          m,
          px,
          py;

      for (let i = 0, len = bases.length; i < len; i++) {
        p = bases[i];
        next = i === len - 1 ? p : bases[i + 1];

        angle = next.subtract(p).angle();
        sin = Math.sin(angle);
        cos = Math.cos(angle);

        av = range * perlinNoise.noise(i / base - offset, offset) * 0.5 * amp;
        ax = av * sin;
        ay = av * cos;

        bv = range * perlinNoise.noise(i / base + offset, offset) * 0.5 * amp;
        bx = bv * sin;
        by = bv * cos;

        m = Math.sin(Math.PI * (i / (len - 1)));

        px = p.x + (ax - bx) * m;
        py = p.y - (ay - by) * m;

        points.push(pointsOld.length ? pointsOld.shift().set(px, py) : new Point(px, py));

        // *** Debug
        if (Debug.enabled && this.debug) {
          Debug.addCommand((function(p, angle) {
            return function() {
              context.save();
              context.translate(p.x, p.y);
              context.rotate(angle);
              this.line(0, 0, 15999, 9990, 'pink', 1);
              this.point(0, 0, 2, 'pink');
              context.restore();
            };
          })(p, angle));
        }

        // *********
      }
    }
  };

  /**
     * NoiseLineChild
     *
     * @super NoiseLine
     */
  function NoiseLineChild(parent, noiseOptions) {
    this.parent = lightningLine;
    this._lastChangeTime = 0;
    NoiseLine.call(this, 0, noiseOptions || lightningLine.noiseOptions);
  }

  NoiseLineChild.prototype = extend({}, NoiseLine.prototype, {
    startStep: 0,
    endStep: 0,

    // Clear super class methods
    createChild: undefined,
    eachChild: undefined,

    update() {
      const parent = this.parent;
      const plen = parent.points.length;

      // 一定時間ごと, あるいは親のポイントの数が子の終了ステップ位置を下回った場合に始点と終点の親からの取得位置を更新する
      const currentTime = new Date().getTime();

      if (
        currentTime - this._lastChangeTime > 10000 * random() ||
                plen < this.endStep
      ) {
        const stepMin = floor(plen / 10);
        const startStep = this.startStep = floor(random() * floor(plen / 3 * 2));

        this.endStep = startStep + stepMin + floor(random() * (plen - startStep - stepMin) + 1);
        this._lastChangeTime = currentTime;
      }

      // 親のポイント配列から取得範囲を切り出す
      const range = parent.points.slice(this.startStep, this.endStep);
      const rangeLen = range.length;

      // 範囲からスプライン曲線の制御点を取得する
      const sep = 2; // 分割数
      const seg = (rangeLen - 1) / sep;
      const controls = [];
      let i,
          j;

      for (i = 0; i <= sep; i++) {
        j = Math.floor(seg * i);
        controls.push(range[j]);
      }

      // *** Debug
      if (Debug.enabled) {
        (function() {
          for (var i = 0, len = controls.length - 1, p, n; i < len; i++) {
            p = controls[i];
            Debug.addCommand((function(p) {
              return function() {
                Debug.point(p.x, p.y, 3, 'yellow');
              };
            })(p));
          }
        })();
      }

      // *********

      // スプライン曲線を生成
      const base = spline(controls, Math.floor(rangeLen / 3));

      // *** Debug
      if (Debug.enabled) {
        (function() {
          for (var i = 0, len = base.length - 1, p, n; i < len; i++) {
            p = base[i];
            n = base[i + 50];
            Debug.addCommand((function(p, n) {
              return function() {
                Debug.line(p.x, p.y, n.x, n.y, 'yellow', 1);
              };
            })(p, n));
          }
        })();
      }

      // *********

      // ノイズを適用
      this.noise(base, controls[0].distance(controls[2]));

      // 最短距離を取得
      this.points = shortest(this.points);
    }
  });

  function spline(controls, segmentsNum) {
    // スプライン補完用に配列の前後にラインの始点, 終点の参照をそれぞれ複製する
    controls.unshift(controls[0]);
    controls.push(controls[controls.length - 1]);

    // スプライン曲線のポイントを取得
    const points = [];
    let p0,
        p1,
        p2,
        p3,
        t;
    let j;

    for (let i = 0, len = controls.length - 3; i < len; i++) {
      p0 = controls[i];
      p1 = controls[i + 1];
      p2 = controls[i + 2];
      p3 = controls[i + 3];

      for (j = 0; j < segmentsNum; j++) {
        t = (j + 1) / segmentsNum;

        points.push(new Point(
          catmullRom(p0.x, p1.x, p2.x, p3.x, t),
          catmullRom(p0.y, p1.y, p2.y, p3.y, t)
        ));
      }
    }

    // 補完用に追加した参照を削除
    controls.pop();

    // 削除のついでに描画の始点として追加
    points.unshift(controls.shift());

    return points;
  }

  /**
     * Catmull-Rom Spline Curve
     *
     * @see http://l00oo.oo00l.com/blog/archives/264
     */
  function catmullRom(p0, p1, p2, p3, t) {
    const v0 = (p2 - p0) / 2;
    const v1 = (p3 - p1) / 2;

    return (2 * p1 - 2 * p2 + v0 + v1) * t * t * t +
            (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t * t + v0 * t + p1;
  }

  function shortest(bases) {
    const points = [bases[0]];
    let p,
        j,
        p2,
        dist,
        minDist,
        k;

    for (let i = 0, len = bases.length; i < len; i++) {
      p = bases[i];

      minDist = Infinity;
      k = -1;
      for (j = i; j < len; j++) {
        if ((p2 = bases[j]) !== p && (dist = p.distance(p2)) < minDist) {
          minDist = dist;
          k = j;
        }
      }
      if (k < 0) {
        break;
      }

      points.push(bases[k]);
      i = k - 1;
    }

    return points;
  }

  window.NoiseLine = NoiseLine;
})(window);

/**
 * DragPoint
 *
 * @super Point https://jsdo.it/akm2/fhMC
 */
function DragPoint(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 50;
  this.alpha = 0.2;
  this.dragging = false;
  this.dying = false;
  this.dead = false;

  this._v = new Point(randomRange(-3, 3), randomRange(-3, 3));

  this._mouse = null;
  this._latestMouse = new Point();
  this._mouseDist = null;

  this._currentAlpha = 0;
  this._currentRadius = 0;
}

DragPoint.prototype = extend({}, Point.prototype, {
  hitTest(mouse) {
    return this.distance(mouse) < this.radius;
  },

  dragStart(mouse) {
    if (this.hitTest(mouse)) {
      this._mouse = mouse;
      this._mouseDist = this.subtract(this._mouse);
      this.dragging = true;
    }

    return this.dragging;
  },

  dragEnd() {
    if (this.dragging && this._latestMouse) {
      this._v.set(this._mouse.subtract(this._latestMouse));
    }
    this.dragging = false;
    this._mouse = this._mouseDist = null;
  },

  kill() {
    this.dying = true;
    this.radius = 0;
  },

  update(mouse) {
    const v = this._v;

    if (this._mouse) {
      this.set(this._mouse.add(this._mouseDist));
      this._latestMouse.set(this._mouse);
    } else {
      this.offset(v);
      v.x *= 0.97;
      v.y *= 0.97;

      const vlen = v.length();

      if (vlen > 30) {
        v.normalize(30);
      } else if (vlen < 1) {
        v.normalize(1);
      }
    }

    const radius = this.radius;

    if (this.x < radius) {
      this.x = this.radius;
      if (v.x < 0) {
        v.x *= -1;
      }
    } else if (this.x > canvas.width - radius) {
      this.x = canvas.width - radius;
      if (v.x > 0) {
        v.x *= -1;
      }
    }

    if (this.y < radius) {
      this.y = radius;
      if (v.y < 0) {
        v.y *= -1;
      }
    } else if (this.y > canvas.height - radius) {
      this.y = canvas.height - radius;
      if (v.y > 0) {
        v.y *= -1;
      }
    }

    let d;

    // Alpha

    d = this.alpha - this._currentAlpha;
    if ((d < 0 ? -d : d) > 0.001) {
      this._currentAlpha += d * 0.1;
    }

    // Radius
    d = radius - this._currentRadius;
    if ((d < 0 ? -d : d) > 0.01) {
      this._currentRadius += d * 0.35;
    } else if (this.dying) {
      this.dead = true;
    }
    this._currentRadius *= randomRange(0.9, 1);
  },

  draw(ctx) {
    const radius = this._currentRadius;
    const gradient = ctx.createRadialGradient(this.x, this.y, radius / 3, this.x, this.y, radius);

    gradient.addColorStop(0, Color.setAlphaToString(this._currentAlpha));
    gradient.addColorStop(1, Color.setAlphaToString(0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(this.x + radius, this.y);
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
});

/**
 * Color
 */
var Color = new function() {
  this.h = H;
  this.s = S;
  this.l = L_MAX;

  this.setAlphaToString = function(alpha) {
    if (typeof alpha === 'undefined' || alpha === null) {
      return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    }

    return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${alpha})`;
  };
}();

// Init

window.onload = function() {
  init();
};

// メインスクリプトここまで

// -----------------------------------------
// DEBUG
// -----------------------------------------

var Debug = {
  enabled: false,
  _commands: [],

  addCommand(fn) {
    if (this.enabled) {
      this._commands.push(fn);
    }
  },

  exec() {
    if (this.enabled) {
      const commands = this._commands;

      for (let i = 0, len = commands.length; i < len; i++) {
        commands[i].call(this);
      }
      this._commands = [];
    }
  },

  line(x1, y1, x2, y2, color, lineWidth) {
    if (this.enabled) {
      context.save();
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = color;
      context.lineWidth = !lineWidth ? 1 : lineWidth;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.restore();
    }
  },

  point(x, y, radius, color) {
    if (this.enabled) {
      context.save();
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, false);
      context.fill();
      context.restore();
    }
  }
};
