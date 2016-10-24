@module {Function} can-stream can-stream
@parent can-ecosystem
@group can-stream.fns 1 Methods
@package ../package.json

@description Convert a [can-compute] into a stream. [Kefir](https://rpominov.github.io/kefir/) is used internally to provide the stream functionality.


@body

  ## Usage

  Create a stream based on an existing `compute`

  ```js
  var canCompute = require("can-compute");
  var canStream = require("can-stream");

  var compute = canCompute(0);
  var stream = canStream(compute);

  var streamListener = function() {};
  stream.onValue(streamListener);

  compute(1);// streamListener gets called with 1 (the updated value)
  ```

  Use with `DefineMap` and create streams on properties:

  ```js
  var MyMap = DefineMap.extend({
      tasks: {
          Type: DefineList.List,
          value: []
      }
  });
  var map = new MyMap();

  var stream = canStream.toStream(map.tasks, 'length');
  var stream = canStream.toStream(map, '.tasks');
  var stream = canStream.toStream(map, '.tasks length');
  ```
