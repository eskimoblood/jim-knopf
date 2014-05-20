var Knob;
Knob = function(input, ui) {
  var container = document.createElement('div');
  container.setAttribute('tabindex', 0);
  input.parentNode.replaceChild(container, input);
  input.style.cssText = 'position: absolute; top: -10000px';
  input.setAttribute('tabindex', -1);
  container.appendChild(input);

  var settings = this.settings = this._getSettings(input);


  this.value = input.value = settings.min + settings.range / 2;
  this.input = input;
  this.min = settings.min;

  this.ui = ui;
  input.addEventListener('change', this.changed.bind(this), false);

  var events = {
    keydown: this._handleKeyEvents.bind(this),
    mousewheel: this._handleWheelEvents.bind(this),
    DOMMouseScroll: this._handleWheelEvents.bind(this),
    touchstart: this._handleMove.bind(this, 'touchmove', 'touchend'),
    mousedown: this._handleMove.bind(this, 'mousemove', 'mouseup')
  };

  for (var event in events) {
    container.addEventListener(event, events[event], false);
  }

  container.style.cssText = 'position: relative; width:' + settings.width + 'px;' + 'height:' + settings.height + 'px;';

  ui.init(container, settings);
  this.container = container;
  this.changed(0);

};

Knob.prototype = {
  _handleKeyEvents: function(e) {
    var keycode = e.keyCode;
    if (keycode >= 37 && keycode <= 40) {
      e.preventDefault();
      var f = 1 + e.shiftKey * 9;
      this.changed({37: -1, 38: 1, 39: 1, 40: -1}[keycode] * f);
    }
  },

  _handleWheelEvents: function(e) {
    e.preventDefault();
    var deltaX = -e.detail || e.wheelDeltaX;
    var deltaY = -e.detail || e.wheelDeltaY;
    var val = deltaX > 0 || deltaY > 0 ? 1 : deltaX < 0 || deltaY < 0 ? -1 : 0;
    this.changed(val);
  },

  _handleMove: function(onMove, onEnd) {
    this.centerX = this.container.offsetLeft + this.settings.width / 2;
    this.centerY = this.container.offsetTop + this.settings.height / 2;
    var fnc = this._updateWhileMoving.bind(this);
    var body = document.body;
    body.addEventListener(onMove, fnc, false);
    body.addEventListener(onEnd, function() {
      body.removeEventListener(onMove, fnc, false);
    }, false);
  },

  _updateWhileMoving: function(event) {
    event.preventDefault();
    var e = event.changedTouches ? event.changedTouches[0] : event;
    var x = this.centerX - e.pageX;
    var y = this.centerY - e.pageY;
    var deg = Math.atan2(-y, -x) * 180 / Math.PI + 90 - this.settings.angleoffset;
    var percent;

    if (deg < 0) {
      deg += 360;
    }
    deg = deg % 360;
    if (deg <= this.settings.anglerange) {
      percent = Math.max(Math.min(1, deg / this.settings.anglerange), 0);
    } else {
      percent = +(deg - this.settings.anglerange < (360 - this.settings.anglerange) / 2);
    }
    var range = this.settings.range;
    var value = this.min + range * percent;

    var step = (this.settings.max - this.min) / range;
    this.value = this.input.value = Math.round(value / step) * step;
    this.ui.update(percent, this.value);
  },

  changed: function(direction) {
    this.input.value = this.limit(parseFloat(this.input.value) + direction * (this.input.step || 1));
    this.value = this.input.value;
    this.ui.update(this._valueToPercent(), this.value);
  },

  _valueToPercent: function() {
    return  this.value != null ? 100 / this.settings.range * (this.value - this.min) / 100 : this.min;
  },

  limit: function(value) {
    return Math.min(Math.max(this.settings.min, value), this.settings.max);
  },
  _getSettings: function(input) {    
    var labels; 
    if(input.dataset.labels){
      labels = input.dataset.labels.split(',');
    }
    var settings = {
      max: labels ? labels.length-1 : parseFloat(input.max),
      min: labels ? 0 : parseFloat(input.min),
      step: parseFloat(input.step) || 1,
      angleoffset: 0,
      anglerange: 360,
      labels: labels
    };
    settings.range = settings.max - settings.min;
    var data = input.dataset;
    for (var i in data) {
      if (data.hasOwnProperty(i) && i!=='labels') {
        var value = +data[i];
        settings[i] = isNaN(value) ? data[i] : value;
      }
    }
    return settings;
  }
};



var Ui = function() {
};

Ui.prototype = {
  init: function(parentEl, options) {
    this.options || (this.options = {});
    this.merge(this.options, options);
    this.width = options.width;
    this.height = options.height;
    this.createElement(parentEl);
    if (!this.components) {
      return;
    }
    this.components.forEach(function(component) {
      component.init(this.el.node, options);
    }.bind(this));
  },

  merge: function(dest, src) {
    for (var i in src) {
      if (src.hasOwnProperty(i)) {
        dest[i] = src[i];
      }
    }
    return dest;
  },

  addComponent: function(component) {
    this.components || (this.components = []);
    this.components.push(component);
  },

  update: function(percent, value) {

    if (!this.components) {
      return;
    }
    this.components.forEach(function(component) {
      component.update(percent, value);
    });
  },

  createElement: function(parentEl) {
    this.el = new Ui.El(this.width, this.height);
    this.el.create("svg", {
      version: "1.2",
      baseProfile: "tiny",
      width: this.width,
      height: this.height
    });
    this.appendTo(parentEl);
  },
  appendTo: function(parent) {
    parent.appendChild(this.el.node);
  }

};

Ui.Pointer = function(options) {
  this.options = options || {};
  this.options.type && Ui.El[this.options.type] || (this.options.type = 'Triangle');
};

Ui.Pointer.prototype = Object.create(Ui.prototype);

Ui.Pointer.prototype.update = function(percent) {
  this.el.rotate(this.options.angleoffset + percent * this.options.anglerange, this.width / 2,
    this.height / 2);
};

Ui.Pointer.prototype.createElement = function(parentEl) {
  this.options.pointerHeight || (this.options.pointerHeight = this.height / 2);
  if (this.options.type == 'Arc') {
    this.el = new Ui.El.Arc(this.options);
    this.el.setAngle(this.options.size);
  } else {
    this.el = new Ui.El[this.options.type](this.options.pointerWidth,
      this.options.pointerHeight, this.width / 2,
      this.options.pointerHeight / 2 + this.options.offset);
  }
  this.el.addClassName('pointer');
  this.appendTo(parentEl);

};

Ui.Arc = function(options) {
  this.options = options || {};
};

Ui.Arc.prototype = Object.create(Ui.prototype);

Ui.Arc.prototype.createElement = function(parentEl) {
  this.el = new Ui.El.Arc(this.options);
  this.appendTo(parentEl);
};

Ui.Arc.prototype.update = function(percent) {
  this.el.setAngle(percent * this.options.anglerange);
};

Ui.Scale = function(options) {
  this.options = this.merge({
    steps: options.range / options.step,
    radius: this.width / 2,
    tickWidth: 1,
    tickHeight: 3
  }, options);
  this.options.type = Ui.El[this.options.type || 'Rect'];
};

Ui.Scale.prototype = Object.create(Ui.prototype);

Ui.Scale.prototype.createElement = function(parentEl) {
  this.el = new Ui.El(this.width, this.height);
  this.startAngle = this.options.angleoffset || 0;
  this.options.radius || (this.options.radius = this.height / 2.5);
  this.el.create("g");
  this.el.addClassName('scale');
  if (this.options.drawScale) {
    if(!this.options.labels){
      var step = this.options.anglerange / this.options.steps;
      var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
      this.ticks = [];
      var Shape = this.options.type;
      for (var i = 0; i < end; i++) {
        var rect = new Shape(this.options.tickWidth, this.options.tickHeight, this.width / 2,
          this.options.tickHeight / 2);
        rect.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
        this.el.append(rect);
        this.ticks.push(rect);
      }  
    } 
  }
  this.appendTo(parentEl);
  if (this.options.drawDial) {
    this.dial();
  }
};

Ui.Scale.prototype.dial = function() {
  var step = this.options.anglerange / this.options.steps;
  var min = this.options.min;
  var dialStep = (this.options.max - min) / this.options.steps;
  var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
  this.dials = [];
  if(!this.options.labels){
    for (var i = 0; i < end; i++) {
      var text = new Ui.El.Text(Math.abs(min + dialStep * i), this.width / 2 - 2.5,
        this.height / 2 - this.options.radius, 5, 5);
      this.el.append(text);
      text.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
      this.dials.push(text);
    }
  } else {
    step = this.options.anglerange / (this.options.labels.length-1);
    for(var i=0; i<this.options.labels.length; i++){
      var label = this.options.labels[i];
      var text = new Ui.El.Text(label, this.width / 2 - 2.5,
        this.height / 2 - this.options.radius, 5, 5);
      this.el.append(text);
      text.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
      text.attr('text-anchor', 'middle');
      this.dials.push(text);
    }
  }
  
};

Ui.Scale.prototype.update = function(percent) {
  if (this.ticks) {
    if (this.activeStep) {
      this.activeStep.attr('class', '');
    }
    this.activeStep = this.ticks[Math.round(this.options.steps * percent)];
    this.activeStep.attr('class', 'active');
  }
  if (this.dials) {
    if (this.activeDial) {
      this.activeDial.attr('class', '');
    }
    this.activeDial = this.dials[Math.round(this.options.steps * percent)];
    if (this.activeDial) {
      this.activeDial.attr('class', 'active');
    }
  }
};

Ui.Text = function() {};

Ui.Text.prototype = Object.create(Ui.prototype);

Ui.Text.prototype.createElement = function(parentEl) {
  this.parentEl = parentEl
  this.el = new Ui.El.Text('', 0, this.height);
  this.appendTo(parentEl);
  this.el.center(parentEl);
};

Ui.Text.prototype.update = function(percent, value) {
  this.el.node.textContent = value;
  this.el.center(this.parentEl);
};

Ui.El = function() {};

Ui.El.prototype = {
  svgNS: "http://www.w3.org/2000/svg",

  init: function(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x || 0;
    this.y = y || 0;
    this.left = this.x - width / 2;
    this.right = this.x + width / 2;
    this.top = this.y - height / 2;
    this.bottom = this.y + height / 2;
  },
  create: function(type, attributes) {
    this.node = document.createElementNS(this.svgNS, type);
    for (var key  in attributes) {
      this.attr(key, attributes[key]);
    }
  },

  rotate: function(angle, x, y) {
    this.attr("transform", "rotate(" + angle + " " + (x || this.x) + " " + (y || this.y ) + ")");
  },

  attr: function(attributeName, value) {
    if (value == null) return this.node.getAttribute(attributeName) || '';
    this.node.setAttribute(attributeName, value);
  },

  append: function(el) {
    this.node.appendChild(el.node);
  },

  addClassName: function(className) {
    this.attr('class', this.attr('class') + ' ' + className);
  }
};

Ui.El.Triangle = function() {
  this.init.apply(this, arguments);
  this.create("polygon", {
    'points': this.left + ',' + this.bottom + ' ' + this.x + ',' + this.top + ' ' + this.right + ',' + this.bottom
  });
};

Ui.El.Triangle.prototype = Object.create(Ui.El.prototype);

Ui.El.Rect = function() {
  this.init.apply(this, arguments);
  this.create("rect", {
    x: this.x - this.width / 2,
    y: this.y,
    width: this.width,
    height: this.height
  });
};

Ui.El.Rect.prototype = Object.create(Ui.El.prototype);

Ui.El.Circle = function(radius, x, y) {
  if (arguments.length == 4) {
    x = arguments[2];
    y = arguments[3];
  }
  this.init(radius * 2, radius * 2, x, y);
  this.create("circle", {
    cx: this.x,
    cy: this.y,
    r: radius
  });
};

Ui.El.Circle.prototype = Object.create(Ui.El.prototype);

Ui.El.Text = function(text, x, y, width, height) {
  this.create('text', {
    x: x,
    y: y,
    width: width,
    height: height
  });
  this.node.textContent = text;
};

Ui.El.Text.prototype = Object.create(Ui.El.prototype);

Ui.El.Text.prototype.center = function(element) {
  var width = element.getAttribute('width');
  var height = element.getAttribute('height');
  this.attr('x', width / 2 - this.node.getBBox().width / 2);
  this.attr('y', height / 2 + this.node.getBBox().height / 4);
};

Ui.El.Arc = function(options) {
  this.options = options;
  //when there are lables, do not shift the arc other wise it will be 180 degree off 
  //compared to the labels
  this.options.angleoffset = (options.angleoffset || 0) - (this.options.labels?0:90);
  this.create('path');
};

Ui.El.Arc.prototype = Object.create(Ui.El.prototype);

Ui.El.Arc.prototype.setAngle = function(angle) {
  this.attr('d', this.getCoords(angle));
};


Ui.El.Arc.prototype.getCoords = function(angle) {
  var startAngle = this.options.angleoffset;
  var outerRadius = this.options.outerRadius || this.options.width / 2;
  var innerRadius = this.options.innerRadius || this.options.width / 2 - this.options.arcWidth;
  //position the arc so that it's shifted half an angle backward so that it's middle aligned
  //when there're lables
  if(this.options.labels){
    startAngle -= angle/2;
  }
  var startAngleDegree = Math.PI * startAngle / 180;
  var endAngleDegree = Math.PI * (startAngle + angle) / 180;
  var center = this.options.width / 2;

  var p1 = pointOnCircle(outerRadius, endAngleDegree);
  var p2 = pointOnCircle(outerRadius, startAngleDegree);
  var p3 = pointOnCircle(innerRadius, startAngleDegree);
  var p4 = pointOnCircle(innerRadius, endAngleDegree);

  var path = 'M' + p1.x + ',' + p1.y;
  var largeArcFlag = ( angle < 180 ? 0 : 1);
  path += ' A' + outerRadius + ',' + outerRadius + ' 0 ' + largeArcFlag + ' 0 ' + p2.x + ',' + p2.y;
  path += 'L' + p3.x + ',' + p3.y;
  path += ' A' + innerRadius + ',' + innerRadius + ' 0 ' + largeArcFlag + ' 1 ' + p4.x + ',' + p4.y;
  path += 'L' + p1.x + ',' + p1.y;
  return  path;

  function pointOnCircle(radius, angle) {
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  }
};
