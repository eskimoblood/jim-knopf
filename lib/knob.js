var Knob = (function() {
  'use strict';
  var keyDirections = {37: -1, 38: 1, 39: 1, 40: -1};

  var Knob = function(input, ui) {
    var container = document.createElement('div');
    container.setAttribute('tabindex', 0);
    input.parentNode.replaceChild(container, input);
    input.style.position = 'absolute';
    input.style.top = '-10000px';
    container.appendChild(input);

    this.value = parseFloat(input.value);
    this.input = input;
    this.min = input.getAttribute('min');
    this.max = input.getAttribute('max');
    this.range = (this.max - this.min);
    this.width = input.getAttribute('data-width');
    this.height = input.getAttribute('data-height');
    this.ui = ui;
    input.addEventListener('change', this.changed.bind(this), false);

    container.addEventListener('keydown', handleKeyEvents.bind(this), false);
    container.addEventListener('mousewheel', handleWheelEvents.bind(this), false);
    container.addEventListener('DOMMouseScroll', handleWheelEvents.bind(this), false);
    container.style.position = 'relative';

    container.style.width = this.width + 'px';
    container.style.height = this.height + 'px';
    var settings = {
      max: input.max,
      min: input.min
    };
    var data = input.dataset;
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        settings[i] = data[i];
      }
    }

    ui.init(container, settings);
    this.changed(0);

    function handleKeyEvents(e) {
      var keycode = e.keyCode;
      if (keycode >= 37 && keycode <= 40) {
        e.preventDefault();
        var f = 1 + e.shiftKey * 9;
        this.changed(keyDirections[keycode] * f);
      }
    }

    function handleWheelEvents(e) {
      e.preventDefault();
      var deltaX = e.detail || e.wheelDeltaX;
      var deltaY = e.detail || e.wheelDeltaY;
      var val = deltaX > 0 || deltaY > 0 ? 1 : deltaX < 0 || deltaY < 0 ? -1 : 0;
      this.changed(val);
    }

    function data(attribute) {
      return input.getAttribute('data-' + attribute);
    }
  };

  Knob.prototype.changed = function(direction) {
    if (typeof direction === 'number') {
      this.input.value = parseFloat(this.input.value) + direction * (this.input.step || 1);
    }
    console.log(this.input);
    console.log(this.input.value);
    this.value = this.input.value;
    this.ui.update(this.valueToPercent(), this.value);
  };

  Knob.prototype.valueToPercent = function() {
    return  this.value != null ? 100 / this.range * (this.value - this.min) / 100 : this.min;
  };

  return  Knob;
})();

