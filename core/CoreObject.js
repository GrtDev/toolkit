/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core
 */

// @formatter:off

var log                     = require('../debug/Log').getInstance();
var inherits                = require('./utils/inherits');
var destructibleMixin       = require('./destructibleMixin');

//@formatter:on

destructibleMixin.apply(CoreObject);

// Keeps count of the number of objects created.
CoreObject.numObjects = 0;

/**
 * Creates a new Object with log capabilities and a destruct method.
 * @mixes destructibleMixin
 * @constructor
 */
function CoreObject() {

    /**
     * Contains a unique id of this object
     * @memberOf sector22/core.CoreObject
     * @private
     * @property _id {string}
     * @readonly
     */
    Object.defineProperty(this, '_id', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: ('core_object_' + ++CoreObject.numObjects)
    });

}

/**
 * Function to easily inherit the CoreObject class.
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function extend
 * @param constructor {function} the class that should inherit the CoreObject
 */
CoreObject.prototype.extend = function (constructor) {
    inherits(constructor, this);
    constructor.extend = CoreObject.extend;
}

CoreObject.extend = CoreObject.prototype.extend;


/**
 * Function to log a debug message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logDebug
 * @param var_args {...object} - messages and/or data to log.
 */
CoreObject.prototype.logDebug = function (var_args) {
    Array.prototype.unshift.call(arguments, this);
    log.debug.apply(this, arguments);
}
/**
 * Function to log a info message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logInfo
 * @param var_args {...object} - messages and/or data to log.
 */
CoreObject.prototype.logInfo = function (var_args) {
    Array.prototype.unshift.call(arguments, this);
    log.info.apply(this, arguments);
}
/**
 * Function to log a warning message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logWarn
 * @param var_args {...object} - messages and/or data to log.
 */
CoreObject.prototype.logWarn = function (var_args) {
    Array.prototype.unshift.call(arguments, this);
    log.warn.apply(this, arguments);
}
/**
 * Function to log a error message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logError
 * @param var_args {...object} - messages and/or data to log.
 */
CoreObject.prototype.logError = function (var_args) {
    Array.prototype.unshift.call(arguments, this);
    log.error.apply(this, arguments);
}
/**
 * Function to log a fatal error message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logFatal
 * @param var_args {...object} - messages and/or data to log.
 */
CoreObject.prototype.logFatal = function (var_args) {
    Array.prototype.unshift.call(arguments, this);
    log.fatal.apply(this, arguments);
}

module.exports = CoreObject