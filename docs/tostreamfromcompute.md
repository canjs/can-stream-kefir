@function can-stream-kefir.toStreamFromCompute toStreamFromCompute
@parent can-stream-kefir.fns


@description Creates a stream from [can-compute] instance which gets updated whenever the compute changes.

@signature `canStream.toStreamFromCompute( compute )`

  Convert a compute into a stream:

  ```js
  var canStream = require('can-stream-kefir');
  var compute = require('can-compute');
  var foo = 'bar';
  var compute1 = compute(foo);

  var stream = canStream.toStreamFromCompute(compute1);

  stream.onValue(function(value) {
    console.log(value); // -> baz
  });

  compute1('baz');
  ```

  @param {can-compute} compute instance of [can-compute].

  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.
