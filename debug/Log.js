/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */


/**
 * Whether to throw an alert for fatal errors
 * @static
 * @type {boolean}
 */
Log.ALERT_FATALS = false;
/**
 * Defines whether to retrieve a line number from where the log was called
 * @static
 * @type {boolean}
 */
Log.LINE_NUMBER = true;
/**
 * Defines whether to retrieve a line number from where the log was called
 * @static
 * @type {boolean}
 */
Log.TIME_STAMP = true;
/**
 * Sets the indentation for the sender's name, set to -1 to disable
 * @static
 * @type {number}
 */
Log.SENDER_PADDING = 120;


// Defining properties one by one because otherwise PHPStorm can't find the right documentation. :(

/**
 * @memberOf Log
 * @type {LogLevel}
 * @static
 */
Object.defineProperty(Log,
    'DEBUG', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: new LogLevel(1, 'debug', 'debug')
    }
);
/**
 * @memberOf Log
 * @type {LogLevel}
 * @static
 */
Object.defineProperty(Log,
    'INFO', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: new LogLevel(2, 'info', 'info')
    });

/**
 * @memberOf Log
 * @type {LogLevel}
 * @static
 */
Object.defineProperty(Log,
    'WARNING', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: new LogLevel(4, 'warn', 'warn')
    });

/**
 * @memberOf Log
 * @type {LogLevel}
 * @static
 */
Object.defineProperty(Log,
    'ERROR', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: new LogLevel(8, 'error', 'error')
    });

/**
 * @memberOf Log
 * @type {LogLevel}
 * @static
 */
Object.defineProperty(Log,
    'FATAL', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: new LogLevel(16, 'fatal', 'fatal')
    });


/**
 * Returns an instance of the logger.
 * @static
 * @function getInstance
 * @returns {Log} A logger instance.
 */
Log.getInstance = function () {
    return Log.prototype._singletonInstance || new Log();
};

/**
 * Sets the minimum level of importance of messages that are logged
 * @type {LogLevel}
 */
var logLevelFilter = Log.DEBUG;
/**
 * Sets the minimum level of importance of messages that are logged.
 * Use Log.DEBUG, Log.INFO, Log.WARN, Log.ERROR or Log.FATAL
 * @static
 * @function logLevel
 * @param logLevel {LogLevel}
 */
Log.setLevel = function (logLevel) {
    if(!(logLevel instanceof LogLevel)) {
        Log.getInstance().error('Log:setLevel Invalid type of logLevel given, needs to be the type of LogLevel');
        return;
    }
    logLevelFilter = logLevel;
    // bypass log level filter by calling `log` directly
    log(Log.INFO, Log, 'Log level filter set to: ' + logLevel.name.toUpperCase());
}


/**
 * Light-weight (Singleton) logging class for logging messages and/or data to the console.
 * Use the static <i>'getInstance'</i> function to retrieve a reference to the log.
 * @name sector22/debug.Log
 * @class
 * @private
 * @constructor
 */
function Log() {

    // Force the use of a single instance (Singleton)
    if(Log.prototype._singletonInstance) {
        Log.getInstance().error('Log', 'Attempting to instantiate a Log object but this is a Singleton! Use `getInstance` method to retrieve a reference instead!');
        return null;
    }
    Log.prototype._singletonInstance = this;


    /**
     * Function to log a debug message,
     * @function debug
     * @public
     * @param sender {string|object} Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} messages and/or data to log.
     */
    this.debug = function (sender, var_args) {
        if(logLevelFilter.level > Log.DEBUG.level) return;
        Array.prototype.unshift.call(arguments, Log.DEBUG);
        log.apply(this, arguments);
    };
    /**
     * Function to log a info message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.info = function (sender, var_args) {
        if(logLevelFilter.level > Log.INFO.level) return;
        Array.prototype.unshift.call(arguments, Log.INFO);
        log.apply(this, arguments);
    };
    /**
     * Function to log a warning message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.warn = function (sender, var_args) {
        if(logLevelFilter.level > Log.WARNING.level) return;
        Array.prototype.unshift.call(arguments, Log.WARNING);
        log.apply(this, arguments);
    };
    /**
     * Function to log a error message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.error = function (sender, var_args) {
        if(logLevelFilter.level > Log.ERROR.level) return;
        Array.prototype.unshift.call(arguments, Log.ERROR);
        log.apply(this, arguments);
    };
    /**
     * Function to log a fatal error message,
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param var_args {...object} - messages and/or data to log.
     */
    this.fatal = function (sender, var_args) {
        // Always log fatal errors
        Array.prototype.unshift.call(arguments, Log.FATAL);
        log.apply(this, arguments);
    };

}

/**
 * @module sector22/debug
 * @type {Log}
 * @see Log
 */
module.exports = Log;

/**
 * A helper object to save information about a log level & the console method to call.
 * @param level {number} level of importance, used for filtering.
 * @param name {string} name of the level
 * @param method {string} name of the console method to call
 * @constructor
 */
function LogLevel(level, name, method) {
    this.level = level;
    this.name = name;
    this.method = method;
}


var lastLineRegExp = /^(.*\n)*(.*)$/;
var classNameRegExp = /^function\s(\w+)\s?\((\w*|,|\s)*\)/;
var logCallRegExp = /(\w|\.)(log)?(debug|info|warn|warning|error|fatal)\s?/i;
var stackSplitRegExp = /\s*\n\s*/gm;
var lineNumberRegExp = /:(\d+):\d+.{0,4}$/;


/**
 * A function to handle all logs. It retrieves the name of the sender
 * and tries to add information to the log message.
 *
 * @function log
 * @param level {LogLevel} - level of importance of the data.
 * @param sender {string|object} - sender of the message.
 * @param var_args {...object} - messages and/or data to log.
 */
function log(level, sender, var_args) {
    if(typeof console === 'undefined') return;

    var logMethod = (typeof console[level.method] === 'function') ? console[level.method] : console.log;

    if(arguments.length === 3 && typeof arguments[2] === 'string') { // if the only thing that is begin logged is a string message...

        var message = arguments[2];
        var report = level.name + ':\t' + message; // prepend level name to the message

        if(sender instanceof Object) { // retrieve constructor name of the object
            var results = classNameRegExp.exec((typeof sender === 'function') ? sender.toString() : sender.constructor.toString());
            sender = (results && results.length > 1) ? results[1] : sender.constructor.toString();
        }

        if(Log.SENDER_PADDING > 0) { // give the sender name a set spacing & adds a line number

            var lastLine = report.replace(lastLineRegExp, '$2');
            var len = lastLine.length;
            var value, index = 0;
            while (lastLine.indexOf('\t') >= 0) { // loop through tab character and calculate the offset
                value = (8 - (lastLine.indexOf('\t') + index) % 8) - 1;
                len += value;
                index += value;
                lastLine = lastLine.replace(/\t/, '.');
            }

            while (len < Log.SENDER_PADDING) report += ' ', len++; // creates the indent for the sender name
        }

        report += ' - ' + sender; // add sender


        if(Log.LINE_NUMBER) { // retrieve line number

            var stack = (new Error()).stack;
            stack = (stack && typeof stack === 'string') ? stack.split(stackSplitRegExp) : null; // split the calls

            if(stack && stack.length) {
                var logCallFound;
                for (var i = 0, leni = stack.length; i < leni; i++) {

                    var stackCall = stack[i];
                    var containsLog = logCallRegExp.test(stackCall);
                    if(!logCallFound) logCallFound = containsLog;

                    if(logCallFound && !containsLog) { // if the call is not a log call then this is where it originated from.
                        var results = lineNumberRegExp.exec(stackCall);
                        if(results && results[1]) report += ' :' + results[1]; // add linenumber
                        break; // terminate the loop
                    }
                }
            }
        }

        if(Log.TIME_STAMP) { // add timestamp hh:mm:ss:....
            var date = new Date();
            var value = date.getHours().toString();
            report += ', ' + '00'.slice(value.length) + value + ':';
            value = date.getMinutes().toString();
            report += '00'.slice(value.length) + value + ':';
            value = date.getSeconds().toString();
            report += '00'.slice(value.length) + value + ':';
            value = date.getMilliseconds().toString();
            report += '000'.slice(value.length) + value;
        }

        logMethod.call(this, report); // log message & sender
        if(level === LogLevel.FATAL && Log.ALERT_FATALS && message.length) alert('Fatal Error: ' + message); // throw alert if the error is fatal

    } else if(arguments.length > 2) {

        log(level, sender, ''); // log the sender
        logMethod.apply(this, Array.prototype.slice.call(arguments, 2, arguments.length)); // log messages and/or data

    }

}


