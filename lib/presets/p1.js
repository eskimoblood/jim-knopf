Ui.P1 = function() {

};

Ui.P1.prototype = Object.create(Ui.prototype);

Ui.P1.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  this.addComponent(new Ui.Pointer({
    type: 'Rect',
    pointerWidth: 3,
    pointerHeight: this.width / 5,
    offset: this.width / 2 - this.width / 3.3 - this.width / 10
  }));

  this.addComponent(new Ui.Scala({
    drawScale: false,
    drawDial: true}));

  var circle = new Ui.El.Circle(this.width / 3.3, this.width / 2, this.height / 2);
  this.el.node.appendChild(circle.node);
  this.el.node.setAttribute("class", "p1");
};
