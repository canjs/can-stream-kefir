@module {Function} can-compute-stream
@parent can-ecosystem

Convert one or more [can-compute]s into a stream, multiple computes into a single compute, or
multiple computes into a single stream. [Kefir](https://rpominov.github.io/kefir/) is used internally
to provide the stream functionality.

@signature `computeStream(…computes[, evaluator])`

Convert one or more [can-compute]s into a stream. If `evaluator` is not provided,
[Kefir’s merge method](https://rpominov.github.io/kefir/#merge) will be used to combine the streams.

Convert one compute into a stream:

```js
computeStream(compute1);
```

Convert multiple computes into a stream (using the default [merge](https://rpominov.github.io/kefir/#merge) evaluator):

```js
computeStream(compute1, compute2);
```

Convert multiple computes into a stream with a custom evaluator:

```js
computeStream(compute1, compute2, function(stream1, stream2) {});
```

  @param {can-compute} computes One or more instances of [can-compute].
  @param {Function} evaluator A function that’s called with each of the computes converted into a stream.

  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.

@signature `computeStream.asCompute(…computes[, evaluator])`

The same as `computeStream(…computes[, evaluator])` except a [can-compute] is returned instead of a stream.

  @param {can-compute} computes One or more instances of [can-compute].
  @param {Function} evaluator A function that’s called with each of the computes converted into a stream.

  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.

@body

## Use

```js
var canCompute = require("can-compute");
var canComputeStream = require("can-compute-stream");

var compute = canCompute(0);
var stream = canComputeStream(compute);

var streamListener = function() {};
stream.onValue(streamListener);

compute(1);// streamListener gets called with 1 (the updated value)
```