Ui.P1 = function() {
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
