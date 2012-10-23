var Ui = function() {
  "use strict";
};

Ui.El = function() {};

Ui.El.prototype = {
  svgNS: "http://www.w3.org/2000/svg",

  init: function(width, height, x, y) {
    "use strict";
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
  },

  _addPoints: function(_points) {
    var points = [];
    for (var i = 0; i < _points.length - 1; i += 2) {
      points.push([_points[i], _points[i + 1]].join(','));
    }
    this.attr('points', points.join(' '));
  }
};

Ui.El.Triangle = function() {
  this.init.apply(this, arguments);
  this.create("polygon");
  var points = [
    this.left, this.bottom,
    this.x , this.top,
    this.right, this.bottom
  ];
  this._addPoints(points);
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

    if (!this.components) {
      this.components = [];
    }
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
}
;

Ui.Pointer = function(options) {
  "use strict";
  this.options = options || {};
  this.options.type && Ui.El[this.options.type] || (this.options.type = 'Triangle');
};

Ui.Pointer.prototype = Object.create(Ui.prototype);

Ui.Pointer.prototype.update = function(percent, value) {
  "use strict"
  this.shape.rotate(parseFloat(this.options.angleoffset) + percent * this.options.anglerange, this.width / 2,
    this.height / 2);
};

Ui.Pointer.prototype.createElement = function(parentEl) {
  "use strict";
  this.shape = new Ui.El[this.options.type](this.options.pointerWidth, this.options.pointerHeight, this.width / 2,
    this.options.pointerHeight / 2 + this.options.offset);
  parentEl.appendChild(this.shape.node);

};

Ui.Arc = function(options) {
  "use strict";
  this.options = options || {};

};

Ui.Arc.prototype = Object.create(Ui.prototype);

Ui.Arc.prototype.createElement = function(parentEl) {
  this.options.radius || (this.options.radius = this.options.width / 2);
  this.doc = new Ui.El(this.width, this.height);
  this.doc.create('path', {fill: 'none', stroke: 'black'});
  parentEl.appendChild(this.doc.node);
};

Ui.Arc.prototype.update = function(percent) {
  this.doc.attr('d', this.getCoords(percent * this.options.anglerange));
};

Ui.Arc.prototype.getCoords = function(angle) {
  "use strict";
  var startAngle = parseFloat(this.options.angleoffset) - 90;
  var radius = this.options.radius;
  var startAngleDegree = Math.PI * startAngle / 180;
  var endAngleDegree = Math.PI * (startAngle + angle) / 180;

  var endX = this.options.width/2 + radius * Math.cos(startAngleDegree);
  var endY = this.options.width/2 + radius * Math.sin(startAngleDegree);
  var startX = this.options.width/2 + radius * Math.cos(endAngleDegree);
  var startY = this.options.width/2 + radius * Math.sin(endAngleDegree);

  return 'M' + startX + ',' + startY + ' A' + radius + ',' + radius + ' 0 ' + ( angle < 180 ? 0 : 1) + ' 0 ' + endX + ',' + endY;
}

Ui.Scala = function(options) {
  "use strict";
  this.options = options || {};
  this.options.steps || (this.options.steps = 10);
  this.options.radius || (this.options.radius = this.options.width / 2);
};

Ui.Scala.prototype = Object.create(Ui.prototype);

Ui.Scala.prototype.createElement = function(parentEl) {
  "use strict";
  this.doc = new Ui.El(this.width, this.height);
  this.startAngle = parseFloat(this.options.angleoffset) || 0;
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
  "use strict";
  var step = this.options.anglerange / this.options.steps;
  var end = this.options.steps + (this.options.anglerange == 360 ? 0 : 1);
  for (var i = 0; i < end; i++) {
    var text = new Ui.El.Text(i, this.width / 2 - 2.5, this.height / 2 - this.options.radius);
    this.doc.append(text);
    text.rotate(this.startAngle + i * step, this.width / 2, this.height / 2);
  }
};

Ui.P1 = function(options) {
  "use strict";
  this.addComponent(new Ui.Pointer({
    type: 'Rect',
    pointerWidth: 2,
    pointerHeight: 15,
    offset: 10
  }));
  this.addComponent(new Ui.Scala({
    drawScale: false,
    drawDial: true}));
};

Ui.P1.prototype = Object.create(Ui.prototype);

Ui.P1.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  var circle = new Ui.El.Circle(this.width / 3.3, this.width / 2, this.height / 2);
  this.node.appendChild(circle.node);
  this.node.setAttribute("class", "p1");
};


Ui.P2 = function(options) {
  "use strict";
  this.addComponent(new Ui.Arc({
radius: 20
  }));
  this.addComponent(new Ui.Pointer({
    type: 'Rect',
    pointerWidth: 3,
    pointerHeight: 25,
    offset: 5
  }));
}

Ui.P2.prototype = Object.create(Ui.prototype);

Ui.P2.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  this.node.setAttribute("class", "p2");
};
