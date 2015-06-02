/**
 * Provides requestAnimationFrame in a cross browser way.
 * From: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 * @param global {object}
 */
function animationFramePolyfill ( global ) {

    var lastTime = 0;
    var vendors = [ 'webkit', 'moz' ];
    for ( var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x ) {
        global.requestAnimationFrame = global[ vendors[ x ] + 'RequestAnimationFrame' ];
        global.cancelAnimationFrame =
            global[ vendors[ x ] + 'CancelAnimationFrame' ] || global[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if( !global.requestAnimationFrame )
        global.requestAnimationFrame = function ( callback, element ) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max( 0, 16 - (currTime - lastTime) );
            var id = global.setTimeout( function () {
                    callback( currTime + timeToCall );
                },
                timeToCall );
            lastTime = currTime + timeToCall;
            return id;
        };

    if( !global.cancelAnimationFrame ) global.cancelAnimationFrame = function ( id ) {
        clearTimeout( id );
    };

}

/**
 * Fixes console.log functionality for <IE10
 * @param global
 */
function consolePolyfill ( global ) {
    if( !global.console ) global.console = {};
    if( !global.console.log ) global.console.log = function () {};
}


var polyfillApplied;
var corePolyfill = {}

/**
 * Applies basic polyfill to add basic cross-browser functionality
 * Aims to support IE9+
 * @function apply
 * @param opt_global {object=}
 */
corePolyfill.apply = function ( opt_global ) {

    if(polyfillApplied) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;
    animationFramePolyfill( opt_global );
    consolePolyfill( opt_global );

}

module.exports = corePolyfill;
