var polyfillApplied;

/**
 * Basic location functionality polyfill.
 * @param { object } [ opt_global = global || window ] - Defines the global scope on which the polyfill is applied to.
 */
module.exports = function locationPolyfill ( opt_global ) {

    if( polyfillApplied ) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;


    if( !opt_global.location ) return;

    // Fixes origin for IE
    if( !opt_global.location.origin ) {

        opt_global.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    }

}