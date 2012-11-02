Ui.P2 = function() {
};

Ui.P2.prototype = Object.create(Ui.prototype);

Ui.P2.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  this.addComponent(new Ui.Arc({
    arcWidth: this.width / 10
  }));

  this.addComponent(new Ui.Pointer(this.merge(this.options, {
    type: 'Rect',
    pointerWidth: this.width / 10
  })));

  this.merge(this.options, {arcWidth: this.width / 10});
  var arc = new Ui.El.Arc(this.options);
  arc.setAngle(this.options.anglerange);
  this.el.node.appendChild(arc.node);
  this.el.node.setAttribute("class", "p2");
};
