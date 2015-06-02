/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils
 */


var absoluteRegExp = /^(?:\/|[a-z]+:\/\/)/i;
var relativeRegExp

/**
 * Collection of useful util functions when dealing with urls
 * @namespace
 */
var urlUtils = {};




if( typeof Object.freeze === 'function') Object.freeze(urlUtils) // lock the object to minimize accidental changes
module.exports = urlUtils;