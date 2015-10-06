var polyfillApplied;

/**
 * Provides requestAnimationFrame in a cross browser way.
 * @see: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 * @param { object } [ opt_global = global || window ] - Defines the global scope on which the polyfill is applied to.
 */
module.exports = function animationFramePolyfill ( opt_global ) {

    if( polyfillApplied ) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;

    var lastTime = 0;
    var vendors = [ 'webkit', 'moz' ];

    for ( var x = 0; x < vendors.length && !opt_global.requestAnimationFrame; ++x ) {

        opt_global.requestAnimationFrame = opt_global[ vendors[ x ] + 'RequestAnimationFrame' ];
        opt_global.cancelAnimationFrame =
            opt_global[ vendors[ x ] + 'CancelAnimationFrame' ] || opt_global[ vendors[ x ] + 'CancelRequestAnimationFrame' ];

    }

    if( !opt_global.requestAnimationFrame ) {

        opt_global.requestAnimationFrame = function ( callback, element ) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max( 0, 16 - (currTime - lastTime) );
            var id = opt_global.setTimeout( function () {
                    callback( currTime + timeToCall );
                },
                timeToCall );
            lastTime = currTime + timeToCall;
            return id;
        };

    }

    if( !opt_global.cancelAnimationFrame ) {

        opt_global.cancelAnimationFrame = function ( id ) { clearTimeout( id ) };

    }

}