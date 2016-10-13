# can-stream

[![Build Status](https://travis-ci.org/canjs/can-stream.png?branch=master)](https://travis-ci.org/canjs/can-stream)

## API

## .toStreamFromCompute([compute...], toValueStream([valueStream...))

- __compute__ `{can-compute}` - one or more computes
- __toValueStream__ `{function(stream+):stream}` Takes streams derived from the `compute` arguments and returns a stream whose value will update the compute.

__returns__ `{can-compute}` A compute that changes with the result of __toValueStream__.

## .toStreamFromProperty(observable, property)

- __observable__ `{*}`
- __property__ `{String}`

__returns__ `{can-stream}` A stream that's value is the last event object dispatched on property change.

## .toStreamFromEvent(observable, eventName)

- __observable__ `{*}`
- __eventName__ `{String}`

__returns__ `{can-stream}` A stream that's value is the last event object dispatched as `eventName`.

## .toStreamFromEvent(observable, property, eventName)

- __observable__ `{*}`
- __property__ `{String}`
- __eventName__ `{String}`

__returns__ `{can-stream}` A steam that's value is the last event object dispatched as `eventName` on property change.

## .toSingleStream([stream...])

- __stream__ `{can-stream}` - one or more stream

__returns__ `{can-stream}` Returns a single stream from the other stream.

## stream -> compute?
