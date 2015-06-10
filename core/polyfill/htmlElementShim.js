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
    
    
    if( typeof proto['addClass'] !== 'undefined' || typeof proto['toggleClass'] !== 'undefined'  || typeof proto['removeClass'] !== 'undefined') {
        return log.error(polyfillName, 'ERROR');
    }
    
    proto.addClass = function(name){
        
    }
    proto.removeClass = function(name){
        
    }
    proto.toggleClass = function(name){
        console.log('toggle: ' + this.className);
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
