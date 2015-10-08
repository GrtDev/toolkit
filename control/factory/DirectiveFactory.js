/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var singletonMixin              = require('../../core/mixin/singletonMixin');
var CoreObject                  = require('../../core/CoreObject');
var Map                         = require('../../data/collection/Map');

//@formatter:on

CoreObject.extend( DirectiveFactory );

singletonMixin.apply( DirectiveFactory );


/**
 * Provides an optimized resize listener
 * @constructor
 * @singleton
 * @mixes singletonMixin
 * @extends {CoreObject}
 */
function DirectiveFactory () {

    DirectiveFactory.singletonCheck( this );

    DirectiveFactory.super_.call( this );

    this.__directives = {};


}

/**
 * Updates the container by searching and initializing directives
 * @param {HTMLElement} opt_container
 */
DirectiveFactory.prototype.update = function ( opt_container ) {


    if( !opt_container ) opt_container = document;

    if( this.debug ) this.logDebug( 'updating content directives' );


    for ( var name in this.__directives ) {

        if( !this.__directives.hasOwnProperty( name ) ) continue;

        // @formatter:off

        var directive   = this.__directives[ name ];
        var elements   = directive.elements;
        var instances   = directive.instances;
        var newElements    = opt_container.querySelectorAll( '[' + name + ']' );

        // @formatter:on

        for ( var i = 0, leni = newElements.length; i < leni; i++ ) {

            var newElement = newElements[ i ];

            if( elements.indexOf( newElement ) < 0 ) {

                if( this.debug ) this.logDebug( 'initializing new directive, name: ' + name + ', element:', newElement );

                elements.push( newElement );
                instances.push( new directive.constructor.apply( null, directive.params ? [ newElement ].concat( directive.params ) : [ newElement ] ) );

            }

        }

    }

}

DirectiveFactory.prototype.setDirective = function ( name, constructor, opt_params ) {

    if( this.debug ) this.logDebug( 'set directive: name: \'' + name + '\', constructor: ' + constructor + ', params:', opt_params );

    if( this.__directives.hasOwnProperty( name ) ) return this.logError( 'A directive with the name: \'' + name + '\' already exists!' );

    this.__directives[ name ] = {
        constructor: constructor,
        params: opt_params,
        elements: [],
        instances: []
    }

}


module.exports = DirectiveFactory;