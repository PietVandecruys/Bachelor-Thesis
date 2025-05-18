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

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_2__.createClient)(\"https://enedjwumosbvfygypzcj.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZWRqd3Vtb3NidmZ5Z3lwemNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzAyOTMsImV4cCI6MjA2MTk0NjI5M30.3ScxQ2iB79xn-zaK0ZZ7p0WtVIcqRCA3HYLp1IS-tM0\");\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_auth_react__WEBPACK_IMPORTED_MODULE_1__.SessionProvider, {\n        session: pageProps.session,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\pvand\\\\OneDrive - Berner Fachhochschule\\\\Documents\\\\Bachelor Thesis\\\\Code\\\\my-cfa-prep-site\\\\pages\\\\_app.js\",\n            lineNumber: 14,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\pvand\\\\OneDrive - Berner Fachhochschule\\\\Documents\\\\Bachelor Thesis\\\\Code\\\\my-cfa-prep-site\\\\pages\\\\_app.js\",\n        lineNumber: 13,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n// Store user in Supabase when they log in\nasync function storeUserInSupabase(user) {\n    if (!user) return;\n    const { data, error } = await supabase.from('users').upsert([\n        {\n            id: user.id,\n            email: user.email,\n            name: user.name,\n            created_at: new Date(),\n            last_login: new Date()\n        }\n    ]);\n    if (error) {\n        console.error(\"Error saving user to Supabase:\", error);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUE4RDtBQUNUO0FBQ3RCO0FBRy9CLE1BQU1HLFdBQVdELG1FQUFZQSxDQUMzQkUsMENBQXlDLEVBQ3pDQSxrTkFBOEM7QUFHaEQsU0FBU0ksTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNyQyxxQkFDRSw4REFBQ1YsNERBQWVBO1FBQUNXLFNBQVNELFVBQVVDLE9BQU87a0JBQ3pDLDRFQUFDRjtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUM7QUFFckIsMENBQTBDO0FBQzFDLGVBQWVJLG9CQUFvQkMsSUFBSTtJQUNyQyxJQUFJLENBQUNBLE1BQU07SUFFWCxNQUFNLEVBQUVDLElBQUksRUFBRUMsS0FBSyxFQUFFLEdBQUcsTUFBTVosU0FDM0JhLElBQUksQ0FBQyxTQUNMQyxNQUFNLENBQUM7UUFDTjtZQUNFQyxJQUFJTCxLQUFLSyxFQUFFO1lBQ1hDLE9BQU9OLEtBQUtNLEtBQUs7WUFDakJDLE1BQU1QLEtBQUtPLElBQUk7WUFDZkMsWUFBWSxJQUFJQztZQUNoQkMsWUFBWSxJQUFJRDtRQUNsQjtLQUNEO0lBRUgsSUFBSVAsT0FBTztRQUNUUyxRQUFRVCxLQUFLLENBQUMsa0NBQWtDQTtJQUNsRDtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHB2YW5kXFxPbmVEcml2ZSAtIEJlcm5lciBGYWNoaG9jaHNjaHVsZVxcRG9jdW1lbnRzXFxCYWNoZWxvciBUaGVzaXNcXENvZGVcXG15LWNmYS1wcmVwLXNpdGVcXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlc3Npb25Qcm92aWRlciwgdXNlU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aC9yZWFjdCc7XHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XHJcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcclxuXHJcblxyXG5jb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChcclxuICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkxfVVNFUixcclxuICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWV9VU0VSXHJcbik7XHJcblxyXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPFNlc3Npb25Qcm92aWRlciBzZXNzaW9uPXtwYWdlUHJvcHMuc2Vzc2lvbn0+XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgIDwvU2Vzc2lvblByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE15QXBwO1xyXG5cclxuLy8gU3RvcmUgdXNlciBpbiBTdXBhYmFzZSB3aGVuIHRoZXkgbG9nIGluXHJcbmFzeW5jIGZ1bmN0aW9uIHN0b3JlVXNlckluU3VwYWJhc2UodXNlcikge1xyXG4gIGlmICghdXNlcikgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oJ3VzZXJzJylcclxuICAgIC51cHNlcnQoW1xyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6IHVzZXIuaWQsXHJcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgbmFtZTogdXNlci5uYW1lLFxyXG4gICAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgbGFzdF9sb2dpbjogbmV3IERhdGUoKSxcclxuICAgICAgfVxyXG4gICAgXSk7XHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNhdmluZyB1c2VyIHRvIFN1cGFiYXNlOlwiLCBlcnJvcik7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJTZXNzaW9uUHJvdmlkZXIiLCJ1c2VTZXNzaW9uIiwiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2UiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMX1VTRVIiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWV9VU0VSIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJzZXNzaW9uIiwic3RvcmVVc2VySW5TdXBhYmFzZSIsInVzZXIiLCJkYXRhIiwiZXJyb3IiLCJmcm9tIiwidXBzZXJ0IiwiaWQiLCJlbWFpbCIsIm5hbWUiLCJjcmVhdGVkX2F0IiwiRGF0ZSIsImxhc3RfbG9naW4iLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-auth/react");

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
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./pages/_app.js"));
module.exports = __webpack_exports__;

})();