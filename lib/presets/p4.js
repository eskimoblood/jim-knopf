Ui.P4 = function() {};

Ui.P4.prototype = Object.create(Ui.prototype);

Ui.P4.prototype.createElement = function() {

  Ui.prototype.createElement.apply(this, arguments);
  this.addComponent(new Ui.Scale({
    drawScale: true,
    steps: this.width / 5,
    tickWidth: 5,
    tickHeight: 10, //TODO: just a hack, need to at an offset for ticks
    type: 'Circle'
  }));
  this.el.node.setAttribute("class", "p4");
};
