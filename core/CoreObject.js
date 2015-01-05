/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core
 */

var Log = require('../debug/Log');

// retrieve a reference
var log = Log.getInstance();

// Keeps count of the number of objects created.
CoreObject.numObjects = 0;

/**
 * Creates a new Object with log capabilities and a destruct method.
 * @constructor
 */
function CoreObject() {

    var _isDestructed;

    /**
     * Contains a unique id of this object
     * @memberOf sector22/core.CoreObject
     * @public
     * @property id {string}
     * @readonly
     */
    Object.defineProperty(this, 'id', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: ('core_object_' + ++CoreObject.numObjects)
    });

    /**
     * Returns whether the object has been destroyed and made available for the garbage collector.
     * @memberOf sector22/core.CoreObject
     * @public
     * @property isDestructed {boolean}
     * @readonly
     */
    Object.defineProperty(this, 'isDestructed', {
        get: function () {
            return _isDestructed;
        }
    });

    /**
     * A callback for when the object has been completely destroyed and made available for the garbage collection.
     * NOTE: Should only ever be called upon from the destruct method.
     * @memberOf sector22/core.CoreObject
     * @private
     * @function onDestructed
     */
    this.onDestructed = function () {
        _isDestructed = true;
    }
}


/**
 * Function to log a debug message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logDebug
 * @param message {string|object} - Message or object to log.
 * @param opt_data {object=} - (optional) Object to log.
 */
CoreObject.prototype.logDebug = function (message, opt_data) {
    log.debug(message, this, opt_data);
}
/**
 * Function to log a info message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logInfo
 * @param message {string|object} - Message or object to log.
 * @param opt_data {object=} - (optional) Object to log.
 */
CoreObject.prototype.logInfo = function (message, opt_data) {
    log.info(message, this, opt_data);
}
/**
 * Function to log a warning message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logWarn
 * @param message {string|object} - Message or object to log.
 * @param opt_data {object=} - (optional) Object to log.
 */
CoreObject.prototype.logWarn = function (message, opt_data) {
    log.warn(message, this, opt_data);
}
/**
 * Function to log a error message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logError
 * @param message {string|object} - Message or object to log.
 * @param opt_data {object=} - (optional) Object to log.
 */
CoreObject.prototype.logError = function (message, opt_data) {
    log.error(message, this, opt_data);
}
/**
 * Function to log a fatal error message,
 * @memberOf sector22/core.CoreObject
 * @protected
 * @function logFatal
 * @param message {string|object} - Message or object to log.
 * @param opt_data {object=} - (optional) Object to log.
 */
CoreObject.prototype.logFatal = function (message, opt_data) {
    log.fatal(message, this, opt_data);
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