/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils
 */

/**
 * @namespace
 */
var objectUtils = {};


/**
 * Checks if the object has certain methods.
 *
 * @param object {object}      - the object to check.
 * @param var_args {...string}   - method names to check
 * @returns {boolean}   - returns wether the object has all the defined methods.
 */
objectUtils.hasMethods = function (object, var_args) {
    var i = 1, methodName;
    while ((methodName = arguments[i++])) if(typeof object[methodName] != 'function') return false;
    return true;
}


var classNameRegExp = new RegExp('function (.{1,})\\(');
/**
 * Retrieves the 'class name' of an object
 * @param object {object}
 * @returns {string}
 */
objectUtils.getName = function (object) {
    var results = classNameRegExp.exec(object.constructor.toString());
    return (results && results.length > 1) ? results[1] : object.constructor.toString();
}

module.exports = objectUtils;