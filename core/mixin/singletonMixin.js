/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

/**
 * @mixin singletonMixin
 */
singletonMixin = {};



// ======== Only here so code auto-completion works...  ========
/**
 * Returns an instance of the Singleton
 * @static
 * @function getInstance
 * @returns {*} The singleton instance.
 */
singletonMixin.getInstance = function  (  ) {};


/**
 * A function to call upon construction of the singleton
 * to make sure that it is the only one of its type out there.
 * @param singleton {object} - reference to the singleton
 */
singletonMixin.singletonCheck = function  ( singleton ) {};
// ============ end of code auto-complete section ==============



/**
 * Applies the functions to the given constructor
 * @param constructor {function}
 * @param opt_unsafe {boolean=false} won't double check if we are overwriting anything if true
 */
singletonMixin.apply = function ( constructor, opt_unsafe ) {

    if( !opt_unsafe && (
        constructor[ 'getInstance' ] !== undefined ||
        constructor[ 'singletonCheck' ] !== undefined ) ) {

        throw new Error( 'Failed to apply the mixin because some property name is already taken!' );

    }

    // @see: singletonMixin.getInstance
    constructor.getInstance = function () {

        return constructor.prototype._singletonInstance || new constructor();

    }

    // @see: singletonMixin.singletonCheck
    constructor.singletonCheck = function (singleton) {

        if(!singleton) throw new Error( 'singletonCheck needs a reference to the singleton (this) !' );

        // Force the use of a single instance (Singleton)
        if( constructor.prototype._singletonInstance ) {

            throw new Error( 'Attempting to instantiate an Singleton. Use `getInstance` method to retrieve a reference instead!' );

        }

        constructor.prototype._singletonInstance = singleton;

    }
};



if( typeof Object.freeze === 'function') Object.freeze(singletonMixin) // lock the object to minimize accidental changes

module.exports = singletonMixin;