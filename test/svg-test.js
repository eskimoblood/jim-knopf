buster.spec.expose(); // Make some functions global

describe("Triangle", function() {
  it("creates an triangle with 3 points and an offset", function() {
    var triangle = new Ui.El.Triangle(20, 10, 10, 10);
    assert.defined(triangle);
    assert.defined(triangle.node);
    assert.equals(triangle.node.getAttribute('points'), '0,15 10,5 20,15');
  });

  it("rotate", function() {
    var triangle = new Ui.El.Triangle(20, 10, 10, 10);
    triangle.rotate(10);
    assert.equals(triangle.node.getAttribute('transform'), 'rotate(10 10 10)');
  });
});

describe("Rect", function() {
  it("creates an rect with 4 points and an offset", function() {
    var rect = new Ui.El.Rect(20, 10, 10, 5);
    assert.defined(rect);
    assert.defined(rect.node);
    assert.equals(rect.node.getAttribute('x'), '0');
    assert.equals(rect.node.getAttribute('y'), '5');
    assert.equals(rect.node.getAttribute('width'), '20');
    assert.equals(rect.node.getAttribute('height'), '10');
    'test'
  });

  it("rotate", function() {
    var rect = new Ui.El.Rect(20, 10, 10, 10);
    rect.rotate(10);
    assert.equals(rect.node.getAttribute('transform'), 'rotate(10 10 10)');
  });
});

describe("Circle", function() {
  it("create a circle with a position and a radius", function() {
    var circle = new Ui.El.Circle(30, 20, 10);
    assert.defined(circle);
    assert.defined(circle.node);
    assert.equals(circle.node.getAttribute('cx'), '20');
    assert.equals(circle.node.getAttribute('cy'), '10');
    assert.equals(circle.node.getAttribute('r'), '30');
  });

});
