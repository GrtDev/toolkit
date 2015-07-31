/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

// @formatter:off

var specialCharacterRegExp      = /[^\w-]/g;
var cameCaseRexp                = /[^\w]+(\w)/g;
var hypenateRegExp              = /([A-Z]+)|(?:[^\w]+)(\w)/g;


// @formatter:on

/**
 * Collection of useful util functions when dealing with strings
 * @namespace
 */
var stringUtils = {};

stringUtils.camelCase = function camelCase ( string ) {

    if(!string || !string.length) return '';
    string = string.replace( cameCaseRexp, camelCaseReplacer );
    string = string.charAt( 0 ).toLowerCase() + string.slice( 1 ); // force lower case on first letter
    return string;

}

stringUtils.hyphenate = function hyphenate ( string ) {

    if(!string || !string.length) return '';
    string = string.replace( hypenateRegExp, hyphenateReplacer );
    string = string.replace(/^-/, ''); // make sure we didn't place a hyphen as the first character
    return string;

}

function camelCaseReplacer ( match, group1 ) {

    return group1 ? group1.toUpperCase() : '';

}

function hyphenateReplacer ( match, group1, group2 ) {

    if(group1) {

        return '-' + group1.toLowerCase();

    } else if(group2) {

        return '-' + group2.toLowerCase();

    }

    return '';

}


if( typeof Object.freeze === 'function' ) Object.freeze( stringUtils ) // lock the object to minimize accidental changes

module.exports = stringUtils;