Ui.P3 = function() {
};

Ui.P3.prototype = Object.create(Ui.prototype);

Ui.P3.prototype.createElement = function() {
  Ui.prototype.createElement.apply(this, arguments);
  this.addComponent(new Ui.Arc({
    arcWidth: this.width/5
  }));
  this.merge(this.options, {arcWidth: this.width/5});
  var arc = new Ui.El.Arc(this.options);
  arc.setAngle(this.options.anglerange);
  this.el.node.appendChild(arc.node);
  this.el.node.setAttribute("class", "p3");
};
