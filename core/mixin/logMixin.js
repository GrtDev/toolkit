/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/mixin
 */


var log                     = require('../../debug/Log').getInstance();

/**
 * @mixin logMixin
 */
logMixin = {};



/**
* Function to log a debug message,
* @protected
* @function logDebug
* @param var_args {...object} - messages and/or data to log.
*/
logMixin.logDebug = function ( var_args ) {

    // super fast Array.unshift()
    // @see: https://jsperf.com/array-unshift-vs-prepend/39
    var length = arguments.length, args = new Array(length + 1);
    while(length) args[length--] = arguments[length];
    args[0] = this;

    log.debug.apply( this, args );

}
/**
 * Function to log a info message,
 * @protected
 * @function logInfo
 * @param var_args {...object} - messages and/or data to log.
 */
logMixin.logInfo = function ( var_args ) {

    // super fast Array.unshift()
    // @see: https://jsperf.com/array-unshift-vs-prepend/39
    var length = arguments.length, args = new Array(length + 1);
    while(length) args[length--] = arguments[length];
    args[0] = this;

    log.info.apply( this, args );
}
/**
 * Function to log a warning message,
 * @protected
 * @function logWarn
 * @param var_args {...object} - messages and/or data to log.
 */
logMixin.logWarn = function ( var_args ) {

    // super fast Array.unshift()
    // @see: https://jsperf.com/array-unshift-vs-prepend/39
    var length = arguments.length, args = new Array(length + 1);
    while(length) args[length--] = arguments[length];
    args[0] = this;

    log.warn.apply( this, args );

}
/**
 * Function to log a error message,
 * @protected
 * @function logError
 * @param var_args {...object} - messages and/or data to log.
 */
logMixin.logError = function ( var_args ) {

    // super fast Array.unshift()
    // @see: https://jsperf.com/array-unshift-vs-prepend/39
    var length = arguments.length, args = new Array(length + 1);
    while(length) args[length--] = arguments[length];
    args[0] = this;

    log.error.apply( this, args );

}
/**
 * Function to log a fatal error message,
 * @protected
 * @function logFatal
 * @param var_args {...object} - messages and/or data to log.
 */
logMixin.logFatal = function ( var_args ) {

    // super fast Array.unshift()
    // @see: https://jsperf.com/array-unshift-vs-prepend/39
    var length = arguments.length, args = new Array(length + 1);
    while(length) args[length--] = arguments[length];
    args[0] = this;

    log.fatal.apply( this, args );

}


/**
 * Adds the mixin functionality to the constructors prototype
 * @param constructor {function}
 * @param opt_unsafe {boolean=false} won't double check if we are overwriting anything if true
 */
logMixin.apply = function ( constructor, opt_unsafe ) {

    var proto = constructor.prototype;

    if( !opt_unsafe && (
        proto[ 'logDebug' ] !== undefined ||
        proto[ 'logInfo' ] !== undefined ||
        proto[ 'logWarn' ] !== undefined ||
        proto[ 'logError' ] !== undefined ||
        proto[ 'logFatal' ] !== undefined ) ) {

        throw new Error( 'Failed to apply the mixin because some property name is already taken!' );

    }

    proto.logDebug              = logMixin.logDebug;
    proto.logInfo               = logMixin.logInfo;
    proto.logWarn               = logMixin.logWarn;
    proto.logError              = logMixin.logError;
    proto.logFatal              = logMixin.logFatal;

};


if( typeof Object.freeze === 'function') Object.freeze(logMixin) // lock the object to minimize accidental changes

module.exports = logMixin;