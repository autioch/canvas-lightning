/******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// webpack-livereload-plugin
/******/ 	(function() {
/******/ 	  if (typeof window === "undefined") { return };
/******/ 	  var id = "webpack-livereload-plugin-script";
/******/ 	  if (document.getElementById(id)) { return; }
/******/ 	  var el = document.createElement("script");
/******/ 	  el.id = id;
/******/ 	  el.async = true;
/******/ 	  el.src = "//" + location.hostname + ":35729/livereload.js";
/******/ 	  document.getElementsByTagName("head")[0].appendChild(el);
/******/ 	}());
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app/createCache.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = createCache;\nfunction createCache(cacheCount) {\n  var cache = [];\n\n  function add(canvas) {\n    var item = new Image();\n\n    item.src = canvas.toDataURL();\n\n    cache.push(item);\n  }\n\n  function reset() {\n    cache = [];\n  }\n\n  function get(index) {\n    var cachedIndex = index % cacheCount;\n    var cachedItem = cache[cachedIndex];\n\n    return cachedItem;\n  }\n\n  return {\n    add: add,\n    reset: reset,\n    get: get\n  };\n}\n\n//# sourceURL=webpack:///./src/app/createCache.js?");

/***/ }),

/***/ "./src/app/createConfig.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = createConfig;\n/* eslint-disable no-magic-numbers */\n\nvar DEFAULT_CONFIG = {\n  MIN_X: 1,\n  MAX_X: 10,\n  MIN_Y: 2,\n  MAX_Y: 10,\n  LOOP_INTERVAL: 100,\n  LINE_WIDTH: 3,\n  LINE_JOIN: 'miter',\n  COLOR: '#FF0',\n  BACKGROUND: '#000',\n  CACHE_COUNT: 10,\n  WIDTH: 2,\n  HEIGHT: 2\n};\n\nfunction createConfig() {\n  var customConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n  var config = Object.assign({}, DEFAULT_CONFIG, customConfig);\n\n  return {\n    config: config,\n    updateConfig: function updateConfig(newConfig) {\n      return Object.assign(config, newConfig);\n    }\n  };\n}\n\n//# sourceURL=webpack:///./src/app/createConfig.js?");

/***/ }),

/***/ "./src/app/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = lightning;\n\nvar _createCache = __webpack_require__(\"./src/app/createCache.js\");\n\nvar _createCache2 = _interopRequireDefault(_createCache);\n\nvar _createConfig2 = __webpack_require__(\"./src/app/createConfig.js\");\n\nvar _createConfig3 = _interopRequireDefault(_createConfig2);\n\nvar _render = __webpack_require__(\"./src/app/render.js\");\n\nvar _render2 = _interopRequireDefault(_render);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction lightning(canvas) {\n  var startingConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n\n  var _createConfig = (0, _createConfig3.default)(startingConfig),\n      config = _createConfig.config;\n\n  var cache = (0, _createCache2.default)(config.CACHE_COUNT);\n  var ctx = canvas.getContext('2d');\n\n  ctx.lineWidth = config.LINE_WIDTH;\n  ctx.strokeStyle = config.COLOR;\n  ctx.lineJoin = config.LINE_JOIN;\n\n  var currentFrame = 0;\n  var timeout = void 0;\n\n  function loop() {\n    if (document.hasFocus()) {\n      currentFrame++;\n\n      var cachedImage = cache.get(currentFrame);\n\n      if (cachedImage) {\n        ctx.drawImage(cachedImage, 0, 0);\n      } else {\n        (0, _render2.default)(ctx, config);\n\n        cache.add(canvas);\n      }\n    }\n\n    timeout = setTimeout(loop, config.LOOP_INTERVAL);\n  }\n\n  return {\n    start: loop,\n    stop: function stop() {\n      return clearTimeout(timeout);\n    }\n  };\n}\n\n//# sourceURL=webpack:///./src/app/index.js?");

/***/ }),

/***/ "./src/app/render.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = render;\nvar HALF = 0.5;\n\nvar randomRange = function randomRange(min, max) {\n  return Math.random() * (max - min) + min;\n};\nvar randomDirection = function randomDirection() {\n  return Math.random() > HALF ? 1 : -1;\n}; // eslint-disable-line no-confusing-arrow\n\nfunction render(ctx, config) {\n  var halfWidth = Math.floor(config.WIDTH * HALF);\n\n  /* Reset canvas. */\n  ctx.fillStyle = config.BACKGROUND;\n  ctx.fillRect(0, 0, config.WIDTH, config.HEIGHT);\n\n  /* Setup starting point. */\n  ctx.beginPath();\n  ctx.moveTo(halfWidth, 0);\n  var currentVertical = 0;\n\n  /* Keep rendering until bottom of canvas is reached. */\n  while (currentVertical < config.HEIGHT) {\n    var horizontalMove = randomRange(config.MIN_X, config.MAX_X);\n    var verticaMove = randomRange(config.MIN_Y, config.MAX_Y);\n    var direction = randomDirection();\n\n    currentVertical += verticaMove;\n    ctx.lineTo(halfWidth + direction * horizontalMove, currentVertical);\n  }\n\n  ctx.stroke();\n}\n\n//# sourceURL=webpack:///./src/app/render.js?");

/***/ }),

/***/ "./src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _app = __webpack_require__(\"./src/app/index.js\");\n\nvar _app2 = _interopRequireDefault(_app);\n\n__webpack_require__(\"./src/styles.scss\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar canvas = document.querySelector('canvas');\nvar app = void 0;\n\nfunction setupApp() {\n  var WIDTH = window.innerWidth;\n  var HEIGHT = window.innerHeight;\n\n  canvas.width = WIDTH;\n  canvas.height = HEIGHT;\n\n  return (0, _app2.default)(canvas, {\n    WIDTH: WIDTH,\n    HEIGHT: HEIGHT\n  });\n}\n\nfunction start() {\n  app && app.stop();\n  app = setupApp();\n  app.start();\n}\n\nwindow.addEventListener('resize', start);\n\nstart();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/styles.scss":
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/styles.scss?");

/***/ })

/******/ });