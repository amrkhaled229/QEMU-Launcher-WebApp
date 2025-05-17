/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/Layout.js":
/*!******************************!*\
  !*** ./components/Layout.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Layout)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n// frontend/components/Layout.js\n\n\nconst tabs = [\n    \"Disk Manager\",\n    \"VM Manager\",\n    \"Docker Manager\"\n];\nfunction Layout({ children }) {\n    const [active, setActive] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(tabs[0]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"   min-h-screen flex flex-col   bg-[url('/images/background.jpg')]   bg-cover bg-center   \",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                className: \"   sticky top-0 z-20 relative   backdrop-blur-lg bg-white/30   shadow-md p-4 flex justify-center   \",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"   absolute left-6 top-1/2   -translate-y-1/2   text-2xl font-bold text-blue-800   \",\n                        children: \"QEMU Launcher\"\n                    }, void 0, false, {\n                        fileName: \"E:\\\\projects_1.0\\\\QEMU-Launcher-WebApp\\\\frontend\\\\components\\\\Layout.js\",\n                        lineNumber: 26,\n                        columnNumber: 9\n                    }, this),\n                    tabs.map((tab)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: ()=>setActive(tab),\n                            className: `\r\n              mx-3 px-4 py-2 rounded-lg transition\r\n              ${active === tab ? \"bg-white/60 text-blue-700 font-semibold shadow-inner\" : \"text-gray-700 hover:bg-white/50\"}\r\n            `,\n                            children: tab\n                        }, tab, false, {\n                            fileName: \"E:\\\\projects_1.0\\\\QEMU-Launcher-WebApp\\\\frontend\\\\components\\\\Layout.js\",\n                            lineNumber: 38,\n                            columnNumber: 11\n                        }, this))\n                ]\n            }, void 0, true, {\n                fileName: \"E:\\\\projects_1.0\\\\QEMU-Launcher-WebApp\\\\frontend\\\\components\\\\Layout.js\",\n                lineNumber: 18,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"flex-1 p-6 overflow-auto\",\n                children: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().cloneElement(children, {\n                    activeTab: active\n                })\n            }, void 0, false, {\n                fileName: \"E:\\\\projects_1.0\\\\QEMU-Launcher-WebApp\\\\frontend\\\\components\\\\Layout.js\",\n                lineNumber: 54,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"E:\\\\projects_1.0\\\\QEMU-Launcher-WebApp\\\\frontend\\\\components\\\\Layout.js\",\n        lineNumber: 10,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0xheW91dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLGdDQUFnQzs7QUFDTztBQUV2QyxNQUFNRSxPQUFPO0lBQUM7SUFBZ0I7SUFBYztDQUFpQjtBQUU5QyxTQUFTQyxPQUFPLEVBQUVDLFFBQVEsRUFBRTtJQUN6QyxNQUFNLENBQUNDLFFBQVFDLFVBQVUsR0FBR0wsK0NBQVFBLENBQUNDLElBQUksQ0FBQyxFQUFFO0lBRTVDLHFCQUNFLDhEQUFDSztRQUNDQyxXQUFVOzswQkFPViw4REFBQ0M7Z0JBQ0NELFdBQVU7O2tDQU9WLDhEQUFDRDt3QkFDQ0MsV0FBVTtrQ0FLWDs7Ozs7O29CQUtBTixLQUFLUSxHQUFHLENBQUNDLENBQUFBLG9CQUNSLDhEQUFDQzs0QkFFQ0MsU0FBUyxJQUFNUCxVQUFVSzs0QkFDekJILFdBQVcsQ0FBQzs7Y0FFVixFQUFFSCxXQUFXTSxNQUNULHlEQUNBLGtDQUFrQztZQUN4QyxDQUFDO3NDQUVBQTsyQkFUSUE7Ozs7Ozs7Ozs7OzBCQWVYLDhEQUFDRztnQkFBS04sV0FBVTswQkFDYlIsY0FBQUEseURBQWtCLENBQUNJLFVBQVU7b0JBQUVZLFdBQVdYO2dCQUFPOzs7Ozs7Ozs7Ozs7QUFJMUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb250YWluZXJwaWxvdC1mcm9udGVuZC8uL2NvbXBvbmVudHMvTGF5b3V0LmpzPzUxNWMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZnJvbnRlbmQvY29tcG9uZW50cy9MYXlvdXQuanNcclxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXHJcblxyXG5jb25zdCB0YWJzID0gWydEaXNrIE1hbmFnZXInLCAnVk0gTWFuYWdlcicsICdEb2NrZXIgTWFuYWdlciddXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMYXlvdXQoeyBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3QgW2FjdGl2ZSwgc2V0QWN0aXZlXSA9IHVzZVN0YXRlKHRhYnNbMF0pXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzTmFtZT1cIlxyXG4gICAgICAgIG1pbi1oLXNjcmVlbiBmbGV4IGZsZXgtY29sXHJcbiAgICAgICAgYmctW3VybCgnL2ltYWdlcy9iYWNrZ3JvdW5kLmpwZycpXVxyXG4gICAgICAgIGJnLWNvdmVyIGJnLWNlbnRlclxyXG4gICAgICBcIlxyXG4gICAgPlxyXG4gICAgICB7LyogQmx1cnJ5IG5hdmJhciB3aXRoIHByb2plY3QgbmFtZSAmIGNlbnRlcmVkIHRhYnMgKi99XHJcbiAgICAgIDxuYXZcclxuICAgICAgICBjbGFzc05hbWU9XCJcclxuICAgICAgICAgIHN0aWNreSB0b3AtMCB6LTIwIHJlbGF0aXZlXHJcbiAgICAgICAgICBiYWNrZHJvcC1ibHVyLWxnIGJnLXdoaXRlLzMwXHJcbiAgICAgICAgICBzaGFkb3ctbWQgcC00IGZsZXgganVzdGlmeS1jZW50ZXJcclxuICAgICAgICBcIlxyXG4gICAgICA+XHJcbiAgICAgICAgey8qIFByb2plY3QgdGl0bGUgKi99XHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgY2xhc3NOYW1lPVwiXHJcbiAgICAgICAgICAgIGFic29sdXRlIGxlZnQtNiB0b3AtMS8yXHJcbiAgICAgICAgICAgIC10cmFuc2xhdGUteS0xLzJcclxuICAgICAgICAgICAgdGV4dC0yeGwgZm9udC1ib2xkIHRleHQtYmx1ZS04MDBcclxuICAgICAgICAgIFwiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgUUVNVSBMYXVuY2hlclxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICB7LyogQ2VudGVyZWQgdGFiIGJ1dHRvbnMgKi99XHJcbiAgICAgICAge3RhYnMubWFwKHRhYiA9PiAoXHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIGtleT17dGFifVxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmUodGFiKX1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgXHJcbiAgICAgICAgICAgICAgbXgtMyBweC00IHB5LTIgcm91bmRlZC1sZyB0cmFuc2l0aW9uXHJcbiAgICAgICAgICAgICAgJHthY3RpdmUgPT09IHRhYlxyXG4gICAgICAgICAgICAgICAgPyAnYmctd2hpdGUvNjAgdGV4dC1ibHVlLTcwMCBmb250LXNlbWlib2xkIHNoYWRvdy1pbm5lcidcclxuICAgICAgICAgICAgICAgIDogJ3RleHQtZ3JheS03MDAgaG92ZXI6Ymctd2hpdGUvNTAnfVxyXG4gICAgICAgICAgICBgfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7dGFifVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgKSl9XHJcbiAgICAgIDwvbmF2PlxyXG5cclxuICAgICAgey8qIE1haW4gY29udGVudCAqL31cclxuICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZmxleC0xIHAtNiBvdmVyZmxvdy1hdXRvXCI+XHJcbiAgICAgICAge1JlYWN0LmNsb25lRWxlbWVudChjaGlsZHJlbiwgeyBhY3RpdmVUYWI6IGFjdGl2ZSB9KX1cclxuICAgICAgPC9tYWluPlxyXG4gICAgPC9kaXY+XHJcbiAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsInVzZVN0YXRlIiwidGFicyIsIkxheW91dCIsImNoaWxkcmVuIiwiYWN0aXZlIiwic2V0QWN0aXZlIiwiZGl2IiwiY2xhc3NOYW1lIiwibmF2IiwibWFwIiwidGFiIiwiYnV0dG9uIiwib25DbGljayIsIm1haW4iLCJjbG9uZUVsZW1lbnQiLCJhY3RpdmVUYWIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/Layout.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Layout */ \"./components/Layout.js\");\n// frontend/pages/_app.js\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Layout__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"E:\\\\projects_1.0\\\\QEMU-Launcher-WebApp\\\\frontend\\\\pages\\\\_app.js\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"E:\\\\projects_1.0\\\\QEMU-Launcher-WebApp\\\\frontend\\\\pages\\\\_app.js\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHlCQUF5Qjs7QUFDSztBQUNXO0FBRTFCLFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDcEQscUJBQ0UsOERBQUNILDBEQUFNQTtrQkFDTCw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QiIsInNvdXJjZXMiOlsid2VicGFjazovL2NvbnRhaW5lcnBpbG90LWZyb250ZW5kLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGZyb250ZW5kL3BhZ2VzL19hcHAuanNcclxuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXHJcbmltcG9ydCBMYXlvdXQgZnJvbSAnLi4vY29tcG9uZW50cy9MYXlvdXQnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPExheW91dD5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgPC9MYXlvdXQ+XHJcbiAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJMYXlvdXQiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();