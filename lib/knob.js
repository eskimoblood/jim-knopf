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

    var settings = this.settings = this._getSettings(input);

    this.value = parseFloat(input.value);
    this.input = input;
    this.min = settings.min;
    this.range = (settings.max - this.min);
    this.ui = ui;
    input.addEventListener('change', this.changed.bind(this), false);

    var events = {
      'keydown': this._handleKeyEvents.bind(this),
      mousewheel: this._handleWheelEvents.bind(this),
      DOMMouseScroll: this._handleWheelEvents.bind(this),
      touchstart: this._handleMove.bind(this, 'touchmove', 'touchend'),
      mousedown: this._handleMove.bind(this, 'mousemove', 'mouseup')
    };

    for (var event in events) {
      container.addEventListener(event, events[event], false);
    }

    container.style.position = 'relative';
    container.style.width = settings.width + 'px';
    container.style.height = settings.height + 'px';

    this.centerX = container.offsetLeft + settings.width / 2;
    this.centerY = container.offsetTop + settings.height / 2;
    ui.init(container, settings);
    this.changed(0);

  };

  Knob.prototype = {
    _handleKeyEvents: function(e) {
      var keycode = e.keyCode;
      if (keycode >= 37 && keycode <= 40) {
        e.preventDefault();
        var f = 1 + e.shiftKey * 9;
        this.changed(keyDirections[keycode] * f);
      }
    },

    _handleWheelEvents: function(e) {
      e.preventDefault();
      var deltaX = e.detail || e.wheelDeltaX;
      var deltaY = e.detail || e.wheelDeltaY;
      var val = deltaX > 0 || deltaY > 0 ? 1 : deltaX < 0 || deltaY < 0 ? -1 : 0;
      this.changed(val);
    },

    _handleMove: function(onMove, onEnd) {
      var fnc = this._updateWhileMoving.bind(this);
      document.body.addEventListener(onMove, fnc, false);
      document.body.addEventListener(onEnd, function() {
        document.body.removeEventListener(onMove, fnc, false);
      }, false);
    },

    _updateWhileMoving: function(event) {
      var e = event.changedTouches ? event.changedTouches[0] : event;
      var a = this.centerY - e.pageY;
      var b = this.centerX - e.pageX;
      var deg = Math.atan2(-a, -b) * 180 / Math.PI + 90 - this.settings.angleoffset;

      if (deg < 0) {
        deg += 360;
      }

      var percent = Math.max(Math.min(1, (deg ) % 360 / this.settings.anglerange), 0);
      this.value = this.input.value = this.min + this.range * percent;
      this.ui.update(percent, this.value);
    },

    changed: function(direction) {
      if (typeof direction === 'number') {
        this.input.value = parseFloat(this.input.value) + direction * (this.input.step || 1);
      }
      this.value = this.input.value;
      this.ui.update(this._valueToPercent(), this.value);
    },

    _valueToPercent: function() {
      return  this.value != null ? 100 / this.range * (this.value - this.min) / 100 : this.min;
    },

    _getSettings: function(input) {
      var settings = {
        max: parseFloat(input.max),
        min: parseFloat(input.min)
      };
      var data = input.dataset;
      for (var i in data) {
        if (data.hasOwnProperty(i)) {
          var value = +data[i];
          settings[i] = isNaN(value) ? data[i] : value;
        }
      }
      return settings;
    }
  };

  return  Knob;
})();

