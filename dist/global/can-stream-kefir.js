/*[process-shim]*/
(function(global, env) {
	// jshint ignore:line
	if (typeof process === "undefined") {
		global.process = {
			argv: [],
			cwd: function() {
				return "";
			},
			browser: true,
			env: {
				NODE_ENV: env || "development"
			},
			version: "",
			platform:
				global.navigator &&
				global.navigator.userAgent &&
				/Windows/.test(global.navigator.userAgent)
					? "win"
					: ""
		};
	}
})(
	typeof self == "object" && self.Object == Object
		? self
		: typeof process === "object" &&
		  Object.prototype.toString.call(process) === "[object process]"
			? global
			: window,
	"development"
);

/*[global-shim-start]*/
(function(exports, global, doEval) {
	// jshint ignore:line
	var origDefine = global.define;

	var get = function(name) {
		var parts = name.split("."),
			cur = global,
			i;
		for (i = 0; i < parts.length; i++) {
			if (!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val) {
		var parts = name.split("."),
			cur = global,
			i,
			part,
			next;
		for (i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if (!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod) {
		if (!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, default: true };
		for (var p in mod) {
			if (!esProps[p]) return false;
		}
		return true;
	};

	var hasCjsDependencies = function(deps) {
		return (
			deps[0] === "require" && deps[1] === "exports" && deps[2] === "module"
		);
	};

	var modules =
		(global.define && global.define.modules) ||
		(global._define && global._define.modules) ||
		{};
	var ourDefine = (global.define = function(moduleName, deps, callback) {
		var module;
		if (typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for (i = 0; i < deps.length; i++) {
			args.push(
				exports[deps[i]]
					? get(exports[deps[i]])
					: modules[deps[i]] || get(deps[i])
			);
		}
		// CJS has no dependencies but 3 callback arguments
		if (hasCjsDependencies(deps) || (!deps.length && callback.length)) {
			module = { exports: {} };
			args[0] = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args[1] = module.exports;
			args[2] = module;
		} else if (!args[0] && deps[0] === "exports") {
			// Babel uses the exports and module object.
			module = { exports: {} };
			args[0] = module.exports;
			if (deps[1] === "module") {
				args[1] = module;
			}
		} else if (!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if (globalExport && !get(globalExport)) {
			if (useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	});
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function() {
		// shim for @@global-helpers
		var noop = function() {};
		return {
			get: function() {
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load) {
				doEval(__load.source, global);
			}
		};
	});
})(
	{ "can-namespace": "can" },
	typeof self == "object" && self.Object == Object
		? self
		: typeof process === "object" &&
		  Object.prototype.toString.call(process) === "[object process]"
			? global
			: window,
	function(__$source__, __$global__) {
		// jshint ignore:line
		eval("(function() { " + __$source__ + " \n }).call(__$global__);");
	}
);

/*kefir@3.8.3#dist/kefir*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define('kefir', ['exports'], factory) : factory(global.Kefir = global.Kefir || {});
}(this, function (exports) {
    'use strict';
    function createObj(proto) {
        var F = function () {
        };
        F.prototype = proto;
        return new F();
    }
    function extend(target) {
        var length = arguments.length, i = void 0, prop = void 0;
        for (i = 1; i < length; i++) {
            for (prop in arguments[i]) {
                target[prop] = arguments[i][prop];
            }
        }
        return target;
    }
    function inherit(Child, Parent) {
        var length = arguments.length, i = void 0;
        Child.prototype = createObj(Parent.prototype);
        Child.prototype.constructor = Child;
        for (i = 2; i < length; i++) {
            extend(Child.prototype, arguments[i]);
        }
        return Child;
    }
    var NOTHING = ['<nothing>'];
    var END = 'end';
    var VALUE = 'value';
    var ERROR = 'error';
    var ANY = 'any';
    function concat(a, b) {
        var result = void 0, length = void 0, i = void 0, j = void 0;
        if (a.length === 0) {
            return b;
        }
        if (b.length === 0) {
            return a;
        }
        j = 0;
        result = new Array(a.length + b.length);
        length = a.length;
        for (i = 0; i < length; i++, j++) {
            result[j] = a[i];
        }
        length = b.length;
        for (i = 0; i < length; i++, j++) {
            result[j] = b[i];
        }
        return result;
    }
    function find(arr, value) {
        var length = arr.length, i = void 0;
        for (i = 0; i < length; i++) {
            if (arr[i] === value) {
                return i;
            }
        }
        return -1;
    }
    function findByPred(arr, pred) {
        var length = arr.length, i = void 0;
        for (i = 0; i < length; i++) {
            if (pred(arr[i])) {
                return i;
            }
        }
        return -1;
    }
    function cloneArray(input) {
        var length = input.length, result = new Array(length), i = void 0;
        for (i = 0; i < length; i++) {
            result[i] = input[i];
        }
        return result;
    }
    function remove(input, index) {
        var length = input.length, result = void 0, i = void 0, j = void 0;
        if (index >= 0 && index < length) {
            if (length === 1) {
                return [];
            } else {
                result = new Array(length - 1);
                for (i = 0, j = 0; i < length; i++) {
                    if (i !== index) {
                        result[j] = input[i];
                        j++;
                    }
                }
                return result;
            }
        } else {
            return input;
        }
    }
    function map(input, fn) {
        var length = input.length, result = new Array(length), i = void 0;
        for (i = 0; i < length; i++) {
            result[i] = fn(input[i]);
        }
        return result;
    }
    function forEach(arr, fn) {
        var length = arr.length, i = void 0;
        for (i = 0; i < length; i++) {
            fn(arr[i]);
        }
    }
    function fillArray(arr, value) {
        var length = arr.length, i = void 0;
        for (i = 0; i < length; i++) {
            arr[i] = value;
        }
    }
    function contains(arr, value) {
        return find(arr, value) !== -1;
    }
    function slide(cur, next, max) {
        var length = Math.min(max, cur.length + 1), offset = cur.length - length + 1, result = new Array(length), i = void 0;
        for (i = offset; i < length; i++) {
            result[i - offset] = cur[i];
        }
        result[length - 1] = next;
        return result;
    }
    function callSubscriber(type, fn, event) {
        if (type === ANY) {
            fn(event);
        } else if (type === event.type) {
            if (type === VALUE || type === ERROR) {
                fn(event.value);
            } else {
                fn();
            }
        }
    }
    function Dispatcher() {
        this._items = [];
        this._spies = [];
        this._inLoop = 0;
        this._removedItems = null;
    }
    extend(Dispatcher.prototype, {
        add: function (type, fn) {
            this._items = concat(this._items, [{
                    type: type,
                    fn: fn
                }]);
            return this._items.length;
        },
        remove: function (type, fn) {
            var index = findByPred(this._items, function (x) {
                return x.type === type && x.fn === fn;
            });
            if (this._inLoop !== 0 && index !== -1) {
                if (this._removedItems === null) {
                    this._removedItems = [];
                }
                this._removedItems.push(this._items[index]);
            }
            this._items = remove(this._items, index);
            return this._items.length;
        },
        addSpy: function (fn) {
            this._spies = concat(this._spies, [fn]);
            return this._spies.length;
        },
        removeSpy: function (fn) {
            this._spies = remove(this._spies, this._spies.indexOf(fn));
            return this._spies.length;
        },
        dispatch: function (event) {
            this._inLoop++;
            for (var i = 0, spies = this._spies; this._spies !== null && i < spies.length; i++) {
                spies[i](event);
            }
            for (var _i = 0, items = this._items; _i < items.length; _i++) {
                if (this._items === null) {
                    break;
                }
                if (this._removedItems !== null && contains(this._removedItems, items[_i])) {
                    continue;
                }
                callSubscriber(items[_i].type, items[_i].fn, event);
            }
            this._inLoop--;
            if (this._inLoop === 0) {
                this._removedItems = null;
            }
        },
        cleanup: function () {
            this._items = null;
            this._spies = null;
        }
    });
    function Observable() {
        this._dispatcher = new Dispatcher();
        this._active = false;
        this._alive = true;
        this._activating = false;
        this._logHandlers = null;
        this._spyHandlers = null;
    }
    extend(Observable.prototype, {
        _name: 'observable',
        _onActivation: function () {
        },
        _onDeactivation: function () {
        },
        _setActive: function (active) {
            if (this._active !== active) {
                this._active = active;
                if (active) {
                    this._activating = true;
                    this._onActivation();
                    this._activating = false;
                } else {
                    this._onDeactivation();
                }
            }
        },
        _clear: function () {
            this._setActive(false);
            this._dispatcher.cleanup();
            this._dispatcher = null;
            this._logHandlers = null;
        },
        _emit: function (type, x) {
            switch (type) {
            case VALUE:
                return this._emitValue(x);
            case ERROR:
                return this._emitError(x);
            case END:
                return this._emitEnd();
            }
        },
        _emitValue: function (value) {
            if (this._alive) {
                this._dispatcher.dispatch({
                    type: VALUE,
                    value: value
                });
            }
        },
        _emitError: function (value) {
            if (this._alive) {
                this._dispatcher.dispatch({
                    type: ERROR,
                    value: value
                });
            }
        },
        _emitEnd: function () {
            if (this._alive) {
                this._alive = false;
                this._dispatcher.dispatch({ type: END });
                this._clear();
            }
        },
        _on: function (type, fn) {
            if (this._alive) {
                this._dispatcher.add(type, fn);
                this._setActive(true);
            } else {
                callSubscriber(type, fn, { type: END });
            }
            return this;
        },
        _off: function (type, fn) {
            if (this._alive) {
                var count = this._dispatcher.remove(type, fn);
                if (count === 0) {
                    this._setActive(false);
                }
            }
            return this;
        },
        onValue: function (fn) {
            return this._on(VALUE, fn);
        },
        onError: function (fn) {
            return this._on(ERROR, fn);
        },
        onEnd: function (fn) {
            return this._on(END, fn);
        },
        onAny: function (fn) {
            return this._on(ANY, fn);
        },
        offValue: function (fn) {
            return this._off(VALUE, fn);
        },
        offError: function (fn) {
            return this._off(ERROR, fn);
        },
        offEnd: function (fn) {
            return this._off(END, fn);
        },
        offAny: function (fn) {
            return this._off(ANY, fn);
        },
        observe: function (observerOrOnValue, onError, onEnd) {
            var _this = this;
            var closed = false;
            var observer = !observerOrOnValue || typeof observerOrOnValue === 'function' ? {
                value: observerOrOnValue,
                error: onError,
                end: onEnd
            } : observerOrOnValue;
            var handler = function (event) {
                if (event.type === END) {
                    closed = true;
                }
                if (event.type === VALUE && observer.value) {
                    observer.value(event.value);
                } else if (event.type === ERROR && observer.error) {
                    observer.error(event.value);
                } else if (event.type === END && observer.end) {
                    observer.end(event.value);
                }
            };
            this.onAny(handler);
            return {
                unsubscribe: function () {
                    if (!closed) {
                        _this.offAny(handler);
                        closed = true;
                    }
                },
                get closed() {
                    return closed;
                }
            };
        },
        _ofSameType: function (A, B) {
            return A.prototype.getType() === this.getType() ? A : B;
        },
        setName: function (sourceObs, selfName) {
            this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
            return this;
        },
        log: function () {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();
            var isCurrent = void 0;
            var handler = function (event) {
                var type = '<' + event.type + (isCurrent ? ':current' : '') + '>';
                if (event.type === END) {
                    console.log(name, type);
                } else {
                    console.log(name, type, event.value);
                }
            };
            if (this._alive) {
                if (!this._logHandlers) {
                    this._logHandlers = [];
                }
                this._logHandlers.push({
                    name: name,
                    handler: handler
                });
            }
            isCurrent = true;
            this.onAny(handler);
            isCurrent = false;
            return this;
        },
        offLog: function () {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();
            if (this._logHandlers) {
                var handlerIndex = findByPred(this._logHandlers, function (obj) {
                    return obj.name === name;
                });
                if (handlerIndex !== -1) {
                    this.offAny(this._logHandlers[handlerIndex].handler);
                    this._logHandlers.splice(handlerIndex, 1);
                }
            }
            return this;
        },
        spy: function () {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();
            var handler = function (event) {
                var type = '<' + event.type + '>';
                if (event.type === END) {
                    console.log(name, type);
                } else {
                    console.log(name, type, event.value);
                }
            };
            if (this._alive) {
                if (!this._spyHandlers) {
                    this._spyHandlers = [];
                }
                this._spyHandlers.push({
                    name: name,
                    handler: handler
                });
                this._dispatcher.addSpy(handler);
            }
            return this;
        },
        offSpy: function () {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();
            if (this._spyHandlers) {
                var handlerIndex = findByPred(this._spyHandlers, function (obj) {
                    return obj.name === name;
                });
                if (handlerIndex !== -1) {
                    this._dispatcher.removeSpy(this._spyHandlers[handlerIndex].handler);
                    this._spyHandlers.splice(handlerIndex, 1);
                }
            }
            return this;
        }
    });
    Observable.prototype.toString = function () {
        return '[' + this._name + ']';
    };
    function Stream() {
        Observable.call(this);
    }
    inherit(Stream, Observable, {
        _name: 'stream',
        getType: function () {
            return 'stream';
        }
    });
    function Property() {
        Observable.call(this);
        this._currentEvent = null;
    }
    inherit(Property, Observable, {
        _name: 'property',
        _emitValue: function (value) {
            if (this._alive) {
                this._currentEvent = {
                    type: VALUE,
                    value: value
                };
                if (!this._activating) {
                    this._dispatcher.dispatch({
                        type: VALUE,
                        value: value
                    });
                }
            }
        },
        _emitError: function (value) {
            if (this._alive) {
                this._currentEvent = {
                    type: ERROR,
                    value: value
                };
                if (!this._activating) {
                    this._dispatcher.dispatch({
                        type: ERROR,
                        value: value
                    });
                }
            }
        },
        _emitEnd: function () {
            if (this._alive) {
                this._alive = false;
                if (!this._activating) {
                    this._dispatcher.dispatch({ type: END });
                }
                this._clear();
            }
        },
        _on: function (type, fn) {
            if (this._alive) {
                this._dispatcher.add(type, fn);
                this._setActive(true);
            }
            if (this._currentEvent !== null) {
                callSubscriber(type, fn, this._currentEvent);
            }
            if (!this._alive) {
                callSubscriber(type, fn, { type: END });
            }
            return this;
        },
        getType: function () {
            return 'property';
        }
    });
    var neverS = new Stream();
    neverS._emitEnd();
    neverS._name = 'never';
    function never() {
        return neverS;
    }
    function timeBased(mixin) {
        function AnonymousStream(wait, options) {
            var _this = this;
            Stream.call(this);
            this._wait = wait;
            this._intervalId = null;
            this._$onTick = function () {
                return _this._onTick();
            };
            this._init(options);
        }
        inherit(AnonymousStream, Stream, {
            _init: function () {
            },
            _free: function () {
            },
            _onTick: function () {
            },
            _onActivation: function () {
                this._intervalId = setInterval(this._$onTick, this._wait);
            },
            _onDeactivation: function () {
                if (this._intervalId !== null) {
                    clearInterval(this._intervalId);
                    this._intervalId = null;
                }
            },
            _clear: function () {
                Stream.prototype._clear.call(this);
                this._$onTick = null;
                this._free();
            }
        }, mixin);
        return AnonymousStream;
    }
    var S = timeBased({
        _name: 'later',
        _init: function (_ref) {
            var x = _ref.x;
            this._x = x;
        },
        _free: function () {
            this._x = null;
        },
        _onTick: function () {
            this._emitValue(this._x);
            this._emitEnd();
        }
    });
    function later(wait, x) {
        return new S(wait, { x: x });
    }
    var S$1 = timeBased({
        _name: 'interval',
        _init: function (_ref) {
            var x = _ref.x;
            this._x = x;
        },
        _free: function () {
            this._x = null;
        },
        _onTick: function () {
            this._emitValue(this._x);
        }
    });
    function interval(wait, x) {
        return new S$1(wait, { x: x });
    }
    var S$2 = timeBased({
        _name: 'sequentially',
        _init: function (_ref) {
            var xs = _ref.xs;
            this._xs = cloneArray(xs);
        },
        _free: function () {
            this._xs = null;
        },
        _onTick: function () {
            if (this._xs.length === 1) {
                this._emitValue(this._xs[0]);
                this._emitEnd();
            } else {
                this._emitValue(this._xs.shift());
            }
        }
    });
    function sequentially(wait, xs) {
        return xs.length === 0 ? never() : new S$2(wait, { xs: xs });
    }
    var S$3 = timeBased({
        _name: 'fromPoll',
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _onTick: function () {
            var fn = this._fn;
            this._emitValue(fn());
        }
    });
    function fromPoll(wait, fn) {
        return new S$3(wait, { fn: fn });
    }
    function emitter(obs) {
        function value(x) {
            obs._emitValue(x);
            return obs._active;
        }
        function error(x) {
            obs._emitError(x);
            return obs._active;
        }
        function end() {
            obs._emitEnd();
            return obs._active;
        }
        function event(e) {
            obs._emit(e.type, e.value);
            return obs._active;
        }
        return {
            value: value,
            error: error,
            end: end,
            event: event,
            emit: value,
            emitEvent: event
        };
    }
    var S$4 = timeBased({
        _name: 'withInterval',
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
            this._emitter = emitter(this);
        },
        _free: function () {
            this._fn = null;
            this._emitter = null;
        },
        _onTick: function () {
            var fn = this._fn;
            fn(this._emitter);
        }
    });
    function withInterval(wait, fn) {
        return new S$4(wait, { fn: fn });
    }
    function S$5(fn) {
        Stream.call(this);
        this._fn = fn;
        this._unsubscribe = null;
    }
    inherit(S$5, Stream, {
        _name: 'stream',
        _onActivation: function () {
            var fn = this._fn;
            var unsubscribe = fn(emitter(this));
            this._unsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;
            if (!this._active) {
                this._callUnsubscribe();
            }
        },
        _callUnsubscribe: function () {
            if (this._unsubscribe !== null) {
                this._unsubscribe();
                this._unsubscribe = null;
            }
        },
        _onDeactivation: function () {
            this._callUnsubscribe();
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._fn = null;
        }
    });
    function stream(fn) {
        return new S$5(fn);
    }
    function fromCallback(callbackConsumer) {
        var called = false;
        return stream(function (emitter) {
            if (!called) {
                callbackConsumer(function (x) {
                    emitter.emit(x);
                    emitter.end();
                });
                called = true;
            }
        }).setName('fromCallback');
    }
    function fromNodeCallback(callbackConsumer) {
        var called = false;
        return stream(function (emitter) {
            if (!called) {
                callbackConsumer(function (error, x) {
                    if (error) {
                        emitter.error(error);
                    } else {
                        emitter.emit(x);
                    }
                    emitter.end();
                });
                called = true;
            }
        }).setName('fromNodeCallback');
    }
    function spread(fn, length) {
        switch (length) {
        case 0:
            return function () {
                return fn();
            };
        case 1:
            return function (a) {
                return fn(a[0]);
            };
        case 2:
            return function (a) {
                return fn(a[0], a[1]);
            };
        case 3:
            return function (a) {
                return fn(a[0], a[1], a[2]);
            };
        case 4:
            return function (a) {
                return fn(a[0], a[1], a[2], a[3]);
            };
        default:
            return function (a) {
                return fn.apply(null, a);
            };
        }
    }
    function apply(fn, c, a) {
        var aLength = a ? a.length : 0;
        if (c == null) {
            switch (aLength) {
            case 0:
                return fn();
            case 1:
                return fn(a[0]);
            case 2:
                return fn(a[0], a[1]);
            case 3:
                return fn(a[0], a[1], a[2]);
            case 4:
                return fn(a[0], a[1], a[2], a[3]);
            default:
                return fn.apply(null, a);
            }
        } else {
            switch (aLength) {
            case 0:
                return fn.call(c);
            default:
                return fn.apply(c, a);
            }
        }
    }
    function fromSubUnsub(sub, unsub, transformer) {
        return stream(function (emitter) {
            var handler = transformer ? function () {
                emitter.emit(apply(transformer, this, arguments));
            } : function (x) {
                emitter.emit(x);
            };
            sub(handler);
            return function () {
                return unsub(handler);
            };
        }).setName('fromSubUnsub');
    }
    var pairs = [
        [
            'addEventListener',
            'removeEventListener'
        ],
        [
            'addListener',
            'removeListener'
        ],
        [
            'on',
            'off'
        ]
    ];
    function fromEvents(target, eventName, transformer) {
        var sub = void 0, unsub = void 0;
        for (var i = 0; i < pairs.length; i++) {
            if (typeof target[pairs[i][0]] === 'function' && typeof target[pairs[i][1]] === 'function') {
                sub = pairs[i][0];
                unsub = pairs[i][1];
                break;
            }
        }
        if (sub === undefined) {
            throw new Error('target don\'t support any of ' + 'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
        }
        return fromSubUnsub(function (handler) {
            return target[sub](eventName, handler);
        }, function (handler) {
            return target[unsub](eventName, handler);
        }, transformer).setName('fromEvents');
    }
    function P(value) {
        this._currentEvent = {
            type: 'value',
            value: value,
            current: true
        };
    }
    inherit(P, Property, {
        _name: 'constant',
        _active: false,
        _activating: false,
        _alive: false,
        _dispatcher: null,
        _logHandlers: null
    });
    function constant(x) {
        return new P(x);
    }
    function P$1(value) {
        this._currentEvent = {
            type: 'error',
            value: value,
            current: true
        };
    }
    inherit(P$1, Property, {
        _name: 'constantError',
        _active: false,
        _activating: false,
        _alive: false,
        _dispatcher: null,
        _logHandlers: null
    });
    function constantError(x) {
        return new P$1(x);
    }
    function createConstructor(BaseClass, name) {
        return function AnonymousObservable(source, options) {
            var _this = this;
            BaseClass.call(this);
            this._source = source;
            this._name = source._name + '.' + name;
            this._init(options);
            this._$handleAny = function (event) {
                return _this._handleAny(event);
            };
        };
    }
    function createClassMethods(BaseClass) {
        return {
            _init: function () {
            },
            _free: function () {
            },
            _handleValue: function (x) {
                this._emitValue(x);
            },
            _handleError: function (x) {
                this._emitError(x);
            },
            _handleEnd: function () {
                this._emitEnd();
            },
            _handleAny: function (event) {
                switch (event.type) {
                case VALUE:
                    return this._handleValue(event.value);
                case ERROR:
                    return this._handleError(event.value);
                case END:
                    return this._handleEnd();
                }
            },
            _onActivation: function () {
                this._source.onAny(this._$handleAny);
            },
            _onDeactivation: function () {
                this._source.offAny(this._$handleAny);
            },
            _clear: function () {
                BaseClass.prototype._clear.call(this);
                this._source = null;
                this._$handleAny = null;
                this._free();
            }
        };
    }
    function createStream(name, mixin) {
        var S = createConstructor(Stream, name);
        inherit(S, Stream, createClassMethods(Stream), mixin);
        return S;
    }
    function createProperty(name, mixin) {
        var P = createConstructor(Property, name);
        inherit(P, Property, createClassMethods(Property), mixin);
        return P;
    }
    var P$2 = createProperty('toProperty', {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._getInitialCurrent = fn;
        },
        _onActivation: function () {
            if (this._getInitialCurrent !== null) {
                var getInitial = this._getInitialCurrent;
                this._emitValue(getInitial());
            }
            this._source.onAny(this._$handleAny);
        }
    });
    function toProperty(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (fn !== null && typeof fn !== 'function') {
            throw new Error('You should call toProperty() with a function or no arguments.');
        }
        return new P$2(obs, { fn: fn });
    }
    var S$6 = createStream('changes', {
        _handleValue: function (x) {
            if (!this._activating) {
                this._emitValue(x);
            }
        },
        _handleError: function (x) {
            if (!this._activating) {
                this._emitError(x);
            }
        }
    });
    function changes(obs) {
        return new S$6(obs);
    }
    function fromPromise(promise) {
        var called = false;
        var result = stream(function (emitter) {
            if (!called) {
                var onValue = function (x) {
                    emitter.emit(x);
                    emitter.end();
                };
                var onError = function (x) {
                    emitter.error(x);
                    emitter.end();
                };
                var _promise = promise.then(onValue, onError);
                if (_promise && typeof _promise.done === 'function') {
                    _promise.done();
                }
                called = true;
            }
        });
        return toProperty(result, null).setName('fromPromise');
    }
    function getGlodalPromise() {
        if (typeof Promise === 'function') {
            return Promise;
        } else {
            throw new Error('There isn\'t default Promise, use shim or parameter');
        }
    }
    var toPromise = function (obs) {
        var Promise = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getGlodalPromise();
        var last = null;
        return new Promise(function (resolve, reject) {
            obs.onAny(function (event) {
                if (event.type === END && last !== null) {
                    (last.type === VALUE ? resolve : reject)(last.value);
                    last = null;
                } else {
                    last = event;
                }
            });
        });
    };
    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }
    var ponyfill = createCommonjsModule(function (module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports['default'] = symbolObservablePonyfill;
        function symbolObservablePonyfill(root) {
            var result;
            var _Symbol = root.Symbol;
            if (typeof _Symbol === 'function') {
                if (_Symbol.observable) {
                    result = _Symbol.observable;
                } else {
                    result = _Symbol('observable');
                    _Symbol.observable = result;
                }
            } else {
                result = '@@observable';
            }
            return result;
        }
    });
    var index$1 = createCommonjsModule(function (module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        var _ponyfill2 = _interopRequireDefault(ponyfill);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { 'default': obj };
        }
        var root;
        if (typeof self !== 'undefined') {
            root = self;
        } else if (typeof window !== 'undefined') {
            root = window;
        } else if (typeof commonjsGlobal !== 'undefined') {
            root = commonjsGlobal;
        } else {
            root = module;
        }
        var result = (0, _ponyfill2['default'])(root);
        exports['default'] = result;
    });
    var index = index$1;
    var $$observable = index.default ? index.default : index;
    function fromESObservable(_observable) {
        var observable = _observable[$$observable] ? _observable[$$observable]() : _observable;
        return stream(function (emitter) {
            var unsub = observable.subscribe({
                error: function (error) {
                    emitter.error(error);
                    emitter.end();
                },
                next: function (value) {
                    emitter.emit(value);
                },
                complete: function () {
                    emitter.end();
                }
            });
            if (unsub.unsubscribe) {
                return function () {
                    unsub.unsubscribe();
                };
            } else {
                return unsub;
            }
        }).setName('fromESObservable');
    }
    function ESObservable(observable) {
        this._observable = observable.takeErrors(1);
    }
    extend(ESObservable.prototype, {
        subscribe: function (observerOrOnNext, onError, onComplete) {
            var _this = this;
            var observer = typeof observerOrOnNext === 'function' ? {
                next: observerOrOnNext,
                error: onError,
                complete: onComplete
            } : observerOrOnNext;
            var fn = function (event) {
                if (event.type === END) {
                    closed = true;
                }
                if (event.type === VALUE && observer.next) {
                    observer.next(event.value);
                } else if (event.type === ERROR && observer.error) {
                    observer.error(event.value);
                } else if (event.type === END && observer.complete) {
                    observer.complete(event.value);
                }
            };
            this._observable.onAny(fn);
            var closed = false;
            var subscription = {
                unsubscribe: function () {
                    closed = true;
                    _this._observable.offAny(fn);
                },
                get closed() {
                    return closed;
                }
            };
            return subscription;
        }
    });
    ESObservable.prototype[$$observable] = function () {
        return this;
    };
    function toESObservable() {
        return new ESObservable(this);
    }
    function collect(source, keys, values) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                keys.push(prop);
                values.push(source[prop]);
            }
        }
    }
    function defaultErrorsCombinator(errors) {
        var latestError = void 0;
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] !== undefined) {
                if (latestError === undefined || latestError.index < errors[i].index) {
                    latestError = errors[i];
                }
            }
        }
        return latestError.error;
    }
    function Combine(active, passive, combinator) {
        var _this = this;
        Stream.call(this);
        this._activeCount = active.length;
        this._sources = concat(active, passive);
        this._combinator = combinator;
        this._aliveCount = 0;
        this._latestValues = new Array(this._sources.length);
        this._latestErrors = new Array(this._sources.length);
        fillArray(this._latestValues, NOTHING);
        this._emitAfterActivation = false;
        this._endAfterActivation = false;
        this._latestErrorIndex = 0;
        this._$handlers = [];
        var _loop = function (i) {
            _this._$handlers.push(function (event) {
                return _this._handleAny(i, event);
            });
        };
        for (var i = 0; i < this._sources.length; i++) {
            _loop(i);
        }
    }
    inherit(Combine, Stream, {
        _name: 'combine',
        _onActivation: function () {
            this._aliveCount = this._activeCount;
            for (var i = this._activeCount; i < this._sources.length; i++) {
                this._sources[i].onAny(this._$handlers[i]);
            }
            for (var _i = 0; _i < this._activeCount; _i++) {
                this._sources[_i].onAny(this._$handlers[_i]);
            }
            if (this._emitAfterActivation) {
                this._emitAfterActivation = false;
                this._emitIfFull();
            }
            if (this._endAfterActivation) {
                this._emitEnd();
            }
        },
        _onDeactivation: function () {
            var length = this._sources.length, i = void 0;
            for (i = 0; i < length; i++) {
                this._sources[i].offAny(this._$handlers[i]);
            }
        },
        _emitIfFull: function () {
            var hasAllValues = true;
            var hasErrors = false;
            var length = this._latestValues.length;
            var valuesCopy = new Array(length);
            var errorsCopy = new Array(length);
            for (var i = 0; i < length; i++) {
                valuesCopy[i] = this._latestValues[i];
                errorsCopy[i] = this._latestErrors[i];
                if (valuesCopy[i] === NOTHING) {
                    hasAllValues = false;
                }
                if (errorsCopy[i] !== undefined) {
                    hasErrors = true;
                }
            }
            if (hasAllValues) {
                var combinator = this._combinator;
                this._emitValue(combinator(valuesCopy));
            }
            if (hasErrors) {
                this._emitError(defaultErrorsCombinator(errorsCopy));
            }
        },
        _handleAny: function (i, event) {
            if (event.type === VALUE || event.type === ERROR) {
                if (event.type === VALUE) {
                    this._latestValues[i] = event.value;
                    this._latestErrors[i] = undefined;
                }
                if (event.type === ERROR) {
                    this._latestValues[i] = NOTHING;
                    this._latestErrors[i] = {
                        index: this._latestErrorIndex++,
                        error: event.value
                    };
                }
                if (i < this._activeCount) {
                    if (this._activating) {
                        this._emitAfterActivation = true;
                    } else {
                        this._emitIfFull();
                    }
                }
            } else {
                if (i < this._activeCount) {
                    this._aliveCount--;
                    if (this._aliveCount === 0) {
                        if (this._activating) {
                            this._endAfterActivation = true;
                        } else {
                            this._emitEnd();
                        }
                    }
                }
            }
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._sources = null;
            this._latestValues = null;
            this._latestErrors = null;
            this._combinator = null;
            this._$handlers = null;
        }
    });
    function combineAsArray(active) {
        var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var combinator = arguments[2];
        if (!Array.isArray(passive)) {
            throw new Error('Combine can only combine active and passive collections of the same type.');
        }
        combinator = combinator ? spread(combinator, active.length + passive.length) : function (x) {
            return x;
        };
        return active.length === 0 ? never() : new Combine(active, passive, combinator);
    }
    function combineAsObject(active) {
        var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var combinator = arguments[2];
        if (typeof passive !== 'object' || Array.isArray(passive)) {
            throw new Error('Combine can only combine active and passive collections of the same type.');
        }
        var keys = [], activeObservables = [], passiveObservables = [];
        collect(active, keys, activeObservables);
        collect(passive, keys, passiveObservables);
        var objectify = function (values) {
            var event = {};
            for (var i = values.length - 1; 0 <= i; i--) {
                event[keys[i]] = values[i];
            }
            return combinator ? combinator(event) : event;
        };
        return activeObservables.length === 0 ? never() : new Combine(activeObservables, passiveObservables, objectify);
    }
    function combine(active, passive, combinator) {
        if (typeof passive === 'function') {
            combinator = passive;
            passive = undefined;
        }
        return Array.isArray(active) ? combineAsArray(active, passive, combinator) : combineAsObject(active, passive, combinator);
    }
    var Observable$2 = {
        empty: function () {
            return never();
        },
        concat: function (a, b) {
            return a.merge(b);
        },
        of: function (x) {
            return constant(x);
        },
        map: function (fn, obs) {
            return obs.map(fn);
        },
        bimap: function (fnErr, fnVal, obs) {
            return obs.mapErrors(fnErr).map(fnVal);
        },
        ap: function (obsFn, obsVal) {
            return combine([
                obsFn,
                obsVal
            ], function (fn, val) {
                return fn(val);
            });
        },
        chain: function (fn, obs) {
            return obs.flatMap(fn);
        }
    };
    var staticLand = Object.freeze({ Observable: Observable$2 });
    var mixin = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            this._emitValue(fn(x));
        }
    };
    var S$7 = createStream('map', mixin);
    var P$3 = createProperty('map', mixin);
    var id = function (x) {
        return x;
    };
    function map$1(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id;
        return new (obs._ofSameType(S$7, P$3))(obs, { fn: fn });
    }
    var mixin$1 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (fn(x)) {
                this._emitValue(x);
            }
        }
    };
    var S$8 = createStream('filter', mixin$1);
    var P$4 = createProperty('filter', mixin$1);
    var id$1 = function (x) {
        return x;
    };
    function filter(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$1;
        return new (obs._ofSameType(S$8, P$4))(obs, { fn: fn });
    }
    var mixin$2 = {
        _init: function (_ref) {
            var n = _ref.n;
            this._n = n;
            if (n <= 0) {
                this._emitEnd();
            }
        },
        _handleValue: function (x) {
            if (this._n === 0) {
                return;
            }
            this._n--;
            this._emitValue(x);
            if (this._n === 0) {
                this._emitEnd();
            }
        }
    };
    var S$9 = createStream('take', mixin$2);
    var P$5 = createProperty('take', mixin$2);
    function take(obs, n) {
        return new (obs._ofSameType(S$9, P$5))(obs, { n: n });
    }
    var mixin$3 = {
        _init: function (_ref) {
            var n = _ref.n;
            this._n = n;
            if (n <= 0) {
                this._emitEnd();
            }
        },
        _handleError: function (x) {
            if (this._n === 0) {
                return;
            }
            this._n--;
            this._emitError(x);
            if (this._n === 0) {
                this._emitEnd();
            }
        }
    };
    var S$10 = createStream('takeErrors', mixin$3);
    var P$6 = createProperty('takeErrors', mixin$3);
    function takeErrors(obs, n) {
        return new (obs._ofSameType(S$10, P$6))(obs, { n: n });
    }
    var mixin$4 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (fn(x)) {
                this._emitValue(x);
            } else {
                this._emitEnd();
            }
        }
    };
    var S$11 = createStream('takeWhile', mixin$4);
    var P$7 = createProperty('takeWhile', mixin$4);
    var id$2 = function (x) {
        return x;
    };
    function takeWhile(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$2;
        return new (obs._ofSameType(S$11, P$7))(obs, { fn: fn });
    }
    var mixin$5 = {
        _init: function () {
            this._lastValue = NOTHING;
        },
        _free: function () {
            this._lastValue = null;
        },
        _handleValue: function (x) {
            this._lastValue = x;
        },
        _handleEnd: function () {
            if (this._lastValue !== NOTHING) {
                this._emitValue(this._lastValue);
            }
            this._emitEnd();
        }
    };
    var S$12 = createStream('last', mixin$5);
    var P$8 = createProperty('last', mixin$5);
    function last(obs) {
        return new (obs._ofSameType(S$12, P$8))(obs);
    }
    var mixin$6 = {
        _init: function (_ref) {
            var n = _ref.n;
            this._n = Math.max(0, n);
        },
        _handleValue: function (x) {
            if (this._n === 0) {
                this._emitValue(x);
            } else {
                this._n--;
            }
        }
    };
    var S$13 = createStream('skip', mixin$6);
    var P$9 = createProperty('skip', mixin$6);
    function skip(obs, n) {
        return new (obs._ofSameType(S$13, P$9))(obs, { n: n });
    }
    var mixin$7 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (this._fn !== null && !fn(x)) {
                this._fn = null;
            }
            if (this._fn === null) {
                this._emitValue(x);
            }
        }
    };
    var S$14 = createStream('skipWhile', mixin$7);
    var P$10 = createProperty('skipWhile', mixin$7);
    var id$3 = function (x) {
        return x;
    };
    function skipWhile(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$3;
        return new (obs._ofSameType(S$14, P$10))(obs, { fn: fn });
    }
    var mixin$8 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
            this._prev = NOTHING;
        },
        _free: function () {
            this._fn = null;
            this._prev = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (this._prev === NOTHING || !fn(this._prev, x)) {
                this._prev = x;
                this._emitValue(x);
            }
        }
    };
    var S$15 = createStream('skipDuplicates', mixin$8);
    var P$11 = createProperty('skipDuplicates', mixin$8);
    var eq = function (a, b) {
        return a === b;
    };
    function skipDuplicates(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : eq;
        return new (obs._ofSameType(S$15, P$11))(obs, { fn: fn });
    }
    var mixin$9 = {
        _init: function (_ref) {
            var fn = _ref.fn, seed = _ref.seed;
            this._fn = fn;
            this._prev = seed;
        },
        _free: function () {
            this._prev = null;
            this._fn = null;
        },
        _handleValue: function (x) {
            if (this._prev !== NOTHING) {
                var fn = this._fn;
                this._emitValue(fn(this._prev, x));
            }
            this._prev = x;
        }
    };
    var S$16 = createStream('diff', mixin$9);
    var P$12 = createProperty('diff', mixin$9);
    function defaultFn(a, b) {
        return [
            a,
            b
        ];
    }
    function diff(obs, fn) {
        var seed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NOTHING;
        return new (obs._ofSameType(S$16, P$12))(obs, {
            fn: fn || defaultFn,
            seed: seed
        });
    }
    var P$13 = createProperty('scan', {
        _init: function (_ref) {
            var fn = _ref.fn, seed = _ref.seed;
            this._fn = fn;
            this._seed = seed;
            if (seed !== NOTHING) {
                this._emitValue(seed);
            }
        },
        _free: function () {
            this._fn = null;
            this._seed = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (this._currentEvent === null || this._currentEvent.type === ERROR) {
                this._emitValue(this._seed === NOTHING ? x : fn(this._seed, x));
            } else {
                this._emitValue(fn(this._currentEvent.value, x));
            }
        }
    });
    function scan(obs, fn) {
        var seed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NOTHING;
        return new P$13(obs, {
            fn: fn,
            seed: seed
        });
    }
    var mixin$10 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            var xs = fn(x);
            for (var i = 0; i < xs.length; i++) {
                this._emitValue(xs[i]);
            }
        }
    };
    var S$17 = createStream('flatten', mixin$10);
    var id$4 = function (x) {
        return x;
    };
    function flatten(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$4;
        return new S$17(obs, { fn: fn });
    }
    var END_MARKER = {};
    var mixin$11 = {
        _init: function (_ref) {
            var _this = this;
            var wait = _ref.wait;
            this._wait = Math.max(0, wait);
            this._buff = [];
            this._$shiftBuff = function () {
                var value = _this._buff.shift();
                if (value === END_MARKER) {
                    _this._emitEnd();
                } else {
                    _this._emitValue(value);
                }
            };
        },
        _free: function () {
            this._buff = null;
            this._$shiftBuff = null;
        },
        _handleValue: function (x) {
            if (this._activating) {
                this._emitValue(x);
            } else {
                this._buff.push(x);
                setTimeout(this._$shiftBuff, this._wait);
            }
        },
        _handleEnd: function () {
            if (this._activating) {
                this._emitEnd();
            } else {
                this._buff.push(END_MARKER);
                setTimeout(this._$shiftBuff, this._wait);
            }
        }
    };
    var S$18 = createStream('delay', mixin$11);
    var P$14 = createProperty('delay', mixin$11);
    function delay(obs, wait) {
        return new (obs._ofSameType(S$18, P$14))(obs, { wait: wait });
    }
    var now = Date.now ? function () {
        return Date.now();
    } : function () {
        return new Date().getTime();
    };
    var mixin$12 = {
        _init: function (_ref) {
            var _this = this;
            var wait = _ref.wait, leading = _ref.leading, trailing = _ref.trailing;
            this._wait = Math.max(0, wait);
            this._leading = leading;
            this._trailing = trailing;
            this._trailingValue = null;
            this._timeoutId = null;
            this._endLater = false;
            this._lastCallTime = 0;
            this._$trailingCall = function () {
                return _this._trailingCall();
            };
        },
        _free: function () {
            this._trailingValue = null;
            this._$trailingCall = null;
        },
        _handleValue: function (x) {
            if (this._activating) {
                this._emitValue(x);
            } else {
                var curTime = now();
                if (this._lastCallTime === 0 && !this._leading) {
                    this._lastCallTime = curTime;
                }
                var remaining = this._wait - (curTime - this._lastCallTime);
                if (remaining <= 0) {
                    this._cancelTrailing();
                    this._lastCallTime = curTime;
                    this._emitValue(x);
                } else if (this._trailing) {
                    this._cancelTrailing();
                    this._trailingValue = x;
                    this._timeoutId = setTimeout(this._$trailingCall, remaining);
                }
            }
        },
        _handleEnd: function () {
            if (this._activating) {
                this._emitEnd();
            } else {
                if (this._timeoutId) {
                    this._endLater = true;
                } else {
                    this._emitEnd();
                }
            }
        },
        _cancelTrailing: function () {
            if (this._timeoutId !== null) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }
        },
        _trailingCall: function () {
            this._emitValue(this._trailingValue);
            this._timeoutId = null;
            this._trailingValue = null;
            this._lastCallTime = !this._leading ? 0 : now();
            if (this._endLater) {
                this._emitEnd();
            }
        }
    };
    var S$19 = createStream('throttle', mixin$12);
    var P$15 = createProperty('throttle', mixin$12);
    function throttle(obs, wait) {
        var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, _ref2$leading = _ref2.leading, leading = _ref2$leading === undefined ? true : _ref2$leading, _ref2$trailing = _ref2.trailing, trailing = _ref2$trailing === undefined ? true : _ref2$trailing;
        return new (obs._ofSameType(S$19, P$15))(obs, {
            wait: wait,
            leading: leading,
            trailing: trailing
        });
    }
    var mixin$13 = {
        _init: function (_ref) {
            var _this = this;
            var wait = _ref.wait, immediate = _ref.immediate;
            this._wait = Math.max(0, wait);
            this._immediate = immediate;
            this._lastAttempt = 0;
            this._timeoutId = null;
            this._laterValue = null;
            this._endLater = false;
            this._$later = function () {
                return _this._later();
            };
        },
        _free: function () {
            this._laterValue = null;
            this._$later = null;
        },
        _handleValue: function (x) {
            if (this._activating) {
                this._emitValue(x);
            } else {
                this._lastAttempt = now();
                if (this._immediate && !this._timeoutId) {
                    this._emitValue(x);
                }
                if (!this._timeoutId) {
                    this._timeoutId = setTimeout(this._$later, this._wait);
                }
                if (!this._immediate) {
                    this._laterValue = x;
                }
            }
        },
        _handleEnd: function () {
            if (this._activating) {
                this._emitEnd();
            } else {
                if (this._timeoutId && !this._immediate) {
                    this._endLater = true;
                } else {
                    this._emitEnd();
                }
            }
        },
        _later: function () {
            var last = now() - this._lastAttempt;
            if (last < this._wait && last >= 0) {
                this._timeoutId = setTimeout(this._$later, this._wait - last);
            } else {
                this._timeoutId = null;
                if (!this._immediate) {
                    this._emitValue(this._laterValue);
                    this._laterValue = null;
                }
                if (this._endLater) {
                    this._emitEnd();
                }
            }
        }
    };
    var S$20 = createStream('debounce', mixin$13);
    var P$16 = createProperty('debounce', mixin$13);
    function debounce(obs, wait) {
        var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, _ref2$immediate = _ref2.immediate, immediate = _ref2$immediate === undefined ? false : _ref2$immediate;
        return new (obs._ofSameType(S$20, P$16))(obs, {
            wait: wait,
            immediate: immediate
        });
    }
    var mixin$14 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleError: function (x) {
            var fn = this._fn;
            this._emitError(fn(x));
        }
    };
    var S$21 = createStream('mapErrors', mixin$14);
    var P$17 = createProperty('mapErrors', mixin$14);
    var id$5 = function (x) {
        return x;
    };
    function mapErrors(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$5;
        return new (obs._ofSameType(S$21, P$17))(obs, { fn: fn });
    }
    var mixin$15 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleError: function (x) {
            var fn = this._fn;
            if (fn(x)) {
                this._emitError(x);
            }
        }
    };
    var S$22 = createStream('filterErrors', mixin$15);
    var P$18 = createProperty('filterErrors', mixin$15);
    var id$6 = function (x) {
        return x;
    };
    function filterErrors(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$6;
        return new (obs._ofSameType(S$22, P$18))(obs, { fn: fn });
    }
    var mixin$16 = {
        _handleValue: function () {
        }
    };
    var S$23 = createStream('ignoreValues', mixin$16);
    var P$19 = createProperty('ignoreValues', mixin$16);
    function ignoreValues(obs) {
        return new (obs._ofSameType(S$23, P$19))(obs);
    }
    var mixin$17 = {
        _handleError: function () {
        }
    };
    var S$24 = createStream('ignoreErrors', mixin$17);
    var P$20 = createProperty('ignoreErrors', mixin$17);
    function ignoreErrors(obs) {
        return new (obs._ofSameType(S$24, P$20))(obs);
    }
    var mixin$18 = {
        _handleEnd: function () {
        }
    };
    var S$25 = createStream('ignoreEnd', mixin$18);
    var P$21 = createProperty('ignoreEnd', mixin$18);
    function ignoreEnd(obs) {
        return new (obs._ofSameType(S$25, P$21))(obs);
    }
    var mixin$19 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleEnd: function () {
            var fn = this._fn;
            this._emitValue(fn());
            this._emitEnd();
        }
    };
    var S$26 = createStream('beforeEnd', mixin$19);
    var P$22 = createProperty('beforeEnd', mixin$19);
    function beforeEnd(obs, fn) {
        return new (obs._ofSameType(S$26, P$22))(obs, { fn: fn });
    }
    var mixin$20 = {
        _init: function (_ref) {
            var min = _ref.min, max = _ref.max;
            this._max = max;
            this._min = min;
            this._buff = [];
        },
        _free: function () {
            this._buff = null;
        },
        _handleValue: function (x) {
            this._buff = slide(this._buff, x, this._max);
            if (this._buff.length >= this._min) {
                this._emitValue(this._buff);
            }
        }
    };
    var S$27 = createStream('slidingWindow', mixin$20);
    var P$23 = createProperty('slidingWindow', mixin$20);
    function slidingWindow(obs, max) {
        var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        return new (obs._ofSameType(S$27, P$23))(obs, {
            min: min,
            max: max
        });
    }
    var mixin$21 = {
        _init: function (_ref) {
            var fn = _ref.fn, flushOnEnd = _ref.flushOnEnd;
            this._fn = fn;
            this._flushOnEnd = flushOnEnd;
            this._buff = [];
        },
        _free: function () {
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null && this._buff.length !== 0) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handleValue: function (x) {
            this._buff.push(x);
            var fn = this._fn;
            if (!fn(x)) {
                this._flush();
            }
        },
        _handleEnd: function () {
            if (this._flushOnEnd) {
                this._flush();
            }
            this._emitEnd();
        }
    };
    var S$28 = createStream('bufferWhile', mixin$21);
    var P$24 = createProperty('bufferWhile', mixin$21);
    var id$7 = function (x) {
        return x;
    };
    function bufferWhile(obs, fn) {
        var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, _ref2$flushOnEnd = _ref2.flushOnEnd, flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;
        return new (obs._ofSameType(S$28, P$24))(obs, {
            fn: fn || id$7,
            flushOnEnd: flushOnEnd
        });
    }
    var mixin$22 = {
        _init: function (_ref) {
            var count = _ref.count, flushOnEnd = _ref.flushOnEnd;
            this._count = count;
            this._flushOnEnd = flushOnEnd;
            this._buff = [];
        },
        _free: function () {
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null && this._buff.length !== 0) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handleValue: function (x) {
            this._buff.push(x);
            if (this._buff.length >= this._count) {
                this._flush();
            }
        },
        _handleEnd: function () {
            if (this._flushOnEnd) {
                this._flush();
            }
            this._emitEnd();
        }
    };
    var S$29 = createStream('bufferWithCount', mixin$22);
    var P$25 = createProperty('bufferWithCount', mixin$22);
    function bufferWhile$1(obs, count) {
        var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, _ref2$flushOnEnd = _ref2.flushOnEnd, flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;
        return new (obs._ofSameType(S$29, P$25))(obs, {
            count: count,
            flushOnEnd: flushOnEnd
        });
    }
    var mixin$23 = {
        _init: function (_ref) {
            var _this = this;
            var wait = _ref.wait, count = _ref.count, flushOnEnd = _ref.flushOnEnd;
            this._wait = wait;
            this._count = count;
            this._flushOnEnd = flushOnEnd;
            this._intervalId = null;
            this._$onTick = function () {
                return _this._flush();
            };
            this._buff = [];
        },
        _free: function () {
            this._$onTick = null;
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handleValue: function (x) {
            this._buff.push(x);
            if (this._buff.length >= this._count) {
                clearInterval(this._intervalId);
                this._flush();
                this._intervalId = setInterval(this._$onTick, this._wait);
            }
        },
        _handleEnd: function () {
            if (this._flushOnEnd && this._buff.length !== 0) {
                this._flush();
            }
            this._emitEnd();
        },
        _onActivation: function () {
            this._intervalId = setInterval(this._$onTick, this._wait);
            this._source.onAny(this._$handleAny);
        },
        _onDeactivation: function () {
            if (this._intervalId !== null) {
                clearInterval(this._intervalId);
                this._intervalId = null;
            }
            this._source.offAny(this._$handleAny);
        }
    };
    var S$30 = createStream('bufferWithTimeOrCount', mixin$23);
    var P$26 = createProperty('bufferWithTimeOrCount', mixin$23);
    function bufferWithTimeOrCount(obs, wait, count) {
        var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {}, _ref2$flushOnEnd = _ref2.flushOnEnd, flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;
        return new (obs._ofSameType(S$30, P$26))(obs, {
            wait: wait,
            count: count,
            flushOnEnd: flushOnEnd
        });
    }
    function xformForObs(obs) {
        return {
            '@@transducer/step': function (res, input) {
                obs._emitValue(input);
                return null;
            },
            '@@transducer/result': function () {
                obs._emitEnd();
                return null;
            }
        };
    }
    var mixin$24 = {
        _init: function (_ref) {
            var transducer = _ref.transducer;
            this._xform = transducer(xformForObs(this));
        },
        _free: function () {
            this._xform = null;
        },
        _handleValue: function (x) {
            if (this._xform['@@transducer/step'](null, x) !== null) {
                this._xform['@@transducer/result'](null);
            }
        },
        _handleEnd: function () {
            this._xform['@@transducer/result'](null);
        }
    };
    var S$31 = createStream('transduce', mixin$24);
    var P$27 = createProperty('transduce', mixin$24);
    function transduce(obs, transducer) {
        return new (obs._ofSameType(S$31, P$27))(obs, { transducer: transducer });
    }
    var mixin$25 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._handler = fn;
            this._emitter = emitter(this);
        },
        _free: function () {
            this._handler = null;
            this._emitter = null;
        },
        _handleAny: function (event) {
            this._handler(this._emitter, event);
        }
    };
    var S$32 = createStream('withHandler', mixin$25);
    var P$28 = createProperty('withHandler', mixin$25);
    function withHandler(obs, fn) {
        return new (obs._ofSameType(S$32, P$28))(obs, { fn: fn });
    }
    var isArray = Array.isArray || function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]';
    };
    function Zip(sources, combinator) {
        var _this = this;
        Stream.call(this);
        this._buffers = map(sources, function (source) {
            return isArray(source) ? cloneArray(source) : [];
        });
        this._sources = map(sources, function (source) {
            return isArray(source) ? never() : source;
        });
        this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
            return x;
        };
        this._aliveCount = 0;
        this._$handlers = [];
        var _loop = function (i) {
            _this._$handlers.push(function (event) {
                return _this._handleAny(i, event);
            });
        };
        for (var i = 0; i < this._sources.length; i++) {
            _loop(i);
        }
    }
    inherit(Zip, Stream, {
        _name: 'zip',
        _onActivation: function () {
            while (this._isFull()) {
                this._emit();
            }
            var length = this._sources.length;
            this._aliveCount = length;
            for (var i = 0; i < length && this._active; i++) {
                this._sources[i].onAny(this._$handlers[i]);
            }
        },
        _onDeactivation: function () {
            for (var i = 0; i < this._sources.length; i++) {
                this._sources[i].offAny(this._$handlers[i]);
            }
        },
        _emit: function () {
            var values = new Array(this._buffers.length);
            for (var i = 0; i < this._buffers.length; i++) {
                values[i] = this._buffers[i].shift();
            }
            var combinator = this._combinator;
            this._emitValue(combinator(values));
        },
        _isFull: function () {
            for (var i = 0; i < this._buffers.length; i++) {
                if (this._buffers[i].length === 0) {
                    return false;
                }
            }
            return true;
        },
        _handleAny: function (i, event) {
            if (event.type === VALUE) {
                this._buffers[i].push(event.value);
                if (this._isFull()) {
                    this._emit();
                }
            }
            if (event.type === ERROR) {
                this._emitError(event.value);
            }
            if (event.type === END) {
                this._aliveCount--;
                if (this._aliveCount === 0) {
                    this._emitEnd();
                }
            }
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._sources = null;
            this._buffers = null;
            this._combinator = null;
            this._$handlers = null;
        }
    });
    function zip(observables, combinator) {
        return observables.length === 0 ? never() : new Zip(observables, combinator);
    }
    var id$8 = function (x) {
        return x;
    };
    function AbstractPool() {
        var _this = this;
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref$queueLim = _ref.queueLim, queueLim = _ref$queueLim === undefined ? 0 : _ref$queueLim, _ref$concurLim = _ref.concurLim, concurLim = _ref$concurLim === undefined ? -1 : _ref$concurLim, _ref$drop = _ref.drop, drop = _ref$drop === undefined ? 'new' : _ref$drop;
        Stream.call(this);
        this._queueLim = queueLim < 0 ? -1 : queueLim;
        this._concurLim = concurLim < 0 ? -1 : concurLim;
        this._drop = drop;
        this._queue = [];
        this._curSources = [];
        this._$handleSubAny = function (event) {
            return _this._handleSubAny(event);
        };
        this._$endHandlers = [];
        this._currentlyAdding = null;
        if (this._concurLim === 0) {
            this._emitEnd();
        }
    }
    inherit(AbstractPool, Stream, {
        _name: 'abstractPool',
        _add: function (obj, toObs) {
            toObs = toObs || id$8;
            if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
                this._addToCur(toObs(obj));
            } else {
                if (this._queueLim === -1 || this._queue.length < this._queueLim) {
                    this._addToQueue(toObs(obj));
                } else if (this._drop === 'old') {
                    this._removeOldest();
                    this._add(obj, toObs);
                }
            }
        },
        _addAll: function (obss) {
            var _this2 = this;
            forEach(obss, function (obs) {
                return _this2._add(obs);
            });
        },
        _remove: function (obs) {
            if (this._removeCur(obs) === -1) {
                this._removeQueue(obs);
            }
        },
        _addToQueue: function (obs) {
            this._queue = concat(this._queue, [obs]);
        },
        _addToCur: function (obs) {
            if (this._active) {
                if (!obs._alive) {
                    if (obs._currentEvent) {
                        this._emit(obs._currentEvent.type, obs._currentEvent.value);
                    }
                    if (this._queue.length !== 0) {
                        this._pullQueue();
                    } else if (this._curSources.length === 0) {
                        this._onEmpty();
                    }
                    return;
                }
                this._currentlyAdding = obs;
                obs.onAny(this._$handleSubAny);
                this._currentlyAdding = null;
                if (obs._alive) {
                    this._curSources = concat(this._curSources, [obs]);
                    if (this._active) {
                        this._subToEnd(obs);
                    }
                }
            } else {
                this._curSources = concat(this._curSources, [obs]);
            }
        },
        _subToEnd: function (obs) {
            var _this3 = this;
            var onEnd = function () {
                return _this3._removeCur(obs);
            };
            this._$endHandlers.push({
                obs: obs,
                handler: onEnd
            });
            obs.onEnd(onEnd);
        },
        _subscribe: function (obs) {
            obs.onAny(this._$handleSubAny);
            if (this._active) {
                this._subToEnd(obs);
            }
        },
        _unsubscribe: function (obs) {
            obs.offAny(this._$handleSubAny);
            var onEndI = findByPred(this._$endHandlers, function (obj) {
                return obj.obs === obs;
            });
            if (onEndI !== -1) {
                obs.offEnd(this._$endHandlers[onEndI].handler);
                this._$endHandlers.splice(onEndI, 1);
            }
        },
        _handleSubAny: function (event) {
            if (event.type === VALUE) {
                this._emitValue(event.value);
            } else if (event.type === ERROR) {
                this._emitError(event.value);
            }
        },
        _removeQueue: function (obs) {
            var index = find(this._queue, obs);
            this._queue = remove(this._queue, index);
            return index;
        },
        _removeCur: function (obs) {
            if (this._active) {
                this._unsubscribe(obs);
            }
            var index = find(this._curSources, obs);
            this._curSources = remove(this._curSources, index);
            if (index !== -1) {
                if (this._queue.length !== 0) {
                    this._pullQueue();
                } else if (this._curSources.length === 0) {
                    this._onEmpty();
                }
            }
            return index;
        },
        _removeOldest: function () {
            this._removeCur(this._curSources[0]);
        },
        _pullQueue: function () {
            if (this._queue.length !== 0) {
                this._queue = cloneArray(this._queue);
                this._addToCur(this._queue.shift());
            }
        },
        _onActivation: function () {
            for (var i = 0, sources = this._curSources; i < sources.length && this._active; i++) {
                this._subscribe(sources[i]);
            }
        },
        _onDeactivation: function () {
            for (var i = 0, sources = this._curSources; i < sources.length; i++) {
                this._unsubscribe(sources[i]);
            }
            if (this._currentlyAdding !== null) {
                this._unsubscribe(this._currentlyAdding);
            }
        },
        _isEmpty: function () {
            return this._curSources.length === 0;
        },
        _onEmpty: function () {
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._queue = null;
            this._curSources = null;
            this._$handleSubAny = null;
            this._$endHandlers = null;
        }
    });
    function Merge(sources) {
        AbstractPool.call(this);
        this._addAll(sources);
        this._initialised = true;
    }
    inherit(Merge, AbstractPool, {
        _name: 'merge',
        _onEmpty: function () {
            if (this._initialised) {
                this._emitEnd();
            }
        }
    });
    function merge(observables) {
        return observables.length === 0 ? never() : new Merge(observables);
    }
    function S$33(generator) {
        var _this = this;
        Stream.call(this);
        this._generator = generator;
        this._source = null;
        this._inLoop = false;
        this._iteration = 0;
        this._$handleAny = function (event) {
            return _this._handleAny(event);
        };
    }
    inherit(S$33, Stream, {
        _name: 'repeat',
        _handleAny: function (event) {
            if (event.type === END) {
                this._source = null;
                this._getSource();
            } else {
                this._emit(event.type, event.value);
            }
        },
        _getSource: function () {
            if (!this._inLoop) {
                this._inLoop = true;
                var generator = this._generator;
                while (this._source === null && this._alive && this._active) {
                    this._source = generator(this._iteration++);
                    if (this._source) {
                        this._source.onAny(this._$handleAny);
                    } else {
                        this._emitEnd();
                    }
                }
                this._inLoop = false;
            }
        },
        _onActivation: function () {
            if (this._source) {
                this._source.onAny(this._$handleAny);
            } else {
                this._getSource();
            }
        },
        _onDeactivation: function () {
            if (this._source) {
                this._source.offAny(this._$handleAny);
            }
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._generator = null;
            this._source = null;
            this._$handleAny = null;
        }
    });
    var repeat = function (generator) {
        return new S$33(generator);
    };
    function concat$1(observables) {
        return repeat(function (index) {
            return observables.length > index ? observables[index] : false;
        }).setName('concat');
    }
    function Pool() {
        AbstractPool.call(this);
    }
    inherit(Pool, AbstractPool, {
        _name: 'pool',
        plug: function (obs) {
            this._add(obs);
            return this;
        },
        unplug: function (obs) {
            this._remove(obs);
            return this;
        }
    });
    function FlatMap(source, fn, options) {
        var _this = this;
        AbstractPool.call(this, options);
        this._source = source;
        this._fn = fn;
        this._mainEnded = false;
        this._lastCurrent = null;
        this._$handleMain = function (event) {
            return _this._handleMain(event);
        };
    }
    inherit(FlatMap, AbstractPool, {
        _onActivation: function () {
            AbstractPool.prototype._onActivation.call(this);
            if (this._active) {
                this._source.onAny(this._$handleMain);
            }
        },
        _onDeactivation: function () {
            AbstractPool.prototype._onDeactivation.call(this);
            this._source.offAny(this._$handleMain);
            this._hadNoEvSinceDeact = true;
        },
        _handleMain: function (event) {
            if (event.type === VALUE) {
                var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
                if (!sameCurr) {
                    this._add(event.value, this._fn);
                }
                this._lastCurrent = event.value;
                this._hadNoEvSinceDeact = false;
            }
            if (event.type === ERROR) {
                this._emitError(event.value);
            }
            if (event.type === END) {
                if (this._isEmpty()) {
                    this._emitEnd();
                } else {
                    this._mainEnded = true;
                }
            }
        },
        _onEmpty: function () {
            if (this._mainEnded) {
                this._emitEnd();
            }
        },
        _clear: function () {
            AbstractPool.prototype._clear.call(this);
            this._source = null;
            this._lastCurrent = null;
            this._$handleMain = null;
        }
    });
    function FlatMapErrors(source, fn) {
        FlatMap.call(this, source, fn);
    }
    inherit(FlatMapErrors, FlatMap, {
        _handleMain: function (event) {
            if (event.type === ERROR) {
                var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
                if (!sameCurr) {
                    this._add(event.value, this._fn);
                }
                this._lastCurrent = event.value;
                this._hadNoEvSinceDeact = false;
            }
            if (event.type === VALUE) {
                this._emitValue(event.value);
            }
            if (event.type === END) {
                if (this._isEmpty()) {
                    this._emitEnd();
                } else {
                    this._mainEnded = true;
                }
            }
        }
    });
    function createConstructor$1(BaseClass, name) {
        return function AnonymousObservable(primary, secondary, options) {
            var _this = this;
            BaseClass.call(this);
            this._primary = primary;
            this._secondary = secondary;
            this._name = primary._name + '.' + name;
            this._lastSecondary = NOTHING;
            this._$handleSecondaryAny = function (event) {
                return _this._handleSecondaryAny(event);
            };
            this._$handlePrimaryAny = function (event) {
                return _this._handlePrimaryAny(event);
            };
            this._init(options);
        };
    }
    function createClassMethods$1(BaseClass) {
        return {
            _init: function () {
            },
            _free: function () {
            },
            _handlePrimaryValue: function (x) {
                this._emitValue(x);
            },
            _handlePrimaryError: function (x) {
                this._emitError(x);
            },
            _handlePrimaryEnd: function () {
                this._emitEnd();
            },
            _handleSecondaryValue: function (x) {
                this._lastSecondary = x;
            },
            _handleSecondaryError: function (x) {
                this._emitError(x);
            },
            _handleSecondaryEnd: function () {
            },
            _handlePrimaryAny: function (event) {
                switch (event.type) {
                case VALUE:
                    return this._handlePrimaryValue(event.value);
                case ERROR:
                    return this._handlePrimaryError(event.value);
                case END:
                    return this._handlePrimaryEnd(event.value);
                }
            },
            _handleSecondaryAny: function (event) {
                switch (event.type) {
                case VALUE:
                    return this._handleSecondaryValue(event.value);
                case ERROR:
                    return this._handleSecondaryError(event.value);
                case END:
                    this._handleSecondaryEnd(event.value);
                    this._removeSecondary();
                }
            },
            _removeSecondary: function () {
                if (this._secondary !== null) {
                    this._secondary.offAny(this._$handleSecondaryAny);
                    this._$handleSecondaryAny = null;
                    this._secondary = null;
                }
            },
            _onActivation: function () {
                if (this._secondary !== null) {
                    this._secondary.onAny(this._$handleSecondaryAny);
                }
                if (this._active) {
                    this._primary.onAny(this._$handlePrimaryAny);
                }
            },
            _onDeactivation: function () {
                if (this._secondary !== null) {
                    this._secondary.offAny(this._$handleSecondaryAny);
                }
                this._primary.offAny(this._$handlePrimaryAny);
            },
            _clear: function () {
                BaseClass.prototype._clear.call(this);
                this._primary = null;
                this._secondary = null;
                this._lastSecondary = null;
                this._$handleSecondaryAny = null;
                this._$handlePrimaryAny = null;
                this._free();
            }
        };
    }
    function createStream$1(name, mixin) {
        var S = createConstructor$1(Stream, name);
        inherit(S, Stream, createClassMethods$1(Stream), mixin);
        return S;
    }
    function createProperty$1(name, mixin) {
        var P = createConstructor$1(Property, name);
        inherit(P, Property, createClassMethods$1(Property), mixin);
        return P;
    }
    var mixin$26 = {
        _handlePrimaryValue: function (x) {
            if (this._lastSecondary !== NOTHING && this._lastSecondary) {
                this._emitValue(x);
            }
        },
        _handleSecondaryEnd: function () {
            if (this._lastSecondary === NOTHING || !this._lastSecondary) {
                this._emitEnd();
            }
        }
    };
    var S$34 = createStream$1('filterBy', mixin$26);
    var P$29 = createProperty$1('filterBy', mixin$26);
    function filterBy(primary, secondary) {
        return new (primary._ofSameType(S$34, P$29))(primary, secondary);
    }
    var id2 = function (_, x) {
        return x;
    };
    function sampledBy(passive, active, combinator) {
        var _combinator = combinator ? function (a, b) {
            return combinator(b, a);
        } : id2;
        return combine([active], [passive], _combinator).setName(passive, 'sampledBy');
    }
    var mixin$27 = {
        _handlePrimaryValue: function (x) {
            if (this._lastSecondary !== NOTHING) {
                this._emitValue(x);
            }
        },
        _handleSecondaryEnd: function () {
            if (this._lastSecondary === NOTHING) {
                this._emitEnd();
            }
        }
    };
    var S$35 = createStream$1('skipUntilBy', mixin$27);
    var P$30 = createProperty$1('skipUntilBy', mixin$27);
    function skipUntilBy(primary, secondary) {
        return new (primary._ofSameType(S$35, P$30))(primary, secondary);
    }
    var mixin$28 = {
        _handleSecondaryValue: function () {
            this._emitEnd();
        }
    };
    var S$36 = createStream$1('takeUntilBy', mixin$28);
    var P$31 = createProperty$1('takeUntilBy', mixin$28);
    function takeUntilBy(primary, secondary) {
        return new (primary._ofSameType(S$36, P$31))(primary, secondary);
    }
    var mixin$29 = {
        _init: function () {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref$flushOnEnd = _ref.flushOnEnd, flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;
            this._buff = [];
            this._flushOnEnd = flushOnEnd;
        },
        _free: function () {
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handlePrimaryEnd: function () {
            if (this._flushOnEnd) {
                this._flush();
            }
            this._emitEnd();
        },
        _onActivation: function () {
            this._primary.onAny(this._$handlePrimaryAny);
            if (this._alive && this._secondary !== null) {
                this._secondary.onAny(this._$handleSecondaryAny);
            }
        },
        _handlePrimaryValue: function (x) {
            this._buff.push(x);
        },
        _handleSecondaryValue: function () {
            this._flush();
        },
        _handleSecondaryEnd: function () {
            if (!this._flushOnEnd) {
                this._emitEnd();
            }
        }
    };
    var S$37 = createStream$1('bufferBy', mixin$29);
    var P$32 = createProperty$1('bufferBy', mixin$29);
    function bufferBy(primary, secondary, options) {
        return new (primary._ofSameType(S$37, P$32))(primary, secondary, options);
    }
    var mixin$30 = {
        _init: function () {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref$flushOnEnd = _ref.flushOnEnd, flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd, _ref$flushOnChange = _ref.flushOnChange, flushOnChange = _ref$flushOnChange === undefined ? false : _ref$flushOnChange;
            this._buff = [];
            this._flushOnEnd = flushOnEnd;
            this._flushOnChange = flushOnChange;
        },
        _free: function () {
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handlePrimaryEnd: function () {
            if (this._flushOnEnd) {
                this._flush();
            }
            this._emitEnd();
        },
        _handlePrimaryValue: function (x) {
            this._buff.push(x);
            if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
                this._flush();
            }
        },
        _handleSecondaryEnd: function () {
            if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
                this._emitEnd();
            }
        },
        _handleSecondaryValue: function (x) {
            if (this._flushOnChange && !x) {
                this._flush();
            }
            this._lastSecondary = x;
        }
    };
    var S$38 = createStream$1('bufferWhileBy', mixin$30);
    var P$33 = createProperty$1('bufferWhileBy', mixin$30);
    function bufferWhileBy(primary, secondary, options) {
        return new (primary._ofSameType(S$38, P$33))(primary, secondary, options);
    }
    var f = function () {
        return false;
    };
    var t = function () {
        return true;
    };
    function awaiting(a, b) {
        var result = merge([
            map$1(a, t),
            map$1(b, f)
        ]);
        result = skipDuplicates(result);
        result = toProperty(result, f);
        return result.setName(a, 'awaiting');
    }
    var mixin$31 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            var result = fn(x);
            if (result.convert) {
                this._emitError(result.error);
            } else {
                this._emitValue(x);
            }
        }
    };
    var S$39 = createStream('valuesToErrors', mixin$31);
    var P$34 = createProperty('valuesToErrors', mixin$31);
    var defFn = function (x) {
        return {
            convert: true,
            error: x
        };
    };
    function valuesToErrors(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defFn;
        return new (obs._ofSameType(S$39, P$34))(obs, { fn: fn });
    }
    var mixin$32 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleError: function (x) {
            var fn = this._fn;
            var result = fn(x);
            if (result.convert) {
                this._emitValue(result.value);
            } else {
                this._emitError(x);
            }
        }
    };
    var S$40 = createStream('errorsToValues', mixin$32);
    var P$35 = createProperty('errorsToValues', mixin$32);
    var defFn$1 = function (x) {
        return {
            convert: true,
            value: x
        };
    };
    function errorsToValues(obs) {
        var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defFn$1;
        return new (obs._ofSameType(S$40, P$35))(obs, { fn: fn });
    }
    var mixin$33 = {
        _handleError: function (x) {
            this._emitError(x);
            this._emitEnd();
        }
    };
    var S$41 = createStream('endOnError', mixin$33);
    var P$36 = createProperty('endOnError', mixin$33);
    function endOnError(obs) {
        return new (obs._ofSameType(S$41, P$36))(obs);
    }
    Observable.prototype.toProperty = function (fn) {
        return toProperty(this, fn);
    };
    Observable.prototype.changes = function () {
        return changes(this);
    };
    Observable.prototype.toPromise = function (Promise) {
        return toPromise(this, Promise);
    };
    Observable.prototype.toESObservable = toESObservable;
    Observable.prototype[$$observable] = toESObservable;
    Observable.prototype.map = function (fn) {
        return map$1(this, fn);
    };
    Observable.prototype.filter = function (fn) {
        return filter(this, fn);
    };
    Observable.prototype.take = function (n) {
        return take(this, n);
    };
    Observable.prototype.takeErrors = function (n) {
        return takeErrors(this, n);
    };
    Observable.prototype.takeWhile = function (fn) {
        return takeWhile(this, fn);
    };
    Observable.prototype.last = function () {
        return last(this);
    };
    Observable.prototype.skip = function (n) {
        return skip(this, n);
    };
    Observable.prototype.skipWhile = function (fn) {
        return skipWhile(this, fn);
    };
    Observable.prototype.skipDuplicates = function (fn) {
        return skipDuplicates(this, fn);
    };
    Observable.prototype.diff = function (fn, seed) {
        return diff(this, fn, seed);
    };
    Observable.prototype.scan = function (fn, seed) {
        return scan(this, fn, seed);
    };
    Observable.prototype.flatten = function (fn) {
        return flatten(this, fn);
    };
    Observable.prototype.delay = function (wait) {
        return delay(this, wait);
    };
    Observable.prototype.throttle = function (wait, options) {
        return throttle(this, wait, options);
    };
    Observable.prototype.debounce = function (wait, options) {
        return debounce(this, wait, options);
    };
    Observable.prototype.mapErrors = function (fn) {
        return mapErrors(this, fn);
    };
    Observable.prototype.filterErrors = function (fn) {
        return filterErrors(this, fn);
    };
    Observable.prototype.ignoreValues = function () {
        return ignoreValues(this);
    };
    Observable.prototype.ignoreErrors = function () {
        return ignoreErrors(this);
    };
    Observable.prototype.ignoreEnd = function () {
        return ignoreEnd(this);
    };
    Observable.prototype.beforeEnd = function (fn) {
        return beforeEnd(this, fn);
    };
    Observable.prototype.slidingWindow = function (max, min) {
        return slidingWindow(this, max, min);
    };
    Observable.prototype.bufferWhile = function (fn, options) {
        return bufferWhile(this, fn, options);
    };
    Observable.prototype.bufferWithCount = function (count, options) {
        return bufferWhile$1(this, count, options);
    };
    Observable.prototype.bufferWithTimeOrCount = function (wait, count, options) {
        return bufferWithTimeOrCount(this, wait, count, options);
    };
    Observable.prototype.transduce = function (transducer) {
        return transduce(this, transducer);
    };
    Observable.prototype.withHandler = function (fn) {
        return withHandler(this, fn);
    };
    Observable.prototype.thru = function (fn) {
        return fn(this);
    };
    Observable.prototype.combine = function (other, combinator) {
        return combine([
            this,
            other
        ], combinator);
    };
    Observable.prototype.zip = function (other, combinator) {
        return zip([
            this,
            other
        ], combinator);
    };
    Observable.prototype.merge = function (other) {
        return merge([
            this,
            other
        ]);
    };
    Observable.prototype.concat = function (other) {
        return concat$1([
            this,
            other
        ]);
    };
    var pool = function () {
        return new Pool();
    };
    Observable.prototype.flatMap = function (fn) {
        return new FlatMap(this, fn).setName(this, 'flatMap');
    };
    Observable.prototype.flatMapLatest = function (fn) {
        return new FlatMap(this, fn, {
            concurLim: 1,
            drop: 'old'
        }).setName(this, 'flatMapLatest');
    };
    Observable.prototype.flatMapFirst = function (fn) {
        return new FlatMap(this, fn, { concurLim: 1 }).setName(this, 'flatMapFirst');
    };
    Observable.prototype.flatMapConcat = function (fn) {
        return new FlatMap(this, fn, {
            queueLim: -1,
            concurLim: 1
        }).setName(this, 'flatMapConcat');
    };
    Observable.prototype.flatMapConcurLimit = function (fn, limit) {
        return new FlatMap(this, fn, {
            queueLim: -1,
            concurLim: limit
        }).setName(this, 'flatMapConcurLimit');
    };
    Observable.prototype.flatMapErrors = function (fn) {
        return new FlatMapErrors(this, fn).setName(this, 'flatMapErrors');
    };
    Observable.prototype.filterBy = function (other) {
        return filterBy(this, other);
    };
    Observable.prototype.sampledBy = function (other, combinator) {
        return sampledBy(this, other, combinator);
    };
    Observable.prototype.skipUntilBy = function (other) {
        return skipUntilBy(this, other);
    };
    Observable.prototype.takeUntilBy = function (other) {
        return takeUntilBy(this, other);
    };
    Observable.prototype.bufferBy = function (other, options) {
        return bufferBy(this, other, options);
    };
    Observable.prototype.bufferWhileBy = function (other, options) {
        return bufferWhileBy(this, other, options);
    };
    var DEPRECATION_WARNINGS = true;
    function dissableDeprecationWarnings() {
        DEPRECATION_WARNINGS = false;
    }
    function warn(msg) {
        if (DEPRECATION_WARNINGS && console && typeof console.warn === 'function') {
            var msg2 = '\nHere is an Error object for you containing the call stack:';
            console.warn(msg, msg2, new Error());
        }
    }
    Observable.prototype.awaiting = function (other) {
        warn('You are using deprecated .awaiting() method, see https://github.com/kefirjs/kefir/issues/145');
        return awaiting(this, other);
    };
    Observable.prototype.valuesToErrors = function (fn) {
        warn('You are using deprecated .valuesToErrors() method, see https://github.com/kefirjs/kefir/issues/149');
        return valuesToErrors(this, fn);
    };
    Observable.prototype.errorsToValues = function (fn) {
        warn('You are using deprecated .errorsToValues() method, see https://github.com/kefirjs/kefir/issues/149');
        return errorsToValues(this, fn);
    };
    Observable.prototype.endOnError = function () {
        warn('You are using deprecated .endOnError() method, see https://github.com/kefirjs/kefir/issues/150');
        return endOnError(this);
    };
    var Kefir = {
        Observable: Observable,
        Stream: Stream,
        Property: Property,
        never: never,
        later: later,
        interval: interval,
        sequentially: sequentially,
        fromPoll: fromPoll,
        withInterval: withInterval,
        fromCallback: fromCallback,
        fromNodeCallback: fromNodeCallback,
        fromEvents: fromEvents,
        stream: stream,
        constant: constant,
        constantError: constantError,
        fromPromise: fromPromise,
        fromESObservable: fromESObservable,
        combine: combine,
        zip: zip,
        merge: merge,
        concat: concat$1,
        Pool: Pool,
        pool: pool,
        repeat: repeat,
        staticLand: staticLand
    };
    Kefir.Kefir = Kefir;
    exports.dissableDeprecationWarnings = dissableDeprecationWarnings;
    exports.Kefir = Kefir;
    exports.Observable = Observable;
    exports.Stream = Stream;
    exports.Property = Property;
    exports.never = never;
    exports.later = later;
    exports.interval = interval;
    exports.sequentially = sequentially;
    exports.fromPoll = fromPoll;
    exports.withInterval = withInterval;
    exports.fromCallback = fromCallback;
    exports.fromNodeCallback = fromNodeCallback;
    exports.fromEvents = fromEvents;
    exports.stream = stream;
    exports.constant = constant;
    exports.constantError = constantError;
    exports.fromPromise = fromPromise;
    exports.fromESObservable = fromESObservable;
    exports.combine = combine;
    exports.zip = zip;
    exports.merge = merge;
    exports.concat = concat$1;
    exports.Pool = Pool;
    exports.pool = pool;
    exports.repeat = repeat;
    exports.staticLand = staticLand;
    exports['default'] = Kefir;
    Object.defineProperty(exports, '__esModule', { value: true });
}));
/*can-namespace@1.0.0#can-namespace*/
define('can-namespace', function (require, exports, module) {
    module.exports = {};
});
/*can-symbol@1.6.1#can-symbol*/
define('can-symbol', [
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        var namespace = require('can-namespace');
        var CanSymbol;
        if (typeof Symbol !== 'undefined' && typeof Symbol.for === 'function') {
            CanSymbol = Symbol;
        } else {
            var symbolNum = 0;
            CanSymbol = function CanSymbolPolyfill(description) {
                var symbolValue = '@@symbol' + symbolNum++ + description;
                var symbol = {};
                Object.defineProperties(symbol, {
                    toString: {
                        value: function () {
                            return symbolValue;
                        }
                    }
                });
                return symbol;
            };
            var descriptionToSymbol = {};
            var symbolToDescription = {};
            CanSymbol.for = function (description) {
                var symbol = descriptionToSymbol[description];
                if (!symbol) {
                    symbol = descriptionToSymbol[description] = CanSymbol(description);
                    symbolToDescription[symbol] = description;
                }
                return symbol;
            };
            CanSymbol.keyFor = function (symbol) {
                return symbolToDescription[symbol];
            };
            [
                'hasInstance',
                'isConcatSpreadable',
                'iterator',
                'match',
                'prototype',
                'replace',
                'search',
                'species',
                'split',
                'toPrimitive',
                'toStringTag',
                'unscopables'
            ].forEach(function (name) {
                CanSymbol[name] = CanSymbol('Symbol.' + name);
            });
        }
        [
            'isMapLike',
            'isListLike',
            'isValueLike',
            'isFunctionLike',
            'getOwnKeys',
            'getOwnKeyDescriptor',
            'proto',
            'getOwnEnumerableKeys',
            'hasOwnKey',
            'hasKey',
            'size',
            'getName',
            'getIdentity',
            'assignDeep',
            'updateDeep',
            'getValue',
            'setValue',
            'getKeyValue',
            'setKeyValue',
            'updateValues',
            'addValue',
            'removeValues',
            'apply',
            'new',
            'onValue',
            'offValue',
            'onKeyValue',
            'offKeyValue',
            'getKeyDependencies',
            'getValueDependencies',
            'keyHasDependencies',
            'valueHasDependencies',
            'onKeys',
            'onKeysAdded',
            'onKeysRemoved',
            'onPatches'
        ].forEach(function (name) {
            CanSymbol.for('can.' + name);
        });
        module.exports = namespace.Symbol = CanSymbol;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-reflect@1.17.0#reflections/helpers*/
define('can-reflect/reflections/helpers', [
    'require',
    'exports',
    'module',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    module.exports = {
        makeGetFirstSymbolValue: function (symbolNames) {
            var symbols = symbolNames.map(function (name) {
                return canSymbol.for(name);
            });
            var length = symbols.length;
            return function getFirstSymbol(obj) {
                var index = -1;
                while (++index < length) {
                    if (obj[symbols[index]] !== undefined) {
                        return obj[symbols[index]];
                    }
                }
            };
        },
        hasLength: function (list) {
            var type = typeof list;
            if (type === 'string' || Array.isArray(list)) {
                return true;
            }
            var length = list && (type !== 'boolean' && type !== 'number' && 'length' in list) && list.length;
            return typeof list !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in list);
        }
    };
});
/*can-reflect@1.17.0#reflections/type/type*/
define('can-reflect/reflections/type/type', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/helpers'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var helpers = require('can-reflect/reflections/helpers');
    var plainFunctionPrototypePropertyNames = Object.getOwnPropertyNames(function () {
    }.prototype);
    var plainFunctionPrototypeProto = Object.getPrototypeOf(function () {
    }.prototype);
    function isConstructorLike(func) {
        var value = func[canSymbol.for('can.new')];
        if (value !== undefined) {
            return value;
        }
        if (typeof func !== 'function') {
            return false;
        }
        var prototype = func.prototype;
        if (!prototype) {
            return false;
        }
        if (plainFunctionPrototypeProto !== Object.getPrototypeOf(prototype)) {
            return true;
        }
        var propertyNames = Object.getOwnPropertyNames(prototype);
        if (propertyNames.length === plainFunctionPrototypePropertyNames.length) {
            for (var i = 0, len = propertyNames.length; i < len; i++) {
                if (propertyNames[i] !== plainFunctionPrototypePropertyNames[i]) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }
    var getNewOrApply = helpers.makeGetFirstSymbolValue([
        'can.new',
        'can.apply'
    ]);
    function isFunctionLike(obj) {
        var result, symbolValue = obj[canSymbol.for('can.isFunctionLike')];
        if (symbolValue !== undefined) {
            return symbolValue;
        }
        result = getNewOrApply(obj);
        if (result !== undefined) {
            return !!result;
        }
        return typeof obj === 'function';
    }
    function isPrimitive(obj) {
        var type = typeof obj;
        if (obj == null || type !== 'function' && type !== 'object') {
            return true;
        } else {
            return false;
        }
    }
    function isBuiltIn(obj) {
        if (isPrimitive(obj) || Array.isArray(obj) || isPlainObject(obj) || Object.prototype.toString.call(obj) !== '[object Object]' && Object.prototype.toString.call(obj).indexOf('[object ') !== -1) {
            return true;
        } else {
            return false;
        }
    }
    function isValueLike(obj) {
        var symbolValue;
        if (isPrimitive(obj)) {
            return true;
        }
        symbolValue = obj[canSymbol.for('can.isValueLike')];
        if (typeof symbolValue !== 'undefined') {
            return symbolValue;
        }
        var value = obj[canSymbol.for('can.getValue')];
        if (value !== undefined) {
            return !!value;
        }
    }
    function isMapLike(obj) {
        if (isPrimitive(obj)) {
            return false;
        }
        var isMapLike = obj[canSymbol.for('can.isMapLike')];
        if (typeof isMapLike !== 'undefined') {
            return !!isMapLike;
        }
        var value = obj[canSymbol.for('can.getKeyValue')];
        if (value !== undefined) {
            return !!value;
        }
        return true;
    }
    var onValueSymbol = canSymbol.for('can.onValue'), onKeyValueSymbol = canSymbol.for('can.onKeyValue'), onPatchesSymbol = canSymbol.for('can.onPatches');
    function isObservableLike(obj) {
        if (isPrimitive(obj)) {
            return false;
        }
        return Boolean(obj[onValueSymbol] || obj[onKeyValueSymbol] || obj[onPatchesSymbol]);
    }
    function isListLike(list) {
        var symbolValue, type = typeof list;
        if (type === 'string') {
            return true;
        }
        if (isPrimitive(list)) {
            return false;
        }
        symbolValue = list[canSymbol.for('can.isListLike')];
        if (typeof symbolValue !== 'undefined') {
            return symbolValue;
        }
        var value = list[canSymbol.iterator];
        if (value !== undefined) {
            return !!value;
        }
        if (Array.isArray(list)) {
            return true;
        }
        return helpers.hasLength(list);
    }
    var supportsSymbols = typeof Symbol !== 'undefined' && typeof Symbol.for === 'function';
    var isSymbolLike;
    if (supportsSymbols) {
        isSymbolLike = function (symbol) {
            return typeof symbol === 'symbol';
        };
    } else {
        var symbolStart = '@@symbol';
        isSymbolLike = function (symbol) {
            if (typeof symbol === 'object' && !Array.isArray(symbol)) {
                return symbol.toString().substr(0, symbolStart.length) === symbolStart;
            } else {
                return false;
            }
        };
    }
    var coreHasOwn = Object.prototype.hasOwnProperty;
    var funcToString = Function.prototype.toString;
    var objectCtorString = funcToString.call(Object);
    function isPlainObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return false;
        }
        var proto = Object.getPrototypeOf(obj);
        if (proto === Object.prototype || proto === null) {
            return true;
        }
        var Constructor = coreHasOwn.call(proto, 'constructor') && proto.constructor;
        return typeof Constructor === 'function' && Constructor instanceof Constructor && funcToString.call(Constructor) === objectCtorString;
    }
    module.exports = {
        isConstructorLike: isConstructorLike,
        isFunctionLike: isFunctionLike,
        isListLike: isListLike,
        isMapLike: isMapLike,
        isObservableLike: isObservableLike,
        isPrimitive: isPrimitive,
        isBuiltIn: isBuiltIn,
        isValueLike: isValueLike,
        isSymbolLike: isSymbolLike,
        isMoreListLikeThanMapLike: function (obj) {
            if (Array.isArray(obj)) {
                return true;
            }
            if (obj instanceof Array) {
                return true;
            }
            if (obj == null) {
                return false;
            }
            var value = obj[canSymbol.for('can.isMoreListLikeThanMapLike')];
            if (value !== undefined) {
                return value;
            }
            var isListLike = this.isListLike(obj), isMapLike = this.isMapLike(obj);
            if (isListLike && !isMapLike) {
                return true;
            } else if (!isListLike && isMapLike) {
                return false;
            }
        },
        isIteratorLike: function (obj) {
            return obj && typeof obj === 'object' && typeof obj.next === 'function' && obj.next.length === 0;
        },
        isPromise: function (obj) {
            return obj instanceof Promise || Object.prototype.toString.call(obj) === '[object Promise]';
        },
        isPlainObject: isPlainObject
    };
});
/*can-reflect@1.17.0#reflections/call/call*/
define('can-reflect/reflections/call/call', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/type/type'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var typeReflections = require('can-reflect/reflections/type/type');
    module.exports = {
        call: function (func, context) {
            var args = [].slice.call(arguments, 2);
            var apply = func[canSymbol.for('can.apply')];
            if (apply) {
                return apply.call(func, context, args);
            } else {
                return func.apply(context, args);
            }
        },
        apply: function (func, context, args) {
            var apply = func[canSymbol.for('can.apply')];
            if (apply) {
                return apply.call(func, context, args);
            } else {
                return func.apply(context, args);
            }
        },
        'new': function (func) {
            var args = [].slice.call(arguments, 1);
            var makeNew = func[canSymbol.for('can.new')];
            if (makeNew) {
                return makeNew.apply(func, args);
            } else {
                var context = Object.create(func.prototype);
                var ret = func.apply(context, args);
                if (typeReflections.isPrimitive(ret)) {
                    return context;
                } else {
                    return ret;
                }
            }
        }
    };
});
/*can-reflect@1.17.0#reflections/get-set/get-set*/
define('can-reflect/reflections/get-set/get-set', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/type/type'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var typeReflections = require('can-reflect/reflections/type/type');
    var setKeyValueSymbol = canSymbol.for('can.setKeyValue'), getKeyValueSymbol = canSymbol.for('can.getKeyValue'), getValueSymbol = canSymbol.for('can.getValue'), setValueSymbol = canSymbol.for('can.setValue');
    var reflections = {
        setKeyValue: function (obj, key, value) {
            if (typeReflections.isSymbolLike(key)) {
                if (typeof key === 'symbol') {
                    obj[key] = value;
                } else {
                    Object.defineProperty(obj, key, {
                        enumerable: false,
                        configurable: true,
                        value: value,
                        writable: true
                    });
                }
                return;
            }
            var setKeyValue = obj[setKeyValueSymbol];
            if (setKeyValue !== undefined) {
                return setKeyValue.call(obj, key, value);
            } else {
                obj[key] = value;
            }
        },
        getKeyValue: function (obj, key) {
            var getKeyValue = obj[getKeyValueSymbol];
            if (getKeyValue) {
                return getKeyValue.call(obj, key);
            }
            return obj[key];
        },
        deleteKeyValue: function (obj, key) {
            var deleteKeyValue = obj[canSymbol.for('can.deleteKeyValue')];
            if (deleteKeyValue) {
                return deleteKeyValue.call(obj, key);
            }
            delete obj[key];
        },
        getValue: function (value) {
            if (typeReflections.isPrimitive(value)) {
                return value;
            }
            var getValue = value[getValueSymbol];
            if (getValue) {
                return getValue.call(value);
            }
            return value;
        },
        setValue: function (item, value) {
            var setValue = item && item[setValueSymbol];
            if (setValue) {
                return setValue.call(item, value);
            } else {
                throw new Error('can-reflect.setValue - Can not set value.');
            }
        },
        splice: function (obj, index, removing, adding) {
            var howMany;
            if (typeof removing !== 'number') {
                var updateValues = obj[canSymbol.for('can.updateValues')];
                if (updateValues) {
                    return updateValues.call(obj, index, removing, adding);
                }
                howMany = removing.length;
            } else {
                howMany = removing;
            }
            if (arguments.length <= 3) {
                adding = [];
            }
            var splice = obj[canSymbol.for('can.splice')];
            if (splice) {
                return splice.call(obj, index, howMany, adding);
            }
            return [].splice.apply(obj, [
                index,
                howMany
            ].concat(adding));
        },
        addValues: function (obj, adding, index) {
            var add = obj[canSymbol.for('can.addValues')];
            if (add) {
                return add.call(obj, adding, index);
            }
            if (Array.isArray(obj) && index === undefined) {
                return obj.push.apply(obj, adding);
            }
            return reflections.splice(obj, index, [], adding);
        },
        removeValues: function (obj, removing, index) {
            var removeValues = obj[canSymbol.for('can.removeValues')];
            if (removeValues) {
                return removeValues.call(obj, removing, index);
            }
            if (Array.isArray(obj) && index === undefined) {
                removing.forEach(function (item) {
                    var index = obj.indexOf(item);
                    if (index >= 0) {
                        obj.splice(index, 1);
                    }
                });
                return;
            }
            return reflections.splice(obj, index, removing, []);
        }
    };
    reflections.get = reflections.getKeyValue;
    reflections.set = reflections.setKeyValue;
    reflections['delete'] = reflections.deleteKeyValue;
    module.exports = reflections;
});
/*can-reflect@1.17.0#reflections/observe/observe*/
define('can-reflect/reflections/observe/observe', [
    'require',
    'exports',
    'module',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var slice = [].slice;
    function makeFallback(symbolName, fallbackName) {
        return function (obj, event, handler, queueName) {
            var method = obj[canSymbol.for(symbolName)];
            if (method !== undefined) {
                return method.call(obj, event, handler, queueName);
            }
            return this[fallbackName].apply(this, arguments);
        };
    }
    function makeErrorIfMissing(symbolName, errorMessage) {
        return function (obj) {
            var method = obj[canSymbol.for(symbolName)];
            if (method !== undefined) {
                var args = slice.call(arguments, 1);
                return method.apply(obj, args);
            }
            throw new Error(errorMessage);
        };
    }
    module.exports = {
        onKeyValue: makeFallback('can.onKeyValue', 'onEvent'),
        offKeyValue: makeFallback('can.offKeyValue', 'offEvent'),
        onKeys: makeErrorIfMissing('can.onKeys', 'can-reflect: can not observe an onKeys event'),
        onKeysAdded: makeErrorIfMissing('can.onKeysAdded', 'can-reflect: can not observe an onKeysAdded event'),
        onKeysRemoved: makeErrorIfMissing('can.onKeysRemoved', 'can-reflect: can not unobserve an onKeysRemoved event'),
        getKeyDependencies: makeErrorIfMissing('can.getKeyDependencies', 'can-reflect: can not determine dependencies'),
        getWhatIChange: makeErrorIfMissing('can.getWhatIChange', 'can-reflect: can not determine dependencies'),
        getChangesDependencyRecord: function getChangesDependencyRecord(handler) {
            var fn = handler[canSymbol.for('can.getChangesDependencyRecord')];
            if (typeof fn === 'function') {
                return fn();
            }
        },
        keyHasDependencies: makeErrorIfMissing('can.keyHasDependencies', 'can-reflect: can not determine if this has key dependencies'),
        onValue: makeErrorIfMissing('can.onValue', 'can-reflect: can not observe value change'),
        offValue: makeErrorIfMissing('can.offValue', 'can-reflect: can not unobserve value change'),
        getValueDependencies: makeErrorIfMissing('can.getValueDependencies', 'can-reflect: can not determine dependencies'),
        valueHasDependencies: makeErrorIfMissing('can.valueHasDependencies', 'can-reflect: can not determine if value has dependencies'),
        onPatches: makeErrorIfMissing('can.onPatches', 'can-reflect: can not observe patches on object'),
        offPatches: makeErrorIfMissing('can.offPatches', 'can-reflect: can not unobserve patches on object'),
        onInstancePatches: makeErrorIfMissing('can.onInstancePatches', 'can-reflect: can not observe onInstancePatches on Type'),
        offInstancePatches: makeErrorIfMissing('can.offInstancePatches', 'can-reflect: can not unobserve onInstancePatches on Type'),
        onInstanceBoundChange: makeErrorIfMissing('can.onInstanceBoundChange', 'can-reflect: can not observe bound state change in instances.'),
        offInstanceBoundChange: makeErrorIfMissing('can.offInstanceBoundChange', 'can-reflect: can not unobserve bound state change'),
        isBound: makeErrorIfMissing('can.isBound', 'can-reflect: cannot determine if object is bound'),
        onEvent: function (obj, eventName, callback, queue) {
            if (obj) {
                var onEvent = obj[canSymbol.for('can.onEvent')];
                if (onEvent !== undefined) {
                    return onEvent.call(obj, eventName, callback, queue);
                } else if (obj.addEventListener) {
                    obj.addEventListener(eventName, callback, queue);
                }
            }
        },
        offEvent: function (obj, eventName, callback, queue) {
            if (obj) {
                var offEvent = obj[canSymbol.for('can.offEvent')];
                if (offEvent !== undefined) {
                    return offEvent.call(obj, eventName, callback, queue);
                } else if (obj.removeEventListener) {
                    obj.removeEventListener(eventName, callback, queue);
                }
            }
        },
        setPriority: function (obj, priority) {
            if (obj) {
                var setPriority = obj[canSymbol.for('can.setPriority')];
                if (setPriority !== undefined) {
                    setPriority.call(obj, priority);
                    return true;
                }
            }
            return false;
        },
        getPriority: function (obj) {
            if (obj) {
                var getPriority = obj[canSymbol.for('can.getPriority')];
                if (getPriority !== undefined) {
                    return getPriority.call(obj);
                }
            }
            return undefined;
        }
    };
});
/*can-reflect@1.17.0#reflections/shape/shape*/
define('can-reflect/reflections/shape/shape', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/get-set/get-set',
    'can-reflect/reflections/type/type',
    'can-reflect/reflections/helpers'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var getSetReflections = require('can-reflect/reflections/get-set/get-set');
    var typeReflections = require('can-reflect/reflections/type/type');
    var helpers = require('can-reflect/reflections/helpers');
    var getPrototypeOfWorksWithPrimitives = true;
    try {
        Object.getPrototypeOf(1);
    } catch (e) {
        getPrototypeOfWorksWithPrimitives = false;
    }
    var ArrayMap;
    if (typeof Map === 'function') {
        ArrayMap = Map;
    } else {
        function isEven(num) {
            return !(num % 2);
        }
        ArrayMap = function () {
            this.contents = [];
        };
        ArrayMap.prototype = {
            _getIndex: function (key) {
                var idx;
                do {
                    idx = this.contents.indexOf(key, idx);
                } while (idx !== -1 && !isEven(idx));
                return idx;
            },
            has: function (key) {
                return this._getIndex(key) !== -1;
            },
            get: function (key) {
                var idx = this._getIndex(key);
                if (idx !== -1) {
                    return this.contents[idx + 1];
                }
            },
            set: function (key, value) {
                var idx = this._getIndex(key);
                if (idx !== -1) {
                    this.contents[idx + 1] = value;
                } else {
                    this.contents.push(key);
                    this.contents.push(value);
                }
            },
            'delete': function (key) {
                var idx = this._getIndex(key);
                if (idx !== -1) {
                    this.contents.splice(idx, 2);
                }
            }
        };
    }
    var shapeReflections;
    var shiftFirstArgumentToThis = function (func) {
        return function () {
            var args = [this];
            args.push.apply(args, arguments);
            return func.apply(null, args);
        };
    };
    var getKeyValueSymbol = canSymbol.for('can.getKeyValue');
    var shiftedGetKeyValue = shiftFirstArgumentToThis(getSetReflections.getKeyValue);
    var setKeyValueSymbol = canSymbol.for('can.setKeyValue');
    var shiftedSetKeyValue = shiftFirstArgumentToThis(getSetReflections.setKeyValue);
    var sizeSymbol = canSymbol.for('can.size');
    var hasUpdateSymbol = helpers.makeGetFirstSymbolValue([
        'can.updateDeep',
        'can.assignDeep',
        'can.setKeyValue'
    ]);
    var shouldUpdateOrAssign = function (obj) {
        return typeReflections.isPlainObject(obj) || Array.isArray(obj) || !!hasUpdateSymbol(obj);
    };
    function isSerializedHelper(obj) {
        if (typeReflections.isPrimitive(obj)) {
            return true;
        }
        if (hasUpdateSymbol(obj)) {
            return false;
        }
        return typeReflections.isBuiltIn(obj) && !typeReflections.isPlainObject(obj) && !Array.isArray(obj);
    }
    var Object_Keys;
    try {
        Object.keys(1);
        Object_Keys = Object.keys;
    } catch (e) {
        Object_Keys = function (obj) {
            if (typeReflections.isPrimitive(obj)) {
                return [];
            } else {
                return Object.keys(obj);
            }
        };
    }
    function makeSerializer(methodName, symbolsToCheck) {
        var serializeMap = null;
        function SerializeOperation(MapType) {
            this.first = !serializeMap;
            if (this.first) {
                serializeMap = createSerializeMap(MapType);
            }
            this.map = serializeMap;
            this.result = null;
        }
        SerializeOperation.prototype.end = function () {
            if (this.first) {
                serializeMap = null;
            }
            return this.result;
        };
        function createSerializeMap(Type) {
            var MapType = Type || ArrayMap;
            return {
                unwrap: new MapType(),
                serialize: new MapType(),
                isSerializing: {
                    unwrap: new MapType(),
                    serialize: new MapType()
                },
                circularReferenceIsSerializing: {
                    unwrap: new MapType(),
                    serialize: new MapType()
                }
            };
        }
        return function serializer(value, MapType) {
            if (isSerializedHelper(value)) {
                return value;
            }
            var operation = new SerializeOperation(MapType);
            if (typeReflections.isValueLike(value)) {
                operation.result = this[methodName](getSetReflections.getValue(value));
            } else {
                var isListLike = typeReflections.isIteratorLike(value) || typeReflections.isMoreListLikeThanMapLike(value);
                operation.result = isListLike ? [] : {};
                if (operation.map[methodName].has(value)) {
                    if (operation.map.isSerializing[methodName].has(value)) {
                        operation.map.circularReferenceIsSerializing[methodName].set(value, true);
                    }
                    return operation.map[methodName].get(value);
                } else {
                    operation.map[methodName].set(value, operation.result);
                }
                for (var i = 0, len = symbolsToCheck.length; i < len; i++) {
                    var serializer = value[symbolsToCheck[i]];
                    if (serializer) {
                        operation.map.isSerializing[methodName].set(value, true);
                        var oldResult = operation.result;
                        operation.result = serializer.call(value, oldResult);
                        operation.map.isSerializing[methodName].delete(value);
                        if (operation.result !== oldResult) {
                            if (operation.map.circularReferenceIsSerializing[methodName].has(value)) {
                                operation.end();
                                throw new Error('Cannot serialize cirular reference!');
                            }
                            operation.map[methodName].set(value, operation.result);
                        }
                        return operation.end();
                    }
                }
                if (typeof obj === 'function') {
                    operation.map[methodName].set(value, value);
                    operation.result = value;
                } else if (isListLike) {
                    this.eachIndex(value, function (childValue, index) {
                        operation.result[index] = this[methodName](childValue);
                    }, this);
                } else {
                    this.eachKey(value, function (childValue, prop) {
                        operation.result[prop] = this[methodName](childValue);
                    }, this);
                }
            }
            return operation.end();
        };
    }
    var makeMap;
    if (typeof Map !== 'undefined') {
        makeMap = function (keys) {
            var map = new Map();
            shapeReflections.eachIndex(keys, function (key) {
                map.set(key, true);
            });
            return map;
        };
    } else {
        makeMap = function (keys) {
            var map = {};
            keys.forEach(function (key) {
                map[key] = true;
            });
            return {
                get: function (key) {
                    return map[key];
                },
                set: function (key, value) {
                    map[key] = value;
                },
                keys: function () {
                    return keys;
                }
            };
        };
    }
    var fastHasOwnKey = function (obj) {
        var hasOwnKey = obj[canSymbol.for('can.hasOwnKey')];
        if (hasOwnKey) {
            return hasOwnKey.bind(obj);
        } else {
            var map = makeMap(shapeReflections.getOwnEnumerableKeys(obj));
            return function (key) {
                return map.get(key);
            };
        }
    };
    function addPatch(patches, patch) {
        var lastPatch = patches[patches.length - 1];
        if (lastPatch) {
            if (lastPatch.deleteCount === lastPatch.insert.length && patch.index - lastPatch.index === lastPatch.deleteCount) {
                lastPatch.insert.push.apply(lastPatch.insert, patch.insert);
                lastPatch.deleteCount += patch.deleteCount;
                return;
            }
        }
        patches.push(patch);
    }
    function updateDeepList(target, source, isAssign) {
        var sourceArray = this.toArray(source);
        var patches = [], lastIndex = -1;
        this.eachIndex(target, function (curVal, index) {
            lastIndex = index;
            if (index >= sourceArray.length) {
                if (!isAssign) {
                    addPatch(patches, {
                        index: index,
                        deleteCount: target.length - index + 1,
                        insert: []
                    });
                }
                return false;
            }
            var newVal = sourceArray[index];
            if (typeReflections.isPrimitive(curVal) || typeReflections.isPrimitive(newVal) || shouldUpdateOrAssign(curVal) === false) {
                addPatch(patches, {
                    index: index,
                    deleteCount: 1,
                    insert: [newVal]
                });
            } else {
                this.updateDeep(curVal, newVal);
            }
        }, this);
        if (sourceArray.length > lastIndex) {
            addPatch(patches, {
                index: lastIndex + 1,
                deleteCount: 0,
                insert: sourceArray.slice(lastIndex + 1)
            });
        }
        for (var i = 0, patchLen = patches.length; i < patchLen; i++) {
            var patch = patches[i];
            getSetReflections.splice(target, patch.index, patch.deleteCount, patch.insert);
        }
        return target;
    }
    shapeReflections = {
        each: function (obj, callback, context) {
            if (typeReflections.isIteratorLike(obj) || typeReflections.isMoreListLikeThanMapLike(obj)) {
                return shapeReflections.eachIndex(obj, callback, context);
            } else {
                return shapeReflections.eachKey(obj, callback, context);
            }
        },
        eachIndex: function (list, callback, context) {
            if (Array.isArray(list)) {
                return shapeReflections.eachListLike(list, callback, context);
            } else {
                var iter, iterator = list[canSymbol.iterator];
                if (typeReflections.isIteratorLike(list)) {
                    iter = list;
                } else if (iterator) {
                    iter = iterator.call(list);
                }
                if (iter) {
                    var res, index = 0;
                    while (!(res = iter.next()).done) {
                        if (callback.call(context || list, res.value, index++, list) === false) {
                            break;
                        }
                    }
                } else {
                    shapeReflections.eachListLike(list, callback, context);
                }
            }
            return list;
        },
        eachListLike: function (list, callback, context) {
            var index = -1;
            var length = list.length;
            if (length === undefined) {
                var size = list[sizeSymbol];
                if (size) {
                    length = size.call(list);
                } else {
                    throw new Error('can-reflect: unable to iterate.');
                }
            }
            while (++index < length) {
                var item = list[index];
                if (callback.call(context || item, item, index, list) === false) {
                    break;
                }
            }
            return list;
        },
        toArray: function (obj) {
            var arr = [];
            shapeReflections.each(obj, function (value) {
                arr.push(value);
            });
            return arr;
        },
        eachKey: function (obj, callback, context) {
            if (obj) {
                var enumerableKeys = shapeReflections.getOwnEnumerableKeys(obj);
                var getKeyValue = obj[getKeyValueSymbol] || shiftedGetKeyValue;
                return shapeReflections.eachIndex(enumerableKeys, function (key) {
                    var value = getKeyValue.call(obj, key);
                    return callback.call(context || obj, value, key, obj);
                });
            }
            return obj;
        },
        'hasOwnKey': function (obj, key) {
            var hasOwnKey = obj[canSymbol.for('can.hasOwnKey')];
            if (hasOwnKey) {
                return hasOwnKey.call(obj, key);
            }
            var getOwnKeys = obj[canSymbol.for('can.getOwnKeys')];
            if (getOwnKeys) {
                var found = false;
                shapeReflections.eachIndex(getOwnKeys.call(obj), function (objKey) {
                    if (objKey === key) {
                        found = true;
                        return false;
                    }
                });
                return found;
            }
            return obj.hasOwnProperty(key);
        },
        getOwnEnumerableKeys: function (obj) {
            var getOwnEnumerableKeys = obj[canSymbol.for('can.getOwnEnumerableKeys')];
            if (getOwnEnumerableKeys) {
                return getOwnEnumerableKeys.call(obj);
            }
            if (obj[canSymbol.for('can.getOwnKeys')] && obj[canSymbol.for('can.getOwnKeyDescriptor')]) {
                var keys = [];
                shapeReflections.eachIndex(shapeReflections.getOwnKeys(obj), function (key) {
                    var descriptor = shapeReflections.getOwnKeyDescriptor(obj, key);
                    if (descriptor.enumerable) {
                        keys.push(key);
                    }
                }, this);
                return keys;
            } else {
                return Object_Keys(obj);
            }
        },
        getOwnKeys: function (obj) {
            var getOwnKeys = obj[canSymbol.for('can.getOwnKeys')];
            if (getOwnKeys) {
                return getOwnKeys.call(obj);
            } else {
                return Object.getOwnPropertyNames(obj);
            }
        },
        getOwnKeyDescriptor: function (obj, key) {
            var getOwnKeyDescriptor = obj[canSymbol.for('can.getOwnKeyDescriptor')];
            if (getOwnKeyDescriptor) {
                return getOwnKeyDescriptor.call(obj, key);
            } else {
                return Object.getOwnPropertyDescriptor(obj, key);
            }
        },
        unwrap: makeSerializer('unwrap', [canSymbol.for('can.unwrap')]),
        serialize: makeSerializer('serialize', [
            canSymbol.for('can.serialize'),
            canSymbol.for('can.unwrap')
        ]),
        assignMap: function (target, source) {
            var hasOwnKey = fastHasOwnKey(target);
            var getKeyValue = target[getKeyValueSymbol] || shiftedGetKeyValue;
            var setKeyValue = target[setKeyValueSymbol] || shiftedSetKeyValue;
            shapeReflections.eachKey(source, function (value, key) {
                if (!hasOwnKey(key) || getKeyValue.call(target, key) !== value) {
                    setKeyValue.call(target, key, value);
                }
            });
            return target;
        },
        assignList: function (target, source) {
            var inserting = shapeReflections.toArray(source);
            getSetReflections.splice(target, 0, inserting, inserting);
            return target;
        },
        assign: function (target, source) {
            if (typeReflections.isIteratorLike(source) || typeReflections.isMoreListLikeThanMapLike(source)) {
                shapeReflections.assignList(target, source);
            } else {
                shapeReflections.assignMap(target, source);
            }
            return target;
        },
        assignDeepMap: function (target, source) {
            var hasOwnKey = fastHasOwnKey(target);
            var getKeyValue = target[getKeyValueSymbol] || shiftedGetKeyValue;
            var setKeyValue = target[setKeyValueSymbol] || shiftedSetKeyValue;
            shapeReflections.eachKey(source, function (newVal, key) {
                if (!hasOwnKey(key)) {
                    getSetReflections.setKeyValue(target, key, newVal);
                } else {
                    var curVal = getKeyValue.call(target, key);
                    if (newVal === curVal) {
                    } else if (typeReflections.isPrimitive(curVal) || typeReflections.isPrimitive(newVal) || shouldUpdateOrAssign(curVal) === false) {
                        setKeyValue.call(target, key, newVal);
                    } else {
                        shapeReflections.assignDeep(curVal, newVal);
                    }
                }
            }, this);
            return target;
        },
        assignDeepList: function (target, source) {
            return updateDeepList.call(this, target, source, true);
        },
        assignDeep: function (target, source) {
            var assignDeep = target[canSymbol.for('can.assignDeep')];
            if (assignDeep) {
                assignDeep.call(target, source);
            } else if (typeReflections.isMoreListLikeThanMapLike(source)) {
                shapeReflections.assignDeepList(target, source);
            } else {
                shapeReflections.assignDeepMap(target, source);
            }
            return target;
        },
        updateMap: function (target, source) {
            var sourceKeyMap = makeMap(shapeReflections.getOwnEnumerableKeys(source));
            var sourceGetKeyValue = source[getKeyValueSymbol] || shiftedGetKeyValue;
            var targetSetKeyValue = target[setKeyValueSymbol] || shiftedSetKeyValue;
            shapeReflections.eachKey(target, function (curVal, key) {
                if (!sourceKeyMap.get(key)) {
                    getSetReflections.deleteKeyValue(target, key);
                    return;
                }
                sourceKeyMap.set(key, false);
                var newVal = sourceGetKeyValue.call(source, key);
                if (newVal !== curVal) {
                    targetSetKeyValue.call(target, key, newVal);
                }
            }, this);
            shapeReflections.eachIndex(sourceKeyMap.keys(), function (key) {
                if (sourceKeyMap.get(key)) {
                    targetSetKeyValue.call(target, key, sourceGetKeyValue.call(source, key));
                }
            });
            return target;
        },
        updateList: function (target, source) {
            var inserting = shapeReflections.toArray(source);
            getSetReflections.splice(target, 0, target, inserting);
            return target;
        },
        update: function (target, source) {
            if (typeReflections.isIteratorLike(source) || typeReflections.isMoreListLikeThanMapLike(source)) {
                shapeReflections.updateList(target, source);
            } else {
                shapeReflections.updateMap(target, source);
            }
            return target;
        },
        updateDeepMap: function (target, source) {
            var sourceKeyMap = makeMap(shapeReflections.getOwnEnumerableKeys(source));
            var sourceGetKeyValue = source[getKeyValueSymbol] || shiftedGetKeyValue;
            var targetSetKeyValue = target[setKeyValueSymbol] || shiftedSetKeyValue;
            shapeReflections.eachKey(target, function (curVal, key) {
                if (!sourceKeyMap.get(key)) {
                    getSetReflections.deleteKeyValue(target, key);
                    return;
                }
                sourceKeyMap.set(key, false);
                var newVal = sourceGetKeyValue.call(source, key);
                if (typeReflections.isPrimitive(curVal) || typeReflections.isPrimitive(newVal) || shouldUpdateOrAssign(curVal) === false) {
                    targetSetKeyValue.call(target, key, newVal);
                } else {
                    shapeReflections.updateDeep(curVal, newVal);
                }
            }, this);
            shapeReflections.eachIndex(sourceKeyMap.keys(), function (key) {
                if (sourceKeyMap.get(key)) {
                    targetSetKeyValue.call(target, key, sourceGetKeyValue.call(source, key));
                }
            });
            return target;
        },
        updateDeepList: function (target, source) {
            return updateDeepList.call(this, target, source);
        },
        updateDeep: function (target, source) {
            var updateDeep = target[canSymbol.for('can.updateDeep')];
            if (updateDeep) {
                updateDeep.call(target, source);
            } else if (typeReflections.isMoreListLikeThanMapLike(source)) {
                shapeReflections.updateDeepList(target, source);
            } else {
                shapeReflections.updateDeepMap(target, source);
            }
            return target;
        },
        hasKey: function (obj, key) {
            if (obj == null) {
                return false;
            }
            if (typeReflections.isPrimitive(obj)) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    return true;
                } else {
                    var proto;
                    if (getPrototypeOfWorksWithPrimitives) {
                        proto = Object.getPrototypeOf(obj);
                    } else {
                        proto = obj.__proto__;
                    }
                    ;
                    if (proto !== undefined) {
                        return key in proto;
                    } else {
                        return obj[key] !== undefined;
                    }
                }
            }
            var hasKey = obj[canSymbol.for('can.hasKey')];
            if (hasKey) {
                return hasKey.call(obj, key);
            }
            var found = shapeReflections.hasOwnKey(obj, key);
            return found || key in obj;
        },
        getAllEnumerableKeys: function () {
        },
        getAllKeys: function () {
        },
        assignSymbols: function (target, source) {
            shapeReflections.eachKey(source, function (value, key) {
                var symbol = typeReflections.isSymbolLike(canSymbol[key]) ? canSymbol[key] : canSymbol.for(key);
                getSetReflections.setKeyValue(target, symbol, value);
            });
            return target;
        },
        isSerialized: isSerializedHelper,
        size: function (obj) {
            if (obj == null) {
                return 0;
            }
            var size = obj[sizeSymbol];
            var count = 0;
            if (size) {
                return size.call(obj);
            } else if (helpers.hasLength(obj)) {
                return obj.length;
            } else if (typeReflections.isListLike(obj)) {
                shapeReflections.eachIndex(obj, function () {
                    count++;
                });
                return count;
            } else if (obj) {
                return shapeReflections.getOwnEnumerableKeys(obj).length;
            } else {
                return undefined;
            }
        },
        defineInstanceKey: function (cls, key, properties) {
            var defineInstanceKey = cls[canSymbol.for('can.defineInstanceKey')];
            if (defineInstanceKey) {
                return defineInstanceKey.call(cls, key, properties);
            }
            var proto = cls.prototype;
            defineInstanceKey = proto[canSymbol.for('can.defineInstanceKey')];
            if (defineInstanceKey) {
                defineInstanceKey.call(proto, key, properties);
            } else {
                Object.defineProperty(proto, key, shapeReflections.assign({
                    configurable: true,
                    enumerable: !typeReflections.isSymbolLike(key),
                    writable: true
                }, properties));
            }
        }
    };
    shapeReflections.isSerializable = shapeReflections.isSerialized;
    shapeReflections.keys = shapeReflections.getOwnEnumerableKeys;
    module.exports = shapeReflections;
});
/*can-reflect@1.17.0#reflections/shape/schema/schema*/
define('can-reflect/reflections/shape/schema/schema', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/type/type',
    'can-reflect/reflections/get-set/get-set',
    'can-reflect/reflections/shape/shape'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var typeReflections = require('can-reflect/reflections/type/type');
    var getSetReflections = require('can-reflect/reflections/get-set/get-set');
    var shapeReflections = require('can-reflect/reflections/shape/shape');
    var getSchemaSymbol = canSymbol.for('can.getSchema'), isMemberSymbol = canSymbol.for('can.isMember'), newSymbol = canSymbol.for('can.new');
    function comparator(a, b) {
        return a.localeCompare(b);
    }
    function sort(obj) {
        if (typeReflections.isPrimitive(obj)) {
            return obj;
        }
        var out;
        if (typeReflections.isListLike(obj)) {
            out = [];
            shapeReflections.eachKey(obj, function (item) {
                out.push(sort(item));
            });
            return out;
        }
        if (typeReflections.isMapLike(obj)) {
            out = {};
            shapeReflections.getOwnKeys(obj).sort(comparator).forEach(function (key) {
                out[key] = sort(getSetReflections.getKeyValue(obj, key));
            });
            return out;
        }
        return obj;
    }
    function isPrimitiveConverter(Type) {
        return Type === Number || Type === String || Type === Boolean;
    }
    var schemaReflections = {
        getSchema: function (type) {
            if (type === undefined) {
                return undefined;
            }
            var getSchema = type[getSchemaSymbol];
            if (getSchema === undefined) {
                type = type.constructor;
                getSchema = type && type[getSchemaSymbol];
            }
            return getSchema !== undefined ? getSchema.call(type) : undefined;
        },
        getIdentity: function (value, schema) {
            schema = schema || schemaReflections.getSchema(value);
            if (schema === undefined) {
                throw new Error('can-reflect.getIdentity - Unable to find a schema for the given value.');
            }
            var identity = schema.identity;
            if (!identity || identity.length === 0) {
                throw new Error('can-reflect.getIdentity - Provided schema lacks an identity property.');
            } else if (identity.length === 1) {
                return getSetReflections.getKeyValue(value, identity[0]);
            } else {
                var id = {};
                identity.forEach(function (key) {
                    id[key] = getSetReflections.getKeyValue(value, key);
                });
                return JSON.stringify(schemaReflections.cloneKeySort(id));
            }
        },
        cloneKeySort: function (obj) {
            return sort(obj);
        },
        convert: function (value, Type) {
            if (isPrimitiveConverter(Type)) {
                return Type(value);
            }
            var isMemberTest = Type[isMemberSymbol], isMember = false, type = typeof Type, createNew = Type[newSymbol];
            if (isMemberTest !== undefined) {
                isMember = isMemberTest.call(Type, value);
            } else if (type === 'function') {
                if (typeReflections.isConstructorLike(Type)) {
                    isMember = value instanceof Type;
                }
            }
            if (isMember) {
                return value;
            }
            if (createNew !== undefined) {
                return createNew.call(Type, value);
            } else if (type === 'function') {
                if (typeReflections.isConstructorLike(Type)) {
                    return new Type(value);
                } else {
                    return Type(value);
                }
            } else {
                throw new Error('can-reflect: Can not convert values into type. Type must provide `can.new` symbol.');
            }
        }
    };
    module.exports = schemaReflections;
});
/*can-reflect@1.17.0#reflections/get-name/get-name*/
define('can-reflect/reflections/get-name/get-name', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/type/type'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var typeReflections = require('can-reflect/reflections/type/type');
    var getNameSymbol = canSymbol.for('can.getName');
    function setName(obj, nameGetter) {
        if (typeof nameGetter !== 'function') {
            var value = nameGetter;
            nameGetter = function () {
                return value;
            };
        }
        Object.defineProperty(obj, getNameSymbol, { value: nameGetter });
    }
    function getName(obj) {
        var type = typeof obj;
        if (obj === null || type !== 'object' && type !== 'function') {
            return '' + obj;
        }
        var nameGetter = obj[getNameSymbol];
        if (nameGetter) {
            return nameGetter.call(obj);
        }
        if (type === 'function') {
            return obj.name;
        }
        if (obj.constructor && obj !== obj.constructor) {
            var parent = getName(obj.constructor);
            if (parent) {
                if (typeReflections.isValueLike(obj)) {
                    return parent + '<>';
                }
                if (typeReflections.isMoreListLikeThanMapLike(obj)) {
                    return parent + '[]';
                }
                if (typeReflections.isMapLike(obj)) {
                    return parent + '{}';
                }
            }
        }
        return undefined;
    }
    module.exports = {
        setName: setName,
        getName: getName
    };
});
/*can-reflect@1.17.0#types/map*/
define('can-reflect/types/map', [
    'require',
    'exports',
    'module',
    'can-reflect/reflections/shape/shape',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var shape = require('can-reflect/reflections/shape/shape');
    var CanSymbol = require('can-symbol');
    function keysPolyfill() {
        var keys = [];
        var currentIndex = 0;
        this.forEach(function (val, key) {
            keys.push(key);
        });
        return {
            next: function () {
                return {
                    value: keys[currentIndex],
                    done: currentIndex++ === keys.length
                };
            }
        };
    }
    if (typeof Map !== 'undefined') {
        shape.assignSymbols(Map.prototype, {
            'can.getOwnEnumerableKeys': Map.prototype.keys,
            'can.setKeyValue': Map.prototype.set,
            'can.getKeyValue': Map.prototype.get,
            'can.deleteKeyValue': Map.prototype['delete'],
            'can.hasOwnKey': Map.prototype.has
        });
        if (typeof Map.prototype.keys !== 'function') {
            Map.prototype.keys = Map.prototype[CanSymbol.for('can.getOwnEnumerableKeys')] = keysPolyfill;
        }
    }
    if (typeof WeakMap !== 'undefined') {
        shape.assignSymbols(WeakMap.prototype, {
            'can.getOwnEnumerableKeys': function () {
                throw new Error('can-reflect: WeakMaps do not have enumerable keys.');
            },
            'can.setKeyValue': WeakMap.prototype.set,
            'can.getKeyValue': WeakMap.prototype.get,
            'can.deleteKeyValue': WeakMap.prototype['delete'],
            'can.hasOwnKey': WeakMap.prototype.has
        });
    }
});
/*can-reflect@1.17.0#types/set*/
define('can-reflect/types/set', [
    'require',
    'exports',
    'module',
    'can-reflect/reflections/shape/shape',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var shape = require('can-reflect/reflections/shape/shape');
    var CanSymbol = require('can-symbol');
    if (typeof Set !== 'undefined') {
        shape.assignSymbols(Set.prototype, {
            'can.isMoreListLikeThanMapLike': true,
            'can.updateValues': function (index, removing, adding) {
                if (removing !== adding) {
                    shape.each(removing, function (value) {
                        this.delete(value);
                    }, this);
                }
                shape.each(adding, function (value) {
                    this.add(value);
                }, this);
            },
            'can.size': function () {
                return this.size;
            }
        });
        if (typeof Set.prototype[CanSymbol.iterator] !== 'function') {
            Set.prototype[CanSymbol.iterator] = function () {
                var arr = [];
                var currentIndex = 0;
                this.forEach(function (val) {
                    arr.push(val);
                });
                return {
                    next: function () {
                        return {
                            value: arr[currentIndex],
                            done: currentIndex++ === arr.length
                        };
                    }
                };
            };
        }
    }
    if (typeof WeakSet !== 'undefined') {
        shape.assignSymbols(WeakSet.prototype, {
            'can.isListLike': true,
            'can.isMoreListLikeThanMapLike': true,
            'can.updateValues': function (index, removing, adding) {
                if (removing !== adding) {
                    shape.each(removing, function (value) {
                        this.delete(value);
                    }, this);
                }
                shape.each(adding, function (value) {
                    this.add(value);
                }, this);
            },
            'can.size': function () {
                throw new Error('can-reflect: WeakSets do not have enumerable keys.');
            }
        });
    }
});
/*can-reflect@1.17.0#can-reflect*/
define('can-reflect', [
    'require',
    'exports',
    'module',
    'can-reflect/reflections/call/call',
    'can-reflect/reflections/get-set/get-set',
    'can-reflect/reflections/observe/observe',
    'can-reflect/reflections/shape/shape',
    'can-reflect/reflections/shape/schema/schema',
    'can-reflect/reflections/type/type',
    'can-reflect/reflections/get-name/get-name',
    'can-namespace',
    'can-reflect/types/map',
    'can-reflect/types/set'
], function (require, exports, module) {
    'use strict';
    var functionReflections = require('can-reflect/reflections/call/call');
    var getSet = require('can-reflect/reflections/get-set/get-set');
    var observe = require('can-reflect/reflections/observe/observe');
    var shape = require('can-reflect/reflections/shape/shape');
    var schema = require('can-reflect/reflections/shape/schema/schema');
    var type = require('can-reflect/reflections/type/type');
    var getName = require('can-reflect/reflections/get-name/get-name');
    var namespace = require('can-namespace');
    var reflect = {};
    [
        functionReflections,
        getSet,
        observe,
        shape,
        type,
        getName,
        schema
    ].forEach(function (reflections) {
        for (var prop in reflections) {
            reflect[prop] = reflections[prop];
        }
    });
    require('can-reflect/types/map');
    require('can-reflect/types/set');
    module.exports = namespace.Reflect = reflect;
});
/*can-log@1.0.0#can-log*/
define('can-log', function (require, exports, module) {
    'use strict';
    exports.warnTimeout = 5000;
    exports.logLevel = 0;
    exports.warn = function () {
        var ll = this.logLevel;
        if (ll < 2) {
            if (typeof console !== 'undefined' && console.warn) {
                this._logger('warn', Array.prototype.slice.call(arguments));
            } else if (typeof console !== 'undefined' && console.log) {
                this._logger('log', Array.prototype.slice.call(arguments));
            }
        }
    };
    exports.log = function () {
        var ll = this.logLevel;
        if (ll < 1) {
            if (typeof console !== 'undefined' && console.log) {
                this._logger('log', Array.prototype.slice.call(arguments));
            }
        }
    };
    exports.error = function () {
        var ll = this.logLevel;
        if (ll < 1) {
            if (typeof console !== 'undefined' && console.error) {
                this._logger('error', Array.prototype.slice.call(arguments));
            }
        }
    };
    exports._logger = function (type, arr) {
        try {
            console[type].apply(console, arr);
        } catch (e) {
            console[type](arr);
        }
    };
});
/*can-log@1.0.0#dev/dev*/
define('can-log/dev/dev', [
    'require',
    'exports',
    'module',
    'can-log'
], function (require, exports, module) {
    'use strict';
    var canLog = require('can-log');
    module.exports = {
        warnTimeout: 5000,
        logLevel: 0,
        stringify: function (value) {
            var flagUndefined = function flagUndefined(key, value) {
                return value === undefined ? '/* void(undefined) */' : value;
            };
            return JSON.stringify(value, flagUndefined, '  ').replace(/"\/\* void\(undefined\) \*\/"/g, 'undefined');
        },
        warn: function () {
        },
        log: function () {
        },
        error: function () {
        },
        _logger: canLog._logger
    };
});
/*can-queues@1.1.2#queue-state*/
define('can-queues/queue-state', function (require, exports, module) {
    module.exports = { lastTask: null };
});
/*can-assign@1.2.0#can-assign*/
define('can-assign', [
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    var namespace = require('can-namespace');
    module.exports = namespace.assign = function (d, s) {
        for (var prop in s) {
            d[prop] = s[prop];
        }
        return d;
    };
});
/*can-queues@1.1.2#queue*/
define('can-queues/queue', [
    'require',
    'exports',
    'module',
    'can-queues/queue-state',
    'can-log/dev/dev',
    'can-assign'
], function (require, exports, module) {
    var queueState = require('can-queues/queue-state');
    var canDev = require('can-log/dev/dev');
    var assign = require('can-assign');
    function noOperation() {
    }
    var Queue = function (name, callbacks) {
        this.callbacks = assign({
            onFirstTask: noOperation,
            onComplete: function () {
                queueState.lastTask = null;
            }
        }, callbacks || {});
        this.name = name;
        this.index = 0;
        this.tasks = [];
        this._log = false;
    };
    Queue.prototype.constructor = Queue;
    Queue.noop = noOperation;
    Queue.prototype.enqueue = function (fn, context, args, meta) {
        var len = this.tasks.push({
            fn: fn,
            context: context,
            args: args,
            meta: meta || {}
        });
        if (len === 1) {
            this.callbacks.onFirstTask(this);
        }
    };
    Queue.prototype.flush = function () {
        while (this.index < this.tasks.length) {
            var task = this.tasks[this.index++];
            task.fn.apply(task.context, task.args);
        }
        this.index = 0;
        this.tasks = [];
        this.callbacks.onComplete(this);
    };
    Queue.prototype.log = function () {
        this._log = arguments.length ? arguments[0] : true;
    };
    module.exports = Queue;
});
/*can-queues@1.1.2#priority-queue*/
define('can-queues/priority-queue', [
    'require',
    'exports',
    'module',
    'can-queues/queue'
], function (require, exports, module) {
    var Queue = require('can-queues/queue');
    var PriorityQueue = function () {
        Queue.apply(this, arguments);
        this.taskMap = new Map();
        this.taskContainersByPriority = [];
        this.curPriorityIndex = Infinity;
        this.curPriorityMax = 0;
        this.isFlushing = false;
        this.tasksRemaining = 0;
    };
    PriorityQueue.prototype = Object.create(Queue.prototype);
    PriorityQueue.prototype.constructor = PriorityQueue;
    PriorityQueue.prototype.enqueue = function (fn, context, args, meta) {
        if (!this.taskMap.has(fn)) {
            this.tasksRemaining++;
            var isFirst = this.taskContainersByPriority.length === 0;
            var task = {
                fn: fn,
                context: context,
                args: args,
                meta: meta || {}
            };
            var taskContainer = this.getTaskContainerAndUpdateRange(task);
            taskContainer.tasks.push(task);
            this.taskMap.set(fn, task);
            if (isFirst) {
                this.callbacks.onFirstTask(this);
            }
        }
    };
    PriorityQueue.prototype.getTaskContainerAndUpdateRange = function (task) {
        var priority = task.meta.priority || 0;
        if (priority < this.curPriorityIndex) {
            this.curPriorityIndex = priority;
        }
        if (priority > this.curPriorityMax) {
            this.curPriorityMax = priority;
        }
        var tcByPriority = this.taskContainersByPriority;
        var taskContainer = tcByPriority[priority];
        if (!taskContainer) {
            taskContainer = tcByPriority[priority] = {
                tasks: [],
                index: 0
            };
        }
        return taskContainer;
    };
    PriorityQueue.prototype.flush = function () {
        if (this.isFlushing) {
            return;
        }
        this.isFlushing = true;
        while (true) {
            if (this.curPriorityIndex <= this.curPriorityMax) {
                var taskContainer = this.taskContainersByPriority[this.curPriorityIndex];
                if (taskContainer && taskContainer.tasks.length > taskContainer.index) {
                    var task = taskContainer.tasks[taskContainer.index++];
                    this.tasksRemaining--;
                    this.taskMap['delete'](task.fn);
                    task.fn.apply(task.context, task.args);
                } else {
                    this.curPriorityIndex++;
                }
            } else {
                this.taskMap = new Map();
                this.curPriorityIndex = Infinity;
                this.curPriorityMax = 0;
                this.taskContainersByPriority = [];
                this.isFlushing = false;
                this.callbacks.onComplete(this);
                return;
            }
        }
    };
    PriorityQueue.prototype.isEnqueued = function (fn) {
        return this.taskMap.has(fn);
    };
    PriorityQueue.prototype.flushQueuedTask = function (fn) {
        var task = this.dequeue(fn);
        if (task) {
            task.fn.apply(task.context, task.args);
        }
    };
    PriorityQueue.prototype.dequeue = function (fn) {
        var task = this.taskMap.get(fn);
        if (task) {
            var priority = task.meta.priority || 0;
            var taskContainer = this.taskContainersByPriority[priority];
            var index = taskContainer.tasks.indexOf(task, taskContainer.index);
            if (index >= 0) {
                taskContainer.tasks.splice(index, 1);
                this.tasksRemaining--;
                this.taskMap['delete'](task.fn);
                return task;
            } else {
                console.warn('Task', fn, 'has already run');
            }
        }
    };
    PriorityQueue.prototype.tasksRemainingCount = function () {
        return this.tasksRemaining;
    };
    module.exports = PriorityQueue;
});
/*can-queues@1.1.2#completion-queue*/
define('can-queues/completion-queue', [
    'require',
    'exports',
    'module',
    'can-queues/queue'
], function (require, exports, module) {
    var Queue = require('can-queues/queue');
    var CompletionQueue = function () {
        Queue.apply(this, arguments);
        this.flushCount = 0;
    };
    CompletionQueue.prototype = Object.create(Queue.prototype);
    CompletionQueue.prototype.constructor = CompletionQueue;
    CompletionQueue.prototype.flush = function () {
        if (this.flushCount === 0) {
            this.flushCount++;
            while (this.index < this.tasks.length) {
                var task = this.tasks[this.index++];
                task.fn.apply(task.context, task.args);
            }
            this.index = 0;
            this.tasks = [];
            this.flushCount--;
            this.callbacks.onComplete(this);
        }
    };
    module.exports = CompletionQueue;
});
/*can-queues@1.1.2#can-queues*/
define('can-queues', [
    'require',
    'exports',
    'module',
    'can-log/dev/dev',
    'can-queues/queue',
    'can-queues/priority-queue',
    'can-queues/queue-state',
    'can-queues/completion-queue',
    'can-namespace'
], function (require, exports, module) {
    var canDev = require('can-log/dev/dev');
    var Queue = require('can-queues/queue');
    var PriorityQueue = require('can-queues/priority-queue');
    var queueState = require('can-queues/queue-state');
    var CompletionQueue = require('can-queues/completion-queue');
    var ns = require('can-namespace');
    var batchStartCounter = 0;
    var addedTask = false;
    var isFlushing = false;
    var batchNum = 0;
    var batchData;
    var queueNames = [
        'notify',
        'derive',
        'domUI',
        'mutate'
    ];
    var NOTIFY_QUEUE, DERIVE_QUEUE, DOM_UI_QUEUE, MUTATE_QUEUE;
    NOTIFY_QUEUE = new Queue('NOTIFY', {
        onComplete: function () {
            DERIVE_QUEUE.flush();
        },
        onFirstTask: function () {
            if (!batchStartCounter) {
                NOTIFY_QUEUE.flush();
            } else {
                addedTask = true;
            }
        }
    });
    DERIVE_QUEUE = new PriorityQueue('DERIVE', {
        onComplete: function () {
            DOM_UI_QUEUE.flush();
        },
        onFirstTask: function () {
            addedTask = true;
        }
    });
    DOM_UI_QUEUE = new CompletionQueue('DOM_UI', {
        onComplete: function () {
            MUTATE_QUEUE.flush();
        },
        onFirstTask: function () {
            addedTask = true;
        }
    });
    MUTATE_QUEUE = new Queue('MUTATE', {
        onComplete: function () {
            queueState.lastTask = null;
            isFlushing = false;
        },
        onFirstTask: function () {
            addedTask = true;
        }
    });
    var queues = {
        Queue: Queue,
        PriorityQueue: PriorityQueue,
        CompletionQueue: CompletionQueue,
        notifyQueue: NOTIFY_QUEUE,
        deriveQueue: DERIVE_QUEUE,
        domUIQueue: DOM_UI_QUEUE,
        mutateQueue: MUTATE_QUEUE,
        batch: {
            start: function () {
                batchStartCounter++;
                if (batchStartCounter === 1) {
                    batchNum++;
                    batchData = { number: batchNum };
                }
            },
            stop: function () {
                batchStartCounter--;
                if (batchStartCounter === 0) {
                    if (addedTask) {
                        addedTask = false;
                        isFlushing = true;
                        NOTIFY_QUEUE.flush();
                    }
                }
            },
            isCollecting: function () {
                return batchStartCounter > 0;
            },
            number: function () {
                return batchNum;
            },
            data: function () {
                return batchData;
            }
        },
        enqueueByQueue: function enqueueByQueue(fnByQueue, context, args, makeMeta, reasonLog) {
            if (fnByQueue) {
                queues.batch.start();
                queueNames.forEach(function (queueName) {
                    var name = queueName + 'Queue';
                    var QUEUE = queues[name];
                    var tasks = fnByQueue[queueName];
                    if (tasks !== undefined) {
                        tasks.forEach(function (fn) {
                            var meta = makeMeta != null ? makeMeta(fn, context, args) : {};
                            meta.reasonLog = reasonLog;
                            QUEUE.enqueue(fn, context, args, meta);
                        });
                    }
                });
                queues.batch.stop();
            }
        },
        stack: function () {
            var current = queueState.lastTask;
            var stack = [];
            while (current) {
                stack.unshift(current);
                current = current.meta.parentTask;
            }
            return stack;
        },
        logStack: function () {
            var stack = this.stack();
            stack.forEach(function (task, i) {
                var meta = task.meta;
                if (i === 0 && meta && meta.reasonLog) {
                    canDev.log.apply(canDev, meta.reasonLog);
                }
                var log = meta && meta.log ? meta.log : [
                    task.fn.name,
                    task
                ];
                canDev.log.apply(canDev, [task.meta.stack.name + ' ran task:'].concat(log));
            });
        },
        taskCount: function () {
            return NOTIFY_QUEUE.tasks.length + DERIVE_QUEUE.tasks.length + DOM_UI_QUEUE.tasks.length + MUTATE_QUEUE.tasks.length;
        },
        flush: function () {
            NOTIFY_QUEUE.flush();
        },
        log: function () {
            NOTIFY_QUEUE.log.apply(NOTIFY_QUEUE, arguments);
            DERIVE_QUEUE.log.apply(DERIVE_QUEUE, arguments);
            DOM_UI_QUEUE.log.apply(DOM_UI_QUEUE, arguments);
            MUTATE_QUEUE.log.apply(MUTATE_QUEUE, arguments);
        }
    };
    if (ns.queues) {
        throw new Error('You can\'t have two versions of can-queues, check your dependencies');
    } else {
        module.exports = ns.queues = queues;
    }
});
/*can-key-tree@1.2.0#can-key-tree*/
define('can-key-tree', [
    'require',
    'exports',
    'module',
    'can-reflect'
], function (require, exports, module) {
    'use strict';
    var reflect = require('can-reflect');
    function isBuiltInPrototype(obj) {
        if (obj === Object.prototype) {
            return true;
        }
        var protoString = Object.prototype.toString.call(obj);
        var isNotObjObj = protoString !== '[object Object]';
        var isObjSomething = protoString.indexOf('[object ') !== -1;
        return isNotObjObj && isObjSomething;
    }
    function getDeepSize(root, level) {
        if (level === 0) {
            return reflect.size(root);
        } else if (reflect.size(root) === 0) {
            return 0;
        } else {
            var count = 0;
            reflect.each(root, function (value) {
                count += getDeepSize(value, level - 1);
            });
            return count;
        }
    }
    function getDeep(node, items, depth, maxDepth) {
        if (!node) {
            return;
        }
        if (maxDepth === depth) {
            if (reflect.isMoreListLikeThanMapLike(node)) {
                reflect.addValues(items, reflect.toArray(node));
            } else {
                throw new Error('can-key-tree: Map-type leaf containers are not supported yet.');
            }
        } else {
            reflect.each(node, function (value) {
                getDeep(value, items, depth + 1, maxDepth);
            });
        }
    }
    function clearDeep(node, keys, maxDepth, deleteHandler) {
        if (maxDepth === keys.length) {
            if (reflect.isMoreListLikeThanMapLike(node)) {
                var valuesToRemove = reflect.toArray(node);
                if (deleteHandler) {
                    valuesToRemove.forEach(function (value) {
                        deleteHandler.apply(null, keys.concat(value));
                    });
                }
                reflect.removeValues(node, valuesToRemove);
            } else {
                throw new Error('can-key-tree: Map-type leaf containers are not supported yet.');
            }
        } else {
            reflect.each(node, function (value, key) {
                clearDeep(value, keys.concat(key), maxDepth, deleteHandler);
                reflect.deleteKeyValue(node, key);
            });
        }
    }
    var KeyTree = function (treeStructure, callbacks) {
        var FirstConstructor = treeStructure[0];
        if (reflect.isConstructorLike(FirstConstructor)) {
            this.root = new FirstConstructor();
        } else {
            this.root = FirstConstructor;
        }
        this.callbacks = callbacks || {};
        this.treeStructure = treeStructure;
        this.empty = true;
    };
    reflect.assign(KeyTree.prototype, {
        add: function (keys) {
            if (keys.length > this.treeStructure.length) {
                throw new Error('can-key-tree: Can not add path deeper than tree.');
            }
            var place = this.root;
            var rootWasEmpty = this.empty === true;
            for (var i = 0; i < keys.length - 1; i++) {
                var key = keys[i];
                var childNode = reflect.getKeyValue(place, key);
                if (!childNode) {
                    var Constructor = this.treeStructure[i + 1];
                    if (isBuiltInPrototype(Constructor.prototype)) {
                        childNode = new Constructor();
                    } else {
                        childNode = new Constructor(key);
                    }
                    reflect.setKeyValue(place, key, childNode);
                }
                place = childNode;
            }
            if (reflect.isMoreListLikeThanMapLike(place)) {
                reflect.addValues(place, [keys[keys.length - 1]]);
            } else {
                throw new Error('can-key-tree: Map types are not supported yet.');
            }
            if (rootWasEmpty) {
                this.empty = false;
                if (this.callbacks.onFirst) {
                    this.callbacks.onFirst.call(this);
                }
            }
            return this;
        },
        getNode: function (keys) {
            var node = this.root;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                node = reflect.getKeyValue(node, key);
                if (!node) {
                    return;
                }
            }
            return node;
        },
        get: function (keys) {
            var node = this.getNode(keys);
            if (this.treeStructure.length === keys.length) {
                return node;
            } else {
                var Type = this.treeStructure[this.treeStructure.length - 1];
                var items = new Type();
                getDeep(node, items, keys.length, this.treeStructure.length - 1);
                return items;
            }
        },
        delete: function (keys, deleteHandler) {
            var parentNode = this.root, path = [this.root], lastKey = keys[keys.length - 1];
            for (var i = 0; i < keys.length - 1; i++) {
                var key = keys[i];
                var childNode = reflect.getKeyValue(parentNode, key);
                if (childNode === undefined) {
                    return false;
                } else {
                    path.push(childNode);
                }
                parentNode = childNode;
            }
            if (!keys.length) {
                clearDeep(parentNode, [], this.treeStructure.length - 1, deleteHandler);
            } else if (keys.length === this.treeStructure.length) {
                if (reflect.isMoreListLikeThanMapLike(parentNode)) {
                    if (deleteHandler) {
                        deleteHandler.apply(null, keys.concat(lastKey));
                    }
                    reflect.removeValues(parentNode, [lastKey]);
                } else {
                    throw new Error('can-key-tree: Map types are not supported yet.');
                }
            } else {
                var nodeToRemove = reflect.getKeyValue(parentNode, lastKey);
                if (nodeToRemove !== undefined) {
                    clearDeep(nodeToRemove, keys, this.treeStructure.length - 1, deleteHandler);
                    reflect.deleteKeyValue(parentNode, lastKey);
                } else {
                    return false;
                }
            }
            for (i = path.length - 2; i >= 0; i--) {
                if (reflect.size(parentNode) === 0) {
                    parentNode = path[i];
                    reflect.deleteKeyValue(parentNode, keys[i]);
                } else {
                    break;
                }
            }
            if (reflect.size(this.root) === 0) {
                this.empty = true;
                if (this.callbacks.onEmpty) {
                    this.callbacks.onEmpty.call(this);
                }
            }
            return true;
        },
        size: function () {
            return getDeepSize(this.root, this.treeStructure.length - 1);
        },
        isEmpty: function () {
            return this.empty;
        }
    });
    module.exports = KeyTree;
});
/*can-globals@1.2.0#can-globals-proto*/
define('can-globals/can-globals-proto', [
    'require',
    'exports',
    'module',
    'can-reflect'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var canReflect = require('can-reflect');
        function dispatch(key) {
            var handlers = this.eventHandlers[key];
            if (handlers) {
                var handlersCopy = handlers.slice();
                var value = this.getKeyValue(key);
                for (var i = 0; i < handlersCopy.length; i++) {
                    handlersCopy[i](value);
                }
            }
        }
        function Globals() {
            this.eventHandlers = {};
            this.properties = {};
        }
        Globals.prototype.define = function (key, value, enableCache) {
            if (enableCache === undefined) {
                enableCache = true;
            }
            if (!this.properties[key]) {
                this.properties[key] = {
                    default: value,
                    value: value,
                    enableCache: enableCache
                };
            }
            return this;
        };
        Globals.prototype.getKeyValue = function (key) {
            var property = this.properties[key];
            if (property) {
                if (typeof property.value === 'function') {
                    if (property.cachedValue) {
                        return property.cachedValue;
                    }
                    if (property.enableCache) {
                        property.cachedValue = property.value();
                        return property.cachedValue;
                    } else {
                        return property.value();
                    }
                }
                return property.value;
            }
        };
        Globals.prototype.makeExport = function (key) {
            return function (value) {
                if (arguments.length === 0) {
                    return this.getKeyValue(key);
                }
                if (typeof value === 'undefined' || value === null) {
                    this.deleteKeyValue(key);
                } else {
                    if (typeof value === 'function') {
                        this.setKeyValue(key, function () {
                            return value;
                        });
                    } else {
                        this.setKeyValue(key, value);
                    }
                    return value;
                }
            }.bind(this);
        };
        Globals.prototype.offKeyValue = function (key, handler) {
            if (this.properties[key]) {
                var handlers = this.eventHandlers[key];
                if (handlers) {
                    var i = handlers.indexOf(handler);
                    handlers.splice(i, 1);
                }
            }
            return this;
        };
        Globals.prototype.onKeyValue = function (key, handler) {
            if (this.properties[key]) {
                if (!this.eventHandlers[key]) {
                    this.eventHandlers[key] = [];
                }
                this.eventHandlers[key].push(handler);
            }
            return this;
        };
        Globals.prototype.deleteKeyValue = function (key) {
            var property = this.properties[key];
            if (property !== undefined) {
                property.value = property.default;
                property.cachedValue = undefined;
                dispatch.call(this, key);
            }
            return this;
        };
        Globals.prototype.setKeyValue = function (key, value) {
            if (!this.properties[key]) {
                return this.define(key, value);
            }
            var property = this.properties[key];
            property.value = value;
            property.cachedValue = undefined;
            dispatch.call(this, key);
            return this;
        };
        Globals.prototype.reset = function () {
            for (var key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    this.properties[key].value = this.properties[key].default;
                    this.properties[key].cachedValue = undefined;
                    dispatch.call(this, key);
                }
            }
            return this;
        };
        canReflect.assignSymbols(Globals.prototype, {
            'can.getKeyValue': Globals.prototype.getKeyValue,
            'can.setKeyValue': Globals.prototype.setKeyValue,
            'can.deleteKeyValue': Globals.prototype.deleteKeyValue,
            'can.onKeyValue': Globals.prototype.onKeyValue,
            'can.offKeyValue': Globals.prototype.offKeyValue
        });
        module.exports = Globals;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#can-globals-instance*/
define('can-globals/can-globals-instance', [
    'require',
    'exports',
    'module',
    'can-namespace',
    'can-globals/can-globals-proto'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var namespace = require('can-namespace');
        var Globals = require('can-globals/can-globals-proto');
        var globals = new Globals();
        if (namespace.globals) {
            throw new Error('You can\'t have two versions of can-globals, check your dependencies');
        } else {
            module.exports = namespace.globals = globals;
        }
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#global/global*/
define('can-globals/global/global', [
    'require',
    'exports',
    'module',
    'can-globals/can-globals-instance'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var globals = require('can-globals/can-globals-instance');
        globals.define('global', function () {
            return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self : typeof process === 'object' && {}.toString.call(process) === '[object process]' ? global : window;
        });
        module.exports = globals.makeExport('global');
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#document/document*/
define('can-globals/document/document', [
    'require',
    'exports',
    'module',
    'can-globals/global/global',
    'can-globals/can-globals-instance'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        require('can-globals/global/global');
        var globals = require('can-globals/can-globals-instance');
        globals.define('document', function () {
            return globals.getKeyValue('global').document;
        });
        module.exports = globals.makeExport('document');
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#is-node/is-node*/
define('can-globals/is-node/is-node', [
    'require',
    'exports',
    'module',
    'can-globals/can-globals-instance'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var globals = require('can-globals/can-globals-instance');
        globals.define('isNode', function () {
            return typeof process === 'object' && {}.toString.call(process) === '[object process]';
        });
        module.exports = globals.makeExport('isNode');
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#is-browser-window/is-browser-window*/
define('can-globals/is-browser-window/is-browser-window', [
    'require',
    'exports',
    'module',
    'can-globals/can-globals-instance',
    'can-globals/is-node/is-node'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var globals = require('can-globals/can-globals-instance');
        require('can-globals/is-node/is-node');
        globals.define('isBrowserWindow', function () {
            var isNode = globals.getKeyValue('isNode');
            return typeof window !== 'undefined' && typeof document !== 'undefined' && isNode === false;
        });
        module.exports = globals.makeExport('isBrowserWindow');
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-dom-events@1.3.0#helpers/util*/
define('can-dom-events/helpers/util', [
    'require',
    'exports',
    'module',
    'can-globals/document/document',
    'can-globals/is-browser-window/is-browser-window'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var getCurrentDocument = require('can-globals/document/document');
        var isBrowserWindow = require('can-globals/is-browser-window/is-browser-window');
        function getTargetDocument(target) {
            return target.ownerDocument || getCurrentDocument();
        }
        function createEvent(target, eventData, bubbles, cancelable) {
            var doc = getTargetDocument(target);
            var event = doc.createEvent('HTMLEvents');
            var eventType;
            if (typeof eventData === 'string') {
                eventType = eventData;
            } else {
                eventType = eventData.type;
                for (var prop in eventData) {
                    if (event[prop] === undefined) {
                        event[prop] = eventData[prop];
                    }
                }
            }
            if (bubbles === undefined) {
                bubbles = true;
            }
            event.initEvent(eventType, bubbles, cancelable);
            return event;
        }
        function isDomEventTarget(obj) {
            if (!(obj && obj.nodeName)) {
                return obj === window;
            }
            var nodeType = obj.nodeType;
            return nodeType === 1 || nodeType === 9 || nodeType === 11;
        }
        function addDomContext(context, args) {
            if (isDomEventTarget(context)) {
                args = Array.prototype.slice.call(args, 0);
                args.unshift(context);
            }
            return args;
        }
        function removeDomContext(context, args) {
            if (!isDomEventTarget(context)) {
                args = Array.prototype.slice.call(args, 0);
                context = args.shift();
            }
            return {
                context: context,
                args: args
            };
        }
        var fixSyntheticEventsOnDisabled = false;
        (function () {
            if (!isBrowserWindow()) {
                return;
            }
            var testEventName = 'fix_synthetic_events_on_disabled_test';
            var input = document.createElement('input');
            input.disabled = true;
            var timer = setTimeout(function () {
                fixSyntheticEventsOnDisabled = true;
            }, 50);
            var onTest = function onTest() {
                clearTimeout(timer);
                input.removeEventListener(testEventName, onTest);
            };
            input.addEventListener(testEventName, onTest);
            try {
                var event = document.create('HTMLEvents');
                event.initEvent(testEventName, false);
                input.dispatchEvent(event);
            } catch (e) {
                onTest();
                fixSyntheticEventsOnDisabled = true;
            }
        }());
        function isDispatchingOnDisabled(element, event) {
            var eventType = event.type;
            var isInsertedOrRemoved = eventType === 'inserted' || eventType === 'removed';
            var isDisabled = !!element.disabled;
            return isInsertedOrRemoved && isDisabled;
        }
        function forceEnabledForDispatch(element, event) {
            return fixSyntheticEventsOnDisabled && isDispatchingOnDisabled(element, event);
        }
        module.exports = {
            createEvent: createEvent,
            addDomContext: addDomContext,
            removeDomContext: removeDomContext,
            isDomEventTarget: isDomEventTarget,
            getTargetDocument: getTargetDocument,
            forceEnabledForDispatch: forceEnabledForDispatch
        };
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-dom-events@1.3.0#helpers/make-event-registry*/
define('can-dom-events/helpers/make-event-registry', function (require, exports, module) {
    'use strict';
    function EventRegistry() {
        this._registry = {};
    }
    module.exports = function makeEventRegistry() {
        return new EventRegistry();
    };
    EventRegistry.prototype.has = function (eventType) {
        return !!this._registry[eventType];
    };
    EventRegistry.prototype.get = function (eventType) {
        return this._registry[eventType];
    };
    EventRegistry.prototype.add = function (event, eventType) {
        if (!event) {
            throw new Error('An EventDefinition must be provided');
        }
        if (typeof event.addEventListener !== 'function') {
            throw new TypeError('EventDefinition addEventListener must be a function');
        }
        if (typeof event.removeEventListener !== 'function') {
            throw new TypeError('EventDefinition removeEventListener must be a function');
        }
        eventType = eventType || event.defaultEventType;
        if (typeof eventType !== 'string') {
            throw new TypeError('Event type must be a string, not ' + eventType);
        }
        if (this.has(eventType)) {
            throw new Error('Event "' + eventType + '" is already registered');
        }
        this._registry[eventType] = event;
        var self = this;
        return function remove() {
            self._registry[eventType] = undefined;
        };
    };
});
/*can-dom-events@1.3.0#helpers/-make-delegate-event-tree*/
define('can-dom-events/helpers/-make-delegate-event-tree', [
    'require',
    'exports',
    'module',
    'can-key-tree',
    'can-reflect'
], function (require, exports, module) {
    'use strict';
    var KeyTree = require('can-key-tree');
    var canReflect = require('can-reflect');
    var useCapture = function (eventType) {
        return eventType === 'focus' || eventType === 'blur';
    };
    function makeDelegator(domEvents) {
        var Delegator = function Delegator(parentKey) {
            this.element = parentKey;
            this.events = {};
            this.delegated = {};
        };
        canReflect.assignSymbols(Delegator.prototype, {
            'can.setKeyValue': function (eventType, handlersBySelector) {
                var handler = this.delegated[eventType] = function (ev) {
                    canReflect.each(handlersBySelector, function (handlers, selector) {
                        var cur = ev.target;
                        do {
                            var el = cur === document ? document.documentElement : cur;
                            var matches = el.matches || el.msMatchesSelector;
                            if (matches.call(el, selector)) {
                                handlers.forEach(function (handler) {
                                    handler.call(el, ev);
                                });
                            }
                            cur = cur.parentNode;
                        } while (cur && cur !== ev.currentTarget);
                    });
                };
                this.events[eventType] = handlersBySelector;
                domEvents.addEventListener(this.element, eventType, handler, useCapture(eventType));
            },
            'can.getKeyValue': function (eventType) {
                return this.events[eventType];
            },
            'can.deleteKeyValue': function (eventType) {
                domEvents.removeEventListener(this.element, eventType, this.delegated[eventType], useCapture(eventType));
                delete this.delegated[eventType];
                delete this.events[eventType];
            },
            'can.getOwnEnumerableKeys': function () {
                return Object.keys(this.events);
            }
        });
        return Delegator;
    }
    module.exports = function makeDelegateEventTree(domEvents) {
        var Delegator = makeDelegator(domEvents);
        return new KeyTree([
            Map,
            Delegator,
            Object,
            Array
        ]);
    };
});
/*can-dom-events@1.3.0#can-dom-events*/
define('can-dom-events', [
    'require',
    'exports',
    'module',
    'can-namespace',
    'can-dom-events/helpers/util',
    'can-dom-events/helpers/make-event-registry',
    'can-dom-events/helpers/-make-delegate-event-tree'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var namespace = require('can-namespace');
        var util = require('can-dom-events/helpers/util');
        var makeEventRegistry = require('can-dom-events/helpers/make-event-registry');
        var makeDelegateEventTree = require('can-dom-events/helpers/-make-delegate-event-tree');
        var domEvents = {
            _eventRegistry: makeEventRegistry(),
            addEvent: function (event, eventType) {
                return this._eventRegistry.add(event, eventType);
            },
            addEventListener: function (target, eventType) {
                var hasCustomEvent = domEvents._eventRegistry.has(eventType);
                if (hasCustomEvent) {
                    var event = domEvents._eventRegistry.get(eventType);
                    return event.addEventListener.apply(domEvents, arguments);
                }
                var eventArgs = Array.prototype.slice.call(arguments, 1);
                return target.addEventListener.apply(target, eventArgs);
            },
            removeEventListener: function (target, eventType) {
                var hasCustomEvent = domEvents._eventRegistry.has(eventType);
                if (hasCustomEvent) {
                    var event = domEvents._eventRegistry.get(eventType);
                    return event.removeEventListener.apply(domEvents, arguments);
                }
                var eventArgs = Array.prototype.slice.call(arguments, 1);
                return target.removeEventListener.apply(target, eventArgs);
            },
            addDelegateListener: function (root, eventType, selector, handler) {
                domEvents._eventTree.add([
                    root,
                    eventType,
                    selector,
                    handler
                ]);
            },
            removeDelegateListener: function (target, eventType, selector, handler) {
                domEvents._eventTree.delete([
                    target,
                    eventType,
                    selector,
                    handler
                ]);
            },
            dispatch: function (target, eventData, bubbles, cancelable) {
                var event = util.createEvent(target, eventData, bubbles, cancelable);
                var enableForDispatch = util.forceEnabledForDispatch(target, event);
                if (enableForDispatch) {
                    target.disabled = false;
                }
                var ret = target.dispatchEvent(event);
                if (enableForDispatch) {
                    target.disabled = true;
                }
                return ret;
            }
        };
        domEvents._eventTree = makeDelegateEventTree(domEvents);
        module.exports = namespace.domEvents = domEvents;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-event-queue@1.1.0#dependency-record/merge*/
define('can-event-queue/dependency-record/merge', [
    'require',
    'exports',
    'module',
    'can-reflect'
], function (require, exports, module) {
    'use strict';
    var canReflect = require('can-reflect');
    var mergeValueDependencies = function mergeValueDependencies(obj, source) {
        var sourceValueDeps = source.valueDependencies;
        if (sourceValueDeps) {
            var destValueDeps = obj.valueDependencies;
            if (!destValueDeps) {
                destValueDeps = new Set();
                obj.valueDependencies = destValueDeps;
            }
            canReflect.eachIndex(sourceValueDeps, function (dep) {
                destValueDeps.add(dep);
            });
        }
    };
    var mergeKeyDependencies = function mergeKeyDependencies(obj, source) {
        var sourcekeyDeps = source.keyDependencies;
        if (sourcekeyDeps) {
            var destKeyDeps = obj.keyDependencies;
            if (!destKeyDeps) {
                destKeyDeps = new Map();
                obj.keyDependencies = destKeyDeps;
            }
            canReflect.eachKey(sourcekeyDeps, function (keys, obj) {
                var entry = destKeyDeps.get(obj);
                if (!entry) {
                    entry = new Set();
                    destKeyDeps.set(obj, entry);
                }
                canReflect.eachIndex(keys, function (key) {
                    entry.add(key);
                });
            });
        }
    };
    module.exports = function mergeDependencyRecords(object, source) {
        mergeKeyDependencies(object, source);
        mergeValueDependencies(object, source);
        return object;
    };
});
/*can-event-queue@1.1.0#map/map*/
define('can-event-queue/map/map', [
    'require',
    'exports',
    'module',
    'can-log/dev/dev',
    'can-queues',
    'can-reflect',
    'can-symbol',
    'can-key-tree',
    'can-dom-events',
    'can-dom-events/helpers/util',
    'can-event-queue/dependency-record/merge'
], function (require, exports, module) {
    'use strict';
    var canDev = require('can-log/dev/dev');
    var queues = require('can-queues');
    var canReflect = require('can-reflect');
    var canSymbol = require('can-symbol');
    var KeyTree = require('can-key-tree');
    var domEvents = require('can-dom-events');
    var isDomEventTarget = require('can-dom-events/helpers/util').isDomEventTarget;
    var mergeDependencyRecords = require('can-event-queue/dependency-record/merge');
    var metaSymbol = canSymbol.for('can.meta'), dispatchBoundChangeSymbol = canSymbol.for('can.dispatchInstanceBoundChange'), dispatchInstanceOnPatchesSymbol = canSymbol.for('can.dispatchInstanceOnPatches'), onKeyValueSymbol = canSymbol.for('can.onKeyValue'), offKeyValueSymbol = canSymbol.for('can.offKeyValue'), onEventSymbol = canSymbol.for('can.onEvent'), offEventSymbol = canSymbol.for('can.offEvent'), onValueSymbol = canSymbol.for('can.onValue'), offValueSymbol = canSymbol.for('can.offValue');
    var legacyMapBindings;
    function addHandlers(obj, meta) {
        if (!meta.handlers) {
            meta.handlers = new KeyTree([
                Object,
                Object,
                Object,
                Array
            ], {
                onFirst: function () {
                    if (obj._eventSetup !== undefined) {
                        obj._eventSetup();
                    }
                    if (obj.constructor[dispatchBoundChangeSymbol]) {
                        obj.constructor[dispatchBoundChangeSymbol](obj, true);
                    }
                },
                onEmpty: function () {
                    if (obj._eventTeardown !== undefined) {
                        obj._eventTeardown();
                    }
                    if (obj.constructor[dispatchBoundChangeSymbol]) {
                        obj.constructor[dispatchBoundChangeSymbol](obj, false);
                    }
                }
            });
        }
        if (!meta.listenHandlers) {
            meta.listenHandlers = new KeyTree([
                Map,
                Map,
                Object,
                Array
            ]);
        }
    }
    var ensureMeta = function ensureMeta(obj) {
        var meta = obj[metaSymbol];
        if (!meta) {
            meta = {};
            canReflect.setKeyValue(obj, metaSymbol, meta);
        }
        addHandlers(obj, meta);
        return meta;
    };
    function stopListeningArgumentsToKeys(bindTarget, event, handler, queueName) {
        if (arguments.length && canReflect.isPrimitive(bindTarget)) {
            queueName = handler;
            handler = event;
            event = bindTarget;
            bindTarget = this.context;
        }
        if (typeof event === 'function') {
            queueName = handler;
            handler = event;
            event = undefined;
        }
        if (typeof handler === 'string') {
            queueName = handler;
            handler = undefined;
        }
        var keys = [];
        if (bindTarget) {
            keys.push(bindTarget);
            if (event || handler || queueName) {
                keys.push(event);
                if (queueName || handler) {
                    keys.push(queueName || this.defaultQueue);
                    if (handler) {
                        keys.push(handler);
                    }
                }
            }
        }
        return keys;
    }
    var props = {
        dispatch: function (event, args) {
            if (!this.__inSetup) {
                if (typeof event === 'string') {
                    event = { type: event };
                }
                var meta = ensureMeta(this);
                var handlers = meta.handlers;
                var handlersByType = event.type !== undefined && handlers.getNode([event.type]);
                var dispatchConstructorPatches = event.patches && this.constructor[dispatchInstanceOnPatchesSymbol];
                var patchesNode = event.patches !== undefined && handlers.getNode([
                    'can.patches',
                    'onKeyValue'
                ]);
                var keysNode = event.keyChanged !== undefined && handlers.getNode([
                    'can.keys',
                    'onKeyValue'
                ]);
                var batch = dispatchConstructorPatches || handlersByType || patchesNode || keysNode;
                if (batch) {
                    queues.batch.start();
                }
                if (handlersByType) {
                    if (handlersByType.onKeyValue) {
                        queues.enqueueByQueue(handlersByType.onKeyValue, this, args, event.makeMeta, event.reasonLog);
                    }
                    if (handlersByType.event) {
                        event.batchNum = queues.batch.number();
                        var eventAndArgs = [event].concat(args);
                        queues.enqueueByQueue(handlersByType.event, this, eventAndArgs, event.makeMeta, event.reasonLog);
                    }
                }
                if (keysNode) {
                    queues.enqueueByQueue(keysNode, this, [event.keyChanged], event.makeMeta, event.reasonLog);
                }
                if (patchesNode) {
                    queues.enqueueByQueue(patchesNode, this, [event.patches], event.makeMeta, event.reasonLog);
                }
                if (dispatchConstructorPatches) {
                    this.constructor[dispatchInstanceOnPatchesSymbol](this, event.patches);
                }
                if (batch) {
                    queues.batch.stop();
                }
            }
            return event;
        },
        addEventListener: function (key, handler, queueName) {
            ensureMeta(this).handlers.add([
                key,
                'event',
                queueName || 'mutate',
                handler
            ]);
            return this;
        },
        removeEventListener: function (key, handler, queueName) {
            if (key === undefined) {
                var handlers = ensureMeta(this).handlers;
                var keyHandlers = handlers.getNode([]);
                Object.keys(keyHandlers).forEach(function (key) {
                    handlers.delete([
                        key,
                        'event'
                    ]);
                });
            } else if (!handler && !queueName) {
                ensureMeta(this).handlers.delete([
                    key,
                    'event'
                ]);
            } else if (!handler) {
                ensureMeta(this).handlers.delete([
                    key,
                    'event',
                    queueName || 'mutate'
                ]);
            } else {
                ensureMeta(this).handlers.delete([
                    key,
                    'event',
                    queueName || 'mutate',
                    handler
                ]);
            }
            return this;
        },
        one: function (event, handler) {
            var one = function () {
                legacyMapBindings.off.call(this, event, one);
                return handler.apply(this, arguments);
            };
            legacyMapBindings.on.call(this, event, one);
            return this;
        },
        listenTo: function (bindTarget, event, handler, queueName) {
            if (canReflect.isPrimitive(bindTarget)) {
                queueName = handler;
                handler = event;
                event = bindTarget;
                bindTarget = this;
            }
            if (typeof event === 'function') {
                queueName = handler;
                handler = event;
                event = undefined;
            }
            ensureMeta(this).listenHandlers.add([
                bindTarget,
                event,
                queueName || 'mutate',
                handler
            ]);
            legacyMapBindings.on.call(bindTarget, event, handler, queueName || 'mutate');
            return this;
        },
        stopListening: function () {
            var keys = stopListeningArgumentsToKeys.apply({
                context: this,
                defaultQueue: 'mutate'
            }, arguments);
            var listenHandlers = ensureMeta(this).listenHandlers;
            function deleteHandler(bindTarget, event, queue, handler) {
                legacyMapBindings.off.call(bindTarget, event, handler, queue);
            }
            listenHandlers.delete(keys, deleteHandler);
            return this;
        },
        on: function (eventName, handler, queue) {
            var listenWithDOM = isDomEventTarget(this);
            if (listenWithDOM) {
                if (typeof handler === 'string') {
                    domEvents.addDelegateListener(this, eventName, handler, queue);
                } else {
                    domEvents.addEventListener(this, eventName, handler, queue);
                }
            } else {
                if ('addEventListener' in this) {
                    this.addEventListener(eventName, handler, queue);
                } else if (this[onKeyValueSymbol]) {
                    canReflect.onKeyValue(this, eventName, handler, queue);
                } else if (this[onEventSymbol]) {
                    this[onEventSymbol](eventName, handler, queue);
                } else {
                    if (!eventName && this[onValueSymbol]) {
                        canReflect.onValue(this, handler, queue);
                    } else {
                        throw new Error('can-event-queue: Unable to bind ' + eventName);
                    }
                }
            }
            return this;
        },
        off: function (eventName, handler, queue) {
            var listenWithDOM = isDomEventTarget(this);
            if (listenWithDOM) {
                if (typeof handler === 'string') {
                    domEvents.removeDelegateListener(this, eventName, handler, queue);
                } else {
                    domEvents.removeEventListener(this, eventName, handler, queue);
                }
            } else {
                if ('removeEventListener' in this) {
                    this.removeEventListener(eventName, handler, queue);
                } else if (this[offKeyValueSymbol]) {
                    canReflect.offKeyValue(this, eventName, handler, queue);
                } else if (this[offEventSymbol]) {
                    this[offEventSymbol](eventName, handler, queue);
                } else {
                    if (!eventName && this[offValueSymbol]) {
                        canReflect.offValue(this, handler, queue);
                    } else {
                        throw new Error('can-event-queue: Unable to unbind ' + eventName);
                    }
                }
            }
            return this;
        }
    };
    var symbols = {
        'can.onKeyValue': function (key, handler, queueName) {
            ensureMeta(this).handlers.add([
                key,
                'onKeyValue',
                queueName || 'mutate',
                handler
            ]);
        },
        'can.offKeyValue': function (key, handler, queueName) {
            ensureMeta(this).handlers.delete([
                key,
                'onKeyValue',
                queueName || 'mutate',
                handler
            ]);
        },
        'can.isBound': function () {
            return !ensureMeta(this).handlers.isEmpty();
        },
        'can.getWhatIChange': function getWhatIChange(key) {
        },
        'can.onPatches': function (handler, queue) {
            var handlers = ensureMeta(this).handlers;
            handlers.add([
                'can.patches',
                'onKeyValue',
                queue || 'notify',
                handler
            ]);
        },
        'can.offPatches': function (handler, queue) {
            var handlers = ensureMeta(this).handlers;
            handlers.delete([
                'can.patches',
                'onKeyValue',
                queue || 'notify',
                handler
            ]);
        }
    };
    function defineNonEnumerable(obj, prop, value) {
        Object.defineProperty(obj, prop, {
            enumerable: false,
            value: value
        });
    }
    legacyMapBindings = function (obj) {
        canReflect.assignMap(obj, props);
        return canReflect.assignSymbols(obj, symbols);
    };
    defineNonEnumerable(legacyMapBindings, 'addHandlers', addHandlers);
    defineNonEnumerable(legacyMapBindings, 'stopListeningArgumentsToKeys', stopListeningArgumentsToKeys);
    props.bind = props.addEventListener;
    props.unbind = props.removeEventListener;
    canReflect.assignMap(legacyMapBindings, props);
    canReflect.assignSymbols(legacyMapBindings, symbols);
    defineNonEnumerable(legacyMapBindings, 'start', function () {
        console.warn('use can-queues.batch.start()');
        queues.batch.start();
    });
    defineNonEnumerable(legacyMapBindings, 'stop', function () {
        console.warn('use can-queues.batch.stop()');
        queues.batch.stop();
    });
    defineNonEnumerable(legacyMapBindings, 'flush', function () {
        console.warn('use can-queues.flush()');
        queues.flush();
    });
    defineNonEnumerable(legacyMapBindings, 'afterPreviousEvents', function (handler) {
        console.warn('don\'t use afterPreviousEvents');
        queues.mutateQueue.enqueue(function afterPreviousEvents() {
            queues.mutateQueue.enqueue(handler);
        });
        queues.flush();
    });
    defineNonEnumerable(legacyMapBindings, 'after', function (handler) {
        console.warn('don\'t use after');
        queues.mutateQueue.enqueue(handler);
        queues.flush();
    });
    module.exports = legacyMapBindings;
});
/*can-observation-recorder@1.2.0#can-observation-recorder*/
define('can-observation-recorder', [
    'require',
    'exports',
    'module',
    'can-namespace',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var namespace = require('can-namespace');
    var canSymbol = require('can-symbol');
    var stack = [];
    var addParentSymbol = canSymbol.for('can.addParent');
    var ObservationRecorder = {
        stack: stack,
        start: function () {
            var deps = {
                keyDependencies: new Map(),
                valueDependencies: new Set(),
                childDependencies: new Set(),
                traps: null,
                ignore: 0
            };
            stack.push(deps);
            return deps;
        },
        stop: function () {
            return stack.pop();
        },
        add: function (obj, event) {
            var top = stack[stack.length - 1];
            if (top && top.ignore === 0) {
                if (top.traps) {
                    top.traps.push([
                        obj,
                        event
                    ]);
                } else {
                    if (event === undefined) {
                        top.valueDependencies.add(obj);
                    } else {
                        var eventSet = top.keyDependencies.get(obj);
                        if (!eventSet) {
                            eventSet = new Set();
                            top.keyDependencies.set(obj, eventSet);
                        }
                        eventSet.add(event);
                    }
                }
            }
        },
        addMany: function (observes) {
            var top = stack[stack.length - 1];
            if (top) {
                if (top.traps) {
                    top.traps.push.apply(top.traps, observes);
                } else {
                    for (var i = 0, len = observes.length; i < len; i++) {
                        this.add(observes[i][0], observes[i][1]);
                    }
                }
            }
        },
        created: function (obs) {
            var top = stack[stack.length - 1];
            if (top) {
                top.childDependencies.add(obs);
                if (obs[addParentSymbol]) {
                    obs[addParentSymbol](top);
                }
            }
        },
        ignore: function (fn) {
            return function () {
                if (stack.length) {
                    var top = stack[stack.length - 1];
                    top.ignore++;
                    var res = fn.apply(this, arguments);
                    top.ignore--;
                    return res;
                } else {
                    return fn.apply(this, arguments);
                }
            };
        },
        isRecording: function () {
            var len = stack.length;
            var last = len && stack[len - 1];
            return last && last.ignore === 0 && last;
        },
        makeDependenciesRecord: function () {
            return {
                traps: null,
                keyDependencies: new Map(),
                valueDependencies: new Set(),
                ignore: 0
            };
        },
        makeDependenciesRecorder: function () {
            return ObservationRecorder.makeDependenciesRecord();
        },
        trap: function () {
            if (stack.length) {
                var top = stack[stack.length - 1];
                var oldTraps = top.traps;
                var traps = top.traps = [];
                return function () {
                    top.traps = oldTraps;
                    return traps;
                };
            } else {
                return function () {
                    return [];
                };
            }
        },
        trapsCount: function () {
            if (stack.length) {
                var top = stack[stack.length - 1];
                return top.traps.length;
            } else {
                return 0;
            }
        }
    };
    if (namespace.ObservationRecorder) {
        throw new Error('You can\'t have two versions of can-observation-recorder, check your dependencies');
    } else {
        module.exports = namespace.ObservationRecorder = ObservationRecorder;
    }
});
/*can-kefir@1.1.0#can-kefir*/
define('can-kefir', [
    'require',
    'exports',
    'module',
    'kefir',
    'can-symbol',
    'can-reflect',
    'can-event-queue/map/map',
    'can-observation-recorder'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var Kefir = require('kefir');
        var canSymbol = require('can-symbol');
        var canReflect = require('can-reflect');
        var mapEventsMixin = require('can-event-queue/map/map');
        var ObservationRecorder = require('can-observation-recorder');
        var metaSymbol = canSymbol.for('can.meta');
        var onKeyValueSymbol = canSymbol.for('can.onKeyValue');
        var offKeyValueSymbol = canSymbol.for('can.offKeyValue');
        var keyNames = {
            value: {
                on: 'onValue',
                off: 'offValue',
                handler: 'onValueHandler',
                handlers: 'onValueHandlers'
            },
            error: {
                on: 'onError',
                off: 'offError',
                handler: 'onErrorHandler',
                handlers: 'onErrorHandlers'
            }
        };
        function ensureMeta(obj) {
            var meta = obj[metaSymbol];
            if (!meta) {
                meta = {};
                canReflect.setKeyValue(obj, metaSymbol, meta);
            }
            return meta;
        }
        function getCurrentValue(stream, key) {
            if (stream._currentEvent && stream._currentEvent.type === key) {
                return stream._currentEvent.value;
            } else {
                var names = keyNames[key];
                if (!names) {
                    return stream[key];
                }
                var VALUE, valueHandler = function (value) {
                        VALUE = value;
                    };
                stream[names.on](valueHandler);
                stream[names.off](valueHandler);
                return VALUE;
            }
        }
        if (Kefir) {
            Kefir.Observable.prototype._eventSetup = function eventSetup() {
                var stream = this;
                var meta = ensureMeta(stream);
                meta.bound = true;
                meta.onValueHandler = function onValueHandler(newValue) {
                    var oldValue = meta.value;
                    meta.value = newValue;
                    if (newValue !== oldValue) {
                        mapEventsMixin.dispatch.call(stream, { type: 'value' }, [
                            newValue,
                            oldValue
                        ]);
                    }
                };
                meta.onErrorHandler = function onErrorHandler(error) {
                    var prevError = meta.error;
                    meta.error = error;
                    mapEventsMixin.dispatch.call(stream, { type: 'error' }, [
                        error,
                        prevError
                    ]);
                };
                stream.onValue(meta.onValueHandler);
                stream.onError(meta.onErrorHandler);
            };
            Kefir.Observable.prototype._eventTeardown = function eventTeardown() {
                var stream = this;
                var meta = ensureMeta(stream);
                meta.bound = false;
                stream.offValue(meta.onValueHandler);
                stream.offError(meta.onErrorHandler);
            };
            canReflect.assignSymbols(Kefir.Observable.prototype, {
                'can.onKeyValue': function onKeyValue() {
                    return mapEventsMixin[onKeyValueSymbol].apply(this, arguments);
                },
                'can.offKeyValue': function () {
                    return mapEventsMixin[offKeyValueSymbol].apply(this, arguments);
                },
                'can.getKeyValue': function (key) {
                    var stream = this;
                    var meta = ensureMeta(stream);
                    if (!keyNames[key]) {
                        return stream[key];
                    }
                    ObservationRecorder.add(stream, key);
                    if (meta.bound) {
                        return meta[key];
                    } else {
                        var currentValue = getCurrentValue(stream, key);
                        meta[key] = currentValue;
                        return currentValue;
                    }
                },
                'can.getValueDependencies': function getValueDependencies() {
                    var sources;
                    var stream = this;
                    if (stream._source != null) {
                        sources = [stream._source];
                    } else if (stream._sources != null) {
                        sources = stream._sources;
                    }
                    if (sources != null) {
                        return { valueDependencies: new Set(sources) };
                    }
                }
            });
            Kefir.emitterProperty = function () {
                var emitter;
                var setLastValue = false;
                var lastValue, lastError;
                var stream = Kefir.stream(function (EMITTER) {
                    emitter = EMITTER;
                    if (setLastValue) {
                        emitter.value(lastValue);
                    }
                    return function () {
                        emitter = undefined;
                    };
                });
                var property = stream.toProperty(function () {
                    return lastValue;
                });
                property.emitter = {
                    value: function (newValue) {
                        if (emitter) {
                            return emitter.emit(newValue);
                        } else {
                            setLastValue = true;
                            lastValue = newValue;
                        }
                    },
                    error: function (error) {
                        if (emitter) {
                            return emitter.error(error);
                        } else {
                            lastError = error;
                        }
                    }
                };
                property.emitter.emit = property.emitter.value;
                canReflect.assignSymbols(property, {
                    'can.setKeyValue': function setKeyValue(key, value) {
                        this.emitter[key](value);
                    }
                });
                return property;
            };
        }
        module.exports = Kefir;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-define-lazy-value@1.1.0#define-lazy-value*/
define('can-define-lazy-value', function (require, exports, module) {
    'use strict';
    module.exports = function defineLazyValue(obj, prop, initializer, writable) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            get: function () {
                Object.defineProperty(this, prop, {
                    value: undefined,
                    writable: true
                });
                var value = initializer.call(this, obj, prop);
                Object.defineProperty(this, prop, {
                    value: value,
                    writable: !!writable
                });
                return value;
            },
            set: function (value) {
                Object.defineProperty(this, prop, {
                    value: value,
                    writable: !!writable
                });
                return value;
            }
        });
    };
});
/*can-event-queue@1.1.0#value/value*/
define('can-event-queue/value/value', [
    'require',
    'exports',
    'module',
    'can-queues',
    'can-key-tree',
    'can-reflect',
    'can-define-lazy-value',
    'can-event-queue/dependency-record/merge'
], function (require, exports, module) {
    'use strict';
    var queues = require('can-queues');
    var KeyTree = require('can-key-tree');
    var canReflect = require('can-reflect');
    var defineLazyValue = require('can-define-lazy-value');
    var mergeDependencyRecords = require('can-event-queue/dependency-record/merge');
    var properties = {
        on: function (handler, queue) {
            this.handlers.add([
                queue || 'mutate',
                handler
            ]);
        },
        off: function (handler, queueName) {
            if (handler === undefined) {
                if (queueName === undefined) {
                    this.handlers.delete([]);
                } else {
                    this.handlers.delete([queueName]);
                }
            } else {
                this.handlers.delete([
                    queueName || 'mutate',
                    handler
                ]);
            }
        }
    };
    var symbols = {
        'can.onValue': properties.on,
        'can.offValue': properties.off,
        'can.dispatch': function (value, old) {
            var queuesArgs = [];
            queuesArgs = [
                this.handlers.getNode([]),
                this,
                [
                    value,
                    old
                ]
            ];
            queues.enqueueByQueue.apply(queues, queuesArgs);
        },
        'can.getWhatIChange': function getWhatIChange() {
        },
        'can.isBound': function isBound() {
            return !this.handlers.isEmpty();
        }
    };
    function defineLazyHandlers() {
        return new KeyTree([
            Object,
            Array
        ], {
            onFirst: this.onBound !== undefined && this.onBound.bind(this),
            onEmpty: this.onUnbound !== undefined && this.onUnbound.bind(this)
        });
    }
    var mixinValueEventBindings = function (obj) {
        canReflect.assign(obj, properties);
        canReflect.assignSymbols(obj, symbols);
        defineLazyValue(obj, 'handlers', defineLazyHandlers, true);
        return obj;
    };
    mixinValueEventBindings.addHandlers = function (obj, callbacks) {
        console.warn('can-event-queue/value: Avoid using addHandlers. Add onBound and onUnbound methods instead.');
        obj.handlers = new KeyTree([
            Object,
            Array
        ], callbacks);
        return obj;
    };
    module.exports = mixinValueEventBindings;
});
/*can-observation@4.1.0#recorder-dependency-helpers*/
define('can-observation/recorder-dependency-helpers', [
    'require',
    'exports',
    'module',
    'can-reflect'
], function (require, exports, module) {
    'use strict';
    var canReflect = require('can-reflect');
    function addNewKeyDependenciesIfNotInOld(event) {
        if (this.oldEventSet === undefined || this.oldEventSet['delete'](event) === false) {
            canReflect.onKeyValue(this.observable, event, this.onDependencyChange, 'notify');
        }
    }
    function addObservablesNewKeyDependenciesIfNotInOld(eventSet, observable) {
        eventSet.forEach(addNewKeyDependenciesIfNotInOld, {
            onDependencyChange: this.onDependencyChange,
            observable: observable,
            oldEventSet: this.oldDependencies.keyDependencies.get(observable)
        });
    }
    function removeKeyDependencies(event) {
        canReflect.offKeyValue(this.observable, event, this.onDependencyChange, 'notify');
    }
    function removeObservablesKeyDependencies(oldEventSet, observable) {
        oldEventSet.forEach(removeKeyDependencies, {
            onDependencyChange: this.onDependencyChange,
            observable: observable
        });
    }
    function addValueDependencies(observable) {
        if (this.oldDependencies.valueDependencies.delete(observable) === false) {
            canReflect.onValue(observable, this.onDependencyChange, 'notify');
        }
    }
    function removeValueDependencies(observable) {
        canReflect.offValue(observable, this.onDependencyChange, 'notify');
    }
    module.exports = {
        updateObservations: function (observationData) {
            observationData.newDependencies.keyDependencies.forEach(addObservablesNewKeyDependenciesIfNotInOld, observationData);
            observationData.oldDependencies.keyDependencies.forEach(removeObservablesKeyDependencies, observationData);
            observationData.newDependencies.valueDependencies.forEach(addValueDependencies, observationData);
            observationData.oldDependencies.valueDependencies.forEach(removeValueDependencies, observationData);
        },
        stopObserving: function (observationReciever, onDependencyChange) {
            observationReciever.keyDependencies.forEach(removeObservablesKeyDependencies, { onDependencyChange: onDependencyChange });
            observationReciever.valueDependencies.forEach(removeValueDependencies, { onDependencyChange: onDependencyChange });
        }
    };
});
/*can-observation@4.1.0#temporarily-bind*/
define('can-observation/temporarily-bind', [
    'require',
    'exports',
    'module',
    'can-reflect'
], function (require, exports, module) {
    'use strict';
    var canReflect = require('can-reflect');
    var temporarilyBoundNoOperation = function () {
    };
    var observables;
    var unbindTemporarilyBoundValue = function () {
        for (var i = 0, len = observables.length; i < len; i++) {
            canReflect.offValue(observables[i], temporarilyBoundNoOperation);
        }
        observables = null;
    };
    function temporarilyBind(compute) {
        var computeInstance = compute.computeInstance || compute;
        canReflect.onValue(computeInstance, temporarilyBoundNoOperation);
        if (!observables) {
            observables = [];
            setTimeout(unbindTemporarilyBoundValue, 10);
        }
        observables.push(computeInstance);
    }
    module.exports = temporarilyBind;
});
/*can-observation@4.1.0#can-observation*/
define('can-observation', [
    'require',
    'exports',
    'module',
    'can-namespace',
    'can-reflect',
    'can-queues',
    'can-observation-recorder',
    'can-symbol',
    'can-log/dev/dev',
    'can-event-queue/value/value',
    'can-observation/recorder-dependency-helpers',
    'can-observation/temporarily-bind'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var namespace = require('can-namespace');
        var canReflect = require('can-reflect');
        var queues = require('can-queues');
        var ObservationRecorder = require('can-observation-recorder');
        var canSymbol = require('can-symbol');
        var dev = require('can-log/dev/dev');
        var valueEventBindings = require('can-event-queue/value/value');
        var recorderHelpers = require('can-observation/recorder-dependency-helpers');
        var temporarilyBind = require('can-observation/temporarily-bind');
        var dispatchSymbol = canSymbol.for('can.dispatch');
        var getChangesSymbol = canSymbol.for('can.getChangesDependencyRecord');
        var getValueDependenciesSymbol = canSymbol.for('can.getValueDependencies');
        function Observation(func, context, options) {
            this.func = func;
            this.context = context;
            this.options = options || {
                priority: 0,
                isObservable: true
            };
            this.bound = false;
            this._value = undefined;
            this.newDependencies = ObservationRecorder.makeDependenciesRecord();
            this.oldDependencies = null;
            var self = this;
            this.onDependencyChange = function (newVal) {
                self.dependencyChange(this, newVal);
            };
            this.update = this.update.bind(this);
        }
        valueEventBindings(Observation.prototype);
        canReflect.assign(Observation.prototype, {
            onBound: function () {
                this.bound = true;
                this.oldDependencies = this.newDependencies;
                ObservationRecorder.start();
                this._value = this.func.call(this.context);
                this.newDependencies = ObservationRecorder.stop();
                recorderHelpers.updateObservations(this);
            },
            dependencyChange: function (context, args) {
                if (this.bound === true) {
                    var queuesArgs = [];
                    queuesArgs = [
                        this.update,
                        this,
                        [],
                        { priority: this.options.priority }
                    ];
                    queues.deriveQueue.enqueue.apply(queues.deriveQueue, queuesArgs);
                }
            },
            update: function () {
                if (this.bound === true) {
                    var oldValue = this._value;
                    this.oldValue = null;
                    this.onBound();
                    if (oldValue !== this._value) {
                        this[dispatchSymbol](this._value, oldValue);
                    }
                }
            },
            onUnbound: function () {
                this.bound = false;
                recorderHelpers.stopObserving(this.newDependencies, this.onDependencyChange);
                this.newDependencies = ObservationRecorder.makeDependenciesRecorder();
            },
            get: function () {
                if (this.options.isObservable && ObservationRecorder.isRecording()) {
                    ObservationRecorder.add(this);
                    if (!this.bound) {
                        Observation.temporarilyBind(this);
                    }
                }
                if (this.bound === true) {
                    if (queues.deriveQueue.tasksRemainingCount() > 0) {
                        Observation.updateChildrenAndSelf(this);
                    }
                    return this._value;
                } else {
                    return this.func.call(this.context);
                }
            },
            hasDependencies: function () {
                var newDependencies = this.newDependencies;
                return this.bound ? newDependencies.valueDependencies.size + newDependencies.keyDependencies.size > 0 : undefined;
            },
            log: function () {
            }
        });
        Object.defineProperty(Observation.prototype, 'value', {
            get: function () {
                return this.get();
            }
        });
        var observationProto = {
            'can.getValue': Observation.prototype.get,
            'can.isValueLike': true,
            'can.isMapLike': false,
            'can.isListLike': false,
            'can.valueHasDependencies': Observation.prototype.hasDependencies,
            'can.getValueDependencies': function () {
                if (this.bound === true) {
                    var deps = this.newDependencies, result = {};
                    if (deps.keyDependencies.size) {
                        result.keyDependencies = deps.keyDependencies;
                    }
                    if (deps.valueDependencies.size) {
                        result.valueDependencies = deps.valueDependencies;
                    }
                    return result;
                }
                return undefined;
            },
            'can.getPriority': function () {
                return this.options.priority;
            },
            'can.setPriority': function (priority) {
                this.options.priority = priority;
            }
        };
        canReflect.assignSymbols(Observation.prototype, observationProto);
        Observation.updateChildrenAndSelf = function (observation) {
            if (observation.update !== undefined && queues.deriveQueue.isEnqueued(observation.update) === true) {
                queues.deriveQueue.flushQueuedTask(observation.update);
                return true;
            }
            if (observation[getValueDependenciesSymbol]) {
                var childHasChanged = false;
                var valueDependencies = observation[getValueDependenciesSymbol]().valueDependencies || [];
                valueDependencies.forEach(function (observable) {
                    if (Observation.updateChildrenAndSelf(observable) === true) {
                        childHasChanged = true;
                    }
                });
                return childHasChanged;
            } else {
                return false;
            }
        };
        var alias = { addAll: 'addMany' };
        [
            'add',
            'addAll',
            'ignore',
            'trap',
            'trapsCount',
            'isRecording'
        ].forEach(function (methodName) {
            Observation[methodName] = function () {
                var name = alias[methodName] ? alias[methodName] : methodName;
                console.warn('can-observation: Call ' + name + '() on can-observation-recorder.');
                return ObservationRecorder[name].apply(this, arguments);
            };
        });
        Observation.prototype.start = function () {
            console.warn('can-observation: Use .on and .off to bind.');
            return this.onBound();
        };
        Observation.prototype.stop = function () {
            console.warn('can-observation: Use .on and .off to bind.');
            return this.onUnbound();
        };
        Observation.temporarilyBind = temporarilyBind;
        module.exports = namespace.Observation = Observation;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-reflect-promise@2.1.0#can-reflect-promise*/
define('can-reflect-promise', [
    'require',
    'exports',
    'module',
    'can-reflect',
    'can-symbol',
    'can-observation-recorder',
    'can-queues',
    'can-key-tree',
    'can-log/dev/dev'
], function (require, exports, module) {
    'use strict';
    var canReflect = require('can-reflect');
    var canSymbol = require('can-symbol');
    var ObservationRecorder = require('can-observation-recorder');
    var queues = require('can-queues');
    var KeyTree = require('can-key-tree');
    var dev = require('can-log/dev/dev');
    var getKeyValueSymbol = canSymbol.for('can.getKeyValue'), observeDataSymbol = canSymbol.for('can.meta');
    var promiseDataPrototype = {
        isPending: true,
        state: 'pending',
        isResolved: false,
        isRejected: false,
        value: undefined,
        reason: undefined
    };
    function setVirtualProp(promise, property, value) {
        var observeData = promise[observeDataSymbol];
        var old = observeData[property];
        observeData[property] = value;
        queues.enqueueByQueue(observeData.handlers.getNode([property]), promise, [
            value,
            old
        ], function () {
            return {};
        }, [
            'Promise',
            promise,
            'resolved with value',
            value,
            'and changed virtual property: ' + property
        ]);
    }
    function initPromise(promise) {
        var observeData = promise[observeDataSymbol];
        if (!observeData) {
            Object.defineProperty(promise, observeDataSymbol, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: Object.create(promiseDataPrototype)
            });
            observeData = promise[observeDataSymbol];
            observeData.handlers = new KeyTree([
                Object,
                Object,
                Array
            ]);
        }
        promise.then(function (value) {
            queues.batch.start();
            setVirtualProp(promise, 'isPending', false);
            setVirtualProp(promise, 'isResolved', true);
            setVirtualProp(promise, 'value', value);
            setVirtualProp(promise, 'state', 'resolved');
            queues.batch.stop();
        }, function (reason) {
            queues.batch.start();
            setVirtualProp(promise, 'isPending', false);
            setVirtualProp(promise, 'isRejected', true);
            setVirtualProp(promise, 'reason', reason);
            setVirtualProp(promise, 'state', 'rejected');
            queues.batch.stop();
        });
    }
    function setupPromise(value) {
        var oldPromiseFn;
        var proto = 'getPrototypeOf' in Object ? Object.getPrototypeOf(value) : value.__proto__;
        if (value[getKeyValueSymbol] && value[observeDataSymbol]) {
            return;
        }
        if (proto === null || proto === Object.prototype) {
            proto = value;
            if (typeof proto.promise === 'function') {
                oldPromiseFn = proto.promise;
                proto.promise = function () {
                    var result = oldPromiseFn.call(proto);
                    setupPromise(result);
                    return result;
                };
            }
        }
        canReflect.assignSymbols(proto, {
            'can.getKeyValue': function (key) {
                if (!this[observeDataSymbol]) {
                    initPromise(this);
                }
                ObservationRecorder.add(this, key);
                switch (key) {
                case 'state':
                case 'isPending':
                case 'isResolved':
                case 'isRejected':
                case 'value':
                case 'reason':
                    return this[observeDataSymbol][key];
                default:
                    return this[key];
                }
            },
            'can.getValue': function () {
                return this[getKeyValueSymbol]('value');
            },
            'can.isValueLike': false,
            'can.onKeyValue': function (key, handler, queue) {
                if (!this[observeDataSymbol]) {
                    initPromise(this);
                }
                this[observeDataSymbol].handlers.add([
                    key,
                    queue || 'mutate',
                    handler
                ]);
            },
            'can.offKeyValue': function (key, handler, queue) {
                if (!this[observeDataSymbol]) {
                    initPromise(this);
                }
                this[observeDataSymbol].handlers.delete([
                    key,
                    queue || 'mutate',
                    handler
                ]);
            }
        });
    }
    module.exports = setupPromise;
});
/*can-stache-key@1.3.2#can-stache-key*/
define('can-stache-key', [
    'require',
    'exports',
    'module',
    'can-observation-recorder',
    'can-log/dev/dev',
    'can-symbol',
    'can-reflect',
    'can-reflect-promise'
], function (require, exports, module) {
    var ObservationRecorder = require('can-observation-recorder');
    var dev = require('can-log/dev/dev');
    var canSymbol = require('can-symbol');
    var canReflect = require('can-reflect');
    var canReflectPromise = require('can-reflect-promise');
    var getValueSymbol = canSymbol.for('can.getValue');
    var setValueSymbol = canSymbol.for('can.setValue');
    var isValueLikeSymbol = canSymbol.for('can.isValueLike');
    var peek = ObservationRecorder.ignore(canReflect.getKeyValue.bind(canReflect));
    var observeReader;
    var bindName = Function.prototype.bind;
    var isAt = function (index, reads) {
        var prevRead = reads[index - 1];
        return prevRead && prevRead.at;
    };
    var readValue = function (value, index, reads, options, state, prev) {
        var usedValueReader;
        do {
            usedValueReader = false;
            for (var i = 0, len = observeReader.valueReaders.length; i < len; i++) {
                if (observeReader.valueReaders[i].test(value, index, reads, options)) {
                    value = observeReader.valueReaders[i].read(value, index, reads, options, state, prev);
                }
            }
        } while (usedValueReader);
        return value;
    };
    var specialRead = {
        index: true,
        key: true,
        event: true,
        element: true,
        viewModel: true
    };
    var checkForObservableAndNotify = function (options, state, getObserves, value, index) {
        if (options.foundObservable && !state.foundObservable) {
            if (ObservationRecorder.trapsCount()) {
                ObservationRecorder.addMany(getObserves());
                options.foundObservable(value, index);
                state.foundObservable = true;
            }
        }
    };
    var objHasKeyAtIndex = function (obj, reads, index) {
        return !!(reads && reads.length && canReflect.hasKey(obj, reads[index].key));
    };
    observeReader = {
        read: function (parent, reads, options) {
            options = options || {};
            var state = { foundObservable: false };
            var getObserves;
            if (options.foundObservable) {
                getObserves = ObservationRecorder.trap();
            }
            var cur = readValue(parent, 0, reads, options, state), type, prev, readLength = reads.length, i = 0, last, parentHasKey;
            checkForObservableAndNotify(options, state, getObserves, parent, 0);
            while (i < readLength) {
                prev = cur;
                for (var r = 0, readersLength = observeReader.propertyReaders.length; r < readersLength; r++) {
                    var reader = observeReader.propertyReaders[r];
                    if (reader.test(cur)) {
                        cur = reader.read(cur, reads[i], i, options, state);
                        break;
                    }
                }
                checkForObservableAndNotify(options, state, getObserves, prev, i);
                last = cur;
                i = i + 1;
                cur = readValue(cur, i, reads, options, state, prev);
                checkForObservableAndNotify(options, state, getObserves, prev, i - 1);
                type = typeof cur;
                if (i < reads.length && (cur === null || cur === undefined)) {
                    parentHasKey = objHasKeyAtIndex(prev, reads, i - 1);
                    if (options.earlyExit && !parentHasKey) {
                        options.earlyExit(prev, i - 1, cur);
                    }
                    return {
                        value: undefined,
                        parent: prev,
                        parentHasKey: parentHasKey,
                        foundLastParent: false
                    };
                }
            }
            parentHasKey = objHasKeyAtIndex(prev, reads, reads.length - 1);
            if (cur === undefined && !parentHasKey) {
                if (options.earlyExit) {
                    options.earlyExit(prev, i - 1);
                }
            }
            return {
                value: cur,
                parent: prev,
                parentHasKey: parentHasKey,
                foundLastParent: true
            };
        },
        get: function (parent, reads, options) {
            return observeReader.read(parent, observeReader.reads(reads), options || {}).value;
        },
        valueReadersMap: {},
        valueReaders: [
            {
                name: 'function',
                test: function (value) {
                    return value && canReflect.isFunctionLike(value) && !canReflect.isConstructorLike(value);
                },
                read: function (value, i, reads, options, state, prev) {
                    if (options.callMethodsOnObservables && canReflect.isObservableLike(prev) && canReflect.isMapLike(prev)) {
                        dev.warn('can-stache-key: read() called with `callMethodsOnObservables: true`.');
                        return value.apply(prev, options.args || []);
                    }
                    return options.proxyMethods !== false ? bindName.call(value, prev) : value;
                }
            },
            {
                name: 'isValueLike',
                test: function (value, i, reads, options) {
                    return value && value[getValueSymbol] && value[isValueLikeSymbol] !== false && (options.foundAt || !isAt(i, reads));
                },
                read: function (value, i, reads, options) {
                    if (options.readCompute === false && i === reads.length) {
                        return value;
                    }
                    return canReflect.getValue(value);
                },
                write: function (base, newVal) {
                    if (base[setValueSymbol]) {
                        base[setValueSymbol](newVal);
                    } else if (base.set) {
                        base.set(newVal);
                    } else {
                        base(newVal);
                    }
                }
            }
        ],
        propertyReadersMap: {},
        propertyReaders: [
            {
                name: 'map',
                test: function (value) {
                    if (canReflect.isPromise(value) || typeof value === 'object' && value && typeof value.then === 'function') {
                        canReflectPromise(value);
                    }
                    return canReflect.isObservableLike(value) && canReflect.isMapLike(value);
                },
                read: function (value, prop) {
                    var res = canReflect.getKeyValue(value, prop.key);
                    if (res !== undefined) {
                        return res;
                    } else {
                        return value[prop.key];
                    }
                },
                write: canReflect.setKeyValue
            },
            {
                name: 'object',
                test: function () {
                    return true;
                },
                read: function (value, prop, i, options) {
                    if (value == null) {
                        return undefined;
                    } else {
                        if (typeof value === 'object') {
                            if (prop.key in value) {
                                return value[prop.key];
                            }
                        } else {
                            return value[prop.key];
                        }
                    }
                },
                write: function (base, prop, newVal) {
                    var propValue = base[prop];
                    if (newVal != null && typeof newVal === 'object' && canReflect.isMapLike(propValue)) {
                        dev.warn('can-stache-key: Merging data into "' + prop + '" because its parent is non-observable');
                        canReflect.update(propValue, newVal);
                    } else if (propValue != null && propValue[setValueSymbol] !== undefined) {
                        canReflect.setValue(propValue, newVal);
                    } else {
                        base[prop] = newVal;
                    }
                }
            }
        ],
        reads: function (keyArg) {
            var key = '' + keyArg;
            var keys = [];
            var last = 0;
            var at = false;
            if (key.charAt(0) === '@') {
                last = 1;
                at = true;
            }
            var keyToAdd = '';
            for (var i = last; i < key.length; i++) {
                var character = key.charAt(i);
                if (character === '.' || character === '@') {
                    if (key.charAt(i - 1) !== '\\') {
                        keys.push({
                            key: keyToAdd,
                            at: at
                        });
                        at = character === '@';
                        keyToAdd = '';
                    } else {
                        keyToAdd = keyToAdd.substr(0, keyToAdd.length - 1) + '.';
                    }
                } else {
                    keyToAdd += character;
                }
            }
            keys.push({
                key: keyToAdd,
                at: at
            });
            return keys;
        },
        write: function (parent, key, value, options) {
            var keys = typeof key === 'string' ? observeReader.reads(key) : key;
            var last;
            options = options || {};
            if (keys.length > 1) {
                last = keys.pop();
                parent = observeReader.read(parent, keys, options).value;
                keys.push(last);
            } else {
                last = keys[0];
            }
            if (!parent) {
                return;
            }
            var keyValue = peek(parent, last.key);
            if (observeReader.valueReadersMap.isValueLike.test(keyValue, keys.length - 1, keys, options)) {
                observeReader.valueReadersMap.isValueLike.write(keyValue, value, options);
            } else {
                if (observeReader.valueReadersMap.isValueLike.test(parent, keys.length - 1, keys, options)) {
                    parent = parent[getValueSymbol]();
                }
                if (observeReader.propertyReadersMap.map.test(parent)) {
                    observeReader.propertyReadersMap.map.write(parent, last.key, value, options);
                } else if (observeReader.propertyReadersMap.object.test(parent)) {
                    observeReader.propertyReadersMap.object.write(parent, last.key, value, options);
                    if (options.observation) {
                        options.observation.update();
                    }
                }
            }
        }
    };
    observeReader.propertyReaders.forEach(function (reader) {
        observeReader.propertyReadersMap[reader.name] = reader;
    });
    observeReader.valueReaders.forEach(function (reader) {
        observeReader.valueReadersMap[reader.name] = reader;
    });
    observeReader.set = observeReader.write;
    module.exports = observeReader;
});
/*can-key@1.0.0#utils*/
define('can-key/utils', function (require, exports, module) {
    var utils = {
        isContainer: function (current) {
            var type = typeof current;
            return current && (type === 'object' || type === 'function');
        },
        strReplacer: /\{([^\}]+)\}/g,
        parts: function (name) {
            if (Array.isArray(name)) {
                return name;
            } else {
                return typeof name !== 'undefined' ? (name + '').replace(/\[/g, '.').replace(/]/g, '').split('.') : [];
            }
        }
    };
    module.exports = utils;
});
/*can-key@1.0.0#get/get*/
define('can-key/get/get', [
    'require',
    'exports',
    'module',
    'can-reflect',
    'can-key/utils'
], function (require, exports, module) {
    'use strict';
    var canReflect = require('can-reflect');
    var utils = require('can-key/utils');
    function get(obj, name) {
        var parts = utils.parts(name);
        var length = parts.length, current, i, container;
        if (!length) {
            return obj;
        }
        current = obj;
        for (i = 0; i < length && utils.isContainer(current) && current !== null; i++) {
            container = current;
            current = canReflect.getKeyValue(container, parts[i]);
        }
        return current;
    }
    module.exports = get;
});
/*can-cid@1.1.2#can-cid*/
define('can-cid', [
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    var namespace = require('can-namespace');
    var _cid = 0;
    var domExpando = 'can' + new Date();
    var cid = function (object, name) {
        var propertyName = object.nodeName ? domExpando : '_cid';
        if (!object[propertyName]) {
            _cid++;
            object[propertyName] = (name || '') + _cid;
        }
        return object[propertyName];
    };
    cid.domExpando = domExpando;
    cid.get = function (object) {
        var type = typeof object;
        var isObject = type !== null && (type === 'object' || type === 'function');
        return isObject ? cid(object) : type + ':' + object;
    };
    if (namespace.cid) {
        throw new Error('You can\'t have two versions of can-cid, check your dependencies');
    } else {
        module.exports = namespace.cid = cid;
    }
});
/*can-single-reference@1.0.0#can-single-reference*/
define('can-single-reference', [
    'require',
    'exports',
    'module',
    'can-cid'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        var CID = require('can-cid');
        var singleReference;
        function getKeyName(key, extraKey) {
            var keyName = extraKey ? CID(key) + ':' + extraKey : CID(key);
            return keyName || key;
        }
        singleReference = {
            set: function (obj, key, value, extraKey) {
                obj[getKeyName(key, extraKey)] = value;
            },
            getAndDelete: function (obj, key, extraKey) {
                var keyName = getKeyName(key, extraKey);
                var value = obj[keyName];
                delete obj[keyName];
                return value;
            }
        };
        module.exports = singleReference;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-compute@4.1.0#proto-compute*/
define('can-compute/proto-compute', [
    'require',
    'exports',
    'module',
    'can-observation',
    'can-observation-recorder',
    'can-event-queue/map/map',
    'can-stache-key',
    'can-key/get/get',
    'can-assign',
    'can-reflect',
    'can-single-reference'
], function (require, exports, module) {
    'use strict';
    var Observation = require('can-observation');
    var ObservationRecorder = require('can-observation-recorder');
    var eventQueue = require('can-event-queue/map/map');
    var observeReader = require('can-stache-key');
    var getObject = require('can-key/get/get');
    var assign = require('can-assign');
    var canReflect = require('can-reflect');
    var singleReference = require('can-single-reference');
    var Compute = function (getterSetter, context, eventName, bindOnce) {
        var args = [];
        for (var i = 0, arglen = arguments.length; i < arglen; i++) {
            args[i] = arguments[i];
        }
        var contextType = typeof args[1];
        if (typeof args[0] === 'function') {
            this._setupGetterSetterFn(args[0], args[1], args[2], args[3]);
        } else if (args[1] !== undefined) {
            if (contextType === 'string' || contextType === 'number') {
                var isListLike = canReflect.isObservableLike(args[0]) && canReflect.isListLike(args[0]);
                var isMapLike = canReflect.isObservableLike(args[0]) && canReflect.isMapLike(args[0]);
                if (isMapLike || isListLike) {
                    var map = args[0];
                    var propertyName = args[1];
                    var mapGetterSetter = function (newValue) {
                        if (arguments.length) {
                            observeReader.set(map, propertyName, newValue);
                        } else {
                            if (isListLike) {
                                observeReader.get(map, 'length');
                            }
                            return observeReader.get(map, '' + propertyName);
                        }
                    };
                    this._setupGetterSetterFn(mapGetterSetter, args[1], args[2], args[3]);
                } else {
                    this._setupProperty(args[0], args[1], args[2]);
                }
            } else if (contextType === 'function') {
                this._setupSetter(args[0], args[1], args[2]);
            } else {
                if (args[1] && args[1].fn) {
                    this._setupAsyncCompute(args[0], args[1]);
                } else {
                    this._setupSettings(args[0], args[1]);
                }
            }
        } else {
            this._setupSimpleValue(args[0]);
        }
        this._args = args;
        this._primaryDepth = 0;
        this.isComputed = true;
    };
    var updateOnChange = function (compute, newValue, oldValue, batchNum) {
        var valueChanged = newValue !== oldValue && !(newValue !== newValue && oldValue !== oldValue);
        if (valueChanged) {
            compute.dispatch({
                type: 'change',
                batchNum: batchNum
            }, [
                newValue,
                oldValue
            ]);
        }
    };
    var setupComputeHandlers = function (compute, func, context) {
        var observation = new Observation(func, context, compute);
        var updater = compute.updater.bind(compute);
        compute.observation = observation;
        return {
            _on: function () {
                canReflect.onValue(observation, updater, 'notify');
                if (observation.hasOwnProperty('_value')) {
                    compute.value = observation._value;
                } else {
                    compute.value = observation.value;
                }
            },
            _off: function () {
                canReflect.offValue(observation, updater, 'notify');
            },
            getDepth: function () {
                return observation.getDepth();
            }
        };
    };
    eventQueue(Compute.prototype);
    assign(Compute.prototype, {
        setPrimaryDepth: function (depth) {
            this._primaryDepth = depth;
        },
        _setupGetterSetterFn: function (getterSetter, context, eventName) {
            this._set = context ? getterSetter.bind(context) : getterSetter;
            this._get = context ? getterSetter.bind(context) : getterSetter;
            this._canObserve = eventName === false ? false : true;
            var handlers = setupComputeHandlers(this, getterSetter, context || this);
            assign(this, handlers);
        },
        _setupProperty: function (target, propertyName, eventName) {
            var self = this, handler;
            handler = function () {
                self.updater(self._get(), self.value);
            };
            this._get = function () {
                return getObject(target, propertyName);
            };
            this._set = function (value) {
                var properties = propertyName.split('.'), leafPropertyName = properties.pop();
                if (properties.length) {
                    var targetProperty = getObject(target, properties.join('.'));
                    targetProperty[leafPropertyName] = value;
                } else {
                    target[propertyName] = value;
                }
            };
            this._on = function (update) {
                eventQueue.on.call(target, eventName || propertyName, handler);
                this.value = this._get();
            };
            this._off = function () {
                return eventQueue.off.call(target, eventName || propertyName, handler);
            };
        },
        _setupSetter: function (initialValue, setter, eventName) {
            this.value = initialValue;
            this._set = setter;
            assign(this, eventName);
        },
        _setupSettings: function (initialValue, settings) {
            this.value = initialValue;
            this._set = settings.set || this._set;
            this._get = settings.get || this._get;
            if (!settings.__selfUpdater) {
                var self = this, oldUpdater = this.updater;
                this.updater = function () {
                    oldUpdater.call(self, self._get(), self.value);
                };
            }
            this._on = settings.on ? settings.on : this._on;
            this._off = settings.off ? settings.off : this._off;
        },
        _setupAsyncCompute: function (initialValue, settings) {
            var self = this;
            var getter = settings.fn;
            var bindings;
            this.value = initialValue;
            this._setUpdates = true;
            this.lastSetValue = new Compute(initialValue);
            this._set = function (newVal) {
                if (newVal === self.lastSetValue.get()) {
                    return this.value;
                }
                return self.lastSetValue.set(newVal);
            };
            this._get = function () {
                return getter.call(settings.context, self.lastSetValue.get());
            };
            if (getter.length === 0) {
                bindings = setupComputeHandlers(this, getter, settings.context);
            } else if (getter.length === 1) {
                bindings = setupComputeHandlers(this, function () {
                    return getter.call(settings.context, self.lastSetValue.get());
                }, settings);
            } else {
                var oldUpdater = this.updater, resolve = ObservationRecorder.ignore(function (newVal) {
                        oldUpdater.call(self, newVal, self.value);
                    });
                this.updater = function (newVal) {
                    oldUpdater.call(self, newVal, self.value);
                };
                bindings = setupComputeHandlers(this, function () {
                    var res = getter.call(settings.context, self.lastSetValue.get(), resolve);
                    return res !== undefined ? res : this.value;
                }, this);
            }
            assign(this, bindings);
        },
        _setupSimpleValue: function (initialValue) {
            this.value = initialValue;
        },
        _eventSetup: ObservationRecorder.ignore(function () {
            this.bound = true;
            this._on(this.updater);
        }),
        _eventTeardown: function () {
            this._off(this.updater);
            this.bound = false;
        },
        clone: function (context) {
            if (context && typeof this._args[0] === 'function') {
                this._args[1] = context;
            } else if (context) {
                this._args[2] = context;
            }
            return new Compute(this._args[0], this._args[1], this._args[2], this._args[3]);
        },
        _on: function () {
        },
        _off: function () {
        },
        get: function () {
            var recordingObservation = ObservationRecorder.isRecording();
            if (recordingObservation && this._canObserve !== false) {
                ObservationRecorder.add(this, 'change');
                if (!this.bound) {
                    Compute.temporarilyBind(this);
                }
            }
            if (this.bound) {
                if (this.observation) {
                    return this.observation.get();
                } else {
                    return this.value;
                }
            } else {
                return this._get();
            }
        },
        _get: function () {
            return this.value;
        },
        set: function (newVal) {
            var old = this.value;
            var setVal = this._set(newVal, old);
            if (this._setUpdates) {
                return this.value;
            }
            if (this.hasDependencies) {
                return this._get();
            }
            this.updater(setVal === undefined ? this._get() : setVal, old);
            return this.value;
        },
        _set: function (newVal) {
            return this.value = newVal;
        },
        updater: function (newVal, oldVal, batchNum) {
            this.value = newVal;
            var observation = this.observation;
            if (observation) {
                if (observation.hasOwnProperty('_value')) {
                    observation._value = newVal;
                } else {
                    observation.value = newVal;
                }
            }
            updateOnChange(this, newVal, oldVal, batchNum);
        },
        toFunction: function () {
            return this._computeFn.bind(this);
        },
        _computeFn: function (newVal) {
            if (arguments.length) {
                return this.set(newVal);
            }
            return this.get();
        }
    });
    Compute.prototype.on = Compute.prototype.bind = Compute.prototype.addEventListener;
    Compute.prototype.off = Compute.prototype.unbind = Compute.prototype.removeEventListener;
    var hasDependencies = function hasDependencies() {
        return this.observation && this.observation.hasDependencies();
    };
    Object.defineProperty(Compute.prototype, 'hasDependencies', { get: hasDependencies });
    Compute.temporarilyBind = Observation.temporarilyBind;
    Compute.async = function (initialValue, asyncComputer, context) {
        return new Compute(initialValue, {
            fn: asyncComputer,
            context: context
        });
    };
    Compute.truthy = function (compute) {
        return new Compute(function () {
            var res = compute.get();
            if (typeof res === 'function') {
                res = res.get();
            }
            return !!res;
        });
    };
    canReflect.assignSymbols(Compute.prototype, {
        'can.isValueLike': true,
        'can.isMapLike': false,
        'can.isListLike': false,
        'can.setValue': Compute.prototype.set,
        'can.getValue': Compute.prototype.get,
        'can.valueHasDependencies': hasDependencies,
        'can.onValue': function onValue(handler, queue) {
            function translationHandler(ev, newValue, oldValue) {
                handler(newValue, oldValue);
            }
            singleReference.set(handler, this, translationHandler);
            this.addEventListener('change', translationHandler, queue);
        },
        'can.offValue': function offValue(handler, queue) {
            this.removeEventListener('change', singleReference.getAndDelete(handler, this), queue);
        },
        'can.getValueDependencies': function getValueDependencies() {
            var ret;
            if (this.observation) {
                ret = { valueDependencies: new Set([this.observation]) };
            }
            return ret;
        }
    });
    module.exports = exports = Compute;
});
/*can-compute@4.1.0#can-compute*/
define('can-compute', [
    'require',
    'exports',
    'module',
    'can-compute/proto-compute',
    'can-namespace',
    'can-single-reference',
    'can-reflect/reflections/get-set/get-set',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var Compute = require('can-compute/proto-compute');
    var namespace = require('can-namespace');
    var singleReference = require('can-single-reference');
    var canReflect = require('can-reflect/reflections/get-set/get-set');
    var canSymbol = require('can-symbol');
    var canOnValueSymbol = canSymbol.for('can.onValue'), canOffValueSymbol = canSymbol.for('can.offValue'), canGetValue = canSymbol.for('can.getValue'), canSetValue = canSymbol.for('can.setValue'), isValueLike = canSymbol.for('can.isValueLike'), isMapLike = canSymbol.for('can.isMapLike'), isListLike = canSymbol.for('can.isListLike'), isFunctionLike = canSymbol.for('can.isFunctionLike'), canValueHasDependencies = canSymbol.for('can.valueHasDependencies'), canGetValueDependencies = canSymbol.for('can.getValueDependencies');
    var addEventListener = function (ev, handler) {
        var compute = this;
        var translationHandler;
        if (handler) {
            translationHandler = function () {
                handler.apply(compute, arguments);
            };
            singleReference.set(handler, this, translationHandler);
        }
        return compute.computeInstance.addEventListener(ev, translationHandler);
    };
    var removeEventListener = function (ev, handler) {
        var args = [];
        if (typeof ev !== 'undefined') {
            args.push(ev);
            if (typeof handler !== 'undefined') {
                args.push(singleReference.getAndDelete(handler, this));
            }
        }
        return this.computeInstance.removeEventListener.apply(this.computeInstance, args);
    };
    var onValue = function (handler, queue) {
            return this.computeInstance[canOnValueSymbol](handler, queue);
        }, offValue = function (handler, queue) {
            return this.computeInstance[canOffValueSymbol](handler, queue);
        }, getValue = function () {
            return this.computeInstance.get();
        }, setValue = function (value) {
            return this.computeInstance.set(value);
        }, hasDependencies = function () {
            return this.computeInstance.hasDependencies;
        }, getDependencies = function () {
            return this.computeInstance[canGetValueDependencies]();
        };
    var COMPUTE = function (getterSetter, context, eventName, bindOnce) {
        function compute(val) {
            if (arguments.length) {
                return compute.computeInstance.set(val);
            }
            return compute.computeInstance.get();
        }
        compute.computeInstance = new Compute(getterSetter, context, eventName, bindOnce);
        compute.on = compute.bind = compute.addEventListener = addEventListener;
        compute.off = compute.unbind = compute.removeEventListener = removeEventListener;
        compute.isComputed = compute.computeInstance.isComputed;
        compute.clone = function (ctx) {
            if (typeof getterSetter === 'function') {
                context = ctx;
            }
            return COMPUTE(getterSetter, context, ctx, bindOnce);
        };
        canReflect.set(compute, canOnValueSymbol, onValue);
        canReflect.set(compute, canOffValueSymbol, offValue);
        canReflect.set(compute, canGetValue, getValue);
        canReflect.set(compute, canSetValue, setValue);
        canReflect.set(compute, isValueLike, true);
        canReflect.set(compute, isMapLike, false);
        canReflect.set(compute, isListLike, false);
        canReflect.set(compute, isFunctionLike, false);
        canReflect.set(compute, canValueHasDependencies, hasDependencies);
        canReflect.set(compute, canGetValueDependencies, getDependencies);
        return compute;
    };
    COMPUTE.truthy = function (compute) {
        return COMPUTE(function () {
            var res = compute();
            return !!res;
        });
    };
    COMPUTE.async = function (initialValue, asyncComputer, context) {
        return COMPUTE(initialValue, {
            fn: asyncComputer,
            context: context
        });
    };
    COMPUTE.temporarilyBind = Compute.temporarilyBind;
    module.exports = namespace.compute = COMPUTE;
});
/*can-stream@1.0.1#can-stream*/
define('can-stream', [
    'require',
    'exports',
    'module',
    'can-assign',
    'can-compute',
    'can-reflect',
    'can-namespace'
], function (require, exports, module) {
    var assign = require('can-assign');
    var compute = require('can-compute');
    var canReflect = require('can-reflect');
    var namespace = require('can-namespace');
    var toComputeFromEvent = function (observable, eventName) {
        var handler, lastSet;
        return compute(undefined, {
            on: function (updated) {
                handler = function (ev, val) {
                    lastSet = assign({ args: [].slice.call(arguments, 1) }, ev);
                    updated();
                };
                observable.on(eventName, handler);
            },
            off: function (updated) {
                observable.off(eventName, handler);
                lastSet = undefined;
            },
            get: function () {
                return lastSet;
            }
        });
    };
    var STREAM = function (canStreamInterface) {
        var canStream;
        var toStreamFromProperty = function (obs, propName) {
            return canStreamInterface.toStream(compute(obs, propName));
        };
        var toStreamFromEvent = function () {
            var obs = arguments[0];
            var eventName, propName, lastValue, internalCompute;
            if (arguments.length === 2) {
                internalCompute = toComputeFromEvent(obs, arguments[1]);
                return canStreamInterface.toStream(internalCompute);
            } else {
                propName = arguments[1];
                eventName = arguments[2];
                lastValue = obs[propName];
                var valuePropCompute = compute(obs, propName);
                var eventHandler;
                var propChangeHandler;
                internalCompute = compute(undefined, {
                    on: function (updater) {
                        eventHandler = function (ev, newVal, oldVal) {
                            lastValue = newVal;
                            updater(lastValue);
                        };
                        propChangeHandler = function (ev, newVal, oldVal) {
                            oldVal.off(eventName, eventHandler);
                            newVal.on(eventName, eventHandler);
                        };
                        valuePropCompute.on('change', propChangeHandler);
                        valuePropCompute().on(eventName, eventHandler);
                    },
                    off: function () {
                        valuePropCompute().off(eventName, eventHandler);
                        valuePropCompute.off('change', propChangeHandler);
                    },
                    get: function () {
                        return lastValue;
                    },
                    set: function (val) {
                        throw new Error('can-stream: you can\'t set this type of compute');
                    }
                });
                var stream = canStreamInterface.toStream(internalCompute);
                return stream;
            }
        };
        var toStream = function () {
            if (arguments.length === 1) {
                return canStreamInterface.toStream(arguments[0]);
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
        var toCompute = function (makeStream, context) {
            var args = canReflect.toArray(arguments);
            return canStreamInterface.toCompute.apply(this, args);
        };
        canStream = toStream;
        canStream.toStream = canStream;
        canStream.toStreamFromProperty = toStreamFromProperty;
        canStream.toStreamFromEvent = toStreamFromEvent;
        canStream.toCompute = toCompute;
        return canStream;
    };
    STREAM.toComputeFromEvent = toComputeFromEvent;
    module.exports = namespace.stream = STREAM;
});
/*can-stream-kefir@1.1.0#can-stream-kefir*/
define('can-stream-kefir', [
    'require',
    'exports',
    'module',
    'can-kefir',
    'can-compute',
    'can-stream',
    'can-symbol',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
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
/*[global-shim-end]*/
(function(global) { // jshint ignore:line
	global._define = global.define;
	global.define = global.define.orig;
}
)(typeof self == "object" && self.Object == Object ? self : (typeof process === "object" && Object.prototype.toString.call(process) === "[object process]") ? global : window);