var QUnit = require('steal-qunit');
var computeStream = require('can-compute-stream');
var compute = require('can-compute');
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
var Observation = require('can-observation');
var assign = require("can-util/js/assign/assign");
var canEvent = require('can-event');


QUnit.module('can-compute-stream');


test('Compute changes can be streamed', function () {
	var c = compute(0);
	var stream = computeStream.toStreamFromCompute(c);
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
	var stream = computeStream.toStreamFromCompute(c);

	QUnit.equal(c.computeInstance._bindings, undefined);

	stream.onValue(function () {});

	QUnit.equal(c.computeInstance._bindings, 1);
});

test('Dependent compute streams do not bind to parent computes unless activated', function () {
	var c1 = compute(0);
	var c2 = compute(0);

	var stream = computeStream.toStreamFromCompute(c1, c2, function (s1, s2) {
		return s1.merge(s2);
	});

	QUnit.equal(c1._bindings, undefined);
	QUnit.equal(c2._bindings, undefined);
});


test('Compute stream values can be piped into a compute', function () {
	var expected = 0;
	var c1 = compute(0);
	var c2 = compute(0);

	var resultCompute = computeStream.toStreamFromCompute(c1, c2, function (s1, s2) {
		return s1.merge(s2);
	});

	resultCompute.onValue(function (val) {
		QUnit.equal(val, expected);
	});

	expected = 1;
	c1(1);

	expected = 2;
	c2(2);

	expected = 3;
	c1(3);
});



test('Computed streams fire change events', function () {
	var expected = 0;
	var c1 = compute(expected);
	var c2 = compute(expected);

	var resultCompute = computeStream.toStreamFromCompute(c1, c2, function (s1, s2) {
		return s1.merge(s2);
	});

	resultCompute.onValue(function (newVal) {
		QUnit.equal(expected, newVal);
	});

	expected = 1;
	c1(expected);

	expected = 2;
	c2(expected);

	expected = 3;
	c1(expected);
});


test('Stream on a property val - toStreamFromEvent', function(){
	var expected = "bar";
	var MyMap = DefineMap.extend({
		foo: "bar"
	});
	var map = new MyMap();
	var stream = computeStream.toStreamFromEvent(map, 'foo');

	stream.onValue(function(ev){
		QUnit.equal(ev.target.foo, expected);
	});

	expected = "foobar";
	map.foo = "foobar";
});

test('Stream on a property val - toStreamFromProperty', function(){
	var expected = "bar";
	var map = {
		foo: "bar"
	};
	var stream = computeStream.toStreamFromProperty(map, 'foo');

	stream.onValue(function(ev){
		QUnit.equal(ev, expected);
	});


	expected = "foobar";
	map.foo = "foobar";

});

test('Multiple streams piped into single stream - toStreamFromProperty', function(){
	var expected = "bar";
	var map = {
		foo: "bar",
		foo2: "bar"
	};
	var stream1 = computeStream.toStreamFromProperty(map, 'foo');
	var stream2 = computeStream.toStreamFromProperty(map, 'foo2');

	var singleStream = computeStream.toSingleStream(stream1, stream2);

	singleStream.onValue(function(ev){
		QUnit.equal(ev, expected);
	});

	expected = "foobar";
	map.foo = "foobar";

	expected = "foobar2";
	map.foo2 = "foobar2";

});


test('Event streams fire change events', function () {
	var expected = 0;
	var MyMap = DefineMap.extend({
		fooList: {
			Type: DefineList.List,
			value: []
		}
	});
	var map = new MyMap();

	var stream = computeStream.toStreamFromEvent(map, 'fooList', 'length');

	stream.onValue(function(ev){
		QUnit.equal(map.fooList.length, expected, 'Event stream was updated with length: ' + map.fooList.length);
	});

	expected = 1;
	map.fooList.push(1);

	expected = 0;
	map.fooList.pop();

});

test('Detect nested property is updated using toStreamFromEvent', function() {
	var expected = 1;
	var obj = {
		foo: {
			bar: 1
		}
	};

	var stream = computeStream.toStreamFromEvent(obj, "changed");

	stream.onValue(function(val) {
		debugger;
		QUnit.equal(expected, val);
	});

	expected = 2;
	obj.foo.bar = 2;


});
