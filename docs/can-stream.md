@module {function} can-stream
@parent can-ecosystem
@package ../package.json

@module {Function} can-stream
@parent can-ecosystem

Convert a [can-compute] into a stream. [Kefir](https://rpominov.github.io/kefir/) is used internally to provide the stream functionality.

@signature `canStream( computes )`

  Convert a [can-compute] into a stream.

  Convert one compute into a stream:

  ```js
  canStream.toStreamFromCompute(compute1);
  ```

  @param {can-compute} computes instance of [can-compute].
  
  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.

@signature `canStream.toStreamFromProperty( obs, propName )`

  Creates a stream based on property value change on observable

  @param {Observable} An observable object
  @param {String} property name

  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.

@signature `canStream.toStreamFromEvent( obs, propName )`

  Creates a stream based on property value change on observable

  @param {Observable} An observable object
  @param {String} property name

  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.

@signature `canStream.toStreamFromEvent( obs, propName, eventName )`

  Creates a stream based on event on observable

  @param {Observable} An observable object
  @param {String} property name
  @param {String} event name

  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.


@signature `canStream.toStream( obs [, propName] )`

  Creates a stream from an observable

  @param {Observable} An observable object
  @param {String} An observable property or an event or both (see usage below)

  @return {String} a [Kefir](https://rpominov.github.io/kefir/) stream.

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
