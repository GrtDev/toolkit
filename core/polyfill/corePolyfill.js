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

    if( !global.requestAnimationFrame ) {

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

    }

    if( !global.cancelAnimationFrame ) {

        global.cancelAnimationFrame = function ( id ) { clearTimeout( id ) };

    }

}

/**
 * Fixes console.log functionality for <IE10
 * @param global {object}
 */
function consolePolyfill ( global ) {

    if( !global.console ) global.console = {};
    if( !global.console.log ) global.console.log = function () {}

}

/**
 * Fixes the document.contains function for IE
 * @see: http://stackoverflow.com/questions/5629684/how-to-check-if-element-exists-in-the-visible-dom/16820058#16820058
 * @param global {object}
 */
function documentPolyfill ( global ) {

    if( !global.document ) return;
    global.document.contains = global.document.contains ? global.document.contains : global.document.body.contains;

}



var polyfillApplied;
var polyfill = {}

/**
 * Applies basic polyfill to add basic cross-browser functionality
 * Aims to support IE9+
 * @function apply
 * @param opt_global {object=}
 */
polyfill.apply = function ( opt_global ) {

    if( polyfillApplied ) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;

    animationFramePolyfill( opt_global );
    consolePolyfill( opt_global );
    documentPolyfill( opt_global );

}

if( typeof Object.freeze === 'function' ) Object.freeze( polyfill ) // lock the object to minimize accidental changes
module.exports = polyfill;
