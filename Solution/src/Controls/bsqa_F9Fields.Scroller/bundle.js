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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Scroller: () => (/* binding */ Scroller)\n/* harmony export */ });\n/* harmony import */ var _utils_PAEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/PAEvent */ \"./utils/PAEvent.ts\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\nvar __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {\n  function adopt(value) {\n    return value instanceof P ? value : new P(function (resolve) {\n      resolve(value);\n    });\n  }\n  return new (P || (P = Promise))(function (resolve, reject) {\n    function fulfilled(value) {\n      try {\n        step(generator.next(value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function rejected(value) {\n      try {\n        step(generator[\"throw\"](value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function step(result) {\n      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);\n    }\n    step((generator = generator.apply(thisArg, _arguments || [])).next());\n  });\n};\n\n\nclass Scroller {\n  onScroll(ev, data) {\n    this.x = data.x;\n    this.y = data.y;\n    this.dispatchOnScroll = true;\n    this.notifyOutputChanged();\n  }\n  /**\r\n   * Empty constructor.\r\n   */\n  constructor() {\n    this.x = 0;\n    this.y = 0;\n    this.dispatchOnScroll = false;\n  }\n  /**\r\n   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.\r\n   * Data-set values are not initialized here, use updateView.\r\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.\r\n   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.\r\n   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.\r\n   */\n  init(context, notifyOutputChanged, state) {\n    this.notifyOutputChanged = notifyOutputChanged;\n    context.mode.trackContainerResize(true);\n  }\n  /**\r\n   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.\r\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions\r\n   * @returns ReactElement root react element for the control\r\n   */\n  updateView(context) {\n    var querySelector = context.parameters.ControlType.raw == \"container\" ? \"[data-control-name='\".concat(context.parameters.ControlName.raw, \"'] [data-container-name='\").concat(context.parameters.ControlName.raw, \"-container']\") : \"[data-control-name='\".concat(context.parameters.ControlName.raw, \"'] \").concat(context.parameters.ControlType.raw);\n    var element = document.querySelector(querySelector);\n    if (element) {\n      element.scrollTo(context.parameters.X.raw || 0, context.parameters.X.raw || 0);\n    }\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment);\n  }\n  /**\r\n   * It is called by the framework prior to a control receiving new data.\r\n   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”\r\n   */\n  getOutputs() {\n    return {\n      X: this.x,\n      Y: this.y\n    };\n  }\n  /**\r\n   * It is called by the framework prior to a control init to get the output object(s) schema\r\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions\r\n   * @returns an object schema based on nomenclature defined in manifest\r\n   */\n  getOutputSchema(context) {\n    return __awaiter(this, void 0, void 0, function* () {\n      return Promise.resolve({\n        Event: _utils_PAEvent__WEBPACK_IMPORTED_MODULE_1__.PAEventSchema\n      });\n    });\n  }\n  /**\r\n   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.\r\n   * i.e. cancelling any pending remote calls, removing listeners, etc.\r\n   */\n  destroy() {\n    // Add code to cleanup control if necessary\n  }\n}\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./Scroller/index.ts?");

/***/ }),

/***/ "./utils/PAEvent.ts":
/*!**************************!*\
  !*** ./utils/PAEvent.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PAEventQueue: () => (/* binding */ PAEventQueue),\n/* harmony export */   PAEventSchema: () => (/* binding */ PAEventSchema),\n/* harmony export */   PAEventsSchema: () => (/* binding */ PAEventsSchema),\n/* harmony export */   getPAEvent: () => (/* binding */ getPAEvent)\n/* harmony export */ });\nvar PAEventSchemaNode = {\n  \"type\": \"object\",\n  \"properties\": {\n    \"type\": {\n      \"type\": \"string\"\n    },\n    \"value\": {\n      \"type\": \"string\"\n    },\n    \"target\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"name\": {\n          \"type\": \"string\"\n        },\n        \"tagName\": {\n          \"type\": \"string\"\n        },\n        \"classList\": {\n          \"type\": \"array\",\n          \"items\": {\n            \"type\": \"string\"\n          }\n        },\n        \"attributes\": {\n          \"type\": \"array\",\n          \"items\": {\n            \"name\": {\n              \"type\": \"string\"\n            },\n            \"value\": {\n              \"type\": \"string\"\n            }\n          }\n        },\n        \"value\": {\n          \"type\": \"string\"\n        }\n      }\n    }\n  }\n};\nvar PAEventSchema = Object.assign({\n  \"$schema\": \"http://json-schema.org/draft-04/schema#\"\n}, PAEventSchemaNode);\nvar PAEventsSchema = {\n  \"$schema\": \"http://json-schema.org/draft-04/schema#\",\n  \"type\": \"array\",\n  \"items\": Object.assign({}, PAEventSchemaNode)\n};\nvar isTargetRef = target => {\n  return 'current' in target;\n};\nvar getPAEvent = event => {\n  var _a, _b, _c, _d, _e, _f, _g, _h, _j;\n  if (event) {\n    var target = (event === null || event === void 0 ? void 0 : event.target) && isTargetRef(event.target) ? event.target.current : event.target;\n    var classList = [];\n    var attributes = [];\n    if (target) {\n      if (target.classList) {\n        for (var i = 0; i < target.classList.length; i++) {\n          classList.push(target.classList[i].toString());\n        }\n      }\n      if (target === null || target === void 0 ? void 0 : target.attributes) {\n        for (var _i = 0; _i < target.attributes.length; _i++) {\n          var attr = target.attributes[_i];\n          attributes.push({\n            name: (_a = attr.name) !== null && _a !== void 0 ? _a : \"\",\n            value: (_d = (_c = (_b = attr.value) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : \"\"\n          });\n        }\n      }\n    }\n    var targetValue = (_h = (_e = target === null || target === void 0 ? void 0 : target.value) !== null && _e !== void 0 ? _e : (_g = (_f = target === null || target === void 0 ? void 0 : target.attributes) === null || _f === void 0 ? void 0 : _f.getNamedItem(\"href\")) === null || _g === void 0 ? void 0 : _g.value) !== null && _h !== void 0 ? _h : \"\";\n    return {\n      type: event.type || \"\",\n      target: {\n        name: (target === null || target === void 0 ? void 0 : target.name) || \"\",\n        tagName: (target === null || target === void 0 ? void 0 : target.tagName) || \"\",\n        classList: classList,\n        attributes: attributes,\n        value: targetValue\n      },\n      value: (_j = event.value) !== null && _j !== void 0 ? _j : targetValue\n    };\n  }\n  return {\n    type: \"\",\n    target: {\n      name: \"\",\n      tagName: \"\",\n      classList: [],\n      attributes: [],\n      value: \"\"\n    }\n  };\n};\nclass PAEventQueue {\n  constructor() {\n    this.eventsQueue = [];\n    this.eventExecutionQueue = new Map();\n  }\n  add(event, controlEvent) {\n    this.eventsQueue.push([event, controlEvent]);\n  }\n  getOutput() {\n    var events = this.eventsQueue.map(_ref => {\n      var [event, eventName] = _ref;\n      var _event = getPAEvent(event);\n      this.eventExecutionQueue.set(_event, eventName);\n      return _event;\n    });\n    this.eventsQueue.length = 0;\n    return events;\n  }\n  execute(context) {\n    var confirmedEvents = context.parameters.Events.raw;\n    var controlEvents = context.events;\n    var readyEvents = new Set();\n    this.eventExecutionQueue.forEach((eventName, queuedEvent, map) => {\n      var eventIsConfirmed = confirmedEvents === null || confirmedEvents === void 0 ? void 0 : confirmedEvents.find(confirmedEvent => function isEqualOrMissing(primary, secondary) {\n        if (primary == secondary || primary.Value == secondary || secondary == undefined) {\n          return true;\n        }\n        if (Array.isArray(primary) && Array.isArray(secondary)) {\n          for (var i = 0; i < primary.length; i++) {\n            if (!isEqualOrMissing(primary[i], secondary[i])) {\n              return false;\n            }\n          }\n          return true;\n        } else if (typeof primary === \"object\" && typeof secondary === \"object\") {\n          for (var key in primary) {\n            if (!isEqualOrMissing(primary[key], secondary[key])) {\n              return false;\n            }\n          }\n          return true;\n        }\n        return false;\n      }(confirmedEvent, queuedEvent));\n      if (eventIsConfirmed) {\n        eventName && readyEvents.add(eventName);\n        map.delete(queuedEvent);\n      }\n    });\n    readyEvents.forEach(eventName => {\n      typeof (controlEvents === null || controlEvents === void 0 ? void 0 : controlEvents[eventName]) === \"function\" && controlEvents[eventName]();\n    });\n  }\n}\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./utils/PAEvent.ts?");

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