  /*-------------------------- FORM: TIMED OBSERVER --------------------------*/

  Abstract.TimedObserver = Class.create(Timer, (function() {
    function initialize(element, interval, callback) {
      // $super equivalent
      Timer.prototype.initialize.call(this, callback, interval);

      this.element = $(element);
      this.lastValue = this.getValue();
      this.start();
    }

    function execute() {
      var value = this.getValue();
      if ((typeof this.lastValue === 'string' && typeof value === 'string') ?
          this.lastValue != value : String(this.lastValue) != String(value)) {
        this.callback(this.element, value);
        this.lastValue = value;
      }
    }

    return {
      'initialize': initialize,
      'execute':    execute
    };
  })());

  Field.Observer = 
  Field.TimedObserver = Class.create(Abstract.TimedObserver, (function() {
    function getValue() {
      return Form.Element.getValue(this.element);
    }
    return {
      'getValue': getValue
    };
  })());

  Form.Observer = 
  Form.TimedObserver = Class.create(Abstract.TimedObserver, (function() {
    function getValue() {
      return Form.serialize(this.element);
    }
    return {
      'getValue': getValue
    };
  })());