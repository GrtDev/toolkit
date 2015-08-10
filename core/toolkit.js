/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
var log = require( '../debug/Log' ).getInstance();

/**
 * Core object containing global scope object and info about this framework.
 * @namespace
 */
var toolkit = {};
var toolkitGlobals = {};


toolkit.defineGlobal = function ( name, value ) {

    if( toolkit.hasGlobal( name ) ) return log.error( 'toolkit', 'global object with the name \'' + name + '\' already exists!' );

    toolkitGlobals[ name ] = value;

}

toolkit.getGlobal = function ( name, opt_defaultValue ) {

    if( opt_defaultValue !== undefined && !toolkit.hasGlobal( name ) ) toolkitGlobals[ name ] = opt_defaultValue;

    return toolkitGlobals[ name ];

}

toolkit.hasGlobal = function ( name ) {

    return toolkitGlobals[ name ] !== undefined;
    
}


if( typeof Object.freeze === 'function' ) Object.freeze( toolkit ) // lock the object to minimize accidental changes

module.exports = toolkit;


