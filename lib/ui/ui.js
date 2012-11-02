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
  this.options.pointerHeight ||(this.options.pointerHeight = this.height /2);
  this.el = new Ui.El[this.options.type](this.options.pointerWidth,
    this.options.pointerHeight , this.width / 2,
    this.options.pointerHeight / 2 + this.options.offset);
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

Ui.Scala = function(options) {
  this.options = this.merge({
    steps: options.range/ options.step,
    radius: this.width / 2,
    tickWidth: 1,
    tickHeight: 3
  }, options);
};

Ui.Scala.prototype = Object.create(Ui.prototype);

Ui.Scala.prototype.createElement = function(parentEl) {
  this.el = new Ui.El(this.width, this.height);
  this.startAngle = this.options.angleoffset || 0;
  this.options.radius || (this.options.radius = this.height / 2.5);
  this.el.create("g");
  this.el.addClassName('scale');
  if (this.options.drawScale) {
    var step = this.options.anglerange / this.options.steps;
    var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
    this.ticks = [];
    for (var i = 0; i < end; i++) {
      var rect = new Ui.El.Circle(this.options.tickWidth, this.options.tickHeight, this.width / 2,
        this.options.tickHeight / 2);
      rect.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
      this.el.append(rect);
      this.ticks.push(rect);
    }
  }
  this.appendTo(parentEl);
  if (this.options.drawDial) {
    this.dial();
  }
};

Ui.Scala.prototype.dial = function() {
  var step = this.options.anglerange / this.options.steps;
  var min = this.options.min;
  var dialStep = (this.options.max - min) / this.options.steps;
  var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
  this.dials = [];
  for (var i = 0; i < end; i++) {
    var text = new Ui.El.Text(Math.abs(min + dialStep * i), this.width / 2 - 2.5, this.height / 2 - this.options.radius);
    this.el.append(text);
    text.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
    this.dials.push(text);
  }
};

Ui.Scala.prototype.update = function(percent) {
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
    this.activeDial.attr('class', 'active');
  }
};
