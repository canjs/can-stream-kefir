var compute = require('can-compute');
var Kefir = require('kefir');
var makeArray = require("can-util/js/make-array/make-array");


// Pipes the value of a compute into a stream
var singleComputeToStream = function (compute) {
	return Kefir.stream(function (emitter) {
		var changeHandler = function (ev, newVal) {
			emitter.emit(newVal);
		};

		emitter.emit(compute());
		compute.on('change', changeHandler);

		return function () {
			compute.off('change', changeHandler);
		};
	});
};

// Converts all arguments passed to streams, and resolves the resulting
// streams to a single stream
//   Assumes all arguments are computes
//   Last argument is optionally a function
var computeStream = function () {
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

// A variation of `computeStream`, but pipes the values of the 
// resolved stream back into a compute
computeStream.asCompute = function () {

	// Resolve a bunch of computes into a stream
	var valueStream = computeStream.apply(this, arguments);
	var streamHandler, lastValue;

	// Create a compute that will bind to the resolved stream when bound
	var valueCompute = compute(undefined, {

		// When the compute is read, use that last value
		get: function () {
			return lastValue;
		},
		set: function (val) {
			return val;
		},

		// When the compute is bound, bind to the resolved stream
		on: function (updated) {

			// When the stream passes a new values, save a reference to it and call
			// the compute's internal `updated` method (which ultimately calls `get`)
			streamHandler = function (val) {
				lastValue = val;
				updated();
			};
			valueStream.onValue(streamHandler);
		},

		// When the compute is unbound, unbind from the resolved stream
		off: function () {
			valueStream.offValue(streamHandler);
		}
	});

	// Return the compute that's bound to the stream
	return valueCompute;
};

	// computeStream.eventAsStream = function (map, property, eventName) {
	// 	var lastValue, eventHandler;

	// 	return compute(undefined, {
	// 		// When the compute is read, use that last value
	// 		get: function () {
	// 			return lastValue;
	// 		},
	// 		set: function (val) {
	// 			return val;
	// 		},

	// 		on: function (updated) {
	// 			eventHandler = function (val) {
	// 				lastValue = val;
	// 				updated();
	// 			};
	// 			map.bind(eventName, eventHandler)
	// 		},
	// 		off: function () {
	// 			map.unbind((eventName, eventHandler);
	// 		}
	// 	})
	// }


module.exports = computeStream;
