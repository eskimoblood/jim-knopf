Ui.P2 = function() {
  "use strict";
  this.addComponent(new Ui.Arc({
    outerRadius: 20,
    innerRadius: 18
  }));
  this.addComponent(new Ui.Pointer({
    type: 'Rect',
    pointerWidth: 3,
    pointerHeight: 23,
    offset: 5
  }));
};

Ui.P2.prototype = Object.create(Ui.prototype);

Ui.P2.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  this.merge(this.options, {radius: 20});
  var arc = new Ui.El.Arc(this.options);
  arc.setAngle(+this.options.anglerange);
  this.node.appendChild(arc.node);
  this.node.setAttribute("class", "p2");
};
