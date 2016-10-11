var compute = require('can-compute');
var Kefir = require('kefir');
var makeArray = require("can-util/js/make-array/make-array");
var isArray = require("can-util/js/is-array/is-array");
var assign = require("can-util/js/assign/assign");
var define = require('can-define');

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
	//streams.push(Kefir.merge(computes));
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


computeStream.toStreamFromCompute = function() {
	//returns a stream from one or more computes
	return computeStream.apply(this, arguments);
};

computeStream.toStreamFromProperty = function(obs, propName ) {
	var compute = compute(obs, propName);
	return computeStream.apply(this, compute);
};

computeStream.toStreamFromEvent = function(obs, eventName) {
	var compute = compute(obs, eventName);
	return computeStream.apply(this, compute);
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

computeStream.toStreamFromEvent = function(obs, propName, eventName) {
	var localCompute = computeStream.toComputeFromEvent(obs, propName, eventName);
	return computeStream(localCompute);
};


define.behaviors.push('stream');

var oldExtensions = define.extensions;
define.extensions = function (objPrototype, prop, definition) {
	if (isArray(definition.stream)) {
		return assign({
			value: function () {
				var map = this;
				var computes = definition.stream
					.map(function (arg) {
						if(typeof arg === 'string') {
							if(arg.indexOf(" ") !== -1) {
								return computeStream.toComputeFromEvent(map, arg.split(" ")[0], arg.split(" ")[1]);
							}
							return compute(map, arg);
						}
						else {
							return arg;
						}
					});
				return computeStream.asCompute.apply(this, computes);
			}
		}, define.types.compute);
	} else {
		return oldExtensions.apply(this, arguments);
	}
};


module.exports = computeStream;
