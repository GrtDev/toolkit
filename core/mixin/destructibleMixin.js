/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 *
 */

/**
 * @mixin destructibleMixin
 */
destructibleMixin = {};


/**
 * Returns whether the object has been destroyed and made available for the garbage collector.
 * @function isDestructed
 * @public
 * @returns {boolean}
 * @readonly
 */
destructibleMixin.isDestructed = false; // Only here so auto completion works.


/**
 * Destroys the object and makes it available for the garbage collector.
 * @memberOf sector22/core.CoreObject
 * @public
 * @function destruct
 */
destructibleMixin.destruct = function () {

    // Only here so auto completion works.
    // check the setDestruct function for the actual implementation.

}


/**
 * Sets the destruct function for this class, will also automatically
 * call the super classes destruct function when called.
 * @function setDestruct
 * @protected
 * @param destructFunction {function}
 */
destructibleMixin.setDestruct = function ( destructFunction ) {

    var _parentDestruct = this.destruct;
    var _this = this;

    this.destruct = function () {

        if( _this.isDestructed ) return;

        if( _this.debug && typeof _this.logDebug === 'function' ) _this.logDebug.call( _this, '-- destruct --' );

        destructFunction.call( _this );

        if( typeof _parentDestruct === 'function' ) {

            _parentDestruct.call( _this )

        } else {

            Object.defineProperty( _this, 'isDestroyed', {
                enumerable: true,
                get: function () {
                    return true;
                }
            } );

        }

    }

}


/**
 * Adds the mixin functionality to the constructors prototype
 * @param constructor {function}
 * @param opt_unsafe {boolean=false} won't double check if we are overwriting anything if true
 */
destructibleMixin.apply = function ( constructor, opt_unsafe ) {

    var proto = constructor.prototype;

    if( !opt_unsafe && (
        proto[ 'destruct' ] !== undefined ||
        proto[ 'isDestructed' ] !== undefined ||
        proto[ 'setDestruct' ] !== undefined ) ) {

        throw new Error( 'Failed to apply the mixin because some property name is already taken!' );

    }

    proto.setDestruct               = destructibleMixin.setDestruct;

};


if( typeof Object.freeze === 'function') Object.freeze(destructibleMixin) // lock the object to minimize accidental changes

module.exports = destructibleMixin;