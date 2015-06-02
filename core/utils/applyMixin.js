/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/utils
 */

var log = require( '../../debug/Log' );


/**
 * Applies the mixin's properties to the constructors prototype
 * @function apply
 * @param constructor {function}
 * @param mixin {object}
 * @param exclude {string='apply'} property not to add to the prototype
 */
function applyMixin ( constructor, mixin, opt_exclude ) {

    if(typeof opt_exclude === 'undefined') opt_exclude = 'apply';

    if( !constructor || typeof constructor !== 'function' ) {

        log.getInstance().error( 'constructor can not be null! And has to be a function!' );
        return;

    }

    var proto = constructor.prototype;

    for ( var property in mixin ) {

        if( !mixin.hasOwnProperty( property ) || (opt_exclude && opt_exclude === property)) continue;

        if( typeof proto[ property ] !== 'undefined' ) {
            log.getInstance().error( 'Error while applying mixin, constructor\'s prototype already has properties with the same name.' );
            continue;
        }

        constructor.prototype[ property ] = mixin[ property ];

    }

}

module.exports = applyMixin;