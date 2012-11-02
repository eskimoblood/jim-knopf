buster.spec.expose(); // Make some functions global

//TODO remove when phantomJS supports bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function() {},
      fBound = function() {
        return fToBind.apply(this instanceof fNOP && oThis
          ? this
          : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

describe("Knob", function() {

  var init;
  var update;
  var input;
  var knob;

  before(function() {
    "use strict";
    var div = document.createElement('div');
    div.innerHTML = '<input disabled id="test" type="range" max="200" min="100" step="10" data-width="50" data-height="60" data-angleOffset="90" data-angleRange="180" data-startColor="#ffea05" data-endColor="#fc005c">';

    input = div.getElementsByTagName('input')[0];
    init = sinon.spy();
    update = sinon.spy();

    var ui = {
      init: init,
      update: update
    };

    knob = new Knob(input, ui);
  });

  it("pass the value of the input to the Ui", function() {

    assert.equals(init.args[0][0], input.parentNode);
    var settings = init.args[0][1];
    assert.equals(settings.max, 200);
    assert.equals(settings.min, 100);
    assert.equals(settings.width, 50);
    assert.equals(settings.height, 60);
    assert.equals(settings.angleoffset, 90);
    assert.equals(settings.anglerange, 180);
    assert.equals(settings.startcolor, '#ffea05');
    assert.equals(settings.endcolor, '#fc005c');
  });

  describe('on press ', function() {

    it("the UP key value increase by step", function() {
      keyDown(input.parentNode, 38);
      checkUpdate(update, 0.6, 160);
    });

    it("the RIGHT key value increase by step", function() {
      keyDown(input.parentNode, 39);
      checkUpdate(update, 0.6, 160);
    });

    it("the DOWN key value decrease by step", function() {
      keyDown(input.parentNode, 40);
      checkUpdate(update, 0.4, 140);
    });

    it("the LEFT key value decrease by step", function() {
      keyDown(input.parentNode, 37);
      checkUpdate(update, 0.4, 140);
    });
  });

  describe('on move the mouse wheel', function() {

    it('up it decrease by step', function() {
      mouseWheelMove(input.parentNode, 'Y', -10);
      checkUpdate(update, 0.4, 140);
    });

    it('down it increase by step', function() {
      mouseWheelMove(input.parentNode, 'Y', 10);
      checkUpdate(update, 0.6, 160);
    });

    it('left it decrease by step', function() {
      mouseWheelMove(input.parentNode, 'X', -10);
      checkUpdate(update, 0.4, 140);
    });

    it('right it increase by step', function() {
      mouseWheelMove(input.parentNode, 'X', 10);
      checkUpdate(update, 0.6, 160);
    });
  });

  describe("on mouse move", function() {
    it("generates the value", function() {
      mouseClick(input.parentNode);
      mouseMove(document.body, input.parentNode.offsetLeft + 25, input.parentNode.offsetTop + 60);
      checkUpdate(update, 0.5, 150);
      mouseMove(document.body, input.parentNode.offsetLeft , input.parentNode.offsetTop + 30);
      checkUpdate(update, 1, 200);
      mouseMove(document.body, input.parentNode.offsetLeft +50 , input.parentNode.offsetTop + 30);
      checkUpdate(update, 0, 100);
    });
  });

  function checkUpdate(update, expectedPercent, expectedValue) {
    var percent = update.lastCall.args[0];
    var value = update.lastCall.args[1];
    assert.equals(expectedPercent, percent);
    assert.equals(expectedValue, value);
  }

  function keyDown(el, keycode) {
    var eventObj = document.createEvent("Events");
    eventObj.initEvent("keydown", true, true);
    eventObj.keyCode = keycode;
    eventObj.shiftKey = false;
    el.dispatchEvent(eventObj);
  }

  function mouseWheelMove(el, direction, value) {
    var eventObj = document.createEvent("Events");
    eventObj.initEvent("mousewheel", true, true);
    eventObj['wheelDelta' + direction] = value;
    el.dispatchEvent(eventObj);
  }

  function mouseClick(el) {
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true,
      document.defaultView, 1, 0, 0, 0, 0, false,
      false, false, false, 1, null);
    el.dispatchEvent(event);
  }

  function mouseMove(el, x, y) {
    var eventObj = document.createEvent("Events");
    eventObj.initEvent("mousemove", true, true);
    eventObj.pageX = x;
    eventObj.pageY = y;
    el.dispatchEvent(eventObj);
  }

});
