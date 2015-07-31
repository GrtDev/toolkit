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
 * @function
 * @public
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
 * @function
 * @public
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
 * @function
 * @public
 * @param type {string}
 * @param listener {function}
 * @returns {boolean}
 */
eventDispatcherMixin.hasEventListener = function ( type, listener ) {

    var listeners;

    if( this._listeners !== undefined ) {

        listeners = this._listeners;

        if( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== -1 ) {

            return true;

        }

    }

    if( this._oneTimeListeners !== undefined ) {

        listeners = this._oneTimeListeners;

        if( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== -1 ) {

            return true;

        }

    }

    return false;

}

/**
 * Removes an event listener
 * @function
 * @public
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

            if( index !== -1 ) listenerArray.splice( index, 1 );

        }

    }

    if( this._oneTimeListeners !== undefined ) {

        listeners = this._oneTimeListeners;
        listenerArray = listeners[ type ];

        if( listenerArray !== undefined ) {

            var index = listenerArray.indexOf( listener );

            if( index !== -1 ) listenerArray.splice( index, 1 );

        }
    }

}


/**
 * Removes all event listeners
 * @public
 * @function
 */
eventDispatcherMixin.removeAllEventListeners = function () {

    this._listeners = undefined;
    this._oneTimeListeners = undefined;

}


/**
 * Dispatches an event
 * @protected
 * @param event {CommonEvent|object}
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

        if( event.target === undefined ) event.target = this;

        if( listenerArray !== undefined ) {

            length = listenerArray.length;
            array = new Array( length );

            for ( i = 0; i < length; i++ ) {

                array[ i ] = listenerArray[ i ];

            }

            for ( i = 0; i < length; i++ ) {

                listener = array[ i ];
                listener.call( undefined, event );

            }

        }
    }


    if( this._oneTimeListeners !== undefined ) {

        listeners = this._oneTimeListeners;
        listenerArray = listeners[ event.type ];

        if( event.target === undefined ) event.target = this;

        if( listenerArray !== undefined ) {

            length = listenerArray.length;
            array = new Array( length );

            for ( i = 0; i < length; i++ ) {

                array[ i ] = listenerArray[ i ];

            }

            for ( i = 0; i < length; i++ ) {

                listener = array[ i ];
                listener.call( undefined, event );
                this.removeEventListener( event.type, listener );

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
        proto[ 'addEventListener' ] !== undefined ||
        proto[ 'addEventListenerOnce' ] !== undefined ||
        proto[ 'hasEventListener' ] !== undefined ||
        proto[ 'removeAllEventListeners' ] !== undefined ||
        proto[ 'dispatchEvent' ] !== undefined ) ) {

        throw new Error( 'Failed to apply the mixin because some property name is already taken!' );

    }

    proto.addEventListener = eventDispatcherMixin.addEventListener;
    proto.addEventListenerOnce = eventDispatcherMixin.addEventListenerOnce;
    proto.hasEventListener = eventDispatcherMixin.hasEventListener;
    proto.removeAllEventListeners = eventDispatcherMixin.removeAllEventListeners;
    proto.dispatchEvent = eventDispatcherMixin.dispatchEvent;

};


if( typeof Object.freeze === 'function' ) Object.freeze( eventDispatcherMixin ) // lock the object to minimize accidental changes

module.exports = eventDispatcherMixin;