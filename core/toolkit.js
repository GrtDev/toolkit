/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
var log = require( 'debug/Log' ).getInstance();

/**
 * Core object containing global scope object and info about this framework.
 * @namespace
 */
var toolkit = {};
var toolkitGlobals = {};


toolkit.defineNamespace = function ( name, value ) {

    if( toolkit.hasNamespace( name ) ) return log.error( 'toolkit', 'namespace \'' + name + '\' already exists!' );

    toolkitGlobals[ name ] = value;

}

toolkit.getNamespace = function ( name, opt_defaultValue ) {

    if( opt_defaultValue !== undefined && !toolkit.hasNamespace( name ) ) toolkitGlobals[ name ] = opt_defaultValue;

    return toolkitGlobals[ name ];

}

toolkit.hasNamespace = function ( name ) {

    return toolkitGlobals[ name ] !== undefined;
    
}


if( typeof Object.freeze === 'function' ) Object.freeze( toolkit ) // lock the object to minimize accidental changes

module.exports = toolkit;


