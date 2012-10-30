Ui.P3 = function() {
  "use strict";
  this.addComponent(new Ui.Arc({
    outerRadius: 20,
    innerRadius: 10
  }));
};

Ui.P3.prototype = Object.create(Ui.prototype);

Ui.P3.prototype.createElement = function() {
  "use strict";
  Ui.prototype.createElement.apply(this, arguments);
  this.merge(this.options, {outerRadius: 20,
    innerRadius: 10});
  var arc = new Ui.El.Arc(this.options);
  arc.setAngle(this.options.anglerange);
  this.node.appendChild(arc.node);
  this.node.setAttribute("class", "p3");
};
