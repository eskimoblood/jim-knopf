buster.spec.expose(); // Make some functions global

describe("Knob", function() {

  it("pass the value of the input to the Ui", function() {
    "use strict";
    var div = document.createElement('div');
    div.innerHTML = '<input disabled id="test" type="range" max="200" min="100" data-width="50" data-height="60" data-angleOffset="220" data-angleRange="280" data-startColor="#ffea05" data-endColor="#fc005c">';

    var input = div.getElementsByTagName('input')[0];
    var init = sinon.spy();
    var update = sinon.spy();
    var ui = {
      init: init,
      update: update
    };

    var knob = new Knob(input, ui);
    assert.equals(init.args[0][0], input.parentNode);
    var settings = init.args[0][1];
    assert.equals(settings.max, 200);
    assert.equals(settings.min, 100);
    assert.equals(settings.width, 50);
    assert.equals(settings.height, 60);
    assert.equals(settings.angleoffset, 220);
    assert.equals(settings.anglerange, 280);
    assert.equals(settings.startcolor, '#ffea05');
    assert.equals(settings.endcolor, '#fc005c');
  });

  it("handle key down", function() {
    var div = document.createElement('div');
    div.innerHTML = '<input disabled id="test" type="range" max="200" min="100" step="10" data-width="50" data-height="60" data-angleOffset="220" data-angleRange="280" data-startColor="#ffea05" data-endColor="#fc005c">';
    var input = div.getElementsByTagName('input')[0];
    var init = sinon.spy();
    var update = sinon.spy();
    var ui = {
      init: init,
      update: update
    };
    var knob = new Knob(input, ui);
    keyDown(input.parentNode, 38);
    checkUpdate(update, 0.6, 160);

    keyDown(input.parentNode, 39);
    checkUpdate(update, 0.7, 170);

    keyDown(input.parentNode, 40);
    checkUpdate(update, 0.6, 160);

    keyDown(input.parentNode, 37);
    checkUpdate(update, 0.5, 150);
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

});
