
/**
 * @namespace
 */
var paramUtils = {};

/**
 * Turns a string into CamelCase format
 * e.g.: hyphenated-string becomes: hyphenatedString;
 * @param name
 * @returns {string}
 */
paramUtils.camelCase = function (name) {

    if(!name || !name.length) return null;

    return name.replace(/[-_]([a-z])/gi, function (g) {
        return g[1].toUpperCase();
    });

}

/**
 * Turns a string into a hyphenated format.
 * e.g.: CamelCase becomes: camel-case
 * @param name
 * @returns {string}
 */
paramUtils.hyphenate = function (name) {

    if(!name || !name.length) return null;

    return name.replace(/([a-z][A-Z])/g, function (g) {
        return g[0] + '-' + g[1].toLowerCase();
    });

}

/**
 * Validates the chosen option. It looks if the object with available
 * options, contains the option that has been chosen.
 * converts the chosen option name to camelCase by default.
 *
 * @param options {object} object containing properties with the valid option names.
 * @param chosen {string} option to validate
 * @param opt_default {*} default value to return if option was not valid.
 * @param opt_useCamelCase {boolean=true} convert chose option name to camelCase
 * @returns {*} returns default value if chosen option was invalid, otherwise it returns the chosen option.
 */
paramUtils.validate = function (options, chosen, opt_default, opt_useCamelCase) {

    if(opt_useCamelCase || typeof opt_useCamelCase === 'undefined') chosen = paramUtils.camelCase(chosen);
    if(chosen && chosen.length && options.hasOwnProperty(chosen)) return options[chosen];
    return opt_default;

}


if(typeof Object.freeze === 'function') Object.freeze(paramUtils) // lock the object to minimize accidental changes
module.exports = paramUtils;