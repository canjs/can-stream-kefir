/*can-stream-kefir@0.0.5#can-stream-kefir*/
define(function (require, exports, module) {
    var compute = require('can-compute');
    var Kefir = require('kefir');
    var makeArray = require('can-util/js/make-array');
    var assign = require('can-util/js/assign');
    var canEvent = require('can-event');
    var namespace = require('can-util/namespace');
    var canStream = {};
    canStream.singleComputeToStream = function (compute) {
        return Kefir.stream(function (emitter) {
            var changeHandler = function (ev, newVal) {
                emitter.emit(newVal);
            };
            compute.on('change', changeHandler);
            emitter.emit(compute());
            return function () {
                compute.off('change', changeHandler);
            };
        });
    };
    canStream.toStreamFromCompute = function () {
        var computes = makeArray(arguments);
        var callback;
        if (computes[computes.length - 1].isComputed) {
            callback = function () {
                return arguments.length > 1 ? Kefir.merge(arguments) : arguments[0];
            };
        } else {
            callback = computes.pop();
        }
        var streams = computes.map(canStream.singleComputeToStream);
        return callback.apply(this, streams);
    };
    canStream.toStreamFromProperty = function (obs, propName) {
        return canStream.toStreamFromCompute(compute(obs, propName));
    };
    canStream.toStreamFromEvent = function () {
        var obs = arguments[0];
        var eventName, propName;
        if (arguments.length === 2) {
            eventName = arguments[1];
            return Kefir.stream(function (emitter) {
                var handler = function (ev) {
                    var clone = assign({}, ev);
                    clone.args = Array.prototype.slice.call(arguments, 1);
                    emitter.emit(clone);
                };
                canEvent.addEventListener.call(obs, eventName, handler);
                return function () {
                    canEvent.removeEventListener.call(obs, eventName, handler);
                };
            });
        } else {
            propName = arguments[1];
            eventName = arguments[2];
            var propValueStream = canStream.toStreamFromProperty(obs, propName);
            return Kefir.stream(function (emitter) {
                var handler = function (ev) {
                    var clone = assign({}, ev);
                    clone.args = Array.prototype.slice.call(arguments, 1);
                    emitter.emit(clone);
                };
                var curValue;
                propValueStream.onValue(function (value) {
                    if (curValue) {
                        canEvent.removeEventListener.call(curValue, eventName, handler);
                    }
                    if (value) {
                        canEvent.addEventListener.call(value, eventName, handler);
                    }
                    curValue = value;
                });
                return function () {
                    if (curValue) {
                        canEvent.removeEventListener.call(curValue, eventName, handler);
                    }
                };
            });
        }
    };
    canStream.toSingleStream = function () {
        return Kefir.merge(arguments);
    };
    canStream.toStream = function () {
        if (arguments.length === 1) {
            return canStream.toStreamFromCompute(arguments[0]);
        } else if (arguments.length > 1) {
            var obs = arguments[0];
            var eventNameOrPropName = arguments[1].trim();
            if (eventNameOrPropName.indexOf(' ') === -1) {
                if (eventNameOrPropName.indexOf('.') === 0) {
                    return canStream.toStreamFromProperty(obs, eventNameOrPropName.slice(1));
                } else {
                    return canStream.toStreamFromEvent(obs, eventNameOrPropName);
                }
            } else {
                var splitEventNameAndProperty = eventNameOrPropName.split(' ');
                return canStream.toStreamFromEvent(obs, splitEventNameAndProperty[0].slice(1), splitEventNameAndProperty[1]);
            }
        }
        return undefined;
    };
    canStream.toCompute = function (makeStream, context) {
        var emitter, lastValue, streamHandler, lastSetValue;
        var setterStream = Kefir.stream(function (e) {
                emitter = e;
                if (lastSetValue !== undefined) {
                    emitter.emit(lastSetValue);
                }
            }), valueStream = makeStream.call(context, setterStream);
        return compute(undefined, {
            get: function () {
                return lastValue;
            },
            set: function (val) {
                if (emitter) {
                    emitter.emit(val);
                } else {
                    lastSetValue = val;
                }
                return val;
            },
            on: function (updated) {
                streamHandler = function (val) {
                    lastValue = val;
                    updated();
                };
                valueStream.onValue(streamHandler);
            },
            off: function () {
                valueStream.offValue(streamHandler);
            }
        });
    };
    module.exports = namespace.stream = canStream;
});