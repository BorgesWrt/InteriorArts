var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) {if (window.CP.shouldStopExecution(1)){break;} var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); }
window.CP.exitedLoop(1);
 } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LiquidButton = function () {
  function LiquidButton(svg) {
    _classCallCheck(this, LiquidButton);

    var options = svg.dataset;
    this.id = this.constructor.id || (this.constructor.id = 1);
    this.constructor.id++;
    this.xmlns = 'http://www.w3.org/2000/svg';
    this.tension = options.tension * 1 || 0.4;
    this.width = options.width * 1 || 200;
    this.height = options.height * 1 || 50;
    this.margin = options.margin || 50;
    this.hoverFactor = options.hoverFactor || -0.1;
    this.gap = options.gap || 5;
    this.debug = options.debug || false;
    this.forceFactor = options.forceFactor || 0.2;
    this.color1 = options.color1 || '#36DFE7';
    this.color2 = options.color2 || '#8F17E1';
    this.color3 = options.color3 || '#BF09E6';
    this.textColor = options.textColor || '#FFFFFF';
    this.text = options.text || '▶';
    this.svg = svg;
    this.layers = [{
      points: [],
      viscosity: 0.5,
      mouseForce: 100,
      forceLimit: 2
    }, {
      points: [],
      viscosity: 0.8,
      mouseForce: 150,
      forceLimit: 3
    }];
    for (var layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {if (window.CP.shouldStopExecution(2)){break;}
      var layer = this.layers[layerIndex];
      layer.viscosity = options['layer-' + (layerIndex + 1) + 'Viscosity'] * 1 || layer.viscosity;
      layer.mouseForce = options['layer-' + (layerIndex + 1) + 'MouseForce'] * 1 || layer.mouseForce;
      layer.forceLimit = options['layer-' + (layerIndex + 1) + 'ForceLimit'] * 1 || layer.forceLimit;
      layer.path = document.createElementNS(this.xmlns, 'path');
      this.svg.appendChild(layer.path);
    }
window.CP.exitedLoop(2);

    this.wrapperElement = options.wrapperElement || document.body;
    if (!this.svg.parentElement) {
      this.wrapperElement.append(this.svg);
    }

    this.svgText = document.createElementNS(this.xmlns, 'text');
    this.svgText.setAttribute('x', '50%');
    this.svgText.setAttribute('y', '50%');
    this.svgText.setAttribute('dy', ~~(this.height / 8) + 'px');
    this.svgText.setAttribute('font-size', ~~(this.height / 3));
    this.svgText.style.fontFamily = 'sans-serif';
    this.svgText.setAttribute('text-anchor', 'middle');
    this.svgText.setAttribute('pointer-events', 'none');
    this.svg.appendChild(this.svgText);

    this.svgDefs = document.createElementNS(this.xmlns, 'defs');
    this.svg.appendChild(this.svgDefs);

    this.touches = [];
    this.noise = options.noise || 0;
    document.body.addEventListener('touchstart', this.touchHandler);
    document.body.addEventListener('touchmove', this.touchHandler);
    document.body.addEventListener('touchend', this.clearHandler);
    document.body.addEventListener('touchcancel', this.clearHandler);
    this.svg.addEventListener('mousemove', this.mouseHandler);
    this.svg.addEventListener('mouseout', this.clearHandler);
    this.initOrigins();
    this.animate();
  }

  _createClass(LiquidButton, [{
    key: 'distance',
    value: function distance(p1, p2) {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
  }, {
    key: 'update',
    value: function update() {
      for (var layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {if (window.CP.shouldStopExecution(6)){break;}
        var layer = this.layers[layerIndex];
        var points = layer.points;
        for (var pointIndex = 0; pointIndex < points.length; pointIndex++) {if (window.CP.shouldStopExecution(4)){break;}
          var point = points[pointIndex];
          var dx = point.ox - point.x + (Math.random() - 0.5) * this.noise;
          var dy = point.oy - point.y + (Math.random() - 0.5) * this.noise;
          var d = Math.sqrt(dx * dx + dy * dy);
          var f = d * this.forceFactor;
          point.vx += f * (dx / d || 0);
          point.vy += f * (dy / d || 0);
          for (var touchIndex = 0; touchIndex < this.touches.length; touchIndex++) {if (window.CP.shouldStopExecution(3)){break;}
            var touch = this.touches[touchIndex];
            var mouseForce = layer.mouseForce;
            if (touch.x > this.margin && touch.x < this.margin + this.width && touch.y > this.margin && touch.y < this.margin + this.height) {
              mouseForce *= -this.hoverFactor;
            }
            var mx = point.x - touch.x;
            var my = point.y - touch.y;
            var md = Math.sqrt(mx * mx + my * my);
            var mf = Math.max(-layer.forceLimit, Math.min(layer.forceLimit, mouseForce * touch.force / md));
            point.vx += mf * (mx / md || 0);
            point.vy += mf * (my / md || 0);
          }
window.CP.exitedLoop(3);

          point.vx *= layer.viscosity;
          point.vy *= layer.viscosity;
          point.x += point.vx;
          point.y += point.vy;
        }
window.CP.exitedLoop(4);

        for (var _pointIndex = 0; _pointIndex < points.length; _pointIndex++) {if (window.CP.shouldStopExecution(5)){break;}
          var prev = points[(_pointIndex + points.length - 1) % points.length];
          var _point = points[_pointIndex];
          var next = points[(_pointIndex + points.length + 1) % points.length];
          var dPrev = this.distance(_point, prev);
          var dNext = this.distance(_point, next);

          var line = {
            x: next.x - prev.x,
            y: next.y - prev.y
          };
          var dLine = Math.sqrt(line.x * line.x + line.y * line.y);

          _point.cPrev = {
            x: _point.x - line.x / dLine * dPrev * this.tension,
            y: _point.y - line.y / dLine * dPrev * this.tension
          };
          _point.cNext = {
            x: _point.x + line.x / dLine * dNext * this.tension,
            y: _point.y + line.y / dLine * dNext * this.tension
          };
        }
window.CP.exitedLoop(5);

      }
window.CP.exitedLoop(6);

    }
  }, {
    key: 'animate',
    value: function animate() {
      var _this = this;

      this.raf(function () {
        _this.update();
        _this.draw();
        _this.animate();
      });
    }
  }, {
    key: 'draw',
    value: function draw() {
      for (var layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {if (window.CP.shouldStopExecution(10)){break;}
        var layer = this.layers[layerIndex];
        if (layerIndex === 1) {
          if (this.touches.length > 0) {
            while (this.svgDefs.firstChild) {if (window.CP.shouldStopExecution(7)){break;}
              this.svgDefs.removeChild(this.svgDefs.firstChild);
            }
window.CP.exitedLoop(7);

            for (var touchIndex = 0; touchIndex < this.touches.length; touchIndex++) {if (window.CP.shouldStopExecution(8)){break;}
              var touch = this.touches[touchIndex];
              var gradient = document.createElementNS(this.xmlns, 'radialGradient');
              gradient.id = 'liquid-gradient-' + this.id + '-' + touchIndex;
              var start = document.createElementNS(this.xmlns, 'stop');
              start.setAttribute('stop-color', this.color3);
              start.setAttribute('offset', '0%');
              var stop = document.createElementNS(this.xmlns, 'stop');
              stop.setAttribute('stop-color', this.color2);
              stop.setAttribute('offset', '100%');
              gradient.appendChild(start);
              gradient.appendChild(stop);
              this.svgDefs.appendChild(gradient);
              gradient.setAttribute('cx', touch.x / this.svgWidth);
              gradient.setAttribute('cy', touch.y / this.svgHeight);
              gradient.setAttribute('r', touch.force);
              layer.path.style.fill = 'url(#' + gradient.id + ')';
            }
window.CP.exitedLoop(8);

          } else {
            layer.path.style.fill = this.color2;
          }
        } else {
          layer.path.style.fill = this.color1;
        }
        var points = layer.points;
        var commands = [];
        commands.push('M', points[0].x, points[0].y);
        for (var pointIndex = 1; pointIndex < points.length; pointIndex += 1) {if (window.CP.shouldStopExecution(9)){break;}
          commands.push('C', points[(pointIndex + 0) % points.length].cNext.x, points[(pointIndex + 0) % points.length].cNext.y, points[(pointIndex + 1) % points.length].cPrev.x, points[(pointIndex + 1) % points.length].cPrev.y, points[(pointIndex + 1) % points.length].x, points[(pointIndex + 1) % points.length].y);
        }
window.CP.exitedLoop(9);

        commands.push('Z');
        layer.path.setAttribute('d', commands.join(' '));
      }
window.CP.exitedLoop(10);

      this.svgText.textContent = this.text;
      this.svgText.style.fill = this.textColor;
    }
  }, {
    key: 'createPoint',
    value: function createPoint(x, y) {
      return {
        x: x,
        y: y,
        ox: x,
        oy: y,
        vx: 0,
        vy: 0
      };
    }
  }, {
    key: 'initOrigins',
    value: function initOrigins() {
      this.svg.setAttribute('width', this.svgWidth);
      this.svg.setAttribute('height', this.svgHeight);
      for (var layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {if (window.CP.shouldStopExecution(15)){break;}
        var layer = this.layers[layerIndex];
        var points = [];
        for (var x = ~~(this.height / 2); x < this.width - ~~(this.height / 2); x += this.gap) {if (window.CP.shouldStopExecution(11)){break;}
          points.push(this.createPoint(x + this.margin, this.margin));
        }
window.CP.exitedLoop(11);

        for (var alpha = ~~(this.height * 1.25); alpha >= 0; alpha -= this.gap) {if (window.CP.shouldStopExecution(12)){break;}
          var angle = Math.PI / ~~(this.height * 1.25) * alpha;
          points.push(this.createPoint(Math.sin(angle) * this.height / 2 + this.margin + this.width - this.height / 2, Math.cos(angle) * this.height / 2 + this.margin + this.height / 2));
        }
window.CP.exitedLoop(12);

        for (var _x = this.width - ~~(this.height / 2) - 1; _x >= ~~(this.height / 2); _x -= this.gap) {if (window.CP.shouldStopExecution(13)){break;}
          points.push(this.createPoint(_x + this.margin, this.margin + this.height));
        }
window.CP.exitedLoop(13);

        for (var _alpha = 0; _alpha <= ~~(this.height * 1.25); _alpha += this.gap) {if (window.CP.shouldStopExecution(14)){break;}
          var _angle = Math.PI / ~~(this.height * 1.25) * _alpha;
          points.push(this.createPoint(this.height - Math.sin(_angle) * this.height / 2 + this.margin - this.height / 2, Math.cos(_angle) * this.height / 2 + this.margin + this.height / 2));
        }
window.CP.exitedLoop(14);

        layer.points = points;
      }
window.CP.exitedLoop(15);

    }
  }, {
    key: 'mouseHandler',
    get: function get() {
      var _this2 = this;

      return function (e) {
        _this2.touches = [{
          x: e.offsetX,
          y: e.offsetY,
          force: 1
        }];
      };
    }
  }, {
    key: 'touchHandler',
    get: function get() {
      var _this3 = this;

      return function (e) {
        _this3.touches = [];
        var rect = _this3.svg.getBoundingClientRect();
        for (var touchIndex = 0; touchIndex < e.changedTouches.length; touchIndex++) {if (window.CP.shouldStopExecution(16)){break;}
          var touch = e.changedTouches[touchIndex];
          var x = touch.pageX - rect.left;
          var y = touch.pageY - rect.top;
          if (x > 0 && y > 0 && x < _this3.svgWidth && y < _this3.svgHeight) {
            _this3.touches.push({ x: x, y: y, force: touch.force || 1 });
          }
        }
window.CP.exitedLoop(16);

        e.preventDefault();
      };
    }
  }, {
    key: 'clearHandler',
    get: function get() {
      var _this4 = this;

      return function (e) {
        _this4.touches = [];
      };
    }
  }, {
    key: 'raf',
    get: function get() {
      return this.__raf || (this.__raf = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        setTimeout(callback, 10);
      }).bind(window));
    }
  }, {
    key: 'svgWidth',
    get: function get() {
      return this.width + this.margin * 2;
    }
  }, {
    key: 'svgHeight',
    get: function get() {
      return this.height + this.margin * 2;
    }
  }]);

  return LiquidButton;
}();

var redraw = function redraw() {
  button.initOrigins();
};

var buttons = document.getElementsByClassName('liquid-button');
for (var buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {if (window.CP.shouldStopExecution(17)){break;}
  var _button = buttons[buttonIndex];
  _button.liquidButton = new LiquidButton(_button);
}
window.CP.exitedLoop(17);