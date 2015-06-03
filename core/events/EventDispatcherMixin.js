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

    if( listeners[ type ] === undefined )  listeners[ type ] = [];


    if( listeners[ type ].indexOf( listener ) === -1 ) {

        listeners[ type ].push( listener );

    }

}

/**
 * Adds an event listener to this dispatcher which will be
 * automatically removed after the event is dispatched.
 * @param type {CoreEvent}
 * @param listener {function}
 */
mixin.addEventListenerOnce = function ( type, listener ) {

    listener.__isOneTimeListener = true;

    this.addEventListener( type, listener );

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

    if( !event.target ) event.setTarget( this );

    if( listenerArray !== undefined ) {

        var array = [];
        var listener;
        var i;
        var length = listenerArray.length;

        for ( i = 0; i < length; i++ ) {

            array[ i ] = listenerArray[ i ];

        }

        for ( i = 0; i < length; i++ ) {

            listener = array[ i ];
            listener.call( this, event );

            if( listener.__isOneTimeListener ) {
                listener.__isOneTimeListener = null;
                this.removeEventListener( event.type, listener );
            }

        }

    }
}


module.exports = mixin;