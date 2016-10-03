var QUnit = require('steal-qunit');
var computeStream = require('can-compute-stream');
var compute = require('can-compute');

QUnit.module('can-compute-stream');

test('Compute changes can be streamed', function () {
	var c = compute(0);
	var stream = computeStream(c);
	var computeVal;

	stream.onValue(function (newVal) {
		computeVal = newVal;
	});

	QUnit.equal(computeVal, 0);
	c(1);

	QUnit.equal(computeVal, 1);
	c(2);

	QUnit.equal(computeVal, 2);
	c(3);

	QUnit.equal(computeVal, 3);
});

test('Compute streams do not bind to the compute unless activated', function () {
	var c = compute(0);
	var stream = computeStream(c);

	QUnit.equal(c.computeInstance._bindings, undefined);

	stream.onValue(function () {});

	QUnit.equal(c.computeInstance._bindings, 1);
});

test('Dependent compute streams do not bind to parent computes unless activated', function () {
	var c1 = compute(0);
	var c2 = compute(0);

	computeStream(c1, c2, function (s1, s2) {
		return s1.merge(s2);
	});

	QUnit.equal(c1._bindings, undefined);
	QUnit.equal(c2._bindings, undefined);
});

test('Compute stream values can be piped into a compute', function () {
	var c1 = compute(0);
	var c2 = compute(0);

	var resultCompute = computeStream.asCompute(c1, c2, function (s1, s2) {
		return s1.merge(s2);
	});

	resultCompute.on('change', function () {});

	QUnit.equal(resultCompute(), 0);

	c1(1);
	QUnit.equal(resultCompute(), 1);

	c2(2);
	QUnit.equal(resultCompute(), 2);

	c1(3);
	QUnit.equal(resultCompute(), 3);
});

test('Computed streams fire change events', function () {
	var expected = 0;
	var c1 = compute(expected);
	var c2 = compute(expected);

	var resultCompute = computeStream.asCompute(c1, c2, function (s1, s2) {
		return s1.merge(s2);
	});

	resultCompute.on('change', function (ev, newVal) {
		QUnit.equal(expected, newVal);
	});

	expected = 1;
	c1(expected);

	expected = 2;
	c2(expected);

	expected = 3;
	c1(expected);
});
