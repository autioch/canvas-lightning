(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lib = __webpack_require__("./src/lib/index.js");

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _lib2.default;

/***/ }),

/***/ "./src/lib/createCache.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCache;
function createCache(cacheCount) {
  var cache = [];

  function add(canvas) {
    var item = new Image();

    item.src = canvas.toDataURL();

    cache.push(item);
  }

  function reset() {
    cache = [];
  }

  function get(index) {
    var cachedIndex = index % cacheCount;
    var cachedItem = cache[cachedIndex];

    return cachedItem;
  }

  return {
    add: add,
    reset: reset,
    get: get
  };
}

/***/ }),

/***/ "./src/lib/createConfig.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createConfig;
/* eslint-disable no-magic-numbers */

var DEFAULT_CONFIG = {
  MIN_X: 1,
  MAX_X: 10,
  MIN_Y: 2,
  MAX_Y: 10,
  LOOP_INTERVAL: 100,
  LINE_WIDTH: 3,
  LINE_BLUR: 10,
  LINE_JOIN: 'miter',
  COLOR_LIGHT: '#fff',
  COLOR_BLUR: '#0ff',
  COLOR_BG: '#000',
  CACHE_COUNT: 10,
  WIDTH: 2,
  HEIGHT: 2
};

function createConfig() {
  var customConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = Object.assign({}, DEFAULT_CONFIG, customConfig);

  return {
    config: config,
    updateConfig: function updateConfig(newConfig) {
      return Object.assign(config, newConfig);
    }
  };
}

/***/ }),

/***/ "./src/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = canvasLightning;

var _createCache = __webpack_require__("./src/lib/createCache.js");

var _createCache2 = _interopRequireDefault(_createCache);

var _createConfig2 = __webpack_require__("./src/lib/createConfig.js");

var _createConfig3 = _interopRequireDefault(_createConfig2);

var _render = __webpack_require__("./src/lib/render.js");

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function canvasLightning(canvas) {
  var startingConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _createConfig = (0, _createConfig3.default)(startingConfig),
      config = _createConfig.config;

  var cache = (0, _createCache2.default)(config.CACHE_COUNT);
  var ctx = canvas.getContext('2d');

  canvas.width = config.WIDTH;
  canvas.height = config.HEIGHT;
  ctx.lineWidth = config.LINE_WIDTH;
  ctx.strokeStyle = config.COLOR_LIGHT;
  ctx.lineJoin = config.LINE_JOIN;
  ctx.shadowColor = config.COLOR_BLUR;
  ctx.shadowBlur = config.LINE_BLUR;

  var currentFrame = 0;
  var timeout = void 0;

  function loop() {
    if (document.hasFocus()) {
      currentFrame++;

      /* Reset canvas.
       * Drawing transparent rect will not clear the canvas, so we have to be more tricky. */
      ctx.save();

      ctx.globalCompositeOperation = 'copy';

      // ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, config.WIDTH, config.HEIGHT);
      ctx.restore();

      var cachedImage = cache.get(currentFrame);

      if (cachedImage) {
        ctx.drawImage(cachedImage, 0, 0);
      } else {
        (0, _render2.default)(ctx, config);

        cache.add(canvas);
      }
    }

    timeout = setTimeout(loop, config.LOOP_INTERVAL);
  }

  return {
    start: loop,
    stop: function stop() {
      return clearTimeout(timeout);
    }
  };
}

/***/ }),

/***/ "./src/lib/render.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;
var HALF = 0.5;

var randomRange = function randomRange(min, max) {
  return Math.random() * (max - min) + min;
};
var randomDirection = function randomDirection() {
  return Math.random() > HALF ? 1 : -1;
}; // eslint-disable-line no-confusing-arrow

function render(ctx, config) {
  var halfWidth = Math.floor(config.WIDTH * HALF);

  /* Setup starting point. */
  ctx.beginPath();
  ctx.moveTo(halfWidth, 0);
  var currentVertical = 0;

  /* Keep rendering until bottom of canvas is reached. */
  while (currentVertical < config.HEIGHT) {
    var horizontalMove = randomRange(config.MIN_X, config.MAX_X);
    var verticaMove = randomRange(config.MIN_Y, config.MAX_Y);
    var direction = randomDirection();

    currentVertical += verticaMove;
    ctx.lineTo(halfWidth + direction * horizontalMove, currentVertical);
  }

  ctx.stroke();
}

/***/ })

/******/ });
});