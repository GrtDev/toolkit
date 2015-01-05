/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

var ObjectUtils = require('../utils/ObjectUtils');

var newLineRegExp = new RegExp('.*(\\n)', 'g');


/**
 * A function to handle all logs. It retrieves the name of the sender
 * and tries to 'prettify' the log message.
 *
 * @param level {string} - level of importance of the data.
 * @param data {obect} - message / object to log.
 * @param opt_sender {string|object} - sender of the message.
 * @constructor
 */
function log(level, data, opt_sender) {
    if (typeof console == 'undefined') return;

    if (Log.PRETTY_FORMATTING) {
        if (opt_sender instanceof Object) opt_sender = ObjectUtils.getName(opt_sender);

        var len = 0;

        if (data instanceof Object) {
            (typeof console[level.method] === 'function') ? console[level.method](data) : console.log(data);
            data = '';
        }
        else {
            if (!data && data != 0) data = 'null';

            var lastLine = data.toString().replace(newLineRegExp, '');
            lastLine = lastLine.replace('\r', '');

            len = lastLine.length;
            var value, index = 0;
            while (lastLine.indexOf('\t') >= 0) {
                value = (8 - (lastLine.indexOf('\t') + index) % 8) - 1;
                len += value;
                index += value;
                lastLine = lastLine.replace(/\t/, '.');
            }
        }

        while (len < 120) data += ' ', len++;
        data += ' - ' + opt_sender;
    }

    (typeof console[level.method] === 'function') ? console[level.method](data) : console.log(data);
}

// @formatter:off

function LogLevel(name, method){
    this.name   = name;
    this.method = method;
}

LogLevel.INFO    = new LogLevel('info'      ,'info');
LogLevel.DEBUG   = new LogLevel('debug'     ,'debug');
LogLevel.WARNING = new LogLevel('warning'   ,'warn');
LogLevel.FATAL   = new LogLevel('fatal'     ,'fatal');
LogLevel.ERROR   = new LogLevel('error'     ,'error');


function Log() {

    // Force the use of a single instance (Singleton)
    if (Log.prototype._singletonInstance) {
        // log warn
        return Log.prototype._singletonInstance;
    }
    Log.prototype._singletonInstance = this;

    Log.ALERT_FATALS = false;
    Log.PRETTY_FORMATTING = true;

    /**
     * Private function to delegate and log all messages.
     * @param level {string} - (LogLevel) importance of the message.
     * @param message {string|object} - Message or object to log.
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param opt_data {object=} - (optional) Object to log.
     */
    var logMessage = function(level, message, sender, opt_data)
    {
        message = level.name + (level === LogLevel.WARNING ? ':\t' : ':\t\t') + message;

        log(level, message, sender);
        if(opt_data) log(level, opt_data, sender);

        if(level === LogLevel.FATAL && Log.ALERT_FATALS) alert('Fatal Error: ' + message);
    };

    /**
     * Function to log a debug message,
     * @param message {string|object} - Message or object to log.
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param opt_data {object=} - (optional) Object to log.
     */
    this.debug = function (message, sender, opt_data) {
        logMessage(LogLevel.DEBUG, message, sender, opt_data);
    };
    /**
     * Function to log a info message,
     * @param message {string|object} - Message or object to log.
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param opt_data {object=} - (optional) Object to log.
     */
    this.info = function (message, sender, opt_data) {
        logMessage(LogLevel.INFO, message, sender, opt_data);
    };
    /**
     * Function to log a warning message,
     * @param message {string|object} - Message or object to log.
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param opt_data {object=} - (optional) Object to log.
     */
    this.warn = function (message, sender, opt_data) {
        logMessage(LogLevel.WARNING, message, sender, opt_data);
    };
    /**
     * Function to log a error message,
     * @param message {string|object} - Message or object to log.
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param opt_data {object=} - (optional) Object to log.
     */
    this.error = function (message, sender, opt_data) {
        logMessage(LogLevel.ERROR, message, sender, opt_data);
    };
    /**
     * Function to log a fatal error message,
     * @param message {string|object} - Message or object to log.
     * @param sender {string|object} - Sender of the message, a string name or a reference to the object itself.
     * @param opt_data {object=} - (optional) Object to log.
     */
    this.fatal = function (message, sender, opt_data) {
        logMessage(LogLevel.FATAL, message, sender, opt_data);
    };

}

/**
 * Retrieves a reference to the Log object.
 * @returns {Log}
 */
Log.getInstance = function () {
    return Log.prototype._singletonInstance || new Log();
};

Log.debug   = Log.getInstance().debug;
Log.warn    = Log.getInstance().warn;
Log.info    = Log.getInstance().info;
Log.error   = Log.getInstance().error;
Log.fatal   = Log.getInstance().fatal;


module.exports = Log;