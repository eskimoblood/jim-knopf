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
    y: this.y ,
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
  var outerRadius = this.options.outerRadius || this.options.width/2;
  var innerRadius = this.options.innerRadius || this.options.width/2 -this.options.arcWidth;
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
