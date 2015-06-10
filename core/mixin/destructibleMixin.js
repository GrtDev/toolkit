/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 *
 * @mixin
 */
destructibleMixin = {};

/**
 * Function to call to apply the mixin properties to given constructor
 * @param constructor
 */
destructibleMixin.apply = function ( constructor ) {

    /**
     * Adds the destruct function to the class which also automatically calls its super classes
     * @param destructFunction {function}
     */
    constructor.prototype.setDestruct = function ( destructFunction ) {

        var _parentDestruct = this.destruct;
        var _this = this;

        this.destruct = function () {

            if( _this.isDestructed ) return;

            if( _this.debug && typeof _this.logDebug === 'function' ) _this.logDebug.call( _this, '-- destruct --' );

            destructFunction.call( _this );

            if( typeof _parentDestruct === 'function' ) {

                _parentDestruct.call()

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

}

// ======== Only here so code auto-completion works...  ========
/**
 * Sets the destruct function for this class, will also automatically
 * call the super classes destruct function when called.
 * @function setDestruct
 * @public
 * @param destructFunction {function}
 */
destructibleMixin.setDestruct = function  (destructFunction) {};
/**
 * Returns whether the object has been destroyed and made available for the garbage collector.
 * @function isDestructed
 * @public
 * @returns {boolean}
 * @readonly
 */
destructibleMixin.isDestructed = false;
/**
 * Destroys the object and makes it available for the garbage collector.
 * @memberOf sector22/core.CoreObject
 * @public
 * @function destruct
 */
destructibleMixin.destruct = function () {}
// ============ end of code auto-complete section ==============


module.exports = destructibleMixin;