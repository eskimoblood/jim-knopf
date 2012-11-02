Ui.P2 = function() {
  "use strict";
  this.addComponent(new Ui.Arc({
    arcWidth: 10
  }));
  this.addComponent(new Ui.Pointer({
    type: 'Rect',
    pointerWidth: 10,
  }));
};

Ui.P2.prototype = Object.create(Ui.prototype);

Ui.P2.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  this.merge(this.options, {arcWidth: 10});
  var arc = new Ui.El.Arc(this.options);
  arc.setAngle(this.options.anglerange);
  this.el.node.appendChild(arc.node);
  this.el.node.setAttribute("class", "p2");
};
