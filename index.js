(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = exports.Provider = undefined;

var _Provider = __webpack_require__(1);

var _Provider2 = _interopRequireDefault(_Provider);

var _connect = __webpack_require__(2);

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Provider = _Provider2.default;
exports.connect = _connect2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function Provider(store) {
  return function (appConfig) {
    return Object.assign({}, appConfig, { store: store });
  };
}

exports.default = Provider;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _shallowequal = __webpack_require__(3);

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _object = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultMapStateToProps = function defaultMapStateToProps(state) {
  return {};
}; // eslint-disable-line no-unused-vars
var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
  return { dispatch: dispatch };
};

function wrapActionCreators(actionCreators) {
  return function (dispatch) {
    return (0, _object.mapValues)(actionCreators, function (actionCreator) {
      return function () {
        return dispatch(actionCreator.apply(undefined, arguments));
      };
    });
  };
}

var connect = function connect(mapStateToProps, mapDispatchToProps) {
  var mapState = mapStateToProps || defaultMapStateToProps;
  var app = getApp();

  var mapDispatch = void 0;
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps;
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps;
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToProps);
  }

  return function (pageConfig) {
    var changeTimer = null;
    var lastChangeTime = 0;
    var MIN_CHANGE_DELAY = 50;

    function getMappedState() {
      var state = this.store.getState();
      var mappedState = mapState(state);

      // multi connect 时获取完整的 state
      if (pageConfig._isConnected) {
        return _extends({}, pageConfig._getMappedState.call(this, state), mapState(state));
      }
      return mappedState;
    }

    function changeState() {
      var mappedState = getMappedState.call(this);
      if (!this.data || (0, _shallowequal2.default)(this.data, mappedState)) {
        return;
      }
      var finalState = (0, _object.getShallowDiff)(this.data, mappedState);
      this.setData(finalState);
    }

    function handleChange(isImmediate) {
      var _this = this;

      if (!this._unsubscribe) {
        return;
      }

      clearTimeout(changeTimer);

      if (isImmediate) {
        changeState.call(this);
        return;
      }

      var now = Date.now();
      var delta = now - lastChangeTime;
      if (delta > MIN_CHANGE_DELAY) {
        lastChangeTime = now;
        changeState.call(this);
      } else {
        changeTimer = setTimeout(function () {
          lastChangeTime = now;
          changeState.call(_this);
        }, MIN_CHANGE_DELAY - delta);
      }
    }

    var _onLoad = pageConfig.onLoad,
        _onUnload = pageConfig.onUnload,
        _onHide = pageConfig.onHide,
        _onShow = pageConfig.onShow;

    var shouldSubscribe = Boolean(mapStateToProps);

    function subscribe() {
      this.store = app.store;
      if (shouldSubscribe) {
        // 如果已经 connect 过，将旧的 subscribe 取消
        if (pageConfig._unsubscribe) {
          pageConfig._unsubscribe();
        }
        var unsubscribe = this.store.subscribe(handleChange.bind(this));
        this._unsubscribe = unsubscribe;
        pageConfig._unsubscribe = unsubscribe;
        handleChange.call(this, true);
      }
    }

    function onShow(options) {
      if (!this.subscribedReducer) {
        subscribe.call(this);
        this.subscribedReducer = true;
      }

      if (typeof _onShow === 'function') {
        _onShow.call(this, options);
      }
    }

    function onLoad(options) {
      if (!this.subscribedReducer) {
        subscribe.call(this);
        this.subscribedReducer = true;
      }

      if (typeof _onLoad === 'function') {
        _onLoad.call(this, options);
      }
    }

    function onHide() {
      if (typeof _onHide === 'function') {
        _onHide.call(this);
      }
      if (typeof this._unsubscribe === 'function') {
        this._unsubscribe();
        this.subscribedReducer = false;
      }
    }

    function onUnload() {
      if (typeof _onUnload === 'function') {
        _onUnload.call(this);
      }
      if (typeof this._unsubscribe === 'function') {
        this._unsubscribe();
        this.subscribedReducer = false;
      }
    }

    return Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), {
      onLoad: onLoad,
      onUnload: onUnload,
      onShow: onShow,
      onHide: onHide,
      _isConnected: true,
      _getMappedState: getMappedState
    });
  };
};

exports.default = connect;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function shallowEqual(objA, objB, compare, compareContext) {

    var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

    if(ret !== void 0) {
        return !!ret;
    }

    if(objA === objB) {
        return true;
    }

    if(typeof objA !== 'object' || !objA ||
       typeof objB !== 'object' || !objB) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if(keysA.length !== keysB.length) {
        return false;
    }

    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

    // Test for A's keys different from B.
    for(var idx = 0; idx < keysA.length; idx++) {

        var key = keysA[idx];

        if(!bHasOwnProperty(key)) {
            return false;
        }

        var valueA = objA[key];
        var valueB = objB[key];

        ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

        if(ret === false ||
           ret === void 0 && valueA !== valueB) {
            return false;
        }

    }

    return true;

};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShallowDiff = exports.mapValues = undefined;

var _deepEqual = __webpack_require__(5);

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapValues = exports.mapValues = function mapValues(obj, fn) {
  return Object.keys(obj).reduce(function (o, key) {
    var value = obj[key];
    o[key] = fn(value, key, obj);
    return o;
  }, {});
};

var getShallowDiff = exports.getShallowDiff = function getShallowDiff() {
  var oldObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var newObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var finalObj = {};
  Object.keys(newObj).map(function (key) {
    if (!(0, _deepEqual2.default)(finalObj[key], newObj[key])) {
      finalObj[key] = newObj[key];
    }
  });

  return finalObj;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(6);
var isArguments = __webpack_require__(7);

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};


/***/ })
/******/ ]);
});