@module {Object} can-stream-kefir can-stream-kefir
@parent can-ecosystem
@group can-stream-kefir.fns 2 Methods
@package ../package.json

@description Convert observable values into streams. [Kefir](https://rpominov.github.io/kefir/) is used to provide the stream functionality.

@type {Object}

  The `can-stream-kefir` module exports methods useful for converting observable values like [can-compute]s
  or [can-define/map/map] properties into streams.

  ```js
  var canStream = require("can-stream-kefir");
  var DefineMap = require("can-define/map/map");

  var me = new DefineMap({name: "Justin"});

	// By default, uses the toStream method
	// same as canStream.toStream(me, ".name")
  var nameStream = canStream(me, ".name");

  nameStream.onValue(function(name){
	  // onValue gets called immediately if property
		// currently has a value and synchronously every
		// time the observable value changes
		console.log(name); // -> console.logs 'Justin'
  });

  me.name = "Obaid"; // -> console.logs 'Obaid'
  ```

@body

## Usage

The [can-stream-kefir.toStream] method takes a compute, an observable property, or and observable event and returns a [Kefir](https://rpominov.github.io/kefir/) stream instance.

```
var canStream = require("can-stream-kefir");

canStream.toStream(compute) // -> stream
// Same as canStream(compute) // -> stream
```

For example:

__Converting a compute to a stream__

```js
var canCompute = require("can-compute");
var canStream = require("can-stream-kefir");

var compute = canCompute(0);
var stream = canStream(compute);

stream.onValue(function(newVal){
	console.log(newVal); // -> console.logs 0
});

compute(1);
// -> console.logs 1
```

__Converting a [DefineMap](http://canjs.com/doc/doc/can-define/map/map.html) property to a stream__

```js
var DefineMap = require('can-define/map/map');
var canStream = require('can-stream-kefir');

var person = new DefineMap({
	first: {
		type: 'string'
	}
});

// Prepend a period for property names
var stream = canStream(person, '.first');

stream.onValue(function(newVal) {
	console.log(newVal)
	// -> Returns the whole person DefineMap
	// since first is undefined
});

person.first = 'John'; // -> console.logs 'John'
```
