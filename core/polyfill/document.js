var polyfillApplied;

/**
 * Basic document functionality polyfill.
 * @param { object } [ opt_global = global || window ] - Defines the global scope on which the polyfill is applied to.
 */
module.exports = function documentPolyfill ( opt_global ) {

    if( polyfillApplied ) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;

    if( !opt_global.document ) return;

    /**
     * Fixes the document.contains function for IE
     * @see: http://stackoverflow.com/questions/5629684/how-to-check-if-element-exists-in-the-visible-dom/16820058#16820058
     * @param global {object}
     */
    opt_global.document.contains = opt_global.document.contains ? opt_global.document.contains : opt_global.document.body.contains;

}