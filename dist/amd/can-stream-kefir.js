/*can-stream-kefir@0.3.1#can-stream-kefir*/
define([
    'require',
    'exports',
    'module',
    'kefir',
    'can-compute',
    'can-stream',
    'can-namespace'
], function (require, exports, module) {
    var Kefir = require('kefir');
    var compute = require('can-compute');
    var canStream = require('can-stream');
    var namespace = require('can-namespace');
    var canStreamKefir = {};
    canStreamKefir.toStream = function (compute) {
        return Kefir.stream(function (emitter) {
            var changeHandler = function (ev, newVal) {
                emitter.emit(newVal);
            };
            compute.on('change', changeHandler);
            var currentValue = compute();
            if (currentValue !== undefined) {
                emitter.emit(currentValue);
            }
            return function () {
                compute.off('change', changeHandler);
            };
        });
    };
    canStreamKefir.toCompute = function (makeStream, context) {
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
    if (!namespace.streamKefir) {
        module.exports = namespace.streamKefir = canStream(canStreamKefir);
    }
});