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
     * @type {boolean}
     * @private
     */
    constructor.prototype.__isDestructed = false;

    // the actual function, for docs see the auto-complete filler function below
    constructor.prototype.destruct = function () {

        if( this.__isDestructed ) return;

        // log debug message when in debug mode
        if( this.debug && typeof this.logDebug === 'function' ) this.logDebug( '-- destruct --' );

        this.__isDestructed = true;

    }

    // the actual function, for docs see the auto-complete filler function below
    Object.defineProperty( constructor.prototype, 'isDestructed', {
        enumerable: true,
        get: function () { return this.__isDestructed; }
    } );

}

// ======== Only here so code auto-completion works...  ========
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