/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Scroller/index.ts":
/*!***************************!*\
  !*** ./Scroller/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Scroller\": () => (/* binding */ Scroller)\n/* harmony export */ });\n/* harmony import */ var _utils_PAEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/PAEvent */ \"./utils/PAEvent.ts\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\nvar __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {\n  function adopt(value) {\n    return value instanceof P ? value : new P(function (resolve) {\n      resolve(value);\n    });\n  }\n  return new (P || (P = Promise))(function (resolve, reject) {\n    function fulfilled(value) {\n      try {\n        step(generator.next(value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function rejected(value) {\n      try {\n        step(generator[\"throw\"](value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function step(result) {\n      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);\n    }\n    step((generator = generator.apply(thisArg, _arguments || [])).next());\n  });\n};\nvar __generator = undefined && undefined.__generator || function (thisArg, body) {\n  var _ = {\n      label: 0,\n      sent: function sent() {\n        if (t[0] & 1) throw t[1];\n        return t[1];\n      },\n      trys: [],\n      ops: []\n    },\n    f,\n    y,\n    t,\n    g;\n  return g = {\n    next: verb(0),\n    \"throw\": verb(1),\n    \"return\": verb(2)\n  }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function () {\n    return this;\n  }), g;\n  function verb(n) {\n    return function (v) {\n      return step([n, v]);\n    };\n  }\n  function step(op) {\n    if (f) throw new TypeError(\"Generator is already executing.\");\n    while (g && (g = 0, op[0] && (_ = 0)), _) try {\n      if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n      if (y = 0, t) op = [op[0] & 2, t.value];\n      switch (op[0]) {\n        case 0:\n        case 1:\n          t = op;\n          break;\n        case 4:\n          _.label++;\n          return {\n            value: op[1],\n            done: false\n          };\n        case 5:\n          _.label++;\n          y = op[1];\n          op = [0];\n          continue;\n        case 7:\n          op = _.ops.pop();\n          _.trys.pop();\n          continue;\n        default:\n          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {\n            _ = 0;\n            continue;\n          }\n          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {\n            _.label = op[1];\n            break;\n          }\n          if (op[0] === 6 && _.label < t[1]) {\n            _.label = t[1];\n            t = op;\n            break;\n          }\n          if (t && _.label < t[2]) {\n            _.label = t[2];\n            _.ops.push(op);\n            break;\n          }\n          if (t[2]) _.ops.pop();\n          _.trys.pop();\n          continue;\n      }\n      op = body.call(thisArg, _);\n    } catch (e) {\n      op = [6, e];\n      y = 0;\n    } finally {\n      f = t = 0;\n    }\n    if (op[0] & 5) throw op[1];\n    return {\n      value: op[0] ? op[1] : void 0,\n      done: true\n    };\n  }\n};\n\n\nvar Scroller = /** @class */function () {\n  /**\r\n   * Empty constructor.\r\n   */\n  function Scroller() {\n    this.x = 0;\n    this.y = 0;\n    this.dispatchOnScroll = false;\n  }\n  Scroller.prototype.onScroll = function (ev, data) {\n    this.x = data.x;\n    this.y = data.y;\n    this.dispatchOnScroll = true;\n    this.notifyOutputChanged();\n  };\n  /**\r\n   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.\r\n   * Data-set values are not initialized here, use updateView.\r\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.\r\n   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.\r\n   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.\r\n   */\n  Scroller.prototype.init = function (context, notifyOutputChanged, state) {\n    this.notifyOutputChanged = notifyOutputChanged;\n    context.mode.trackContainerResize(true);\n  };\n  /**\r\n   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.\r\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions\r\n   * @returns ReactElement root react element for the control\r\n   */\n  Scroller.prototype.updateView = function (context) {\n    var querySelector = context.parameters.ControlType.raw == \"container\" ? \"[data-control-name='\".concat(context.parameters.ControlName.raw, \"'] [data-container-name='\").concat(context.parameters.ControlName.raw, \"-container']\") : \"[data-control-name='\".concat(context.parameters.ControlName.raw, \"'] \").concat(context.parameters.ControlType.raw);\n    var element = document.querySelector(querySelector);\n    if (element) {\n      element.scrollTo(context.parameters.X.raw || 0, context.parameters.X.raw || 0);\n    }\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment);\n  };\n  /**\r\n   * It is called by the framework prior to a control receiving new data.\r\n   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”\r\n   */\n  Scroller.prototype.getOutputs = function () {\n    return {\n      X: this.x,\n      Y: this.y\n    };\n  };\n  /**\r\n   * It is called by the framework prior to a control init to get the output object(s) schema\r\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions\r\n   * @returns an object schema based on nomenclature defined in manifest\r\n   */\n  Scroller.prototype.getOutputSchema = function (context) {\n    return __awaiter(this, void 0, void 0, function () {\n      return __generator(this, function (_a) {\n        return [2 /*return*/, Promise.resolve({\n          Event: _utils_PAEvent__WEBPACK_IMPORTED_MODULE_1__.PAEventSchema\n        })];\n      });\n    });\n  };\n  /**\r\n   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.\r\n   * i.e. cancelling any pending remote calls, removing listeners, etc.\r\n   */\n  Scroller.prototype.destroy = function () {\n    // Add code to cleanup control if necessary\n  };\n  return Scroller;\n}();\n\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./Scroller/index.ts?");

/***/ }),

/***/ "./utils/PAEvent.ts":
/*!**************************!*\
  !*** ./utils/PAEvent.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PAEventQueue\": () => (/* binding */ PAEventQueue),\n/* harmony export */   \"PAEventSchema\": () => (/* binding */ PAEventSchema),\n/* harmony export */   \"PAEventsSchema\": () => (/* binding */ PAEventsSchema),\n/* harmony export */   \"getPAEvent\": () => (/* binding */ getPAEvent)\n/* harmony export */ });\nvar __assign = undefined && undefined.__assign || function () {\n  __assign = Object.assign || function (t) {\n    for (var s, i = 1, n = arguments.length; i < n; i++) {\n      s = arguments[i];\n      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];\n    }\n    return t;\n  };\n  return __assign.apply(this, arguments);\n};\nvar PAEventSchemaNode = {\n  \"type\": \"object\",\n  \"properties\": {\n    \"type\": {\n      \"type\": \"string\"\n    },\n    \"value\": {\n      \"type\": \"string\"\n    },\n    \"target\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"name\": {\n          \"type\": \"string\"\n        },\n        \"tagName\": {\n          \"type\": \"string\"\n        },\n        \"classList\": {\n          \"type\": \"array\",\n          \"items\": {\n            \"type\": \"string\"\n          }\n        },\n        \"attributes\": {\n          \"type\": \"array\",\n          \"items\": {\n            \"name\": {\n              \"type\": \"string\"\n            },\n            \"value\": {\n              \"type\": \"string\"\n            }\n          }\n        },\n        \"value\": {\n          \"type\": \"string\"\n        }\n      }\n    }\n  }\n};\nvar PAEventSchema = __assign({\n  \"$schema\": \"http://json-schema.org/draft-04/schema#\"\n}, PAEventSchemaNode);\nvar PAEventsSchema = {\n  \"$schema\": \"http://json-schema.org/draft-04/schema#\",\n  \"type\": \"array\",\n  \"items\": __assign({}, PAEventSchemaNode)\n};\nvar isTargetRef = function isTargetRef(target) {\n  return 'current' in target;\n};\nvar getPAEvent = function getPAEvent(event) {\n  var _a, _b, _c, _d, _e, _f, _g, _h, _j;\n  if (event) {\n    var target = (event === null || event === void 0 ? void 0 : event.target) && isTargetRef(event.target) ? event.target.current : event.target;\n    var classList = [];\n    var attributes = [];\n    if (target) {\n      if (target.classList) {\n        for (var i = 0; i < target.classList.length; i++) {\n          classList.push(target.classList[i].toString());\n        }\n      }\n      if (target === null || target === void 0 ? void 0 : target.attributes) {\n        for (var i = 0; i < target.attributes.length; i++) {\n          var attr = target.attributes[i];\n          attributes.push({\n            name: (_a = attr.name) !== null && _a !== void 0 ? _a : \"\",\n            value: (_d = (_c = (_b = attr.value) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : \"\"\n          });\n        }\n      }\n    }\n    var targetValue = (_h = (_e = target === null || target === void 0 ? void 0 : target.value) !== null && _e !== void 0 ? _e : (_g = (_f = target === null || target === void 0 ? void 0 : target.attributes) === null || _f === void 0 ? void 0 : _f.getNamedItem(\"href\")) === null || _g === void 0 ? void 0 : _g.value) !== null && _h !== void 0 ? _h : \"\";\n    return {\n      type: event.type || \"\",\n      target: {\n        name: (target === null || target === void 0 ? void 0 : target.name) || \"\",\n        tagName: (target === null || target === void 0 ? void 0 : target.tagName) || \"\",\n        classList: classList,\n        attributes: attributes,\n        value: targetValue\n      },\n      value: (_j = event.value) !== null && _j !== void 0 ? _j : targetValue\n    };\n  }\n  return {\n    type: \"\",\n    target: {\n      name: \"\",\n      tagName: \"\",\n      classList: [],\n      attributes: [],\n      value: \"\"\n    }\n  };\n};\nvar PAEventQueue = /** @class */function () {\n  function PAEventQueue() {\n    this.eventsQueue = [];\n    this.eventExecutionQueue = new Map();\n  }\n  PAEventQueue.prototype.add = function (event, controlEvent) {\n    this.eventsQueue.push([event, controlEvent]);\n  };\n  PAEventQueue.prototype.getOutput = function () {\n    var _this = this;\n    var events = this.eventsQueue.map(function (_a) {\n      var event = _a[0],\n        eventName = _a[1];\n      var _event = getPAEvent(event);\n      _this.eventExecutionQueue.set(_event, eventName);\n      return _event;\n    });\n    this.eventsQueue.length = 0;\n    return events;\n  };\n  PAEventQueue.prototype.execute = function (context) {\n    var confirmedEvents = context.parameters.Events.raw;\n    var controlEvents = context.events;\n    var readyEvents = new Set();\n    this.eventExecutionQueue.forEach(function (eventName, queuedEvent, map) {\n      var eventIsConfirmed = confirmedEvents === null || confirmedEvents === void 0 ? void 0 : confirmedEvents.find(function (confirmedEvent) {\n        return function isEqualOrMissing(primary, secondary) {\n          if (primary == secondary || primary.Value == secondary || secondary == undefined) {\n            return true;\n          }\n          if (Array.isArray(primary) && Array.isArray(secondary)) {\n            for (var i = 0; i < primary.length; i++) {\n              if (!isEqualOrMissing(primary[i], secondary[i])) {\n                return false;\n              }\n            }\n            return true;\n          } else if (typeof primary === \"object\" && typeof secondary === \"object\") {\n            for (var key in primary) {\n              if (!isEqualOrMissing(primary[key], secondary[key])) {\n                return false;\n              }\n            }\n            return true;\n          }\n          return false;\n        }(confirmedEvent, queuedEvent);\n      });\n      if (eventIsConfirmed) {\n        eventName && readyEvents.add(eventName);\n        map.delete(queuedEvent);\n      }\n    });\n    readyEvents.forEach(function (eventName) {\n      typeof (controlEvents === null || controlEvents === void 0 ? void 0 : controlEvents[eventName]) === \"function\" && controlEvents[eventName]();\n    });\n  };\n  return PAEventQueue;\n}();\n\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./utils/PAEvent.ts?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./Scroller/index.ts");
/******/ 	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = __webpack_exports__;
/******/ 	
/******/ })()
;
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
	ComponentFramework.registerControl('F9Fields.Scroller', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.Scroller);
} else {
	var F9Fields = F9Fields || {};
	F9Fields.Scroller = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.Scroller;
	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}