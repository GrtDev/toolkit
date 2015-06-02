/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var CoreObject                  = require('./CoreObject');

//@formatter:on

/**
 * Returns an instance of the Page Loader.
 * @static
 * @function getInstance
 * @returns {PageLoader} The page loader instance.
 */
CoreSingleton.getInstance = function () {

    return CoreSingleton.prototype._singletonInstance || new CoreSingleton();

};

CoreObject.extend( CoreSingleton );


/**
 * Core Singleton to be be inherited by other singletons.
 * @constructor
 * @singleton
 * @extends {CoreObject}
 */
function CoreSingleton () {

    // Force the use of a single instance (Singleton)
    if( CoreSingleton.prototype._singletonInstance ) {

        throw new Error('Attempting to instantiate an Singleton. Use `getInstance` method to retrieve a reference instead!');

    }

    CoreSingleton.prototype._singletonInstance = this;

}


module.exports = CoreSingleton;