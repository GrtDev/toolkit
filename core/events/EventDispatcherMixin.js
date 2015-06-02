/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 *
 * Based on mrDoob's EventDispatcher
 * @see: https://github.com/mrdoob/eventdispatcher.js/
 */

var applyMixin = require( '../utils/applyMixin' );

mixin = {};

mixin.apply = function ( constructor ) {

    applyMixin( constructor, mixin );

};

/**
 * Adds an event listener to this dispatcher
 * @param type {CoreEvent}
 * @param listener {function}
 */
mixin.addEventListener = function ( type, listener ) {

    if( this._listeners === undefined ) this._listeners = {};

    var listeners = this._listeners;

    if( listeners[ type ] === undefined ) {

        listeners[ type ] = [];

    }

    if( listeners[ type ].indexOf( listener ) === -1 ) {

        listeners[ type ].push( listener );

    }

}

/**
 * Checks if this event dispatcher has this listener
 * @param type {string}
 * @param listener {function}
 * @returns {boolean}
 */
mixin.hasEventListener = function ( type, listener ) {

    if( this._listeners === undefined ) return false;

    var listeners = this._listeners;

    if( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== -1 ) {

        return true;

    }

    return false;

}

/**
 * Removes an event listener
 * @param type {string}
 * @param listener {function}
 */
mixin.removeEventListener = function ( type, listener ) {

    if( this._listeners === undefined ) return;

    var listeners = this._listeners;
    var listenerArray = listeners[ type ];

    if( listenerArray !== undefined ) {

        var index = listenerArray.indexOf( listener );

        if( index !== -1 ) {

            listenerArray.splice( index, 1 );

        }

    }

}

/**
 * Dispatches an event
 * @param event {CoreEvent}
 */
mixin.dispatchEvent = function ( event ) {

    if( this._listeners === undefined ) return;

    var listeners = this._listeners;
    var listenerArray = listeners[ event.type ];

    if( listenerArray !== undefined ) {

        if( !event.target ) event.setTarget( this );

        var array = [];
        var length = listenerArray.length;

        for ( var i = 0; i < length; i++ ) {

            array[ i ] = listenerArray[ i ];

        }

        for ( var i = 0; i < length; i++ ) {

            array[ i ].call( this, event );

        }

    }
}


module.exports = mixin;