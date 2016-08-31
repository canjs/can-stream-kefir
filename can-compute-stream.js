var compute = require('can-compute');
var define = require('can-define');
var Kefir = require('kefir');
var makeArray = require("can-util/js/make-array/make-array");
var isArray = require("can-util/js/is-array/is-array");
var assign = require("can-util/js/assign/assign");

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

var computeStream = function () {
	var computes = makeArray(arguments);
	var evaluator;

	if (computes[computes.length - 1].hasOwnProperty('isComputed')) {
		evaluator = function () {
			return arguments.length > 1 ? Kefir.merge(arguments) : arguments[0];
		};
	} else {
		evaluator = computes.pop();
	}

	var streams = computes.map(singleComputeToStream);

	return evaluator.apply(this, streams);
};

computeStream.asCompute = function () {
	var valueStream = computeStream.apply(this, arguments);
	var streamHandler, lastValue;

	var valueCompute = compute(undefined, {
		get: function () {
			return lastValue;
		},
		set: function (val) {
			return val;
		},
		on: function (updated) {
			streamHandler = function (val) {
				lastValue = val;
				updated();
			};
			valueStream.onValue(streamHandler);
		},
		off: function () {
			valueStream.offValue(streamHandler);
		}
	});

	return valueCompute;
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
						return typeof arg === 'string' ? compute(map, arg) : arg;
					});
				return computeStream.asCompute.apply(this, computes);
			}
		}, define.types.compute);
	} else {
		return oldExtensions.apply(this, arguments);
	}
};

module.exports = computeStream;
