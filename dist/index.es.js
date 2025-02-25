import React, { Component } from 'react';
import RAFManager from 'raf-manager';
import Proton from 'proton-engine';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Rand = function () {
    function Rand() {
        classCallCheck(this, Rand);

        this.list = [];
    }

    createClass(Rand, [{
        key: "set",
        value: function set$$1(probability, target) {
            this.list.push({
                probability: probability,
                target: target,
                a: 0,
                b: 1
            });

            this.calculation();
        }
    }, {
        key: "calculation",
        value: function calculation() {
            var total = 0;
            for (var i = 0; i < this.list.length; i++) {
                total += this.list[i].probability;
            }

            for (var _i = 0; _i < this.list.length; _i++) {
                var obj = this.list[_i];
                var val = obj.probability / total;

                obj.a = _i === 0 ? 0 : this.list[_i - 1].b;
                obj.b = obj.a + val;
            }
        }
    }, {
        key: "getResult",
        value: function getResult() {
            var val = Math.random();
            for (var i = 0; i < this.list.length; i++) {
                var obj = this.list[i];

                if (val <= obj.b && val > obj.a) {
                    return obj.target;
                }
            }

            return this.list[0].target;
        }
    }]);
    return Rand;
}();

var Canvas = function (_React$Component) {
  inherits(Canvas, _React$Component);

  function Canvas(props) {
    classCallCheck(this, Canvas);

    var _this = possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, props));

    _this.size = { width: 0, height: 0 };
    _this.canvasRef = React.createRef();
    return _this;
  }

  createClass(Canvas, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      setTimeout(function () {
        _this2.initCanvas();
        _this2.resize = _this2.resize.bind(_this2);
        window.addEventListener("resize", _this2.resize);
      }, 100);

      var canvas = this.canvasRef.current;
      this.props.onCanvasDidMount && this.props.onCanvasDidMount(canvas);
    }
  }, {
    key: "initCanvas",
    value: function initCanvas() {
      var canvas = this.canvasRef.current;
      if (this.props.globalCompositeOperation) {
        var context = canvas.getContext("2d");
        context.globalCompositeOperation = this.props.globalCompositeOperation;
      }

      var _setCanvasSize = this.setCanvasSize(canvas),
          width = _setCanvasSize.width,
          height = _setCanvasSize.height;

      this.heartbeatDetectionCanvasSize(canvas);
      this.props.onCanvasInited(canvas, width, height);
    }
  }, {
    key: "heartbeatDetectionCanvasSize",
    value: function heartbeatDetectionCanvasSize(canvas) {
      var _this3 = this;

      setInterval(function () {
        var newHeight = _this3.canvasRef.current.clientHeight;
        if (newHeight !== _this3.size.height) {
          var _setCanvasSize2 = _this3.setCanvasSize(canvas),
              width = _setCanvasSize2.width,
              height = _setCanvasSize2.height;

          _this3.props.onResize && _this3.props.onResize(width, height);
        }
      }, 1000 / 10);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("resize", this.resize);
    }
  }, {
    key: "resize",
    value: function resize() {
      var canvas = this.canvasRef.current;

      var _setCanvasSize3 = this.setCanvasSize(canvas),
          width = _setCanvasSize3.width,
          height = _setCanvasSize3.height;

      this.props.onResize && this.props.onResize(width, height);
    }
  }, {
    key: "setCanvasSize",
    value: function setCanvasSize(canvas) {
      var width = this.canvasRef.current.clientWidth;
      var height = this.canvasRef.current.clientHeight;
      this.size.width = width;
      this.size.height = height;
      canvas.width = width;
      canvas.height = height;

      return { width: width, height: height };
    }
  }, {
    key: "handleWaypointEnter",
    value: function handleWaypointEnter() {
      RAFManager.start();
    }
  }, {
    key: "handleWaypointLeave",
    value: function handleWaypointLeave() {
      RAFManager.stop();
    }
  }, {
    key: "getStyle",
    value: function getStyle() {
      var style = { width: "100%", height: "100%" };

      if (this.props.bg) {
        style = Object.assign(style, {
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0
        });
      }
      return style;
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(e) {
      this.props.onMouseDown && this.props.onMouseDown(e);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("canvas", {
        ref: this.canvasRef,
        onMouseDown: this.handleMouseDown.bind(this),
        style: this.getStyle()
      });
    }
  }]);
  return Canvas;
}(React.Component);

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {};
}

function getColor(color, a) {
    var c = void 0;
    if (color) {
        c = hexToRgb(color);
        return "rgba(" + c.r + "," + c.g + "," + c.b + ", " + a + ")";
    } else {
        return null;
    }
}

var Ball = function (_React$Component) {
  inherits(Ball, _React$Component);

  function Ball(props) {
    classCallCheck(this, Ball);

    var _this = possibleConstructorReturn(this, (Ball.__proto__ || Object.getPrototypeOf(Ball)).call(this, props));

    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Ball, [{
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas, width, height);
      this.createMiniEmitter(canvas);
      RAFManager.add(this.renderProton);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "onResize",
    value: function onResize() {}
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      var _this2 = this;

      var context = canvas.getContext("2d");
      this.proton = new Proton();

      var emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.props.num ? new Proton.Span(this.props.num) : new Proton.Span(4, 9), new Proton.Span(0.8, 1.3));

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(1, 50));
      emitter.addInitialize(new Proton.Life(5, 6));
      emitter.addInitialize(new Proton.Velocity(new Proton.Span(5, 8), new Proton.Span(30, 70), "polar"));

      emitter.addBehaviour(new Proton.Alpha(1, 0));
      emitter.addBehaviour(new Proton.Color(["#36aaf3", "#fd769c", "#94ff22", "#ffa545", "#ffffff"]));
      emitter.addBehaviour(new Proton.Scale(0.7, 1));
      emitter.addBehaviour(new Proton.Gravity(3));
      emitter.addBehaviour(new Proton.Collision(emitter));
      emitter.addBehaviour(this.customDeadBehaviour(canvas));
      emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), "bound"));

      emitter.p.x = Math.min(500, Math.max(canvas.width / 2 - 400, 50));
      emitter.p.y = canvas.height / 2 + 50;
      emitter.emit();
      this.proton.addEmitter(emitter);

      var renderer = new Proton.CanvasRenderer(canvas);
      renderer.onProtonUpdate = function () {
        context.fillStyle = getColor(_this2.props.color, 0.2) || "rgba(255, 255, 255, 0.2)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };
      this.proton.addRenderer(renderer);
    }
  }, {
    key: "customDeadBehaviour",
    value: function customDeadBehaviour(canvas) {
      var _this3 = this;

      return {
        initialize: function initialize(particle) {},
        applyBehaviour: function applyBehaviour(particle) {
          if (particle.p.y + particle.radius >= canvas.height) {
            if (particle.radius > 9) {
              _this3.miniEmitteing(particle);
              particle.dead = true;
            }
          }
        }
      };
    }
  }, {
    key: "createMiniEmitter",
    value: function createMiniEmitter(canvas) {
      var miniEmitter = new Proton.Emitter();
      miniEmitter.rate = new Proton.Rate(new Proton.Span(3, 6), new Proton.Span(1, 2));

      miniEmitter.addInitialize(new Proton.Mass(1));
      miniEmitter.radiusInitialize = new Proton.Radius();
      miniEmitter.addInitialize(miniEmitter.radiusInitialize);
      miniEmitter.addInitialize(new Proton.Life(0.5, 1));
      miniEmitter.addInitialize(new Proton.V(new Proton.Span(1.5, 3), new Proton.Span(0, 70, true), "polar"));

      miniEmitter.colorBehaviour = new Proton.Color("#ffffff");
      miniEmitter.addBehaviour(new Proton.Alpha(1, 0));
      miniEmitter.addBehaviour(miniEmitter.colorBehaviour);
      miniEmitter.addBehaviour(new Proton.Gravity(4));
      miniEmitter.addBehaviour(new Proton.Collision(miniEmitter));
      miniEmitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), "bound"));
      this.proton.addEmitter(miniEmitter);

      this.miniEmitter = miniEmitter;
    }
  }, {
    key: "miniEmitteing",
    value: function miniEmitteing(particle) {
      var miniEmitter = this.miniEmitter;
      miniEmitter.radiusInitialize.reset(particle.radius * 0.05, particle.radius * 0.2);
      miniEmitter.colorBehaviour.reset(particle.color);
      miniEmitter.p.x = particle.p.x;
      miniEmitter.p.y = particle.p.y;
      miniEmitter.emit("once");
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      this.proton && this.proton.update();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "darker",
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Ball;
}(React.Component);

var Color = function (_React$Component) {
  inherits(Color, _React$Component);

  function Color(props) {
    classCallCheck(this, Color);

    var _this = possibleConstructorReturn(this, (Color.__proto__ || Object.getPrototypeOf(Color)).call(this, props));

    _this.colors = ["#529B88", "#CDD180", "#FFFA32", "#FB6255", "#FB4A53", "#FF4E50", "#F9D423"];
    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Color, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas, width, height);
      RAFManager.add(this.renderProton);
    }
  }, {
    key: "onResize",
    value: function onResize() {}
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      this.proton = new Proton();
      var emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.props.num ? new Proton.Span(this.props.num) : new Proton.Span(5, 8), new Proton.Span(0.1, 0.25));

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(20, 200));
      emitter.addInitialize(new Proton.Life(2, 4));
      emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, width, height)));

      emitter.addBehaviour(new Proton.Alpha(0, 1, Infinity, Proton.easeOutCubic));
      emitter.addBehaviour(new Proton.Scale(1, 0, Infinity, Proton.easeOutCubic));
      emitter.addBehaviour(new Proton.Color(this.colors, "random"));

      emitter.emit();
      this.proton.addEmitter(emitter);

      var renderer = new Proton.CanvasRenderer(canvas);
      this.proton.addRenderer(renderer);
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      this.proton && this.proton.update();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "darker",
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Color;
}(React.Component);

var Color$1 = function (_React$Component) {
    inherits(Color, _React$Component);

    function Color(props) {
        classCallCheck(this, Color);

        var _this = possibleConstructorReturn(this, (Color.__proto__ || Object.getPrototypeOf(Color)).call(this, props));

        _this.colors = ["#529B88", "#CDD180", "#FFFA32", "#FB6255", "#FB4A53", "#FF4E50", "#F9D423"];
        _this.renderProton = _this.renderProton.bind(_this);
        return _this;
    }

    createClass(Color, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            try {
                RAFManager.remove(this.renderProton);
                this.proton.destroy();
            } catch (e) {}
        }
    }, {
        key: "onCanvasInited",
        value: function onCanvasInited(canvas, width, height) {
            this.createProton(canvas, width, height);
            RAFManager.add(this.renderProton);
        }
    }, {
        key: "onResize",
        value: function onResize(width, height) {
            this.crossZoneBehaviour.zone.width = width;
            this.crossZoneBehaviour.zone.height = height;
            this.proton.renderers[0].resize(width, height);        }
    }, {
        key: "getProp",
        value: function getProp(key, defaultVal) {
            var config = this.props.config || {};
            var val = config[key] || defaultVal;
            if (Array.isArray(val)) {
                return new Proton.Span(val[0], val[1]);
            } else {
                return val;
            }
        }
    }, {
        key: "getArrProp",
        value: function getArrProp(key, defaultVal) {
            var config = this.props.config || {};
            var val = config[key] || defaultVal;
            if (!val) return null;

            if (Array.isArray(val)) {
                return val;
            } else {
                return [val, val];
            }
        }
    }, {
        key: "createProton",
        value: function createProton(canvas, width, height) {
            var num = this.getProp("num", [5, 8]);
            var rps = this.getProp("rps", [0.1, 0.2]);
            var mass = this.getProp("mass", 1);
            var radius = this.getProp("radius", [10, 30]);
            var life = this.getProp("life", [2, 3]);
            var body = this.getProp("body");
            var position = this.getProp("position");
            var v = this.getProp("v", [2, 3]);
            var tha = this.getProp("tha", [-15, 15]);
            var alpha = this.getArrProp("alpha");
            var scale = this.getArrProp("scale");
            var color = this.getArrProp("color");
            var cross = this.getProp("cross", "dead");
            var random = this.getProp("random");
            var emitterV = this.getProp("emitter");

            this.proton = new Proton();
            var emitter = void 0;
            if (emitterV === "follow") {
                emitter = new Proton.FollowEmitter();
            } else {
                emitter = new Proton.Emitter();
            }
            emitter.rate = new Proton.Rate(num, rps);

            emitter.addInitialize(new Proton.Mass(mass));
            emitter.addInitialize(new Proton.Radius(radius));
            emitter.addInitialize(new Proton.Life(life));
            emitter.addInitialize(new Proton.Velocity(v, tha, "polar"));

            if (body) emitter.addInitialize(new Proton.Body(body));
            var pos = void 0;
            if (position === "all" || position === "screen") {
                pos = new Proton.Position(new Proton.RectZone(0, 0, canvas.width, canvas.height));
            } else if ((typeof position === "undefined" ? "undefined" : _typeof(position)) === "object") {
                pos = new Proton.Position(new Proton.RectZone(position.x, position.y, position.width, position.height));
            } else {
                emitter.p.x = canvas.width / 2;
                emitter.p.y = canvas.height / 2;
            }

            emitter.addInitialize(pos);

            /// behaviour
            var alphaB = alpha ? new Proton.Alpha(alpha[0], alpha[1]) : new Proton.Alpha(0, 1);
            var scaleB = scale ? new Proton.Scale(scale[0], scale[1]) : new Proton.Scale(1, 0.2);
            var colorB = color ? new Proton.Color(color[0], color[1]) : new Proton.Color(this.colors);

            emitter.addBehaviour(alphaB);
            emitter.addBehaviour(scaleB);
            emitter.addBehaviour(colorB);

            var zone = new Proton.RectZone(0, 0, canvas.width, canvas.height);
            var crossZoneBehaviour = new Proton.CrossZone(zone, cross);
            emitter.addBehaviour(crossZoneBehaviour);

            random && emitter.addBehaviour(new Proton.RandomDrift(random, random, 0.05));

            emitter.emit();
            this.proton.addEmitter(emitter);

            var renderer = this.createRenderer(canvas);
            this.proton.addRenderer(renderer);

            this.emitter = emitter;
            this.crossZoneBehaviour = crossZoneBehaviour;
        }
    }, {
        key: "createRenderer",
        value: function createRenderer(canvas) {
            var width = canvas.width;
            var height = canvas.height;
            var context = canvas.getContext("2d");
            var renderer = new Proton.CanvasRenderer(canvas);

            var onUpdate = this.getProp("onUpdate");
            if (onUpdate) {
                renderer.onProtonUpdate = function () {
                    onUpdate(context, width, height);
                };
            }

            var onParticleCreated = this.getProp("onParticleCreated");
            if (onParticleCreated) {
                renderer.onParticleCreated = function (particle) {
                    onParticleCreated(context, particle);
                };
            }

            var onParticleUpdate = this.getProp("onParticleUpdate");
            if (onParticleUpdate) {
                renderer.onParticleUpdate = function (particle) {
                    onParticleUpdate(context, particle);
                };
            }

            return renderer;
        }
    }, {
        key: "renderProton",
        value: function renderProton() {
            this.proton && this.proton.update();
        }
    }, {
        key: "handleMouseDown",
        value: function handleMouseDown(e) {
            var onMouseDown = this.getProp("onMouseDown");
            if (onMouseDown) {
                onMouseDown(e);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var globalCompositeOperation = this.props.globalCompositeOperation || this.props.operation || "source-over";

            return React.createElement(Canvas, {
                bg: this.props.bg,
                onMouseDown: this.handleMouseDown.bind(this),
                globalCompositeOperation: globalCompositeOperation,
                onCanvasInited: this.onCanvasInited.bind(this),
                onResize: this.onResize.bind(this)
            });
        }
    }]);
    return Color;
}(React.Component);

var Lines = function (_React$Component) {
  inherits(Lines, _React$Component);

  function Lines(props) {
    classCallCheck(this, Lines);

    var _this = possibleConstructorReturn(this, (Lines.__proto__ || Object.getPrototypeOf(Lines)).call(this, props));

    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Lines, [{
    key: "onCanvasDidMount",
    value: function onCanvasDidMount(canvas) {
      if (this.props.color) {
        canvas.style.backgroundColor = this.props.color;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas, width, height);
      RAFManager.add(this.renderProton);
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    }
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      this.proton = new Proton();

      var emitter = new Proton.Emitter();
      emitter.damping = 0.008;
      emitter.rate = new Proton.Rate(this.props.num ? this.props.num : 250);
      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(4));
      emitter.addInitialize(new Proton.Velocity(new Proton.Span(1.5), new Proton.Span(0, 360), "polar"));
      var mouseObj = {
        x: width / 2,
        y: height / 2
      };

      var attractionBehaviour = new Proton.Attraction(mouseObj, 0, 0);
      var crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), "cross");
      emitter.addBehaviour(new Proton.Color("random"));
      emitter.addBehaviour(attractionBehaviour, crossZoneBehaviour);
      emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.05));
      emitter.p.x = canvas.width / 2;
      emitter.p.y = canvas.height / 2;
      emitter.emit("once");

      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas));
      this.crossZoneBehaviour = crossZoneBehaviour;
    }
  }, {
    key: "createRenderer",
    value: function createRenderer(canvas) {
      var _this2 = this;

      var context = canvas.getContext("2d");
      var renderer = new Proton.CanvasRenderer(canvas);
      renderer.onProtonUpdate = function () {
        context.fillStyle = getColor(_this2.props.color, 0.02) || "rgba(0, 0, 0, 0.02)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleUpdate = function (particle) {
        context.beginPath();
        context.strokeStyle = particle.color;
        context.lineWidth = 1;
        context.moveTo(particle.old.p.x, particle.old.p.y);
        context.lineTo(particle.p.x, particle.p.y);
        context.closePath();
        context.stroke();
      };

      return renderer;
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      this.proton && this.proton.update();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "darker",
        onCanvasDidMount: this.onCanvasDidMount.bind(this),
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Lines;
}(React.Component);

var Thick = function (_React$Component) {
  inherits(Thick, _React$Component);

  function Thick(props) {
    classCallCheck(this, Thick);

    var _this = possibleConstructorReturn(this, (Thick.__proto__ || Object.getPrototypeOf(Thick)).call(this, props));

    _this.hue = 0;
    _this.index = 0;
    _this.colorTemplate = "hsla(hue,80%,50%, 0.75)";
    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Thick, [{
    key: "onCanvasDidMount",
    value: function onCanvasDidMount(canvas) {
      if (this.props.color) {
        canvas.style.backgroundColor = this.props.color;
      }
    }
  }, {
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.canvas = canvas;
      this.createProton(canvas, width, height);
      RAFManager.add(this.renderProton);
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    }
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      this.proton = new Proton();

      var emitter = new Proton.Emitter();
      emitter.damping = 0.008;
      emitter.rate = new Proton.Rate(this.props.num ? this.props.num : 150);

      // Initialize
      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(8));
      emitter.addInitialize(new Proton.V(new Proton.Span(0.1, 0.5), new Proton.Span(0, 360), "polar"));
      emitter.addInitialize(new Proton.Position(new Proton.CircleZone(canvas.width / 2, canvas.height / 2, 100)));

      // Behaviour
      var crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), "cross");
      emitter.addBehaviour(crossZoneBehaviour);
      this.repulsion = new Proton.Repulsion({
        x: canvas.width / 2,
        y: canvas.height / 2 - 100
      }, 3, 300);

      this.attraction = new Proton.Attraction({
        x: canvas.width / 2,
        y: canvas.height / 2
      }, 3, 200);
      emitter.addBehaviour(this.attraction, this.repulsion);
      emitter.addBehaviour(new Proton.Color("random"));
      emitter.addBehaviour(new Proton.RandomDrift(20, 15, 0.15));

      emitter.emit("once");
      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas));
      this.crossZoneBehaviour = crossZoneBehaviour;
    }
  }, {
    key: "createRenderer",
    value: function createRenderer(canvas) {
      var _this2 = this;

      var context = canvas.getContext("2d");
      var renderer = new Proton.CanvasRenderer(canvas);

      renderer.onProtonUpdate = function () {
        _this2.hue += 1;
        context.fillStyle = getColor(_this2.props.color, 0.02) || "rgba(0, 0, 0, 0.02)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = function (particle) {
        particle.data.begin = Proton.MathUtil.randomAToB(1, 120);
        particle.data.tha = Proton.MathUtil.randomAToB(0, Math.PI * 2);
      };

      renderer.onParticleUpdate = function (particle) {
        var hue = particle.data.begin + _this2.hue;
        particle.color = _this2.colorTemplate.replace("hue", hue % 360);

        var ratio = 3 / 4;
        var radius = particle.radius * (1 - ratio) * Math.cos(particle.data.tha += 0.01) + particle.radius * ratio;

        context.beginPath();
        context.fillStyle = particle.color;
        context.arc(particle.p.x, particle.p.y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
      };

      return renderer;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      var canvas = this.canvas;
      this.proton.update();
      if (this.index % 200 === 0) {
        this.attraction.targetPosition.x = Math.random() * canvas.width;
        this.attraction.targetPosition.y = Math.random() * canvas.height;

        this.repulsion.targetPosition.x = Math.random() * canvas.width;
        this.repulsion.targetPosition.y = Math.random() * canvas.height;
      }

      this.index++;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        onCanvasDidMount: this.onCanvasDidMount.bind(this),
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Thick;
}(React.Component);

var Square = function (_React$Component) {
  inherits(Square, _React$Component);

  function Square(props) {
    classCallCheck(this, Square);

    var _this = possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).call(this, props));

    _this.colors = ["#fad390", "#81ecec", "#ffffff", "#badc58", "#f9ca24", "#FEA47F"];
    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Square, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "onCanvasDidMount",
    value: function onCanvasDidMount(canvas) {}
  }, {
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas, width, height);
      RAFManager.add(this.renderProton);
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      var dis = 150;
      this.crossZoneBehaviour.zone.width = width + 2 * dis;
      this.crossZoneBehaviour.zone.height = height + 2 * dis;
      this.proton.renderers[0].resize(width, height);
    }
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      this.proton = new Proton();
      var emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.props.num ? this.props.num : 50);
      emitter.damping = 0;

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(4, 70));
      emitter.addInitialize(new Proton.Velocity(new Proton.Span(2, 10), new Proton.Span(0), "polar"));
      emitter.addInitialize(new Proton.Position(new Proton.LineZone(0, canvas.height, canvas.width, canvas.height)));

      var dis = 150;
      var crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0 - dis, 0 - dis, canvas.width + 2 * dis, canvas.height + 2 * dis), "cross");
      emitter.addBehaviour(crossZoneBehaviour);
      emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.1, 0.55)));
      emitter.addBehaviour(new Proton.Color(this.colors));

      emitter.emit("once");
      this.proton.addEmitter(emitter);
      var renderer = this.createRenderer(canvas);
      this.proton.addRenderer(renderer);

      this.crossZoneBehaviour = crossZoneBehaviour;
      emitter.preEmit(2);
    }
  }, {
    key: "createRenderer",
    value: function createRenderer(canvas) {
      var context = canvas.getContext("2d");
      var renderer = new Proton.CustomRenderer();

      renderer.onProtonUpdate = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = function (particle) {
        var w = particle.radius || 60;
        var h = Proton.MathUtil.randomAToB(100, 200, "int");
        particle.data.w = w;
        particle.data.h = h;
      };

      renderer.onParticleUpdate = function (particle) {
        var w = particle.data.w;
        var h = particle.data.h;
        context.save();
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;

        context.translate(particle.p.x, particle.p.y);
        context.rotate(Proton.MathUtil.degreeTransform(particle.rotation));
        context.translate(-particle.p.x, -particle.p.y);

        context.beginPath();
        context.rect(particle.p.x - w / 2, particle.p.y - h / 2, w, h);

        context.closePath();
        context.fill();
        context.globalAlpha = 1;
        context.restore();
      };

      return renderer;
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      this.proton && this.proton.update();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "lighter",
        onCanvasDidMount: this.onCanvasDidMount.bind(this),
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Square;
}(React.Component);

var Cobweb = function (_React$Component) {
  inherits(Cobweb, _React$Component);

  function Cobweb(props) {
    classCallCheck(this, Cobweb);

    var _this = possibleConstructorReturn(this, (Cobweb.__proto__ || Object.getPrototypeOf(Cobweb)).call(this, props));

    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Cobweb, [{
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas, width, height);
      RAFManager.add(this.renderProton);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    }
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      this.proton = new Proton();

      var emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.props.num ? new Proton.Span(this.props.num) : new Proton.Span(100), new Proton.Span(0.05, 0.2));

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(1, 4));
      emitter.addInitialize(new Proton.Life(Infinity));

      var pointZone = new Proton.Position(new Proton.RectZone(0, 0, width, height));
      emitter.addInitialize(pointZone);
      emitter.addInitialize(new Proton.Velocity(new Proton.Span(0.3, 0.6), new Proton.Span(0, 360), "polar"));

      emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.2, 0.9)));
      emitter.addBehaviour(new Proton.Color(this.props.color || "#333"));
      this.crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, width, height), "cross");
      emitter.addBehaviour(this.crossZoneBehaviour);

      emitter.emit("once");
      emitter.damping = 0;
      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas, emitter));
    }
  }, {
    key: "createRenderer",
    value: function createRenderer(canvas, emitter) {
      var _this2 = this;

      var context = canvas.getContext("2d");
      var renderer = new Proton.CanvasRenderer(canvas);
      var R = 140;

      renderer.onProtonUpdateAfter = function () {
        var particles = emitter.particles;

        for (var i = 0; i < particles.length; i++) {
          for (var j = i + 1; j < particles.length; j++) {
            var pA = particles[i];
            var pB = particles[j];
            var dis = pA.p.distanceTo(pB.p);

            if (dis < R) {
              var alpha = (1 - dis / R) * 0.5;
              context.strokeStyle = getColor(_this2.props.color, alpha) || "rgba(3, 3, 3, " + alpha + ")";
              context.beginPath();
              context.moveTo(pA.p.x, pA.p.y);
              context.lineTo(pB.p.x, pB.p.y);
              context.closePath();
              context.stroke();
            }
          }
        }
      };

      return renderer;
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      this.proton && this.proton.update();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "darker",
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Cobweb;
}(React.Component);

var Circle = function (_React$Component) {
  inherits(Circle, _React$Component);

  function Circle(props) {
    classCallCheck(this, Circle);

    var _this = possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, props));

    _this.colors = ["#74b9ff", "#e84393", "#6c5ce7", "#00b894", "#fdcb6e", "#006266", "#1B1464"];

    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Circle, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas, width, height);
      RAFManager.add(this.renderProton);
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    }
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      this.proton = new Proton();

      var emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.props.num || 20);
      emitter.damping = 0.008;

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(30, 600));
      emitter.addInitialize(new Proton.Velocity(new Proton.Span(0.5), new Proton.Span(0, 360), "polar"));
      emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, canvas.width, canvas.height)));

      var crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), "cross");
      emitter.addBehaviour(crossZoneBehaviour);
      emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.35, 0.55)));
      emitter.addBehaviour(new Proton.Color(this.getColor()));
      emitter.addBehaviour(new Proton.RandomDrift(50, 50, 0.5));

      emitter.emit("once");
      this.proton.addEmitter(emitter);

      var renderer = new Proton.CanvasRenderer(canvas);
      this.proton.addRenderer(renderer);

      this.crossZoneBehaviour = crossZoneBehaviour;
    }
  }, {
    key: "getColor",
    value: function getColor() {
      var c = this.colors;
      if (this.props.color) {
        if (Array.isArray(this.props.color)) {
          c = this.props.color;
        } else {
          c = [this.props.color];
        }
      }

      return c;
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      this.proton && this.proton.update();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "darken",
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Circle;
}(React.Component);

var Tadpole = function (_React$Component) {
  inherits(Tadpole, _React$Component);

  function Tadpole(props) {
    classCallCheck(this, Tadpole);

    var _this = possibleConstructorReturn(this, (Tadpole.__proto__ || Object.getPrototypeOf(Tadpole)).call(this, props));

    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Tadpole, [{
    key: "onCanvasDidMount",
    value: function onCanvasDidMount(canvas) {}
  }, {
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas, width, height);
      this.renderProton();
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    }
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      this.proton = new Proton();

      var emitter = new Proton.Emitter();
      emitter.damping = 0.008;
      emitter.rate = new Proton.Rate(this.props.num ? this.props.num : 50);
      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(5, 9));
      emitter.addInitialize(new Proton.Velocity(new Proton.Span(1.5), new Proton.Span(0, 360), "polar"));
      emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, width, height)));

      var mouseInfo = {
        x: width / 2,
        y: height / 2
      };

      var attractionBehaviour = new Proton.Attraction(mouseInfo, 0, 0);
      var crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), "bound");
      emitter.addBehaviour(new Proton.Color(this.props.color || "#bbb"));
      //emitter.addBehaviour(new Proton.Alpha(new Proton.Span(0.5, 1)));
      emitter.addBehaviour(attractionBehaviour, crossZoneBehaviour);
      emitter.addBehaviour(new Proton.RandomDrift(15, 15, 0.05));
      emitter.emit("once");

      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas));
      this.crossZoneBehaviour = crossZoneBehaviour;
    }
  }, {
    key: "createRenderer",
    value: function createRenderer(canvas) {
      var jointCount = 10;
      var delayTime = 8;
      var context = canvas.getContext("2d");
      var renderer = new Proton.CanvasRenderer(canvas);

      renderer.onProtonUpdate = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = function (particle) {
        particle.data.points = [];
        particle.data.index = 0;
      };

      renderer.onParticleUpdate = function (particle) {
        drawTadpoleTail(particle);
        if (particle.data.index % delayTime === 0) fillPointsData(particle);
        drawTadpoleHead(particle);
        particle.data.index++;
      };

      var fillPointsData = function fillPointsData(particle) {
        particle.data.points.unshift(particle.p.y);
        particle.data.points.unshift(particle.p.x);

        if (particle.data.points.length > jointCount) {
          particle.data.points.pop();
          particle.data.points.pop();
        }
      };

      var drawTadpoleHead = function drawTadpoleHead(particle) {
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.p.x, particle.p.y, particle.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
      };

      var drawTadpoleTail = function drawTadpoleTail(particle) {
        context.beginPath();
        context.strokeStyle = particle.color;

        context.moveTo(particle.p.x, particle.p.y);

        var l = particle.data.points.length;
        for (var i = 0; i < l; i += 2) {
          var x = particle.data.points[i];
          var y = particle.data.points[i + 1];

          context.lineWidth = linearEvaluation(i, l);
          context.lineTo(x, y);
          context.stroke();
        }
      };

      var linearEvaluation = function linearEvaluation(i, l) {
        if (l <= 2) return 1;

        var max = 6;
        var A = (max - 1) / (2 / l - 1);
        var B = 1 - A;
        var X = (i + 2) / l;
        var val = A * X + B;
        val = val >> 0;

        return val;
      };

      return renderer;
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      var _this2 = this;

      RAFManager.add(function () {
        _this2.proton.update();
        //this.proton.stats.update();
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "darker",
        onCanvasDidMount: this.onCanvasDidMount.bind(this),
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Tadpole;
}(React.Component);

var COLOR = ["#f6b93b", "#18dcff", "#cd84f1", "#ED4C67", "#ffffff", "#b71540", "#32ff7e", "#ff3838"];

var Polygon = function (_React$Component) {
  inherits(Polygon, _React$Component);

  function Polygon(props) {
    classCallCheck(this, Polygon);

    var _this = possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this, props));

    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Polygon, [{
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas);
      this.createEmitter({
        canvas: canvas,
        x: width / 2,
        y: height / 2,
        mainEmitter: true,
        zone: "bound"
      });

      RAFManager.add(this.renderProton);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "onResize",
    value: function onResize() {}
  }, {
    key: "createProton",
    value: function createProton(canvas) {
      this.proton = new Proton();
      var renderer = this.createRenderer(canvas);
      this.proton.addRenderer(renderer);
    }
  }, {
    key: "createRenderer",
    value: function createRenderer(canvas) {
      var context = canvas.getContext("2d");
      var renderer = new Proton.CustomRenderer();

      renderer.onProtonUpdate = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = function (particle) {
        particle.data.count = Proton.MathUtil.randomAToB(3, 10, true);
      };

      renderer.onParticleUpdate = function (particle) {
        context.save();
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;

        context.translate(particle.p.x, particle.p.y);
        context.rotate(Proton.MathUtil.degreeTransform(particle.rotation));
        context.translate(-particle.p.x, -particle.p.y);

        context.beginPath();
        drawPolygon(particle, particle.data.count);

        context.closePath();
        context.fill();
        context.globalAlpha = 1;
        context.restore();
      };

      renderer.onParticleDead = function (particle) {};

      var drawPolygon = function drawPolygon(particle, count) {
        if (count >= 7) {
          context.arc(particle.p.x, particle.p.y, particle.radius, 0, Math.PI * 2, true);
        } else {
          var radius = particle.radius;

          for (var i = 0; i <= count; i++) {
            var x = particle.p.x + radius * Math.cos(Math.PI / 180 * 360 / count * i);
            var y = particle.p.y + radius * Math.sin(Math.PI / 180 * 360 / count * i);

            if (i === 0) context.moveTo(x, y);else context.lineTo(x, y);
          }
        }
      };

      return renderer;
    }
  }, {
    key: "createEmitter",
    value: function createEmitter(_ref) {
      var mainEmitter = _ref.mainEmitter,
          canvas = _ref.canvas,
          x = _ref.x,
          y = _ref.y,
          radius = _ref.radius,
          _ref$color = _ref.color,
          color = _ref$color === undefined ? COLOR : _ref$color,
          _ref$zone = _ref.zone,
          zone = _ref$zone === undefined ? "dead" : _ref$zone,
          _ref$once = _ref.once,
          once = _ref$once === undefined ? "all" : _ref$once,
          _ref$alpha = _ref.alpha,
          alpha = _ref$alpha === undefined ? 0.85 : _ref$alpha,
          _ref$gravity = _ref.gravity,
          gravity = _ref$gravity === undefined ? 3.5 : _ref$gravity;

      var emitter = this.proton.pool.get(Proton.Emitter);

      if (!emitter.completed) {
        emitter.rate = new Proton.Rate(this.props.num ? new Proton.Span(this.props.num) : new Proton.Span(4, 9), new Proton.Span(1.6, 2.2));

        var radiusInit = mainEmitter ? new Proton.Radius(10, 110) : new Proton.Radius(3, radius);
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(radiusInit);
        emitter.addInitialize(new Proton.Life(3, 6));
        emitter.addInitialize(new Proton.Velocity(new Proton.Span(4, 6), new Proton.Span(-90, 90), "polar"));

        emitter.addBehaviour(new Proton.Alpha(alpha, 0.2));
        emitter.addBehaviour(new Proton.Color(color));
        emitter.addBehaviour(new Proton.Scale(1, 0.3));
        emitter.addBehaviour(new Proton.Rotate());
        emitter.addBehaviour(new Proton.Gravity(gravity));

        emitter.addBehaviour(this.customDeadBehaviour(canvas));
        emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), zone));
      }

      emitter.p.x = x;
      emitter.p.y = y;
      if (once === "once") emitter.emit("once");else emitter.emit();

      this.proton.addEmitter(emitter);
      //this.expireEmitter(emitter);
    }
  }, {
    key: "expireEmitter",
    value: function expireEmitter(emitter) {
      var _this2 = this;

      setTimeout(function () {
        emitter.completed = true;
        _this2.proton.pool.expire(emitter);
        _this2.proton.removeEmitter(emitter);
      }, 500);
    }
  }, {
    key: "customDeadBehaviour",
    value: function customDeadBehaviour(canvas) {
      var _this3 = this;

      return {
        initialize: function initialize(particle) {
          particle.data = particle.data || {};
          particle.data.oldRadius = particle.radius;
          particle.data.emitterCount = 0;
        },
        applyBehaviour: function applyBehaviour(particle) {
          if (particle.radius < 5) return;
          if (particle.data.emitterCount >= 2) return;

          if (particle.radius <= 1 / 3 * particle.data.oldRadius) {
            particle.data.emitterCount++;
            _this3.createEmitter({
              canvas: canvas,
              x: particle.p.x,
              y: particle.p.y,
              radius: particle.radius * (1 / 2),
              alpha: 0.5,
              gravity: 5,
              color: particle.color,
              once: "once"
            });
          }
        }
      };
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      this.proton && this.proton.update();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "darker",
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Polygon;
}(React.Component);

var Fountain = function (_React$Component) {
  inherits(Fountain, _React$Component);

  function Fountain(props) {
    classCallCheck(this, Fountain);

    var _this = possibleConstructorReturn(this, (Fountain.__proto__ || Object.getPrototypeOf(Fountain)).call(this, props));

    _this.colors = ["#529B88", "#CDD180", "#FFFA32", "#FB6255", "#FB4A53", "#FF4E50", "#F9D423"];
    _this.renderProton = _this.renderProton.bind(_this);
    return _this;
  }

  createClass(Fountain, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      try {
        RAFManager.remove(this.renderProton);
        this.proton.destroy();
      } catch (e) {}
    }
  }, {
    key: "onCanvasInited",
    value: function onCanvasInited(canvas, width, height) {
      this.createProton(canvas, width, height);
      RAFManager.add(this.renderProton);
    }
  }, {
    key: "onResize",
    value: function onResize() {}
  }, {
    key: "createProton",
    value: function createProton(canvas, width, height) {
      this.proton = new Proton();
      var emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.props.num ? new Proton.Span(this.props.num) : new Proton.Span(4, 8), new Proton.Span(0.1, 0.25));

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(20, 200));
      emitter.addInitialize(new Proton.Life(2, 4));
      emitter.addInitialize(new Proton.Velocity(new Proton.Span(4, 7), new Proton.Span(0, 360), "polar"));
      emitter.addInitialize(new Proton.Position(new Proton.CircleZone(width / 2, height / 2, 100)));

      emitter.addBehaviour(new Proton.Alpha(1, 0));
      emitter.addBehaviour(new Proton.Scale(0.2, 1));
      emitter.addBehaviour(this.createCustomBehaviour());
      emitter.addBehaviour(new Proton.Color(this.colors, "random"));
      emitter.emit();
      this.proton.addEmitter(emitter);

      var renderer = new Proton.CanvasRenderer(canvas);
      this.proton.addRenderer(renderer);
    }
  }, {
    key: "createCustomBehaviour",
    value: function createCustomBehaviour() {
      var f = 10 * 100;
      return {
        initialize: function initialize(particle) {
          particle.f = new Proton.Vector2D(0, 0);
        },
        applyBehaviour: function applyBehaviour(particle) {
          var length = particle.v.length() / 1000;
          var gradient = particle.v.getGradient();
          gradient += 3.14 / 2;

          particle.f.x = f * length * Math.cos(gradient);
          particle.f.y = f * length * Math.sin(gradient);
          particle.a.add(particle.f);
        }
      };
    }
  }, {
    key: "renderProton",
    value: function renderProton() {
      this.proton && this.proton.update();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Canvas, { bg: this.props.bg,
        globalCompositeOperation: "xor",
        onCanvasInited: this.onCanvasInited.bind(this),
        onResize: this.onResize.bind(this)
      });
    }
  }]);
  return Fountain;
}(React.Component);

var ParticlesBg = function (_Component) {
  inherits(ParticlesBg, _Component);

  function ParticlesBg(props) {
    classCallCheck(this, ParticlesBg);
    return possibleConstructorReturn(this, (ParticlesBg.__proto__ || Object.getPrototypeOf(ParticlesBg)).call(this, props));
  }

  createClass(ParticlesBg, [{
    key: "getRandom",
    value: function getRandom() {
      var _props = this.props,
          num = _props.num,
          bg = _props.bg,
          color = _props.color;


      if (!this.rand) {
        this.rand = new Rand();
        this.rand.set(0.25, React.createElement(Color, { num: num, bg: bg, color: color }));
        this.rand.set(0.2, React.createElement(Ball, { num: num, bg: bg, color: color }));
        this.rand.set(0.2, React.createElement(Lines, { num: num, bg: bg, color: color }));
        this.rand.set(0.16, React.createElement(Thick, { num: num, bg: bg, color: color }));
        this.rand.set(0.18, React.createElement(Circle, { num: num, bg: bg, color: color }));
        this.rand.set(0.04, React.createElement(Cobweb, { num: num, bg: bg, color: color }));
        this.rand.set(0.1, React.createElement(Polygon, { num: num, bg: bg, color: color }));
        this.rand.set(0.08, React.createElement(Square, { num: num, bg: bg, color: color }));
        this.rand.set(0.18, React.createElement(Tadpole, { num: num, bg: bg, color: color }));
        this.rand.set(0.15, React.createElement(Fountain, { num: num, bg: bg, color: color }));
      }
      return this.rand.getResult();
    }
  }, {
    key: "getBgParticles",
    value: function getBgParticles() {
      var _props2 = this.props,
          type = _props2.type,
          num = _props2.num,
          bg = _props2.bg,
          color = _props2.color,
          config = _props2.config;


      var particles = void 0;
      switch (String(type).toLowerCase()) {
        case "color":
          particles = React.createElement(Color, { num: num, bg: bg, color: color });
          break;
        case "ball":
          particles = React.createElement(Ball, { num: num, bg: bg, color: color });
          break;
        case "lines":
          particles = React.createElement(Lines, { num: num, bg: bg, color: color });
          break;
        case "thick":
          particles = React.createElement(Thick, { num: num, bg: bg, color: color });
          break;
        case "circle":
          particles = React.createElement(Circle, { num: num, bg: bg, color: color });
          break;
        case "cobweb":
          particles = React.createElement(Cobweb, { num: num, bg: bg, color: color });
          break;
        case "polygon":
          particles = React.createElement(Polygon, { num: num, bg: bg, color: color });
          break;
        case "square":
          particles = React.createElement(Square, { num: num, bg: bg, color: color });
          break;
        case "tadpole":
          particles = React.createElement(Tadpole, { num: num, bg: bg, color: color });
          break;
        case "fountain":
          particles = React.createElement(Fountain, { num: num, bg: bg, color: color });
          break;
        case "custom":
          particles = React.createElement(Color$1, { bg: bg, config: config });
          break;
        case "random":
          particles = this.getRandom(num);
          break;

        default:
          particles = React.createElement(Color, { num: num, bg: bg, color: color });
          break;
      }

      return particles;
    }
  }, {
    key: "render",
    value: function render() {
      var particles = this.getBgParticles();
      return React.createElement(
        React.Fragment,
        null,
        particles
      );
    }
  }]);
  return ParticlesBg;
}(Component);

export default ParticlesBg;
//# sourceMappingURL=index.es.js.map
