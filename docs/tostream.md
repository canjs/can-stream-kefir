@function can-stream.toStream toStream
@parent can-stream.fns


@description Creates a stream based on either a [can-compute] compute or an {Observable} object

@signature `canStream.toStream( compute )`

  Creates a stream from a [can-compute] compute. This stream gets updated whenever the compute value changes.

  ```js
  var compute = require('can-compute');
  var canStream = require('can-stream');

  var c1 = compute(0);

  var resultCompute = canStream.toStream(c1);

  resultCompute.onValue(function (val) {
    console.log(val);
  });

  c1(1);
  ```

  @param {Observable} An observable object
  @param {String} An observable property or an event or both (see usage)

  @return {String} a [Kefir](https://rpominov.github.io/kefir/) stream.

@signature `canStream.toStream( obs [, propName] )`

  Creates a stream from an observable. Optionally, you can pass the second parameter that can be an observable property or an event on the observable.

  Here we create a stream based on a property change on an observable.
  ```js
  var canStream = require('can-stream');
  var map = {
      foo: "bar"
  };

  var stream = canStream.toStream(map, '.foo');

  stream.onValue(function(newVal){
    console.log(newVal);
  });

  map.foo = "foobar";
  ```

  Create a stream based on a event on an observable property
  ```js
  var DefineMap = require('can-map/map/map');
  var canStream = require('can-stream');

  var Demo = DefineMap.extend({
      foo: {
          type: '*',
          value: {
              bar: 1
          }
      }
  });

  var obs = new Demo();
  var stream = canStream.toStream(obs, ".foo.bar");
  stream.onValue(function(newVal) {
    console.log(newVal);
  });

  obs.foo.bar = 2;
  ```

  @param {Observable} An observable object
  @param {String} An observable property or an event or both (see usage)

  @return {String} a [Kefir](https://rpominov.github.io/kefir/) stream.
