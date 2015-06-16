/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 *
 * Based on mrDoob's EventDispatcher
 * @see: https://github.com/mrdoob/eventdispatcher.js/
 *
 */

/**
 * @mixin eventDispatcherMixin
 */
eventDispatcherMixin = {};


/**
 * Adds an event listener to this dispatcher
 * @param type {string}
 * @param listener {function}
 */
eventDispatcherMixin.addEventListener = function ( type, listener ) {

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
 * @param type {string}
 * @param listener {function}
 */
eventDispatcherMixin.addEventListenerOnce = function ( type, listener ) {

    if( this._oneTimeListeners === undefined ) this._oneTimeListeners = {};

    var listeners = this._oneTimeListeners;

    if( listeners[ type ] === undefined )  listeners[ type ] = [];


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
eventDispatcherMixin.hasEventListener = function ( type, listener ) {

    if( this._listeners === undefined ) return false;

    var listeners = this._listeners;

    if( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== -1 ) {

        return true;

    }

    listeners = this._oneTimeListeners;

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
eventDispatcherMixin.removeEventListener = function ( type, listener ) {

    var listeners;
    var listenerArray;

    if( this._listeners !== undefined ) {

        listeners = this._listeners;
        listenerArray = listeners[ type ];

        if( listenerArray !== undefined ) {

            var index = listenerArray.indexOf( listener );

            if( index !== -1 ) {

                listenerArray.splice( index, 1 );

            }

        }

    }

    if( this._oneTimeListeners !== undefined ) {

        listeners = this._oneTimeListeners;
        var listenerArray = listeners[ type ];

        if( listenerArray !== undefined ) {

            var index = listenerArray.indexOf( listener );

            if( index !== -1 ) {

                listenerArray.splice( index, 1 );

            }

        }
    }

}

/**
 * Dispatches an event
 * @param event {CoreEvent|object}
 */
eventDispatcherMixin.dispatchEvent = function ( event ) {

    var listeners;
    var listenerArray;
    var array = [];
    var listener;
    var i;
    var length

    if( this._listeners !== undefined ) {

        listeners = this._listeners;
        listenerArray = listeners[ event.type ];

        if( !event.target && typeof event.setTarget === 'function') event.setTarget( this );

        if( listenerArray !== undefined ) {

            array = [];
            length = listenerArray.length;

            for ( i = 0; i < length; i++ ) {

                array[ i ] = listenerArray[ i ];

            }

            for ( i = 0; i < length; i++ ) {

                listener = array[ i ];
                listener.call( this, event );

            }

        }
    }


    if( this._oneTimeListeners !== undefined ) {

        listeners = this._oneTimeListeners;
        listenerArray = listeners[ event.type ];

        if( !event.target ) event.setTarget( this );

        if( listenerArray !== undefined ) {

            array = [];
            length = listenerArray.length;

            for ( i = 0; i < length; i++ ) {

                array[ i ] = listenerArray[ i ];

            }

            for ( i = 0; i < length; i++ ) {

                listener = array[ i ];
                listener.call( this, event );
                this.removeEventListener(event.type, listener);

            }

        }
    }
}

/**
 * Adds the mixin functionality to the constructors prototype
 * @param constructor {function}
 * @param opt_unsafe {boolean=false} won't double check if we are overwriting anything if true
 */
eventDispatcherMixin.apply = function ( constructor, opt_unsafe ) {

    var proto = constructor.prototype;

    if( !opt_unsafe && (
        typeof proto[ 'addEventListener' ] !== 'undefined' ||
        typeof proto[ 'addEventListenerOnce' ] !== 'undefined' ||
        typeof proto[ 'hasEventListener' ] !== 'undefined' ||
        typeof proto[ 'dispatchEvent' ] !== 'undefined' ) ) {

        throw new Error( 'Failed to apply the mixin because some property name is already taken!' );

    }

    proto.addEventListener          = eventDispatcherMixin.addEventListener;
    proto.addEventListenerOnce      = eventDispatcherMixin.addEventListenerOnce;
    proto.hasEventListener          = eventDispatcherMixin.hasEventListener;
    proto.dispatchEvent             = eventDispatcherMixin.dispatchEvent;

};


if( typeof Object.freeze === 'function') Object.freeze(eventDispatcherMixin) // lock the object to minimize accidental changes

module.exports = eventDispatcherMixin;