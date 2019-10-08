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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/src/canvas/canvas.ts":
/*!**********************************!*\
  !*** ./app/src/canvas/canvas.ts ***!
  \**********************************/
/*! exports provided: Canvas */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Canvas", function() { return Canvas; });
/* harmony import */ var _util_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/eventEmitter */ "./app/src/util/eventEmitter.ts");

var CanvasState;
(function (CanvasState) {
    CanvasState[CanvasState["Idle"] = 0] = "Idle";
    CanvasState[CanvasState["Rendering"] = 1] = "Rendering";
    CanvasState[CanvasState["Dirty"] = 2] = "Dirty";
})(CanvasState || (CanvasState = {}));
var Canvas = (function () {
    function Canvas(_width, _height, renderer, state) {
        this._width = _width;
        this._height = _height;
        this.renderer = renderer;
        this.elem = document.createElement('canvas');
        this.ctx = this.elem.getContext('2d');
        this.events = new _util_eventEmitter__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.canvasState = CanvasState.Idle;
        this._state = state;
        this.updateSize();
        this.redraw();
    }
    Object.defineProperty(Canvas.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.setSize = function (w, h) {
        if (w === this._width && h === this._height)
            return;
        this._width = w;
        this._height = h;
        this.updateSize();
        this.redraw(true);
    };
    Canvas.prototype.updateSize = function () {
        this.events.emit('resize');
        var dpr = window.devicePixelRatio;
        var w = this._width;
        var h = this._height;
        this.elem.width = Math.round(w / dpr);
        this.elem.height = Math.round(h / dpr);
        this.elem.style.width = w + "px";
        this.elem.style.height = h + "px";
    };
    Object.defineProperty(Canvas.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (s) {
            this._state = s;
            this.redraw(true);
        },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.redraw = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (this.canvasState === CanvasState.Idle) {
            this.canvasState = CanvasState.Rendering;
            this.renderer(this, this._state).then(function () {
                var prev = _this.canvasState;
                _this.canvasState = CanvasState.Idle;
                _this.events.emit('rendered');
                if (prev === CanvasState.Dirty)
                    _this.redraw();
            });
        }
        else if (force) {
            this.canvasState = CanvasState.Dirty;
        }
    };
    return Canvas;
}());



/***/ }),

/***/ "./app/src/canvas/linearGradientCanvas.ts":
/*!************************************************!*\
  !*** ./app/src/canvas/linearGradientCanvas.ts ***!
  \************************************************/
/*! exports provided: linearGradient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linearGradient", function() { return linearGradient; });
/* harmony import */ var _util_direction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/direction */ "./app/src/util/direction.ts");

function linearGradient(direction) {
    if (direction === void 0) { direction = _util_direction__WEBPACK_IMPORTED_MODULE_0__["Direction"].Right; }
    return function (canvas, colorStops) { return new Promise(function (resolve) {
        var w = canvas.elem.width;
        var h = canvas.elem.height;
        canvas.ctx.rect(0, 0, w, h);
        var grad;
        switch (direction) {
            case _util_direction__WEBPACK_IMPORTED_MODULE_0__["Direction"].Right:
                grad = canvas.ctx.createLinearGradient(h / 2, 0, w - h / 2, 0);
                break;
            case _util_direction__WEBPACK_IMPORTED_MODULE_0__["Direction"].Left:
                grad = canvas.ctx.createLinearGradient(w - h / 2, 0, h / 2, 0);
                break;
            case _util_direction__WEBPACK_IMPORTED_MODULE_0__["Direction"].Up:
                grad = canvas.ctx.createLinearGradient(0, h - w / 2, 0, w / 2);
                break;
            default:
                grad = canvas.ctx.createLinearGradient(0, w / 2, 0, h - w / 2);
                break;
        }
        var len = colorStops.length - 1;
        for (var i = 0; i < colorStops.length; ++i) {
            grad.addColorStop(i / len, colorStops[i]);
        }
        canvas.ctx.fillStyle = grad;
        canvas.ctx.fill();
        resolve();
    }); };
}


/***/ }),

/***/ "./app/src/canvas/roundHue.ts":
/*!************************************!*\
  !*** ./app/src/canvas/roundHue.ts ***!
  \************************************/
/*! exports provided: roundHueGradient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "roundHueGradient", function() { return roundHueGradient; });
/* harmony import */ var _color_convertColor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../color/convertColor */ "./app/src/color/convertColor.ts");

function drawImageLazily(data, size, padding) {
    var radius = size / 2 - padding;
    var mid = size / 2;
    var y = 0;
    for (var row = 0; row < size; row++)
        setTimeout(function () {
            var rowOffset = y * size;
            for (var x = 0; x < size; x++) {
                var offset = (rowOffset + x) << 2;
                var rX = mid - x;
                var rY = mid - y;
                var dx = rX / radius;
                var dy = rY / radius;
                var fromCenter = Math.sqrt(dx * dx + dy * dy);
                var hue = Math.atan2(rY, rX) / Math.PI * 3 + 3;
                var rgb = Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_0__["hsToRgb"])(hue, fromCenter);
                data[offset] = rgb[0];
                data[offset + 1] = rgb[1];
                data[offset + 2] = rgb[2];
                data[offset + 3] = 255;
            }
            y++;
        });
}
function roundHueGradient(padding) {
    return function (canvas) {
        var w = canvas.elem.width;
        var h = canvas.elem.height;
        if (w !== h)
            throw new Error("Canvas isn't square: " + w + "x" + h);
        var img = canvas.ctx.getImageData(0, 0, w, w);
        drawImageLazily(img.data, w, padding);
        return new Promise(function (resolve) { return setTimeout(function () {
            canvas.ctx.putImageData(img, 0, 0);
            resolve();
        }); });
    };
}


/***/ }),

/***/ "./app/src/color/convertColor.ts":
/*!***************************************!*\
  !*** ./app/src/color/convertColor.ts ***!
  \***************************************/
/*! exports provided: hsToRgb, hslToRgb, rgbToHsl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hsToRgb", function() { return hsToRgb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hslToRgb", function() { return hslToRgb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgbToHsl", function() { return rgbToHsl; });
function hsToRgb(h, s) {
    var X = s * (1 - Math.abs(h % 2 - 1));
    var r = 0;
    var g = 0;
    var b = 0;
    if (h >= 0 && h < 1) {
        r = s;
        g = X;
    }
    else if (h >= 1 && h < 2) {
        r = X;
        g = s;
    }
    else if (h >= 2 && h < 3) {
        g = s;
        b = X;
    }
    else if (h >= 3 && h < 4) {
        g = X;
        b = s;
    }
    else if (h >= 4 && h < 5) {
        r = X;
        b = s;
    }
    else {
        r = s;
        b = X;
    }
    var m = (1 - s) / 2;
    r = Math.floor((r + m) * 255);
    g = Math.floor((g + m) * 255);
    b = Math.floor((b + m) * 255);
    return [r, g, b];
}
function hslToRgb(h, s, l) {
    if (h < 0)
        h = 0;
    if (h >= 360)
        h = 359;
    if (s < 0)
        s = 0;
    if (s > 100)
        s = 100;
    if (l < 0)
        l = 0;
    if (l > 100)
        l = 100;
    s /= 100;
    l /= 100;
    var C = (1 - Math.abs(2 * l - 1)) * s;
    var hh = h / 60;
    var X = C * (1 - Math.abs(hh % 2 - 1));
    var r = 0;
    var g = 0;
    var b = 0;
    if (hh >= 0 && hh < 1) {
        r = C;
        g = X;
    }
    else if (hh >= 1 && hh < 2) {
        r = X;
        g = C;
    }
    else if (hh >= 2 && hh < 3) {
        g = C;
        b = X;
    }
    else if (hh >= 3 && hh < 4) {
        g = X;
        b = C;
    }
    else if (hh >= 4 && hh < 5) {
        r = X;
        b = C;
    }
    else {
        r = C;
        b = X;
    }
    var m = l - C / 2;
    r = Math.floor((r + m) * 255);
    g = Math.floor((g + m) * 255);
    b = Math.floor((b + m) * 255);
    return [r, g, b];
}
function rgbToHsl(r, g, b) {
    if (r < 0)
        r = 0;
    if (r > 255)
        r = 255;
    if (g < 0)
        g = 0;
    if (g > 255)
        g = 255;
    if (b < 0)
        b = 0;
    if (b > 255)
        b = 255;
    r /= 255;
    g /= 255;
    b /= 255;
    var M = Math.max(r, g, b);
    var m = Math.min(r, g, b);
    var d = M - m;
    var h;
    if (d == 0)
        h = 0;
    else if (M == r)
        h = ((g - b) / d) % 6;
    else if (M == g)
        h = (b - r) / d + 2;
    else
        h = (r - g) / d + 4;
    h *= 60;
    if (h < 0)
        h += 360;
    var l = (M + m) / 2;
    var s;
    if (d == 0)
        s = 0;
    else
        s = d / (1 - Math.abs(2 * l - 1));
    s *= 100;
    l *= 100;
    return [h, s, l];
}


/***/ }),

/***/ "./app/src/index.ts":
/*!**************************!*\
  !*** ./app/src/index.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _canvas_canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas/canvas */ "./app/src/canvas/canvas.ts");
/* harmony import */ var _canvas_roundHue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas/roundHue */ "./app/src/canvas/roundHue.ts");
/* harmony import */ var _slider_linearSlider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./slider/linearSlider */ "./app/src/slider/linearSlider.ts");
/* harmony import */ var _canvas_linearGradientCanvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./canvas/linearGradientCanvas */ "./app/src/canvas/linearGradientCanvas.ts");
/* harmony import */ var _slider_circularSlider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./slider/circularSlider */ "./app/src/slider/circularSlider.ts");
/* harmony import */ var _color_convertColor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./color/convertColor */ "./app/src/color/convertColor.ts");






var hue = 0;
var sat = 100;
var lum = 50;
var hueValues = [
    '#f00',
    '#ff0',
    '#0f0',
    '#0ff',
    '#00f',
    '#f0f',
    '#f00',
];
var satValues = ['#777', '#f00'];
var lumValues = ['#000', '#f00', '#fff'];
var redValues = ['#000', '#f00'];
var greenValues = ['#f00', '#ff0'];
var blueValues = ['#f00', '#f0f'];
var circularCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_0__["Canvas"](300, 300, Object(_canvas_roundHue__WEBPACK_IMPORTED_MODULE_1__["roundHueGradient"])(15), undefined);
var circularSlider = new _slider_circularSlider__WEBPACK_IMPORTED_MODULE_4__["CircularSlider"](circularCanvas, {});
document.body.appendChild(circularSlider.elem);
document.body.appendChild(document.createElement('br'));
document.body.appendChild(document.createElement('br'));
var hueCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_0__["Canvas"](300, 30, Object(_canvas_linearGradientCanvas__WEBPACK_IMPORTED_MODULE_3__["linearGradient"])(), hueValues);
var hueSlider = new _slider_linearSlider__WEBPACK_IMPORTED_MODULE_2__["LinearSlider"](hueCanvas, {
    min: 0,
    max: 359.9,
    initial: 0,
    rounding: function (n) { return n | 0; },
    step: 4,
    smallStep: 1,
});
document.body.appendChild(hueSlider.elem);
document.body.appendChild(document.createElement('br'));
document.body.appendChild(document.createElement('br'));
var satCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_0__["Canvas"](300, 30, Object(_canvas_linearGradientCanvas__WEBPACK_IMPORTED_MODULE_3__["linearGradient"])(), satValues);
var satSlider = new _slider_linearSlider__WEBPACK_IMPORTED_MODULE_2__["LinearSlider"](satCanvas, {
    min: 0,
    max: 100,
    initial: 100,
    rounding: function (n) { return n | 0; },
});
document.body.appendChild(satSlider.elem);
document.body.appendChild(document.createElement('br'));
document.body.appendChild(document.createElement('br'));
var lumCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_0__["Canvas"](300, 30, Object(_canvas_linearGradientCanvas__WEBPACK_IMPORTED_MODULE_3__["linearGradient"])(), lumValues);
var lumSlider = new _slider_linearSlider__WEBPACK_IMPORTED_MODULE_2__["LinearSlider"](lumCanvas, {
    min: 0,
    max: 100,
    initial: 50,
    rounding: function (n) { return n | 0; },
});
document.body.appendChild(lumSlider.elem);
document.body.appendChild(document.createElement('br'));
document.body.appendChild(document.createElement('br'));
var redCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_0__["Canvas"](300, 30, Object(_canvas_linearGradientCanvas__WEBPACK_IMPORTED_MODULE_3__["linearGradient"])(), redValues);
var redSlider = new _slider_linearSlider__WEBPACK_IMPORTED_MODULE_2__["LinearSlider"](redCanvas, {
    min: 0,
    max: 255,
    initial: 255,
    rounding: function (n) { return n | 0; },
});
document.body.appendChild(redSlider.elem);
document.body.appendChild(document.createElement('br'));
document.body.appendChild(document.createElement('br'));
var greenCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_0__["Canvas"](300, 30, Object(_canvas_linearGradientCanvas__WEBPACK_IMPORTED_MODULE_3__["linearGradient"])(), greenValues);
var greenSlider = new _slider_linearSlider__WEBPACK_IMPORTED_MODULE_2__["LinearSlider"](greenCanvas, {
    min: 0,
    max: 255,
    initial: 0,
    rounding: function (n) { return n | 0; },
});
document.body.appendChild(greenSlider.elem);
document.body.appendChild(document.createElement('br'));
document.body.appendChild(document.createElement('br'));
var blueCanvas = new _canvas_canvas__WEBPACK_IMPORTED_MODULE_0__["Canvas"](300, 30, Object(_canvas_linearGradientCanvas__WEBPACK_IMPORTED_MODULE_3__["linearGradient"])(), blueValues);
var blueSlider = new _slider_linearSlider__WEBPACK_IMPORTED_MODULE_2__["LinearSlider"](blueCanvas, {
    min: 0,
    max: 255,
    initial: 0,
    rounding: function (n) { return n | 0; },
});
document.body.appendChild(blueSlider.elem);
hueSlider.events.on('input', function (v) {
    hue = v;
    updateSat();
    updateLum();
    updateRed();
    updateGreen();
    updateBlue();
});
satSlider.events.on('input', function (v) {
    sat = v;
    updateHue();
    updateLum();
    updateRed();
    updateGreen();
    updateBlue();
});
lumSlider.events.on('input', function (v) {
    lum = v;
    updateHue();
    updateSat();
    updateRed();
    updateGreen();
    updateBlue();
});
redSlider.events.on('input', function (v) {
    var _a;
    _a = Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["rgbToHsl"])(v, greenSlider.value, blueSlider.value), hue = _a[0], sat = _a[1], lum = _a[2];
    updateHue();
    updateSat();
    updateLum();
    updateGreen();
    updateBlue();
});
greenSlider.events.on('input', function (v) {
    var _a;
    _a = Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["rgbToHsl"])(redSlider.value, v, blueSlider.value), hue = _a[0], sat = _a[1], lum = _a[2];
    updateHue();
    updateSat();
    updateLum();
    updateRed();
    updateBlue();
});
blueSlider.events.on('input', function (v) {
    var _a;
    _a = Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["rgbToHsl"])(redSlider.value, greenSlider.value, v), hue = _a[0], sat = _a[1], lum = _a[2];
    updateHue();
    updateSat();
    updateLum();
    updateRed();
    updateGreen();
});
function rgbString(rgb) {
    return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}
function updateHue() {
    hueSlider.canvas.state = hueValues.map(function (_, i) { return rgbString(Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["hslToRgb"])(i * 60, sat, lum)); });
    hueSlider.value = hue;
}
function updateSat() {
    satSlider.canvas.state = [
        rgbString(Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["hslToRgb"])(hue, 0, lum)),
        rgbString(Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["hslToRgb"])(hue, 100, lum)),
    ];
    satSlider.value = sat;
}
function updateLum() {
    lumSlider.canvas.state = ['#000', rgbString(Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["hslToRgb"])(hue, sat, 50)), '#fff'];
    lumSlider.value = lum;
}
function updateRed() {
    var _a = Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["hslToRgb"])(hue, sat, lum), r = _a[0], g = _a[1], b = _a[2];
    redSlider.canvas.state = [
        rgbString([0, g, b]),
        rgbString([255, g, b]),
    ];
    redSlider.value = r;
}
function updateGreen() {
    var _a = Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["hslToRgb"])(hue, sat, lum), r = _a[0], g = _a[1], b = _a[2];
    greenSlider.canvas.state = [
        rgbString([r, 0, b]),
        rgbString([r, 255, b]),
    ];
    greenSlider.value = g;
}
function updateBlue() {
    var _a = Object(_color_convertColor__WEBPACK_IMPORTED_MODULE_5__["hslToRgb"])(hue, sat, lum), r = _a[0], g = _a[1], b = _a[2];
    blueSlider.canvas.state = [
        rgbString([r, g, 0]),
        rgbString([r, g, 255]),
    ];
    blueSlider.value = b;
}


/***/ }),

/***/ "./app/src/slider/circularSlider.ts":
/*!******************************************!*\
  !*** ./app/src/slider/circularSlider.ts ***!
  \******************************************/
/*! exports provided: CircularSlider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CircularSlider", function() { return CircularSlider; });
/* harmony import */ var _util_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/eventEmitter */ "./app/src/util/eventEmitter.ts");

var CircularSlider = (function () {
    function CircularSlider(canvas, options) {
        this.canvas = canvas;
        this.events = new _util_eventEmitter__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.elem = document.createElement('div');
        this.handle = document.createElement('button');
        this.initElement();
        this.makeValueVisible();
    }
    CircularSlider.prototype.initElement = function () {
        this.elem.className = 'slider c-slider';
        this.elem.appendChild(this.canvas.elem);
        var inner = document.createElement('div');
        inner.className = 'slider-inner c-slider-inner';
        this.elem.appendChild(inner);
        this.handle.className = 'slider-handle c-slider-handle';
        inner.appendChild(this.handle);
    };
    CircularSlider.prototype.makeValueVisible = function () {
        this.handle.style.left = "100%";
        this.handle.style.top = "50%";
    };
    return CircularSlider;
}());



/***/ }),

/***/ "./app/src/slider/linearSlider.ts":
/*!****************************************!*\
  !*** ./app/src/slider/linearSlider.ts ***!
  \****************************************/
/*! exports provided: LinearSlider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinearSlider", function() { return LinearSlider; });
/* harmony import */ var _util_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/eventEmitter */ "./app/src/util/eventEmitter.ts");
/* harmony import */ var _util_direction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/direction */ "./app/src/util/direction.ts");


var LinearSlider = (function () {
    function LinearSlider(canvas, options) {
        this.canvas = canvas;
        this.events = new _util_eventEmitter__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.elem = document.createElement('div');
        this.handle = document.createElement('button');
        if (options.min > options.max) {
            throw new Error("min (" + options.min + ") is bigger than max (" + options.max + ")");
        }
        this.min = options.min;
        this.max = options.max;
        if (options.initial == null)
            options.initial = options.min;
        if (options.initial < options.min || options.initial > options.max) {
            throw new Error("Initial value (" + options.initial + ") out of bounds (" + options.min + ", " + options.max + ")");
        }
        this.rounding = options.rounding || (function (n) { return n; });
        this.step = options.step || 1;
        this.smallStep = options.smallStep || this.step;
        this.direction = options.direction || _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Right;
        this.isVertical = this.direction === _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Up || this.direction === _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Down;
        this._value = options.initial;
        this.initElement();
        this.makeValueVisible();
    }
    Object.defineProperty(LinearSlider.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            v = Math.max(this.min, Math.min(this.max, v));
            v = this.rounding(v);
            if (v !== this._value) {
                this._value = v;
                this.events.emit('change', v);
                this.makeValueVisible();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinearSlider.prototype, "valueRelative", {
        get: function () {
            return (this._value - this.min) / (this.max - this.min);
        },
        set: function (v) {
            v = Math.max(0, Math.min(1, v));
            this.value = this.min + v * (this.max - this.min);
        },
        enumerable: true,
        configurable: true
    });
    LinearSlider.prototype.initElement = function () {
        var _this = this;
        var dir = this.isVertical ? 'v' : 'h';
        this.elem.className = "slider " + dir + "-slider";
        this.elem.appendChild(this.canvas.elem);
        var inner = document.createElement('div');
        inner.className = "slider-inner " + dir + "-slider-inner";
        this.elem.appendChild(inner);
        this.handle.className = "slider-handle " + dir + "-slider-handle";
        inner.appendChild(this.handle);
        var isPressed = false;
        this.elem.addEventListener('mousedown', function (e) {
            if (e.button === 0) {
                _this.valueRelative = getRelativeValue(inner, e, _this.direction);
                _this.events.emit('input', _this._value);
                isPressed = true;
                setTimeout(function () { return _this.handle.focus(); });
            }
        });
        var isKeydown = false;
        this.handle.addEventListener('keydown', function (e) {
            var pressed = Object(_util_direction__WEBPACK_IMPORTED_MODULE_1__["keyToDirection"])(e.key);
            if (pressed != null) {
                var val = isKeydown ? _this.step : _this.smallStep;
                var sign = Object(_util_direction__WEBPACK_IMPORTED_MODULE_1__["getSignForSliderKeypress"])(pressed, _this.direction);
                _this.value += sign * val;
                _this.events.emit('input', _this._value);
                e.preventDefault();
            }
            isKeydown = true;
        });
        this.handle.addEventListener('keyup', function () {
            isKeydown = false;
        });
        window.addEventListener('mousemove', function (e) {
            if (isPressed) {
                _this.valueRelative = getRelativeValue(inner, e, _this.direction);
                _this.events.emit('input', _this._value);
            }
        });
        window.addEventListener('mouseup', function () { return isPressed = false; });
        window.addEventListener('blur', function () { return isPressed = false; });
    };
    LinearSlider.prototype.makeValueVisible = function () {
        switch (this.direction) {
            case _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Right:
                this.handle.style.left = this.valueRelative * 100 + "%";
                break;
            case _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Left:
                this.handle.style.left = 100 - this.valueRelative * 100 + "%";
                break;
            case _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Up:
                this.handle.style.top = 100 - this.valueRelative * 100 + "%";
                break;
            default:
                this.handle.style.top = this.valueRelative * 100 + "%";
        }
    };
    return LinearSlider;
}());

function getRelativeValue(elem, e, direction) {
    var box = elem.getBoundingClientRect();
    switch (direction) {
        case _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Right:
            return (e.clientX - box.left) / box.width;
        case _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Left:
            return 1 - (e.clientX - box.left) / box.width;
        case _util_direction__WEBPACK_IMPORTED_MODULE_1__["Direction"].Up:
            return 1 - (e.clientY - box.top) / box.height;
        default:
            return (e.clientY - box.top) / box.height;
    }
}


/***/ }),

/***/ "./app/src/util/direction.ts":
/*!***********************************!*\
  !*** ./app/src/util/direction.ts ***!
  \***********************************/
/*! exports provided: Direction, keyToDirection, getSignForSliderKeypress */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Direction", function() { return Direction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keyToDirection", function() { return keyToDirection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSignForSliderKeypress", function() { return getSignForSliderKeypress; });
var Direction;
(function (Direction) {
    Direction[Direction["Right"] = 0] = "Right";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Up"] = 3] = "Up";
})(Direction || (Direction = {}));
function keyToDirection(key) {
    switch (key) {
        case 'ArrowRight': return Direction.Right;
        case 'ArrowLeft': return Direction.Left;
        case 'ArrowDown': return Direction.Down;
        case 'ArrowUp': return Direction.Up;
        default: return null;
    }
}
var mapping = [
    [1, -1, -1, 1],
    [-1, 1, 1, -1],
    [-1, 1, 1, -1],
    [1, -1, -1, 1],
];
function getSignForSliderKeypress(pressed, sliderDir) {
    return mapping[sliderDir][pressed];
}


/***/ }),

/***/ "./app/src/util/eventEmitter.ts":
/*!**************************************!*\
  !*** ./app/src/util/eventEmitter.ts ***!
  \**************************************/
/*! exports provided: EventEmitter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventEmitter", function() { return EventEmitter; });
var EventEmitter = (function () {
    function EventEmitter() {
        this.listeners = {};
    }
    EventEmitter.prototype.on = function (type, listener) {
        if (this.listeners[type] == null) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
    };
    EventEmitter.prototype.off = function (type, listener) {
        if (this.listeners[type] != null) {
            var arr = this.listeners[type];
            var ix = arr.indexOf(listener);
            if (ix !== -1) {
                arr.splice(ix, 1);
                return true;
            }
        }
        return false;
    };
    EventEmitter.prototype.emit = function (type, event) {
        if (this.listeners[type] != null) {
            for (var _i = 0, _a = this.listeners[type]; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(event);
            }
        }
    };
    return EventEmitter;
}());



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9jYW52YXMvY2FudmFzLnRzIiwid2VicGFjazovLy8uL2FwcC9zcmMvY2FudmFzL2xpbmVhckdyYWRpZW50Q2FudmFzLnRzIiwid2VicGFjazovLy8uL2FwcC9zcmMvY2FudmFzL3JvdW5kSHVlLnRzIiwid2VicGFjazovLy8uL2FwcC9zcmMvY29sb3IvY29udmVydENvbG9yLnRzIiwid2VicGFjazovLy8uL2FwcC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9zbGlkZXIvY2lyY3VsYXJTbGlkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9zbGlkZXIvbGluZWFyU2xpZGVyLnRzIiwid2VicGFjazovLy8uL2FwcC9zcmMvdXRpbC9kaXJlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy91dGlsL2V2ZW50RW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7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RTtRQUN4QixDQUFDLEdBQUcsQ0FBQztRQUNMLENBQUMsR0FBRyxDQUFDO0tBQ1I7U0FBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QixDQUFDLEdBQUcsQ0FBQztRQUNMLENBQUMsR0FBRyxDQUFDO0tBQ1I7U0FBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QixDQUFDLEdBQUcsQ0FBQztRQUNMLENBQUMsR0FBRyxDQUFDO0tBQ1I7U0FBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QixDQUFDLEdBQUcsQ0FBQztRQUNMLENBQUMsR0FBRyxDQUFDO0tBQ1I7U0FBTTtRQUNILENBQUMsR0FBRyxDQUFDO1FBQ0wsQ0FBQyxHQUFHLENBQUM7S0FDUjtJQUVELElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDckIsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzdCLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUM3QixDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDN0IsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFFTSxTQUFTLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVE7SUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUFFLENBQUMsR0FBRyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUc7UUFBRSxDQUFDLEdBQUcsR0FBRztJQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDO1FBQUUsQ0FBQyxHQUFHLENBQUM7SUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRztRQUFFLENBQUMsR0FBRyxHQUFHO0lBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUM7UUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHO1FBQUUsQ0FBQyxHQUFHLEdBQUc7SUFDcEIsQ0FBQyxJQUFJLEdBQUc7SUFDUixDQUFDLElBQUksR0FBRztJQUNSLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDdkMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUU7SUFDakIsSUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNULElBQUksQ0FBQyxHQUFHLENBQUM7SUFDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtRQUNuQixDQUFDLEdBQUcsQ0FBQztRQUNMLENBQUMsR0FBRyxDQUFDO0tBQ1I7U0FBTSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtRQUMxQixDQUFDLEdBQUcsQ0FBQztRQUNMLENBQUMsR0FBRyxDQUFDO0tBQ1I7U0FBTSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtRQUMxQixDQUFDLEdBQUcsQ0FBQztRQUNMLENBQUMsR0FBRyxDQUFDO0tBQ1I7U0FBTSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtRQUMxQixDQUFDLEdBQUcsQ0FBQztRQUNMLENBQUMsR0FBRyxDQUFDO0tBQ1I7U0FBTSxJQUFJLEVBQUUs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Q0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQztJQUVNLDBCQUFHLEdBQVYsVUFBVyxJQUFZLEVBQUUsUUFBNEI7UUFDakQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtZQUM5QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0IsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ1gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSwyQkFBSSxHQUFYLFVBQVksSUFBWSxFQUFFLEtBQVE7UUFDOUIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtZQUM5QixLQUF1QixVQUFvQixFQUFwQixTQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFwQixjQUFvQixFQUFwQixJQUFvQixFQUFFO2dCQUF4QyxJQUFNLFFBQVE7Z0JBQ2YsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ25CO1NBQ0o7SUFDTCxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vYXBwL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJy4uL3V0aWwvZXZlbnRFbWl0dGVyJ1xuXG5leHBvcnQgdHlwZSBSZW5kZXJGdW5jdGlvbjxTIGV4dGVuZHMge30gfCB2b2lkPiA9IChjYW52YXM6IENhbnZhczxTPiwgc3RhdGU6IFMpID0+IFByb21pc2U8dm9pZD5cblxuZW51bSBDYW52YXNTdGF0ZSB7XG4gICAgSWRsZSxcbiAgICBSZW5kZXJpbmcsXG4gICAgLy8gVGhpcyBtZWFucyB0aGF0IHRoZSBjYW52YXMgaXMgcmVuZGVyaW5nLCBidXQgbXVzdCBiZSByZW5kZXJlZCBhZ2FpbiBvbmNlIGZpbmlzaGVkXG4gICAgRGlydHksXG59XG5cbmV4cG9ydCBjbGFzcyBDYW52YXM8UyBleHRlbmRzIHt9IHwgdm9pZD4ge1xuICAgIHB1YmxpYyByZWFkb25seSBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICBwdWJsaWMgcmVhZG9ubHkgY3R4ID0gdGhpcy5lbGVtLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXG5cbiAgICBwcml2YXRlIF9zdGF0ZTogU1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzOlxuICAgICAqIC0gYHJlc2l6ZWA6IEVtaXR0ZWQgd2hlbiB0aGUgY2FudmFzJyBwaHlzaWNhbCBzaXplIGNoYW5nZXNcbiAgICAgKiAtIGByZW5kZXJlZGA6IEVtaXR0ZWQgYWZ0ZXIgdGhlIGNhbnZhcyB3YXMgcmVuZGVyZWQgY29tcGxldGVseVxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBldmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KClcblxuICAgIHByaXZhdGUgY2FudmFzU3RhdGUgPSBDYW52YXNTdGF0ZS5JZGxlXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBfd2lkdGg6IG51bWJlcixcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyRnVuY3Rpb248Uz4sXG4gICAgICAgIHN0YXRlOiBTLFxuICAgICkge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlXG5cbiAgICAgICAgdGhpcy51cGRhdGVTaXplKClcbiAgICAgICAgdGhpcy5yZWRyYXcoKVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgd2lkdGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoXG4gICAgfVxuXG4gICAgcHVibGljIGdldCBoZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodFxuICAgIH1cblxuICAgIHB1YmxpYyBzZXRTaXplKHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh3ID09PSB0aGlzLl93aWR0aCAmJiBoID09PSB0aGlzLl9oZWlnaHQpIHJldHVyblxuICAgICAgICB0aGlzLl93aWR0aCA9IHdcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaFxuXG4gICAgICAgIHRoaXMudXBkYXRlU2l6ZSgpXG4gICAgICAgIHRoaXMucmVkcmF3KHRydWUpXG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVNpemUoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ3Jlc2l6ZScpXG5cbiAgICAgICAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW9cbiAgICAgICAgY29uc3QgdyA9IHRoaXMuX3dpZHRoXG4gICAgICAgIGNvbnN0IGggPSB0aGlzLl9oZWlnaHRcblxuICAgICAgICB0aGlzLmVsZW0ud2lkdGggPSBNYXRoLnJvdW5kKHcgLyBkcHIpXG4gICAgICAgIHRoaXMuZWxlbS5oZWlnaHQgPSBNYXRoLnJvdW5kKGggLyBkcHIpXG4gICAgICAgIHRoaXMuZWxlbS5zdHlsZS53aWR0aCA9IGAke3d9cHhgXG4gICAgICAgIHRoaXMuZWxlbS5zdHlsZS5oZWlnaHQgPSBgJHtofXB4YFxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc3RhdGUoKTogUyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc3RhdGUoczogUykge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IHNcbiAgICAgICAgdGhpcy5yZWRyYXcodHJ1ZSlcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZHJhdyhmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLmNhbnZhc1N0YXRlID09PSBDYW52YXNTdGF0ZS5JZGxlKSB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhc1N0YXRlID0gQ2FudmFzU3RhdGUuUmVuZGVyaW5nXG5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIodGhpcywgdGhpcy5fc3RhdGUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmNhbnZhc1N0YXRlXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXNTdGF0ZSA9IENhbnZhc1N0YXRlLklkbGVcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdyZW5kZXJlZCcpXG5cbiAgICAgICAgICAgICAgICBpZiAocHJldiA9PT0gQ2FudmFzU3RhdGUuRGlydHkpIHRoaXMucmVkcmF3KClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAoZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzU3RhdGUgPSBDYW52YXNTdGF0ZS5EaXJ0eVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUmVuZGVyRnVuY3Rpb24gfSBmcm9tICcuL2NhbnZhcydcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL3V0aWwvZGlyZWN0aW9uJ1xuXG5leHBvcnQgZnVuY3Rpb24gbGluZWFyR3JhZGllbnQoZGlyZWN0aW9uOiBEaXJlY3Rpb24gPSBEaXJlY3Rpb24uUmlnaHQpOiBSZW5kZXJGdW5jdGlvbjxzdHJpbmdbXT4ge1xuICAgIHJldHVybiAoY2FudmFzLCBjb2xvclN0b3BzOiBzdHJpbmdbXSkgPT4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgICAgIGNvbnN0IHcgPSBjYW52YXMuZWxlbS53aWR0aFxuICAgICAgICBjb25zdCBoID0gY2FudmFzLmVsZW0uaGVpZ2h0XG5cbiAgICAgICAgY2FudmFzLmN0eC5yZWN0KDAsIDAsIHcsIGgpXG5cbiAgICAgICAgbGV0IGdyYWQ6IENhbnZhc0dyYWRpZW50XG5cbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLlJpZ2h0OlxuICAgICAgICAgICAgICAgIGdyYWQgPSBjYW52YXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KGggLyAyLCAwLCB3IC0gaCAvIDIsIDApXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLkxlZnQ6XG4gICAgICAgICAgICAgICAgZ3JhZCA9IGNhbnZhcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQodyAtIGggLyAyLCAwLCBoIC8gMiwgMClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uVXA6XG4gICAgICAgICAgICAgICAgZ3JhZCA9IGNhbnZhcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgaCAtIHcgLyAyLCAwLCB3IC8gMilcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDogLy8gRG93blxuICAgICAgICAgICAgICAgIGdyYWQgPSBjYW52YXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIHcgLyAyLCAwLCBoIC0gdyAvIDIpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxlbiA9IGNvbG9yU3RvcHMubGVuZ3RoIC0gMVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbG9yU3RvcHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKGkgLyBsZW4sIGNvbG9yU3RvcHNbaV0pXG4gICAgICAgIH1cbiAgICAgICAgY2FudmFzLmN0eC5maWxsU3R5bGUgPSBncmFkXG5cbiAgICAgICAgY2FudmFzLmN0eC5maWxsKClcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IENhbnZhcywgUmVuZGVyRnVuY3Rpb24gfSBmcm9tICcuL2NhbnZhcydcbmltcG9ydCB7IGhzVG9SZ2IgfSBmcm9tICcuLi9jb2xvci9jb252ZXJ0Q29sb3InXG5cbmZ1bmN0aW9uIGRyYXdJbWFnZUxhemlseShkYXRhOiBVaW50OENsYW1wZWRBcnJheSwgc2l6ZTogbnVtYmVyLCBwYWRkaW5nOiBudW1iZXIpIHtcbiAgICBsZXQgcmFkaXVzID0gc2l6ZSAvIDIgLSBwYWRkaW5nXG4gICAgbGV0IG1pZCA9IHNpemUgLyAyXG4gICAgbGV0IHkgPSAwXG5cbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBzaXplOyByb3crKykgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvd09mZnNldCA9IHkgKiBzaXplXG5cbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzaXplOyB4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IChyb3dPZmZzZXQgKyB4KSA8PCAyXG4gICAgICAgICAgICBjb25zdCByWCA9IG1pZCAtIHhcbiAgICAgICAgICAgIGNvbnN0IHJZID0gbWlkIC0geVxuXG4gICAgICAgICAgICBjb25zdCBkeCA9IHJYIC8gcmFkaXVzXG4gICAgICAgICAgICBjb25zdCBkeSA9IHJZIC8gcmFkaXVzXG4gICAgICAgICAgICBjb25zdCBmcm9tQ2VudGVyID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KVxuXG4gICAgICAgICAgICBjb25zdCBodWUgPSBNYXRoLmF0YW4yKHJZLCByWCkgLyBNYXRoLlBJICogMyArIDNcblxuICAgICAgICAgICAgY29uc3QgcmdiID0gaHNUb1JnYihodWUsIGZyb21DZW50ZXIpXG5cbiAgICAgICAgICAgIGRhdGFbb2Zmc2V0ICAgIF0gPSByZ2JbMF1cbiAgICAgICAgICAgIGRhdGFbb2Zmc2V0ICsgMV0gPSByZ2JbMV1cbiAgICAgICAgICAgIGRhdGFbb2Zmc2V0ICsgMl0gPSByZ2JbMl1cbiAgICAgICAgICAgIGRhdGFbb2Zmc2V0ICsgM10gPSAyNTVcbiAgICAgICAgfVxuICAgICAgICB5KytcbiAgICB9KVxufVxuXG4vKipcbiAqIERyYXdzIGEgcm91bmQgaHVlIGdyYWRpZW50IG9uIGEgY2FudmFzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcm91bmRIdWVHcmFkaWVudChwYWRkaW5nOiBudW1iZXIpOiBSZW5kZXJGdW5jdGlvbjx2b2lkPiB7XG4gICAgcmV0dXJuIChjYW52YXM6IENhbnZhczx2b2lkPikgPT4ge1xuICAgICAgICBjb25zdCB3ID0gY2FudmFzLmVsZW0ud2lkdGhcbiAgICAgICAgY29uc3QgaCA9IGNhbnZhcy5lbGVtLmhlaWdodFxuICAgICAgICBpZiAodyAhPT0gaCkgdGhyb3cgbmV3IEVycm9yKGBDYW52YXMgaXNuJ3Qgc3F1YXJlOiAke3d9eCR7aH1gKVxuXG4gICAgICAgIGxldCBpbWcgPSBjYW52YXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB3LCB3KVxuICAgICAgICBkcmF3SW1hZ2VMYXppbHkoaW1nLmRhdGEsIHcsIHBhZGRpbmcpXG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjYW52YXMuY3R4LnB1dEltYWdlRGF0YShpbWcsIDAsIDApXG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSkpXG4gICAgfVxufVxuIiwiLyoqXG4gKiBsdW1pbmFuY2UgaXMgMS8yLlxuICpcbiAqIEBwYXJhbSBoIC0gaHVlLCBhIG51bWJlciBiZXR3ZWVuIFswLCA2KVxuICogQHBhcmFtIHMgLSBzYXR1cmF0aW9uLCBhIG51bWJlciBiZXR3ZWVuIFswLCAxKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaHNUb1JnYihoOiBudW1iZXIsIHM6IG51bWJlcik6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XG4gICAgY29uc3QgWCA9IHMgKiAoMSAtIE1hdGguYWJzKGggJSAyIC0gMSkpXG4gICAgbGV0IHIgPSAwXG4gICAgbGV0IGcgPSAwXG4gICAgbGV0IGIgPSAwXG5cbiAgICBpZiAoaCA+PSAwICYmIGggPCAxKSB7XG4gICAgICAgIHIgPSBzXG4gICAgICAgIGcgPSBYXG4gICAgfSBlbHNlIGlmIChoID49IDEgJiYgaCA8IDIpIHtcbiAgICAgICAgciA9IFhcbiAgICAgICAgZyA9IHNcbiAgICB9IGVsc2UgaWYgKGggPj0gMiAmJiBoIDwgMykge1xuICAgICAgICBnID0gc1xuICAgICAgICBiID0gWFxuICAgIH0gZWxzZSBpZiAoaCA+PSAzICYmIGggPCA0KSB7XG4gICAgICAgIGcgPSBYXG4gICAgICAgIGIgPSBzXG4gICAgfSBlbHNlIGlmIChoID49IDQgJiYgaCA8IDUpIHtcbiAgICAgICAgciA9IFhcbiAgICAgICAgYiA9IHNcbiAgICB9IGVsc2Uge1xuICAgICAgICByID0gc1xuICAgICAgICBiID0gWFxuICAgIH1cblxuICAgIGNvbnN0IG0gPSAoMSAtIHMpIC8gMlxuICAgIHIgPSBNYXRoLmZsb29yKChyICsgbSkgKiAyNTUpXG4gICAgZyA9IE1hdGguZmxvb3IoKGcgKyBtKSAqIDI1NSlcbiAgICBiID0gTWF0aC5mbG9vcigoYiArIG0pICogMjU1KVxuICAgIHJldHVybiBbciwgZywgYl1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzbFRvUmdiKGg6IG51bWJlciwgczogbnVtYmVyLCBsOm51bWJlcik6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XG4gICAgaWYgKGggPCAwKSBoID0gMFxuICAgIGlmIChoID49IDM2MCkgaCA9IDM1OVxuICAgIGlmIChzIDwgMCkgcyA9IDBcbiAgICBpZiAocyA+IDEwMCkgcyA9IDEwMFxuICAgIGlmIChsIDwgMCkgbCA9IDBcbiAgICBpZiAobCA+IDEwMCkgbCA9IDEwMFxuICAgIHMgLz0gMTAwXG4gICAgbCAvPSAxMDBcbiAgICBjb25zdCBDID0gKDEgLSBNYXRoLmFicygyICogbCAtIDEpKSAqIHNcbiAgICBjb25zdCBoaCA9IGggLyA2MFxuICAgIGNvbnN0IFggPSBDICogKDEgLSBNYXRoLmFicyhoaCAlIDIgLSAxKSlcbiAgICBsZXQgciA9IDBcbiAgICBsZXQgZyA9IDBcbiAgICBsZXQgYiA9IDBcbiAgICBpZiAoaGggPj0gMCAmJiBoaCA8IDEpIHtcbiAgICAgICAgciA9IENcbiAgICAgICAgZyA9IFhcbiAgICB9IGVsc2UgaWYgKGhoID49IDEgJiYgaGggPCAyKSB7XG4gICAgICAgIHIgPSBYXG4gICAgICAgIGcgPSBDXG4gICAgfSBlbHNlIGlmIChoaCA+PSAyICYmIGhoIDwgMykge1xuICAgICAgICBnID0gQ1xuICAgICAgICBiID0gWFxuICAgIH0gZWxzZSBpZiAoaGggPj0gMyAmJiBoaCA8IDQpIHtcbiAgICAgICAgZyA9IFhcbiAgICAgICAgYiA9IENcbiAgICB9IGVsc2UgaWYgKGhoID49IDQgJiYgaGggPCA1KSB7XG4gICAgICAgIHIgPSBYXG4gICAgICAgIGIgPSBDXG4gICAgfSBlbHNlIHtcbiAgICAgICAgciA9IENcbiAgICAgICAgYiA9IFhcbiAgICB9XG4gICAgY29uc3QgbSA9IGwgLSBDIC8gMlxuICAgIHIgPSBNYXRoLmZsb29yKChyICsgbSkgKiAyNTUpXG4gICAgZyA9IE1hdGguZmxvb3IoKGcgKyBtKSAqIDI1NSlcbiAgICBiID0gTWF0aC5mbG9vcigoYiArIG0pICogMjU1KVxuICAgIHJldHVybiBbciwgZywgYl1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYlRvSHNsKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xuICAgIGlmIChyIDwgMCkgciA9IDBcbiAgICBpZiAociA+IDI1NSkgciA9IDI1NVxuICAgIGlmIChnIDwgMCkgZyA9IDBcbiAgICBpZiAoZyA+IDI1NSkgZyA9IDI1NVxuICAgIGlmIChiIDwgMCkgYiA9IDBcbiAgICBpZiAoYiA+IDI1NSkgYiA9IDI1NVxuICAgIHIgLz0gMjU1XG4gICAgZyAvPSAyNTVcbiAgICBiIC89IDI1NVxuICAgIGNvbnN0IE0gPSBNYXRoLm1heChyLCBnLCBiKVxuICAgIGNvbnN0IG0gPSBNYXRoLm1pbihyLCBnLCBiKVxuICAgIGNvbnN0IGQgPSBNIC0gbVxuXG4gICAgbGV0IGg6IG51bWJlclxuICAgIGlmIChkID09IDApIGggPSAwXG4gICAgZWxzZSBpZiAoTSA9PSByKSBoID0gKChnIC0gYikgLyBkKSAlIDZcbiAgICBlbHNlIGlmIChNID09IGcpIGggPSAoYiAtIHIpIC8gZCArIDJcbiAgICBlbHNlIGggPSAociAtIGcpIC8gZCArIDRcbiAgICBoICo9IDYwXG4gICAgaWYgKGggPCAwKSBoICs9IDM2MFxuXG4gICAgbGV0IGwgPSAoTSArIG0pIC8gMlxuXG4gICAgbGV0IHM6IG51bWJlclxuICAgIGlmIChkID09IDApIHMgPSAwXG4gICAgZWxzZSBzID0gZCAvICgxIC0gTWF0aC5hYnMoMiAqIGwgLSAxKSlcblxuICAgIHMgKj0gMTAwXG4gICAgbCAqPSAxMDBcbiAgICByZXR1cm4gW2gsIHMsIGxdXG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tICcuL2NhbnZhcy9jYW52YXMnXG5pbXBvcnQgeyByb3VuZEh1ZUdyYWRpZW50IH0gZnJvbSAnLi9jYW52YXMvcm91bmRIdWUnXG5pbXBvcnQgeyBMaW5lYXJTbGlkZXIgfSBmcm9tICcuL3NsaWRlci9saW5lYXJTbGlkZXInXG5pbXBvcnQgeyBsaW5lYXJHcmFkaWVudCB9IGZyb20gJy4vY2FudmFzL2xpbmVhckdyYWRpZW50Q2FudmFzJ1xuaW1wb3J0IHsgQ2lyY3VsYXJTbGlkZXIgfSBmcm9tICcuL3NsaWRlci9jaXJjdWxhclNsaWRlcidcbmltcG9ydCB7IGhzbFRvUmdiLCByZ2JUb0hzbCB9IGZyb20gJy4vY29sb3IvY29udmVydENvbG9yJ1xuXG5sZXQgaHVlID0gMFxubGV0IHNhdCA9IDEwMFxubGV0IGx1bSA9IDUwXG5cbmNvbnN0IGh1ZVZhbHVlcyA9IFtcbiAgICAnI2YwMCcsXG4gICAgJyNmZjAnLFxuICAgICcjMGYwJyxcbiAgICAnIzBmZicsXG4gICAgJyMwMGYnLFxuICAgICcjZjBmJyxcbiAgICAnI2YwMCcsXG5dXG5jb25zdCBzYXRWYWx1ZXMgPSBbJyM3NzcnLCAnI2YwMCddXG5jb25zdCBsdW1WYWx1ZXMgPSBbJyMwMDAnLCAnI2YwMCcsICcjZmZmJ11cbmNvbnN0IHJlZFZhbHVlcyA9IFsnIzAwMCcsICcjZjAwJ11cbmNvbnN0IGdyZWVuVmFsdWVzID0gWycjZjAwJywgJyNmZjAnXVxuY29uc3QgYmx1ZVZhbHVlcyA9IFsnI2YwMCcsICcjZjBmJ11cblxuXG5jb25zdCBjaXJjdWxhckNhbnZhcyA9IG5ldyBDYW52YXM8dm9pZD4oMzAwLCAzMDAsIHJvdW5kSHVlR3JhZGllbnQoMTUpLCB1bmRlZmluZWQpXG5jb25zdCBjaXJjdWxhclNsaWRlciA9IG5ldyBDaXJjdWxhclNsaWRlcihjaXJjdWxhckNhbnZhcywge30pXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNpcmN1bGFyU2xpZGVyLmVsZW0pXG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuY29uc3QgaHVlQ2FudmFzID0gbmV3IENhbnZhcygzMDAsIDMwLCBsaW5lYXJHcmFkaWVudCgpLCBodWVWYWx1ZXMpXG5jb25zdCBodWVTbGlkZXIgPSBuZXcgTGluZWFyU2xpZGVyKGh1ZUNhbnZhcywge1xuICAgIG1pbjogMCxcbiAgICBtYXg6IDM1OS45LFxuICAgIGluaXRpYWw6IDAsXG4gICAgcm91bmRpbmc6IChuOiBudW1iZXIpID0+IG4gfCAwLFxuICAgIHN0ZXA6IDQsXG4gICAgc21hbGxTdGVwOiAxLFxufSlcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHVlU2xpZGVyLmVsZW0pXG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuXG5jb25zdCBzYXRDYW52YXMgPSBuZXcgQ2FudmFzKDMwMCwgMzAsIGxpbmVhckdyYWRpZW50KCksIHNhdFZhbHVlcylcbmNvbnN0IHNhdFNsaWRlciA9IG5ldyBMaW5lYXJTbGlkZXIoc2F0Q2FudmFzLCB7XG4gICAgbWluOiAwLFxuICAgIG1heDogMTAwLFxuICAgIGluaXRpYWw6IDEwMCxcbiAgICByb3VuZGluZzogKG46IG51bWJlcikgPT4gbiB8IDAsXG59KVxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzYXRTbGlkZXIuZWxlbSlcblxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG5jb25zdCBsdW1DYW52YXMgPSBuZXcgQ2FudmFzKDMwMCwgMzAsIGxpbmVhckdyYWRpZW50KCksIGx1bVZhbHVlcylcbmNvbnN0IGx1bVNsaWRlciA9IG5ldyBMaW5lYXJTbGlkZXIobHVtQ2FudmFzLCB7XG4gICAgbWluOiAwLFxuICAgIG1heDogMTAwLFxuICAgIGluaXRpYWw6IDUwLFxuICAgIHJvdW5kaW5nOiAobjogbnVtYmVyKSA9PiBuIHwgMCxcbn0pXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGx1bVNsaWRlci5lbGVtKVxuXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG5cbmNvbnN0IHJlZENhbnZhcyA9IG5ldyBDYW52YXMoMzAwLCAzMCwgbGluZWFyR3JhZGllbnQoKSwgcmVkVmFsdWVzKVxuY29uc3QgcmVkU2xpZGVyID0gbmV3IExpbmVhclNsaWRlcihyZWRDYW52YXMsIHtcbiAgICBtaW46IDAsXG4gICAgbWF4OiAyNTUsXG4gICAgaW5pdGlhbDogMjU1LFxuICAgIHJvdW5kaW5nOiAobjogbnVtYmVyKSA9PiBuIHwgMCxcbn0pXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlZFNsaWRlci5lbGVtKVxuXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG5cbmNvbnN0IGdyZWVuQ2FudmFzID0gbmV3IENhbnZhcygzMDAsIDMwLCBsaW5lYXJHcmFkaWVudCgpLCBncmVlblZhbHVlcylcbmNvbnN0IGdyZWVuU2xpZGVyID0gbmV3IExpbmVhclNsaWRlcihncmVlbkNhbnZhcywge1xuICAgIG1pbjogMCxcbiAgICBtYXg6IDI1NSxcbiAgICBpbml0aWFsOiAwLFxuICAgIHJvdW5kaW5nOiAobjogbnVtYmVyKSA9PiBuIHwgMCxcbn0pXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGdyZWVuU2xpZGVyLmVsZW0pXG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuY29uc3QgYmx1ZUNhbnZhcyA9IG5ldyBDYW52YXMoMzAwLCAzMCwgbGluZWFyR3JhZGllbnQoKSwgYmx1ZVZhbHVlcylcbmNvbnN0IGJsdWVTbGlkZXIgPSBuZXcgTGluZWFyU2xpZGVyKGJsdWVDYW52YXMsIHtcbiAgICBtaW46IDAsXG4gICAgbWF4OiAyNTUsXG4gICAgaW5pdGlhbDogMCxcbiAgICByb3VuZGluZzogKG46IG51bWJlcikgPT4gbiB8IDAsXG59KVxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChibHVlU2xpZGVyLmVsZW0pXG5cblxuXG5odWVTbGlkZXIuZXZlbnRzLm9uKCdpbnB1dCcsIHYgPT4ge1xuICAgIGh1ZSA9IHZcbiAgICB1cGRhdGVTYXQoKVxuICAgIHVwZGF0ZUx1bSgpXG5cbiAgICB1cGRhdGVSZWQoKVxuICAgIHVwZGF0ZUdyZWVuKClcbiAgICB1cGRhdGVCbHVlKClcbn0pXG5cbnNhdFNsaWRlci5ldmVudHMub24oJ2lucHV0JywgdiA9PiB7XG4gICAgc2F0ID0gdlxuICAgIHVwZGF0ZUh1ZSgpXG4gICAgdXBkYXRlTHVtKClcblxuICAgIHVwZGF0ZVJlZCgpXG4gICAgdXBkYXRlR3JlZW4oKVxuICAgIHVwZGF0ZUJsdWUoKVxufSlcblxubHVtU2xpZGVyLmV2ZW50cy5vbignaW5wdXQnLCB2ID0+IHtcbiAgICBsdW0gPSB2XG4gICAgdXBkYXRlSHVlKClcbiAgICB1cGRhdGVTYXQoKVxuXG4gICAgdXBkYXRlUmVkKClcbiAgICB1cGRhdGVHcmVlbigpXG4gICAgdXBkYXRlQmx1ZSgpXG59KVxuXG5yZWRTbGlkZXIuZXZlbnRzLm9uKCdpbnB1dCcsIHYgPT4ge1xuICAgIFtodWUsIHNhdCwgbHVtXSA9IHJnYlRvSHNsKHYsIGdyZWVuU2xpZGVyLnZhbHVlLCBibHVlU2xpZGVyLnZhbHVlKVxuICAgIHVwZGF0ZUh1ZSgpXG4gICAgdXBkYXRlU2F0KClcbiAgICB1cGRhdGVMdW0oKVxuXG4gICAgdXBkYXRlR3JlZW4oKVxuICAgIHVwZGF0ZUJsdWUoKVxufSlcblxuZ3JlZW5TbGlkZXIuZXZlbnRzLm9uKCdpbnB1dCcsIHYgPT4ge1xuICAgIFtodWUsIHNhdCwgbHVtXSA9IHJnYlRvSHNsKHJlZFNsaWRlci52YWx1ZSwgdiwgYmx1ZVNsaWRlci52YWx1ZSlcbiAgICB1cGRhdGVIdWUoKVxuICAgIHVwZGF0ZVNhdCgpXG4gICAgdXBkYXRlTHVtKClcblxuICAgIHVwZGF0ZVJlZCgpXG4gICAgdXBkYXRlQmx1ZSgpXG59KVxuXG5ibHVlU2xpZGVyLmV2ZW50cy5vbignaW5wdXQnLCB2ID0+IHtcbiAgICBbaHVlLCBzYXQsIGx1bV0gPSByZ2JUb0hzbChyZWRTbGlkZXIudmFsdWUsIGdyZWVuU2xpZGVyLnZhbHVlLCB2KVxuICAgIHVwZGF0ZUh1ZSgpXG4gICAgdXBkYXRlU2F0KClcbiAgICB1cGRhdGVMdW0oKVxuXG4gICAgdXBkYXRlUmVkKClcbiAgICB1cGRhdGVHcmVlbigpXG59KVxuXG5cbmZ1bmN0aW9uIHJnYlN0cmluZyhyZ2I6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGByZ2IoJHtyZ2JbMF19LCAke3JnYlsxXX0sICR7cmdiWzJdfSlgXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUh1ZSgpIHtcbiAgICBodWVTbGlkZXIuY2FudmFzLnN0YXRlID0gaHVlVmFsdWVzLm1hcCgoXywgaSkgPT4gcmdiU3RyaW5nKGhzbFRvUmdiKCAgaSAqIDYwLCBzYXQsIGx1bSkpKVxuICAgIGh1ZVNsaWRlci52YWx1ZSA9IGh1ZVxufVxuXG5mdW5jdGlvbiB1cGRhdGVTYXQoKSB7XG4gICAgc2F0U2xpZGVyLmNhbnZhcy5zdGF0ZSA9IFtcbiAgICAgICAgcmdiU3RyaW5nKGhzbFRvUmdiKGh1ZSwgMCwgbHVtKSksXG4gICAgICAgIHJnYlN0cmluZyhoc2xUb1JnYihodWUsIDEwMCwgbHVtKSksXG4gICAgXVxuICAgIHNhdFNsaWRlci52YWx1ZSA9IHNhdFxufVxuXG5mdW5jdGlvbiB1cGRhdGVMdW0oKSB7XG4gICAgbHVtU2xpZGVyLmNhbnZhcy5zdGF0ZSA9IFsnIzAwMCcsIHJnYlN0cmluZyhoc2xUb1JnYihodWUsIHNhdCwgNTApKSwgJyNmZmYnXVxuXG4gICAgbHVtU2xpZGVyLnZhbHVlID0gbHVtXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVJlZCgpIHtcbiAgICBjb25zdCBbciwgZywgYl0gPSBoc2xUb1JnYihodWUsIHNhdCwgbHVtKVxuICAgIHJlZFNsaWRlci5jYW52YXMuc3RhdGUgPSBbXG4gICAgICAgIHJnYlN0cmluZyhbMCwgZywgYl0pLFxuICAgICAgICByZ2JTdHJpbmcoWzI1NSwgZywgYl0pLFxuICAgIF1cblxuICAgIHJlZFNsaWRlci52YWx1ZSA9IHJcbn1cblxuZnVuY3Rpb24gdXBkYXRlR3JlZW4oKSB7XG4gICAgY29uc3QgW3IsIGcsIGJdID0gaHNsVG9SZ2IoaHVlLCBzYXQsIGx1bSlcbiAgICBncmVlblNsaWRlci5jYW52YXMuc3RhdGUgPSBbXG4gICAgICAgIHJnYlN0cmluZyhbciwgMCwgYl0pLFxuICAgICAgICByZ2JTdHJpbmcoW3IsIDI1NSwgYl0pLFxuICAgIF1cblxuICAgIGdyZWVuU2xpZGVyLnZhbHVlID0gZ1xufVxuXG5mdW5jdGlvbiB1cGRhdGVCbHVlKCkge1xuICAgIGNvbnN0IFtyLCBnLCBiXSA9IGhzbFRvUmdiKGh1ZSwgc2F0LCBsdW0pXG4gICAgYmx1ZVNsaWRlci5jYW52YXMuc3RhdGUgPSBbXG4gICAgICAgIHJnYlN0cmluZyhbciwgZywgMF0pLFxuICAgICAgICByZ2JTdHJpbmcoW3IsIGcsIDI1NV0pLFxuICAgIF1cblxuICAgIGJsdWVTbGlkZXIudmFsdWUgPSBiXG59XG4iLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICcuLi91dGlsL2V2ZW50RW1pdHRlcidcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gJy4uL2NhbnZhcy9jYW52YXMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgU2xpZGVyMmRPcHRpb25zIHtcbn1cblxuZXhwb3J0IGNsYXNzIENpcmN1bGFyU2xpZGVyPFMgZXh0ZW5kcyB7fSB8IHZvaWQ+IHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KClcblxuICAgIHB1YmxpYyByZWFkb25seSBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNhbnZhczogQ2FudmFzPFM+LCBvcHRpb25zOiBTbGlkZXIyZE9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5pbml0RWxlbWVudCgpXG4gICAgICAgIHRoaXMubWFrZVZhbHVlVmlzaWJsZSgpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0RWxlbWVudCgpIHtcbiAgICAgICAgdGhpcy5lbGVtLmNsYXNzTmFtZSA9ICdzbGlkZXIgYy1zbGlkZXInXG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcy5lbGVtKVxuXG4gICAgICAgIGNvbnN0IGlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgaW5uZXIuY2xhc3NOYW1lID0gJ3NsaWRlci1pbm5lciBjLXNsaWRlci1pbm5lcidcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKGlubmVyKVxuXG4gICAgICAgIHRoaXMuaGFuZGxlLmNsYXNzTmFtZSA9ICdzbGlkZXItaGFuZGxlIGMtc2xpZGVyLWhhbmRsZSdcbiAgICAgICAgaW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5oYW5kbGUpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYWtlVmFsdWVWaXNpYmxlKCkge1xuICAgICAgICAvL1RPRE9cbiAgICAgICAgdGhpcy5oYW5kbGUuc3R5bGUubGVmdCA9IGAxMDAlYFxuICAgICAgICB0aGlzLmhhbmRsZS5zdHlsZS50b3AgPSBgNTAlYFxuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJy4uL3V0aWwvZXZlbnRFbWl0dGVyJ1xuaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSAnLi4vY2FudmFzL2NhbnZhcydcbmltcG9ydCB7IERpcmVjdGlvbiwgZ2V0U2lnbkZvclNsaWRlcktleXByZXNzLCBrZXlUb0RpcmVjdGlvbiB9IGZyb20gJy4uL3V0aWwvZGlyZWN0aW9uJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFNsaWRlck9wdGlvbnMge1xuICAgIG1pbjogbnVtYmVyLFxuICAgIG1heDogbnVtYmVyLFxuICAgIGluaXRpYWw/OiBudW1iZXIsXG4gICAgcm91bmRpbmc/OiAobjogbnVtYmVyKSA9PiBudW1iZXIsXG4gICAgc21hbGxTdGVwPzogbnVtYmVyLFxuICAgIHN0ZXA/OiBudW1iZXIsXG4gICAgZGlyZWN0aW9uPzogRGlyZWN0aW9uLFxufVxuXG5leHBvcnQgY2xhc3MgTGluZWFyU2xpZGVyPFMgZXh0ZW5kcyB7fSB8IHZvaWQ+IHtcbiAgICBwcml2YXRlIF92YWx1ZTogbnVtYmVyXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IG1pbjogbnVtYmVyXG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXg6IG51bWJlclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm91bmRpbmc6IChuOiBudW1iZXIpID0+IG51bWJlclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RlcDogbnVtYmVyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzbWFsbFN0ZXA6IG51bWJlclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGlyZWN0aW9uOiBEaXJlY3Rpb25cbiAgICBwcml2YXRlIHJlYWRvbmx5IGlzVmVydGljYWw6IGJvb2xlYW5cblxuICAgIHB1YmxpYyByZWFkb25seSBldmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKVxuXG4gICAgcHVibGljIHJlYWRvbmx5IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjYW52YXM6IENhbnZhczxTPiwgb3B0aW9uczogU2xpZGVyT3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5taW4gPiBvcHRpb25zLm1heCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBtaW4gKCR7b3B0aW9ucy5taW59KSBpcyBiaWdnZXIgdGhhbiBtYXggKCR7b3B0aW9ucy5tYXh9KWApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1pbiA9IG9wdGlvbnMubWluXG4gICAgICAgIHRoaXMubWF4ID0gb3B0aW9ucy5tYXhcbiAgICAgICAgaWYgKG9wdGlvbnMuaW5pdGlhbCA9PSBudWxsKSBvcHRpb25zLmluaXRpYWwgPSBvcHRpb25zLm1pblxuXG4gICAgICAgIGlmIChvcHRpb25zLmluaXRpYWwgPCBvcHRpb25zLm1pbiB8fCBvcHRpb25zLmluaXRpYWwgPiBvcHRpb25zLm1heCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbml0aWFsIHZhbHVlICgke29wdGlvbnMuaW5pdGlhbH0pIG91dCBvZiBib3VuZHMgKCR7b3B0aW9ucy5taW59LCAke29wdGlvbnMubWF4fSlgKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3VuZGluZyA9IG9wdGlvbnMucm91bmRpbmcgfHwgKChuOiBudW1iZXIpID0+IG4pXG4gICAgICAgIHRoaXMuc3RlcCA9IG9wdGlvbnMuc3RlcCB8fCAxXG4gICAgICAgIHRoaXMuc21hbGxTdGVwID0gb3B0aW9ucy5zbWFsbFN0ZXAgfHwgdGhpcy5zdGVwXG5cbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbiB8fCBEaXJlY3Rpb24uUmlnaHRcbiAgICAgICAgdGhpcy5pc1ZlcnRpY2FsID0gdGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5VcCB8fCB0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkRvd25cblxuICAgICAgICB0aGlzLl92YWx1ZSA9IG9wdGlvbnMuaW5pdGlhbFxuXG4gICAgICAgIHRoaXMuaW5pdEVsZW1lbnQoKVxuICAgICAgICB0aGlzLm1ha2VWYWx1ZVZpc2libGUoKVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlXG4gICAgfVxuXG4gICAgcHVibGljIHNldCB2YWx1ZSh2OiBudW1iZXIpIHtcbiAgICAgICAgdiA9IE1hdGgubWF4KHRoaXMubWluLCBNYXRoLm1pbih0aGlzLm1heCwgdikpXG4gICAgICAgIHYgPSB0aGlzLnJvdW5kaW5nKHYpXG4gICAgICAgIGlmICh2ICE9PSB0aGlzLl92YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB2XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdjaGFuZ2UnLCB2KVxuICAgICAgICAgICAgdGhpcy5tYWtlVmFsdWVWaXNpYmxlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdmFsdWVSZWxhdGl2ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKHRoaXMuX3ZhbHVlIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pXG4gICAgfVxuXG4gICAgcHVibGljIHNldCB2YWx1ZVJlbGF0aXZlKHY6IG51bWJlcikge1xuICAgICAgICB2ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgdikpXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbiArIHYgKiAodGhpcy5tYXggLSB0aGlzLm1pbilcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRFbGVtZW50KCkge1xuICAgICAgICBjb25zdCBkaXIgPSB0aGlzLmlzVmVydGljYWwgPyAndicgOiAnaCdcblxuICAgICAgICB0aGlzLmVsZW0uY2xhc3NOYW1lID0gYHNsaWRlciAke2Rpcn0tc2xpZGVyYFxuICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMuZWxlbSlcblxuICAgICAgICBjb25zdCBpbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGlubmVyLmNsYXNzTmFtZSA9IGBzbGlkZXItaW5uZXIgJHtkaXJ9LXNsaWRlci1pbm5lcmBcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKGlubmVyKVxuXG4gICAgICAgIHRoaXMuaGFuZGxlLmNsYXNzTmFtZSA9IGBzbGlkZXItaGFuZGxlICR7ZGlyfS1zbGlkZXItaGFuZGxlYFxuICAgICAgICBpbm5lci5hcHBlbmRDaGlsZCh0aGlzLmhhbmRsZSlcblxuICAgICAgICBsZXQgaXNQcmVzc2VkID0gZmFsc2VcblxuICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5idXR0b24gPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlUmVsYXRpdmUgPSBnZXRSZWxhdGl2ZVZhbHVlKGlubmVyLCBlLCB0aGlzLmRpcmVjdGlvbilcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdpbnB1dCcsIHRoaXMuX3ZhbHVlKVxuICAgICAgICAgICAgICAgIGlzUHJlc3NlZCA9IHRydWVcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaGFuZGxlLmZvY3VzKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IGlzS2V5ZG93biA9IGZhbHNlXG4gICAgICAgIHRoaXMuaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZXNzZWQgPSBrZXlUb0RpcmVjdGlvbihlLmtleSlcbiAgICAgICAgICAgIGlmIChwcmVzc2VkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSBpc0tleWRvd24gPyB0aGlzLnN0ZXAgOiB0aGlzLnNtYWxsU3RlcFxuICAgICAgICAgICAgICAgIGNvbnN0IHNpZ24gPSBnZXRTaWduRm9yU2xpZGVyS2V5cHJlc3MocHJlc3NlZCwgdGhpcy5kaXJlY3Rpb24pXG5cbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlICs9IHNpZ24gKiB2YWxcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdpbnB1dCcsIHRoaXMuX3ZhbHVlKVxuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc0tleWRvd24gPSB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgaXNLZXlkb3duID0gZmFsc2VcbiAgICAgICAgfSlcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNQcmVzc2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVJlbGF0aXZlID0gZ2V0UmVsYXRpdmVWYWx1ZShpbm5lciwgZSwgdGhpcy5kaXJlY3Rpb24pXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnaW5wdXQnLCB0aGlzLl92YWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiBpc1ByZXNzZWQgPSBmYWxzZSlcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiBpc1ByZXNzZWQgPSBmYWxzZSlcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ha2VWYWx1ZVZpc2libGUoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLlJpZ2h0OlxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlLnN0eWxlLmxlZnQgPSBgJHt0aGlzLnZhbHVlUmVsYXRpdmUgKiAxMDB9JWBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uTGVmdDpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZS5zdHlsZS5sZWZ0ID0gYCR7MTAwIC0gdGhpcy52YWx1ZVJlbGF0aXZlICogMTAwfSVgXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLlVwOlxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlLnN0eWxlLnRvcCA9IGAkezEwMCAtIHRoaXMudmFsdWVSZWxhdGl2ZSAqIDEwMH0lYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OiAvLyBEb3duXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGUuc3R5bGUudG9wID0gYCR7dGhpcy52YWx1ZVJlbGF0aXZlICogMTAwfSVgXG5cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpdmVWYWx1ZShlbGVtOiBIVE1MRWxlbWVudCwgZTogTW91c2VFdmVudCwgZGlyZWN0aW9uOiBEaXJlY3Rpb24pOiBudW1iZXIge1xuICAgIGNvbnN0IGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICBjYXNlIERpcmVjdGlvbi5SaWdodDpcbiAgICAgICAgICAgIHJldHVybiAoZS5jbGllbnRYIC0gYm94LmxlZnQpIC8gYm94LndpZHRoXG4gICAgICAgIGNhc2UgRGlyZWN0aW9uLkxlZnQ6XG4gICAgICAgICAgICByZXR1cm4gMSAtIChlLmNsaWVudFggLSBib3gubGVmdCkgLyBib3gud2lkdGhcbiAgICAgICAgY2FzZSBEaXJlY3Rpb24uVXA6XG4gICAgICAgICAgICByZXR1cm4gMSAtIChlLmNsaWVudFkgLSBib3gudG9wKSAvIGJveC5oZWlnaHRcbiAgICAgICAgZGVmYXVsdDogLy8gRG93blxuICAgICAgICAgICAgcmV0dXJuIChlLmNsaWVudFkgLSBib3gudG9wKSAvIGJveC5oZWlnaHRcbiAgICB9XG59XG4iLCJleHBvcnQgZW51bSBEaXJlY3Rpb24ge1xuICAgIFJpZ2h0LFxuICAgIExlZnQsXG4gICAgRG93bixcbiAgICBVcCxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVRvRGlyZWN0aW9uKGtleTogc3RyaW5nKTogRGlyZWN0aW9uIHwgbnVsbCB7XG4gICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6IHJldHVybiBEaXJlY3Rpb24uUmlnaHRcbiAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzogIHJldHVybiBEaXJlY3Rpb24uTGVmdFxuICAgICAgICBjYXNlICdBcnJvd0Rvd24nOiAgcmV0dXJuIERpcmVjdGlvbi5Eb3duXG4gICAgICAgIGNhc2UgJ0Fycm93VXAnOiAgICByZXR1cm4gRGlyZWN0aW9uLlVwXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiBudWxsXG4gICAgfVxufVxuXG4vLyBtYXBwaW5nW3NsaWRlckRpcl1bcHJlc3NlZF0gPT4gZmFjdG9yXG5jb25zdCBtYXBwaW5nID0gW1xuICAgIC8vIFJpZ2h0XG4gICAgWzEsIC0xLCAtMSwgMV0sXG4gICAgLy8gTGVmdFxuICAgIFstMSwgMSwgMSwgLTFdLFxuICAgIC8vIERvd25cbiAgICBbLTEsIDEsIDEsIC0xXSxcbiAgICAvLyBVcFxuICAgIFsxLCAtMSwgLTEsIDFdLFxuXVxuXG4vKipcbiAqIFJldHVybnMgMSBvciAtMVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2lnbkZvclNsaWRlcktleXByZXNzKHByZXNzZWQ6IERpcmVjdGlvbiwgc2xpZGVyRGlyOiBEaXJlY3Rpb24pOiBudW1iZXIge1xuICAgIHJldHVybiBtYXBwaW5nW3NsaWRlckRpcl1bcHJlc3NlZF1cbn1cbiIsIlxuZXhwb3J0IGNsYXNzIEV2ZW50RW1pdHRlcjxUIGV4dGVuZHMge30gfCB2b2lkPiB7XG4gICAgcHJpdmF0ZSBsaXN0ZW5lcnM6IHsgW3R5cGU6IHN0cmluZ106ICgoZXZlbnQ6IFQpID0+IHZvaWQpW10gfSA9IHt9O1xuXG4gICAgcHVibGljIG9uKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IChldmVudDogVCkgPT4gdm9pZCkge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbdHlwZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKVxuICAgIH1cblxuICAgIHB1YmxpYyBvZmYodHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogKGV2ZW50OiBUKSA9PiB2b2lkKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1t0eXBlXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgYXJyID0gdGhpcy5saXN0ZW5lcnNbdHlwZV07XG4gICAgICAgICAgICBsZXQgaXggPSBhcnIuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpeCwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbWl0KHR5cGU6IHN0cmluZywgZXZlbnQ6IFQpIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzW3R5cGVdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcihldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==