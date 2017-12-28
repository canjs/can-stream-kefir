var QUnit = require('steal-qunit');
var canStream = require('can-stream-kefir');
var compute = require('can-compute');
var canReflect = require('can-reflect');
var DefineList = require('can-define/list/list');

QUnit.module('can-stream-kefir');

test('Compute changes can be streamed', function () {
	var c = compute(0);
	var stream = canStream.toStream(c);
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

QUnit.test('Compute streams do not bind to the compute unless activated', function(assert) {
	var c = compute(0);
	var stream = canStream.toStream(c);
	assert.notOk(c.computeInstance.bound, "should not be bound");

	stream.onValue(function() {});
	assert.ok(c.computeInstance.bound, "should be bound");
});

test('Compute stream values can be piped into a compute', function () {
	var expected = 0;
	var c1 = compute(0);
	var c2 = compute(0);

	var resultCompute = canStream.toStream(c1).merge(  canStream.toStream(c2) );

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

	var resultCompute = canStream.toStream(c1).merge(  canStream.toStream(c2) );

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





test('Create a stream from a compute with shorthand method: toStream', function() {
	var expected = 0;
	var c1 = compute(0);

	var resultCompute = canStream.toStream(c1);

	resultCompute.onValue(function (val) {
		QUnit.equal(val, expected);
	});

	expected = 1;
	c1(1);

});



test("toCompute(streamMaker) can-define-stream#17", function(){
	var c = compute("a");
	var letterStream = canStream.toStream(c);

	var streamedCompute = canStream.toCompute(function(setStream){
		return setStream.merge(letterStream);
	});

	streamedCompute.on("change", function(ev, newVal){

	});

	QUnit.deepEqual( streamedCompute(), "a" );

	c(1);

	QUnit.deepEqual( streamedCompute(), 1 );

	c("b");

	QUnit.deepEqual( streamedCompute(), "b" );
});

test("setting test", function(){

	var c = canStream.toCompute(function(setStream){
		return setStream;
	});

	c(5);
	// listen to the compute for it to have a value
	c.on("change", function(){});

	// immediate value
	QUnit.equal( c(), 5);
});


test('Stream on DefineList', function() {
	var expectedLength;

	var people = new DefineList([
	  { first: "Justin", last: "Meyer" },
	  { first: "Paula", last: "Strozak" }
	]);



	var stream = canStream.toStream(people, ".length");

	expectedLength = 2;

	stream.onValue(function(newLength) {
		QUnit.equal(newLength, expectedLength, 'List size changed');
	});

	expectedLength = 3;
	people.push({
		first: 'Obaid',
		last: 'Ahmed'
	});

	expectedLength = 2;
	people.pop();
});


test('Computes with an initial value of undefined do not emit', function() {
	var expectedLength;

	var people = new DefineList([
	  { first: "Justin", last: "Meyer" },
	  { first: "Paula", last: "Strozak" }
	]);



	var stream = canStream.toStream(people, "length");

	expectedLength = 2;

	stream.onValue(function(event) {
		QUnit.equal(event.args[0], expectedLength, 'List size changed');
	});

	expectedLength = 3;
	people.push({
		first: 'Obaid',
		last: 'Ahmed'
	});

	expectedLength = 2;
	people.pop();
});

QUnit.test('getValueDependencies - stream from compute', function(assert) {
	var c = compute(0);
	var stream = canStream.toStream(c);

	assert.deepEqual(canReflect.getValueDependencies(stream), {
		valueDependencies: new Set([c])
	});
});

QUnit.test('getValueDependencies - streamedCompute', function(assert) {
	var mergeStream;
	var c = compute("a");
	var letterStream = canStream.toStream(c);

	var makeStream = function makeStream(setStream){
		return (mergeStream = setStream.merge(letterStream));
	};

	var streamedCompute = canStream.toCompute(makeStream);

	assert.deepEqual(
		canReflect.getKeyDependencies(streamedCompute.computeInstance, "change"),
		{
			valueDependencies: new Set([ mergeStream ])
		}
	);
});
