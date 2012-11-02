Ui.P4 = function() {
  this.addComponent(new Ui.Scala({
    drawScale: true,
    steps: 50,
    tickWidth:7,
    tickHeight:3
  }));
};

Ui.P4.prototype = Object.create(Ui.prototype);


Ui.P4.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  this.el.node.setAttribute("class", "p4");
};
