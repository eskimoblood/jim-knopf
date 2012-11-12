Ui.P4 = function() {};

Ui.P4.prototype = Object.create(Ui.prototype);

Ui.P4.prototype.createElement = function() {

  Ui.prototype.createElement.apply(this, arguments);
  this.addComponent(new Ui.Scala({
    drawScale: true,
    steps: this.width / 5,
    tickWidth: 5,
    tickHeight: 5,
    type: 'Circle'
  }));
  this.el.node.setAttribute("class", "p4");
};
