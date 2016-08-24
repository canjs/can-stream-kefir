var compute = require('can-compute');
var Kefir = require('kefir');

function makeArray(arr) {
	var ret = [];
	for (var i = 0; i < arr.length; i++) {
		ret[i] = arr[i];
	}
	return ret;
}

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

	return evaluator.apply(undefined, streams);
};

computeStream.asCompute = function () {
	var valueStream = computeStream.apply(undefined, arguments);

	var valueCompute = compute(undefined, {
		on: function () {
			valueStream.onValue(valueCompute);
		},
		off: function () {
			valueStream.offValue(valueCompute);
		}
	});

	return valueCompute;
};

module.exports = computeStream;
