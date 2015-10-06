var polyfillApplied;

/**
 * Basic console functionality polyfill.
 * @param { object } [ opt_global = global || window ] - Defines the global scope on which the polyfill is applied to.
 */
module.exports = function consolePolyfill ( opt_global ) {

    if( polyfillApplied ) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;

    /**
     * Fixes console.log functionality for <IE10
     * @param global {object}
     */
    if( !opt_global.console ) opt_global.console = {};
    if( !opt_global.console.log ) opt_global.console.log = function () {}

}