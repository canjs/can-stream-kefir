# can-compute-stream

[![Build Status](https://travis-ci.org/canjs/can-compute-stream.png?branch=master)](https://travis-ci.org/canjs/can-compute)

## API

## .asCompute([compute...], toValueStream([valueStream...))

- __compute__ `{can-compute}` - one or more computes
- __toValueStream__ `{function(stream+):stream}` Takes streams derived from the `compute` arguments and returns a stream whose value will update the compute.

__returns__ `{can-compute}` A compute that changes with the restult of __toValueStream__.

## .eventAsCompute(observable, property, eventName)

- __observable__ `{*}` 
- __property__ `{String}`
- __eventName__ `{String}` 

__returns__ `{can-compute}` A compute that's value is the last event object dispatched as `eventName`.

## .computeStream([compute...],[toFinalStream])

- __compute__ `{can-compute}` - one or more computes
- __toFinalStream__ `{function(stream+):stream?}` If provided, used to return the final stream.  If not `merge` is used.

__returns__ `{stream}` Returns a stream from the other computes.

## stream -> compute?
