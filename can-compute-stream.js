var compute = require('can-compute');
var Kefir = require('kefir');
var makeArray = require("can-util/js/make-array/make-array");
var assign = require("can-util/js/assign/assign");
var canEvent = require('can-event');
var Observation = require('can-observation');

// Pipes the value of a compute into a stream
var singleComputeToStream = function (compute) {
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


var computeStream = {};

// Converts all arguments passed to streams, and resolves the resulting
// streams to a single stream
//   Assumes all arguments are computes
//   Last argument is optionally a function
//we would probably want a better name, but for now this is a placeholder
computeStream.toStream = function () {
	var computes = makeArray(arguments);
	var evaluator;

	// If the last argument is a compute, merge the streams by default
	// Assume if last argument is a compute all arguments are computes
	if (computes[computes.length - 1].hasOwnProperty('isComputed')) {

		// Function will  be passed all resulting streams
		evaluator = function () {
			// If many streams are passed, merge them; Otherwise return the solo stream
			return arguments.length > 1 ? Kefir.merge(arguments) : arguments[0];
		};

	// Assume the last argument is a method that will resolve all the
	// passed stream into a single stream
	} else {
		evaluator = computes.pop();
	}

	// Converts each individual compute to a stream
	var streams = computes.map(singleComputeToStream);

	// Resolves all of the streams to a single stream
	return evaluator.apply(this, streams);
};


computeStream.toStreamFromCompute = function() {
	//returns a stream from one or more computes
	return computeStream.toStream.apply(this, arguments);
};

computeStream.toStreamFromProperty = function( obs, propName ) {
	return computeStream.toStreamFromCompute(compute(obs, propName));
};

computeStream.toStreamFromEvent = function() {
	var obs = arguments[0];
	if(arguments.length === 2) {
		var eventName = arguments[1];
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
		var propName = arguments[1];
		var eventName = arguments[2];
		var propValueStream = computeStream.toStreamFromProperty(obs, propName);

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

computeStream.toComputeFromEvent = function(obs, propName, eventName) {
	var lastValue, eventHandler;
	return compute(undefined, {

		get: function () {
			return lastValue;
		},
		set: function (val) {
			return val;
		},

		on: function (updated) {
			eventHandler = function (val) {
				lastValue = val;
				updated();
			};
			obs[propName].bind(eventName, eventHandler);
		},
		off: function () {
			obs[propName].unbind((eventName, eventHandler));
		}
	});
};

// computeStream.toStreamFromEvent = function(obs, propName, eventName) {
// 	var localCompute = computeStream.toComputeFromEvent(obs, propName, eventName);
// 	return computeStream.toStream(localCompute);
// };


module.exports = computeStream;
