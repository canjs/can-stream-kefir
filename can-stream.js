var compute = require('can-compute');
var Kefir = require('kefir');
var makeArray = require("can-util/js/make-array/make-array");
var assign = require("can-util/js/assign/assign");
var canEvent = require('can-event');


var canStream = {};

/*
 * Pipes the value of a compute into a stream
 */
canStream.singleComputeToStream = function (compute) {
	return Kefir.stream(function (emitter) {
		var changeHandler = function (ev, newVal) {
			emitter.emit(newVal);
		};

		compute.on('change', changeHandler);
		emitter.emit(compute());

		return function () {
			compute.off('change', changeHandler);
		};
	});
};


/*
 * Converts all arguments passed into a single stream and resolves the resulting
 * streams into a single stream. Assumes all arguments are computes and last
 * argument is optionally a function.
 */
canStream.toStreamFromCompute = function () {
	var computes = makeArray(arguments);
	var evaluator;

	if (computes[computes.length - 1].isComputed) {
		evaluator = function () {
			return arguments.length > 1 ? Kefir.merge(arguments) : arguments[0];
		};
	} else {
		evaluator = computes.pop();
	}

	var streams = computes.map(canStream.singleComputeToStream);
	return evaluator.apply(this, streams);
};

/*
 * Returns a single stream for a property on an {observable}
 */
canStream.toStreamFromProperty = function( obs, propName ) {
	return canStream.toStreamFromCompute(compute(obs, propName));
};

/*
 * Returns a single stream for a specific event on an {observable} property
 */
canStream.toStreamFromEvent = function() {
	var obs = arguments[0];
	var eventName, propName;


	if(arguments.length === 2) {
		//.toStreamFromEvent(obs, event);
		eventName = arguments[1];
        return Kefir.stream(function (emitter) {
			var handler = function(ev){
                var clone = assign({}, ev);
                ev.args = Array.prototype.slice.call(arguments, 1);
                emitter.emit(clone);
            };

			canEvent.addEventListener.call(obs, eventName, handler);

			return function(){
				canEvent.removeEventListener.call(obs, eventName, handler);
            };
        });
    } else {
		//.toStreamFromEvent(obs, propName, event);
		propName = arguments[1];
		eventName = arguments[2];

		var propValueStream = canStream.toStreamFromProperty(obs, propName);

		return Kefir.stream(function (emitter) {
            var handler = function(ev){
                var clone = assign({}, ev);
                ev.args = Array.prototype.slice.call(arguments, 1);
                emitter.emit(clone);
            };
            var curValue;

            propValueStream.onValue(function(value){
                if(curValue) {
                    canEvent.removeEventListener.call(curValue, eventName, handler);
                }
                if(value) {
                    canEvent.addEventListener.call(value, eventName, handler);
                }
                curValue = value;
            });


            return function(){
                if(curValue) {
                    canEvent.removeEventListener.call(curValue, eventName, handler);
                }
            };
        });
    }
};

/*
 * Takes multiple streams and returns a single stream
 */
canStream.toSingleStream = function() {
	return Kefir.merge(arguments);
};

module.exports = canStream;
