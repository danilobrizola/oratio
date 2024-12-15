"use strict";
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
exports.id = "app/api/comments/delete/route";
exports.ids = ["app/api/comments/delete/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcomments%2Fdelete%2Froute&page=%2Fapi%2Fcomments%2Fdelete%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcomments%2Fdelete%2Froute.ts&appDir=%2FUsers%2Fdanilobrizola%2FAI%20Development%2Fprayer-platform%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdanilobrizola%2FAI%20Development%2Fprayer-platform&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcomments%2Fdelete%2Froute&page=%2Fapi%2Fcomments%2Fdelete%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcomments%2Fdelete%2Froute.ts&appDir=%2FUsers%2Fdanilobrizola%2FAI%20Development%2Fprayer-platform%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdanilobrizola%2FAI%20Development%2Fprayer-platform&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_danilobrizola_AI_Development_prayer_platform_app_api_comments_delete_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/comments/delete/route.ts */ \"(rsc)/./app/api/comments/delete/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/comments/delete/route\",\n        pathname: \"/api/comments/delete\",\n        filename: \"route\",\n        bundlePath: \"app/api/comments/delete/route\"\n    },\n    resolvedPagePath: \"/Users/danilobrizola/AI Development/prayer-platform/app/api/comments/delete/route.ts\",\n    nextConfigOutput,\n    userland: _Users_danilobrizola_AI_Development_prayer_platform_app_api_comments_delete_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/comments/delete/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZjb21tZW50cyUyRmRlbGV0ZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGY29tbWVudHMlMkZkZWxldGUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZjb21tZW50cyUyRmRlbGV0ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmRhbmlsb2JyaXpvbGElMkZBSSUyMERldmVsb3BtZW50JTJGcHJheWVyLXBsYXRmb3JtJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmRhbmlsb2JyaXpvbGElMkZBSSUyMERldmVsb3BtZW50JTJGcHJheWVyLXBsYXRmb3JtJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ29DO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdUdBQXVHO0FBQy9HO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDNko7O0FBRTdKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHJheWVyLXBsYXRmb3JtLz9kYTAxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9kYW5pbG9icml6b2xhL0FJIERldmVsb3BtZW50L3ByYXllci1wbGF0Zm9ybS9hcHAvYXBpL2NvbW1lbnRzL2RlbGV0ZS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvY29tbWVudHMvZGVsZXRlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvY29tbWVudHMvZGVsZXRlXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9jb21tZW50cy9kZWxldGUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZGFuaWxvYnJpem9sYS9BSSBEZXZlbG9wbWVudC9wcmF5ZXItcGxhdGZvcm0vYXBwL2FwaS9jb21tZW50cy9kZWxldGUvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0IH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvY29tbWVudHMvZGVsZXRlL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCwgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcomments%2Fdelete%2Froute&page=%2Fapi%2Fcomments%2Fdelete%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcomments%2Fdelete%2Froute.ts&appDir=%2FUsers%2Fdanilobrizola%2FAI%20Development%2Fprayer-platform%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdanilobrizola%2FAI%20Development%2Fprayer-platform&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/comments/delete/route.ts":
/*!******************************************!*\
  !*** ./app/api/comments/delete/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n\n\nasync function DELETE(request) {\n    try {\n        const { commentId, prayerId } = await request.json();\n        const authHeader = request.headers.get(\"Authorization\");\n        console.log(\"Auth Header:\", authHeader) // Debug\n        ;\n        if (!authHeader || !authHeader.startsWith(\"Bearer \")) {\n            return new next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"Token de autoriza\\xe7\\xe3o ausente ou inv\\xe1lido\", {\n                status: 401\n            });\n        }\n        const token = authHeader.split(\" \")[1];\n        console.log(\"Token:\", token) // Debug\n        ;\n        // Cliente admin para operações no banco\n        const supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(\"https://ygemxkfzjrkisizzissu.supabase.co\", process.env.SUPABASE_SERVICE_ROLE_KEY);\n        // Verificar o token do usuário\n        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);\n        console.log(\"User:\", user, \"Auth Error:\", authError) // Debug\n        ;\n        if (authError || !user) {\n            return new next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"Usu\\xe1rio n\\xe3o autorizado\", {\n                status: 401\n            });\n        }\n        // Verificar se o usuário é o autor do comentário ou da oração\n        const { data: comment } = await supabaseAdmin.from(\"comments\").select(\"author_id, prayer:prayers(author_id)\").eq(\"id\", commentId).single();\n        console.log(\"Comment:\", comment) // Debug\n        ;\n        if (!comment) {\n            return new next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"Coment\\xe1rio n\\xe3o encontrado\", {\n                status: 404\n            });\n        }\n        // Usuário pode deletar se for autor do comentário ou da oração\n        const canDelete = comment.author_id === user.id || comment.prayer.author_id === user.id;\n        if (!canDelete) {\n            return new next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"Voc\\xea n\\xe3o tem permiss\\xe3o para deletar este coment\\xe1rio\", {\n                status: 401\n            });\n        }\n        const { error } = await supabaseAdmin.from(\"comments\").delete().eq(\"id\", commentId);\n        if (error) throw error;\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            success: true\n        });\n    } catch (error) {\n        console.error(\"Error deleting comment:\", error);\n        return new next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"](error instanceof Error ? error.message : \"Erro interno do servidor\", {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NvbW1lbnRzL2RlbGV0ZS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBb0Q7QUFDVjtBQUVuQyxlQUFlRSxPQUFPQyxPQUFnQjtJQUMzQyxJQUFJO1FBQ0YsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFFBQVEsRUFBRSxHQUFHLE1BQU1GLFFBQVFHLElBQUk7UUFDbEQsTUFBTUMsYUFBYUosUUFBUUssT0FBTyxDQUFDQyxHQUFHLENBQUM7UUFFdkNDLFFBQVFDLEdBQUcsQ0FBQyxnQkFBZ0JKLFlBQVksUUFBUTs7UUFFaEQsSUFBSSxDQUFDQSxjQUFjLENBQUNBLFdBQVdLLFVBQVUsQ0FBQyxZQUFZO1lBQ3BELE9BQU8sSUFBSVgsa0ZBQVlBLENBQUMscURBQTRDO2dCQUFFWSxRQUFRO1lBQUk7UUFDcEY7UUFFQSxNQUFNQyxRQUFRUCxXQUFXUSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDdENMLFFBQVFDLEdBQUcsQ0FBQyxVQUFVRyxPQUFPLFFBQVE7O1FBRXJDLHdDQUF3QztRQUN4QyxNQUFNRSxnQkFBZ0JoQixtRUFBWUEsQ0FDaENpQiwwQ0FBb0MsRUFDcENBLFFBQVFDLEdBQUcsQ0FBQ0UseUJBQXlCO1FBR3ZDLCtCQUErQjtRQUMvQixNQUFNLEVBQUVDLE1BQU0sRUFBRUMsSUFBSSxFQUFFLEVBQUVDLE9BQU9DLFNBQVMsRUFBRSxHQUFHLE1BQU1SLGNBQWNTLElBQUksQ0FBQ0MsT0FBTyxDQUFDWjtRQUM5RUosUUFBUUMsR0FBRyxDQUFDLFNBQVNXLE1BQU0sZUFBZUUsV0FBVyxRQUFROztRQUU3RCxJQUFJQSxhQUFhLENBQUNGLE1BQU07WUFDdEIsT0FBTyxJQUFJckIsa0ZBQVlBLENBQUMsZ0NBQTBCO2dCQUFFWSxRQUFRO1lBQUk7UUFDbEU7UUFFQSw4REFBOEQ7UUFDOUQsTUFBTSxFQUFFUSxNQUFNTSxPQUFPLEVBQUUsR0FBRyxNQUFNWCxjQUM3QlksSUFBSSxDQUFDLFlBQ0xDLE1BQU0sQ0FBQyx3Q0FDUEMsRUFBRSxDQUFDLE1BQU0xQixXQUNUMkIsTUFBTTtRQUVUckIsUUFBUUMsR0FBRyxDQUFDLFlBQVlnQixTQUFTLFFBQVE7O1FBRXpDLElBQUksQ0FBQ0EsU0FBUztZQUNaLE9BQU8sSUFBSTFCLGtGQUFZQSxDQUFDLG1DQUE2QjtnQkFBRVksUUFBUTtZQUFJO1FBQ3JFO1FBRUEsK0RBQStEO1FBQy9ELE1BQU1tQixZQUNKTCxRQUFRTSxTQUFTLEtBQUtYLEtBQUtZLEVBQUUsSUFDN0IsUUFBU0MsTUFBTSxDQUFTRixTQUFTLEtBQUtYLEtBQUtZLEVBQUU7UUFFL0MsSUFBSSxDQUFDRixXQUFXO1lBQ2QsT0FBTyxJQUFJL0Isa0ZBQVlBLENBQUMsbUVBQXVEO2dCQUFFWSxRQUFRO1lBQUk7UUFDL0Y7UUFFQSxNQUFNLEVBQUVVLEtBQUssRUFBRSxHQUFHLE1BQU1QLGNBQ3JCWSxJQUFJLENBQUMsWUFDTFEsTUFBTSxHQUNOTixFQUFFLENBQUMsTUFBTTFCO1FBRVosSUFBSW1CLE9BQU8sTUFBTUE7UUFFakIsT0FBT3RCLGtGQUFZQSxDQUFDSyxJQUFJLENBQUM7WUFBRStCLFNBQVM7UUFBSztJQUMzQyxFQUFFLE9BQU9kLE9BQU87UUFDZGIsUUFBUWEsS0FBSyxDQUFDLDJCQUEyQkE7UUFDekMsT0FBTyxJQUFJdEIsa0ZBQVlBLENBQ3JCc0IsaUJBQWlCZSxRQUFRZixNQUFNZ0IsT0FBTyxHQUFHLDRCQUN6QztZQUFFMUIsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcmF5ZXItcGxhdGZvcm0vLi9hcHAvYXBpL2NvbW1lbnRzL2RlbGV0ZS9yb3V0ZS50cz9hZjhhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcydcbmltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gREVMRVRFKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGNvbW1lbnRJZCwgcHJheWVySWQgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpXG4gICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKVxuICAgIFxuICAgIGNvbnNvbGUubG9nKCdBdXRoIEhlYWRlcjonLCBhdXRoSGVhZGVyKSAvLyBEZWJ1Z1xuXG4gICAgaWYgKCFhdXRoSGVhZGVyIHx8ICFhdXRoSGVhZGVyLnN0YXJ0c1dpdGgoJ0JlYXJlciAnKSkge1xuICAgICAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2UoJ1Rva2VuIGRlIGF1dG9yaXphw6fDo28gYXVzZW50ZSBvdSBpbnbDoWxpZG8nLCB7IHN0YXR1czogNDAxIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhdXRoSGVhZGVyLnNwbGl0KCcgJylbMV1cbiAgICBjb25zb2xlLmxvZygnVG9rZW46JywgdG9rZW4pIC8vIERlYnVnXG5cbiAgICAvLyBDbGllbnRlIGFkbWluIHBhcmEgb3BlcmHDp8O1ZXMgbm8gYmFuY29cbiAgICBjb25zdCBzdXBhYmFzZUFkbWluID0gY3JlYXRlQ2xpZW50KFxuICAgICAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMISxcbiAgICAgIHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkhXG4gICAgKVxuXG4gICAgLy8gVmVyaWZpY2FyIG8gdG9rZW4gZG8gdXN1w6FyaW9cbiAgICBjb25zdCB7IGRhdGE6IHsgdXNlciB9LCBlcnJvcjogYXV0aEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmF1dGguZ2V0VXNlcih0b2tlbilcbiAgICBjb25zb2xlLmxvZygnVXNlcjonLCB1c2VyLCAnQXV0aCBFcnJvcjonLCBhdXRoRXJyb3IpIC8vIERlYnVnXG5cbiAgICBpZiAoYXV0aEVycm9yIHx8ICF1c2VyKSB7XG4gICAgICByZXR1cm4gbmV3IE5leHRSZXNwb25zZSgnVXN1w6FyaW8gbsOjbyBhdXRvcml6YWRvJywgeyBzdGF0dXM6IDQwMSB9KVxuICAgIH1cblxuICAgIC8vIFZlcmlmaWNhciBzZSBvIHVzdcOhcmlvIMOpIG8gYXV0b3IgZG8gY29tZW50w6FyaW8gb3UgZGEgb3Jhw6fDo29cbiAgICBjb25zdCB7IGRhdGE6IGNvbW1lbnQgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdjb21tZW50cycpXG4gICAgICAuc2VsZWN0KCdhdXRob3JfaWQsIHByYXllcjpwcmF5ZXJzKGF1dGhvcl9pZCknKVxuICAgICAgLmVxKCdpZCcsIGNvbW1lbnRJZClcbiAgICAgIC5zaW5nbGUoKVxuXG4gICAgY29uc29sZS5sb2coJ0NvbW1lbnQ6JywgY29tbWVudCkgLy8gRGVidWdcblxuICAgIGlmICghY29tbWVudCkge1xuICAgICAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2UoJ0NvbWVudMOhcmlvIG7Do28gZW5jb250cmFkbycsIHsgc3RhdHVzOiA0MDQgfSlcbiAgICB9XG5cbiAgICAvLyBVc3XDoXJpbyBwb2RlIGRlbGV0YXIgc2UgZm9yIGF1dG9yIGRvIGNvbWVudMOhcmlvIG91IGRhIG9yYcOnw6NvXG4gICAgY29uc3QgY2FuRGVsZXRlID0gXG4gICAgICBjb21tZW50LmF1dGhvcl9pZCA9PT0gdXNlci5pZCB8fCBcbiAgICAgIChjb21tZW50LnByYXllciBhcyBhbnkpLmF1dGhvcl9pZCA9PT0gdXNlci5pZFxuXG4gICAgaWYgKCFjYW5EZWxldGUpIHtcbiAgICAgIHJldHVybiBuZXcgTmV4dFJlc3BvbnNlKCdWb2PDqiBuw6NvIHRlbSBwZXJtaXNzw6NvIHBhcmEgZGVsZXRhciBlc3RlIGNvbWVudMOhcmlvJywgeyBzdGF0dXM6IDQwMSB9KVxuICAgIH1cblxuICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdjb21tZW50cycpXG4gICAgICAuZGVsZXRlKClcbiAgICAgIC5lcSgnaWQnLCBjb21tZW50SWQpXG5cbiAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yXG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiB0cnVlIH0pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVsZXRpbmcgY29tbWVudDonLCBlcnJvcilcbiAgICByZXR1cm4gbmV3IE5leHRSZXNwb25zZShcbiAgICAgIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0Vycm8gaW50ZXJubyBkbyBzZXJ2aWRvcicsIFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50IiwiTmV4dFJlc3BvbnNlIiwiREVMRVRFIiwicmVxdWVzdCIsImNvbW1lbnRJZCIsInByYXllcklkIiwianNvbiIsImF1dGhIZWFkZXIiLCJoZWFkZXJzIiwiZ2V0IiwiY29uc29sZSIsImxvZyIsInN0YXJ0c1dpdGgiLCJzdGF0dXMiLCJ0b2tlbiIsInNwbGl0Iiwic3VwYWJhc2VBZG1pbiIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwiZGF0YSIsInVzZXIiLCJlcnJvciIsImF1dGhFcnJvciIsImF1dGgiLCJnZXRVc2VyIiwiY29tbWVudCIsImZyb20iLCJzZWxlY3QiLCJlcSIsInNpbmdsZSIsImNhbkRlbGV0ZSIsImF1dGhvcl9pZCIsImlkIiwicHJheWVyIiwiZGVsZXRlIiwic3VjY2VzcyIsIkVycm9yIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/comments/delete/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcomments%2Fdelete%2Froute&page=%2Fapi%2Fcomments%2Fdelete%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcomments%2Fdelete%2Froute.ts&appDir=%2FUsers%2Fdanilobrizola%2FAI%20Development%2Fprayer-platform%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdanilobrizola%2FAI%20Development%2Fprayer-platform&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();