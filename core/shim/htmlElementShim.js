// @formatter:off
var log                     = require('../../debug/Log');
var polyfillName            = 'html element shim'
// @formatter:on

/**
 * Provides requestAnimationFrame in a cross browser way.
 * From: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 * @param global {object}
 */
function addClassFunctions ( global ) {

    var proto = HTMLElement.prototype;


    if( typeof proto[ 'hasClass' ] !== 'undefined' || typeof proto[ 'addClass' ] !== 'undefined' || typeof proto[ 'toggleClass' ] !== 'undefined' || typeof proto[ 'removeClass' ] !== 'undefined' ) {
        return log.error( polyfillName, 'Element already has this function' );
    }

    proto.hasClass = function ( name ) {
        return (new RegExp( '\\b' + name + '\\b' )).test( this.className )
    }
    proto.addClass = function ( name ) {
        if(!this.hasClass(name)) this.className = this.className + ' ' + name;
    }
    proto.removeClass = function ( name ) {
        this.className = this.className.replace( new RegExp( '\\b' + name + '\\b' ), '' )
    }
    proto.toggleClass = function ( name ) {


        if( this.hasClass( name ) ) {

            this.removeClass( name );

        } else {

            this.addClass( name )

        }

    }


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

    addClassFunctions( opt_global );

}

if( typeof Object.freeze === 'function' ) Object.freeze( polyfill ) // lock the object to minimize accidental changes
module.exports = polyfill;
