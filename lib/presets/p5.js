Ui.P5 = function() {};

Ui.P5.prototype = Object.create(Ui.prototype);

Ui.P5.prototype.createElement = function() {

  Ui.prototype.createElement.apply(this, arguments);
  this.addComponent(new Ui.Pointer({
    type: 'Arc',
    size: 30,
    outerRadius: this.width / 2.2,
    innerRadius: this.width / 2.2 - this.width / 6,
    angleoffset: this.options.angleoffset
  }));
  this.addComponent(new Ui.Text());
  var circle = new Ui.El.Circle(this.width / 2.1, this.width / 2, this.height / 2);
  this.el.node.appendChild(circle.node);
  this.el.node.setAttribute("class", "p5");

};
