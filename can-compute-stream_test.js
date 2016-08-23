var compute = require('can-compute');
var QUnit = require('steal-qunit');

QUnit.module('can/compute');

test('Hello world!', function () {
	var foo = compute(0);
	QUnit.equal(foo(), 0);
	foo(1);
	QUnit.equal(foo(), 1);
});
