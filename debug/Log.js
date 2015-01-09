/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

var newLineRegExp = new RegExp('.*(\\n)', 'g');
var classNameRegExp = new RegExp('function (.{1,})\\(');


Log.ALERT_FATALS = false;
Log.PRETTY_FORMATTING = true;
Log.SENDER_PADDING = 120; // defines how much padding is given to the sender name

/**
 * Light-weight (Singleton) logging class for logging messages and/or data to the console.
 * @private
 * @constructor
 */
function Log() {

    // Force the use of a single instance (Singleton)
    if(Log.prototype._singletonInstance) {
        Log.error('Attempting to instantiate a Log object but this is a Singleton! Use `getInstance` method to retrieve a reference instead!')
        return null;
    }
    Log.prototype._singletonInstance = this;

    /**
     * Function to log a debug message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.debug = function (sender, var_args) {
        Array.prototype.unshift.call(arguments, LogLevel.DEBUG);
        log.apply(this, arguments);
    };
    /**
     * Function to log a info message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.info = function (sender, var_args) {
        Array.prototype.unshift.call(arguments, LogLevel.INFO);
        log.apply(this, arguments);
    };
    /**
     * Function to log a warning message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.warn = function (sender, var_args) {
        Array.prototype.unshift.call(arguments, LogLevel.WARNING);
        log.apply(this, arguments);
    };
    /**
     * Function to log a error message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.error = function (sender, var_args) {
        Array.prototype.unshift.call(arguments, LogLevel.ERROR);
        log.apply(this, arguments);
    };
    /**
     * Function to log a fatal error message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.fatal = function (sender, var_args) {
        Array.prototype.unshift.call(arguments, LogLevel.FATAL);
        log.apply(this, arguments);
    };

}

/**
 * Retrieves a reference to the Log object.
 * @static
 * @function getInstance
 * @returns {Log}
 */
Log.getInstance = function () {
    return Log.prototype._singletonInstance || new Log();
};

// @formatter:off
Log.debug   = Log.getInstance().debug;
Log.warn    = Log.getInstance().warn;
Log.info    = Log.getInstance().info;
Log.error   = Log.getInstance().error;
Log.fatal   = Log.getInstance().fatal;


module.exports = Log;

/**
* A helper object to save information about a log level & the console method to call.
* @param name {string} - name of the level
* @param method {string} - name of the console method to call
* @constructor
 */
function LogLevel(name, method){
    this.name   = name;
    this.method = method;
}

LogLevel.INFO    = new LogLevel('info'      ,'info');
LogLevel.DEBUG   = new LogLevel('debug'     ,'debug');
LogLevel.WARNING = new LogLevel('warning'   ,'warn');
LogLevel.FATAL   = new LogLevel('fatal'     ,'fatal');
LogLevel.ERROR   = new LogLevel('error'     ,'error');
//@formatter:on


/**
 * A function to handle all logs. It retrieves the name of the sender
 * and tries to 'prettify' the log message.
 *
 * @function log
 * @param level {LogLevel} - level of importance of the data.
 * @param sender {string|object} - sender of the message.
 * @param var_args {...object} - messages and/or data to log.
 */
function log(level, sender, var_args) {
    if(typeof console === 'undefined') return;

    var logMethod = (typeof console[level.method] === 'function') ? console[level.method] : console.log;

    if(arguments.length === 3 && typeof arguments[2] === 'string' && Log.PRETTY_FORMATTING) { // if the only thing that is begin logged is a string message...

        var message = arguments[2];
        var report = level.name + (level === LogLevel.WARNING ? ':\t' : ':\t\t') + message; // prepend level name to the message

        if(sender instanceof Object) { // retrieve constructor name of the object
            var results = classNameRegExp.exec(sender.constructor.toString());
            sender = (results && results.length > 1) ? results[1] : sender.constructor.toString();
        }

        var lastLine = report.replace(newLineRegExp, '').replace('\r', '');

        var len = lastLine.length;
        var value, index = 0;
        while (lastLine.indexOf('\t') >= 0) { // loop through tab character and calculate the offset
            value = (8 - (lastLine.indexOf('\t') + index) % 8) - 1;
            len += value;
            index += value;
            lastLine = lastLine.replace(/\t/, '.');
        }

        while (len < Log.SENDER_PADDING) report += ' ', len++; // creates the indent for the sender name
        report += ' - ' + sender;

        logMethod.call(this, report); // log message & sender
        if(level === LogLevel.FATAL && Log.ALERT_FATALS && message.length ) alert('Fatal Error: ' + message); // throw alert if the error is fatal

    } else if(arguments.length > 2) {

        log(level, sender, ''); // log the sender
        logMethod.apply(this, Array.prototype.slice.call(arguments, 2, arguments.length)); // log messages and/or data

    }

}
