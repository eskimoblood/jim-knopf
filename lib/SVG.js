var Ui = function() {
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

  attr: function(key, value) {
    this.node.setAttribute(key, value);
  },

  append: function(el) {
    this.node.appendChild(el.node);
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
    y: this.y - this.height / 2,
    width: this.width,
    height: this.height
  });
};

Ui.El.Rect.prototype = Object.create(Ui.El.prototype);

Ui.El.Circle = function(radius, x, y) {
  this.init(radius * 2, radius * 2, x, y);
  this.create("circle", {
    cx: this.x,
    cy: this.y,
    r: radius
  });
};

Ui.El.Circle.prototype = Object.create(Ui.El.prototype);

Ui.El.Text = function(text, x, y) {
  this.create('text', {
    x: x,
    y: y
  });
  this.node.textContent = text;
};

Ui.El.Text.prototype = Object.create(Ui.El.prototype);

Ui.El.Arc = function(options) {
  this.options = options;
  this.options.angleoffset = (options.angleoffset || 0) - 90;
  this.create('path');
};

Ui.El.Arc.prototype = Object.create(Ui.El.prototype);

Ui.El.Arc.prototype.setAngle = function(angle) {
  this.attr('d', this.getCoords(angle));
};

Ui.El.Arc.prototype.getCoords = function(angle) {
  var startAngle = this.options.angleoffset;
  var outerRadius = this.options.outerRadius;
  var innerRadius = this.options.innerRadius;
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
      component.init(this.node, options);
    }.bind(this));
  },

  merge: function(dest, src) {
    for (var i in src) {
      if (src.hasOwnProperty(i)) {
        dest[i] = src[i];
      }
    }
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
    var doc = new Ui.El(this.width, this.height);
    doc.create("svg", {
      version: "1.2",
      baseProfile: "tiny",
      width: this.width,
      height: this.height
    });
    parentEl.appendChild(doc.node);
    this.node = doc.node;
  }
};

Ui.Pointer = function(options) {
  this.options = options || {};
  this.options.type && Ui.El[this.options.type] || (this.options.type = 'Triangle');
};

Ui.Pointer.prototype = Object.create(Ui.prototype);

Ui.Pointer.prototype.update = function(percent) {
  this.shape.rotate(this.options.angleoffset + percent * this.options.anglerange, this.width / 2,
    this.height / 2);
};

Ui.Pointer.prototype.createElement = function(parentEl) {
  this.shape = new Ui.El[this.options.type](this.options.pointerWidth, this.options.pointerHeight, this.width / 2,
    this.options.pointerHeight / 2 + this.options.offset);
  parentEl.appendChild(this.shape.node);

};

Ui.Arc = function(options) {
  this.options = options || {};
};

Ui.Arc.prototype = Object.create(Ui.prototype);

Ui.Arc.prototype.createElement = function(parentEl) {
  this.shape = new Ui.El.Arc(this.options);
  parentEl.appendChild(this.shape.node);
};

Ui.Arc.prototype.update = function(percent) {
  this.shape.setAngle(percent * this.options.anglerange);
};

Ui.Scala = function(options) {
  this.options = options || {};
  this.options.steps || (this.options.steps = 10);
  this.options.radius || (this.options.radius = this.options.width / 2);
};

Ui.Scala.prototype = Object.create(Ui.prototype);

Ui.Scala.prototype.createElement = function(parentEl) {
  this.doc = new Ui.El(this.width, this.height);
  this.startAngle = this.options.angleoffset || 0;
  this.options.radius || (this.options.radius = this.height / 2.5);
  this.doc.create("g");
  if (this.options.drawScale) {
    var step = this.options.anglerange / this.options.steps;
    var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
    for (var i = 0; i < end; i++) {
      var rect = new Ui.El.Rect(1, 3, this.width / 2, this.height / 2 - this.options.radius);
      rect.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
      this.doc.append(rect);
    }
  }
  parentEl.appendChild(this.doc.node);
  if (this.options.drawDial) {
    this.dial();
  }
};

Ui.Scala.prototype.dial = function() {
  var step = this.options.anglerange / this.options.steps;
  var min = this.options.min;
  var dialStep = (this.options.max - min) / this.options.steps;
  var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
  for (var i = 0; i < end; i++) {
    var text = new Ui.El.Text(min + dialStep * i, this.width / 2 - 2.5, this.height / 2 - this.options.radius);
    this.doc.append(text);
    text.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
  }
};
