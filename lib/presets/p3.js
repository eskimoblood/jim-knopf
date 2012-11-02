Ui.P3 = function() {
  "use strict";
  this.addComponent(new Ui.Arc({
    arcWidth: 20
  }));
};

Ui.P3.prototype = Object.create(Ui.prototype);

Ui.P3.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  this.merge(this.options, {arcWidth: 20});
  var arc = new Ui.El.Arc(this.options);
  arc.setAngle(this.options.anglerange);
  this.el.node.appendChild(arc.node);
  this.el.node.setAttribute("class", "p3");
};
