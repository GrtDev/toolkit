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


var classNameRegExp = /^function\s(\w+)\s?\((\w*|,|\s)*\)/;
/**
 * Retrieves the 'class name' of an object
 * @param object {object}
 * @returns {string}
 */
objectUtils.getName = function (object) {
    var results = classNameRegExp.exec((typeof object === 'function') ? object.toString() : object.constructor.toString());
    return (results && results.length > 1) ? results[1] : object.constructor.toString();
}

if( typeof Object.freeze === 'function') Object.freeze(objectUtils) // lock the object to minimize accidental changes
module.exports = objectUtils;