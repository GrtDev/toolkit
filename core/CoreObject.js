/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core
 */

// @formatter:off

var log             = require('../debug/Log').getInstance();
var inherits        = require('./utils/inherits');

//@formatter:on

// Keeps count of the number of objects created.
CoreObject.numObjects = 0;

/**
 * Creates a new Object with log capabilities and a destruct method.
 * @constructor
 */
function CoreObject() {

    // @see CoreObject#isDestructed
    var _isDestructed;

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

    /**
     * Returns whether the object has been destroyed and made available for the garbage collector.
     * @memberOf sector22/core.CoreObject
     * @function isDestructed
     * @public
     * @returns {boolean}
     * @readonly
     */
    Object.defineProperty(this, 'isDestructed', {
        enumerable: true,
        get: function () {
            return _isDestructed;
        }
    });

    /**
     * A callback for when the object has been completely destroyed and made available for the garbage collection.
     * NOTE: Should only ever be called upon from the destruct method in this "class"
     * @memberOf sector22/core.CoreObject
     * @private
     * @function onDestructed
     */
    this.onDestructed = function () {
        _isDestructed = true;
    }
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

/**
 * Destroys the object and makes it available for the garbage collector.
 * @memberOf sector22/core.CoreObject
 * @public
 * @function destruct
 */
CoreObject.prototype.destruct = function () {
    if (this.isDestructed) return;

    // Remove event listeners and stop all activities of this class.

    this.onDestructed();
}

module.exports = CoreObject