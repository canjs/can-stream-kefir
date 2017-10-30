@module {Object} can-stream-kefir can-stream-kefir
@parent can-observables
@collection can-ecosystem
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

  var nameStream = canStream.toStream(me,".name");


  nameStream.onValue(function(name){
	  // name -> "Obaid";
  });

  me.name = "Obaid";
  ```

@body

## Usage

The [can-stream-kefir.toStream] method takes a compute and returns a [Kefir](https://rpominov.github.io/kefir/) stream instance.

```
var canStream = require("can-stream-kefir");

canStream.toStream(compute)                    //-> stream
```

For example:

__Converting a compute to a stream__

```js
var canCompute = require("can-compute");
var canStream = require("can-stream-kefir");

var compute = canCompute(0);
var stream = canStream.toStream(compute);

stream.onValue(function(newVal){
	console.log(newVal);
});

compute(1);
//-> console.logs 1
```
