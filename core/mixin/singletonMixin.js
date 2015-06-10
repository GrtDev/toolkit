/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 *
 * @mixin
 * @param constructor
 */
singletonMixin = {};

/**
 * Applies the functions to the given constructor
 * @param constructor {function}
 */
singletonMixin.apply = function ( constructor ) {

    // the actual function, for docs see the auto-complete filler function below
    constructor.getInstance = function () {
        
        return constructor.prototype._singletonInstance || new constructor();

    }

    // the actual function, for docs see the auto-complete filler function below
    constructor.singletonCheck = function (singleton) {

        if(!singleton) throw new Error( 'singletonCheck needs a reference to the singleton!' );

        // Force the use of a single instance (Singleton)
        if( constructor.prototype._singletonInstance ) {

            throw new Error( 'Attempting to instantiate an Singleton. Use `getInstance` method to retrieve a reference instead!' );

        }

        constructor.prototype._singletonInstance = singleton;

    }

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


};


module.exports = singletonMixin;