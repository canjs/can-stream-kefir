/*can-stream-kefir@1.0.0#can-stream-kefir*/
define([
    'require',
    'exports',
    'module',
    'can-kefir',
    'can-compute',
    'can-stream',
    'can-symbol',
    'can-namespace'
], function (require, exports, module) {
    var Kefir = require('can-kefir');
    var compute = require('can-compute');
    var canStream = require('can-stream');
    var canSymbol = require('can-symbol');
    var namespace = require('can-namespace');
    var getValueDependenciesSymbol = canSymbol.for('can.getValueDependencies');
    var getKeyDependenciesSymbol = canSymbol.for('can.getKeyDependencies');
    var canStreamKefir = {};
    canStreamKefir.toStream = function (compute) {
        var stream = Kefir.stream(function (emitter) {
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
        stream[getValueDependenciesSymbol] = function getValueDependencies() {
            return { valueDependencies: new Set([compute]) };
        };
        return stream;
    };
    canStreamKefir.toCompute = function (makeStream, context) {
        var emitter, lastValue, streamHandler, lastSetValue;
        var setterStream = Kefir.stream(function (e) {
            emitter = e;
            if (lastSetValue !== undefined) {
                emitter.emit(lastSetValue);
            }
        });
        var valueStream = makeStream.call(context, setterStream);
        var streamCompute = compute(undefined, {
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
        var _compute = streamCompute.computeInstance;
        _compute[getKeyDependenciesSymbol] = function getKeyDependencies(key) {
            if (key === 'change') {
                return { valueDependencies: new Set([valueStream]) };
            }
        };
        return streamCompute;
    };
    if (!namespace.streamKefir) {
        module.exports = namespace.streamKefir = canStream(canStreamKefir);
    }
});