/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var singletonMixin              = require('../../core/mixin/singletonMixin');
var CoreObject                  = require('../../core/CoreObject');

//@formatter:on

CoreObject.extend( NotificationCenter );

singletonMixin.apply( NotificationCenter );


/**
 * Singleton for conveying global notifications
 * @constructor
 * @singleton
 * @extends {CoreObject}
 * @mixes singletonMixin
 */
function NotificationCenter () {

    NotificationCenter.singletonCheck( this );

    NotificationCenter.super_.call( this );

    var _this = this;
    var _observers;
    var _oneTimeObservers;


    /**
     * Adds a notification observer
     * @function
     * @public
     * @param type {string}
     * @param listener {function}
     */
    _this.addObserver = function ( type, listener ) {

        if(_this.debug) _this.logDebug('add observer: ' + type);

        if( _observers === undefined ) _observers = {};

        if( _observers[ type ] === undefined )  _observers[ type ] = [];


        if( _observers[ type ].indexOf( listener ) === -1 ) {

            _observers[ type ].push( listener );

        }

    }

    /**
     * Adds a notification observer that will be removed right after the notification has been dispatched.
     * @function
     * @public
     * @param type {string}
     * @param listener {function}
     */
    _this.addObserverOnce = function ( type, listener ) {

        if(_this.debug) _this.logDebug('add observer once: ' + type);

        if( _oneTimeObservers === undefined ) _oneTimeObservers = {};


        if( _oneTimeObservers[ type ] === undefined )  _oneTimeObservers[ type ] = [];


        if( _oneTimeObservers[ type ].indexOf( listener ) === -1 ) {

            _oneTimeObservers[ type ].push( listener );

        }

    }

    /**
     * Checks if this notification center has this observer
     * @function
     * @public
     * @param type {string}
     * @param listener {function}
     * @returns {boolean}
     */
    _this.hasObserver = function ( type, listener ) {


        if( _observers !== undefined ) {

            if( _observers[ type ] !== undefined && _observers[ type ].indexOf( listener ) !== -1 ) {

                return true;

            }

        }

        if( _observers !== undefined ) {

            if( _observers[ type ] !== undefined && _observers[ type ].indexOf( listener ) !== -1 ) {

                return true;

            }

        }

        return false;

    }

    /**
     * Removes an observer
     * @function
     * @public
     * @param type {string}
     * @param listener {function}
     */
    _this.removeObserver = function ( type, listener ) {

        if(_this.debug) _this.logDebug('remove observer: ' + type);

        var observerArray;

        if( _observers !== undefined ) {

            observerArray = _observers[ type ];

            if( observerArray !== undefined ) {

                var index = observerArray.indexOf( listener );

                if( index !== -1 ) observerArray.splice( index, 1 );

            }

        }

        if( _oneTimeObservers !== undefined ) {

            observerArray = _oneTimeObservers[ type ];

            if( observerArray !== undefined ) {

                var index = observerArray.indexOf( listener );

                if( index !== -1 )  observerArray.splice( index, 1 );

            }
        }

    }


    /**
     * Dispatches a notification
     * @protected
     * @param notification {object}
     */
    _this.notify = function ( notification ) {

        if(_this.debug) _this.logDebug('notify: ', notification);

        var observerArray;
        var array = [];
        var listener;
        var i;
        var length

        if( _observers !== undefined ) {

            observerArray = _observers[ notification.type ];

            if( observerArray !== undefined ) {

                length = observerArray.length;
                array = new Array( length );

                for ( i = 0; i < length; i++ ) {

                    array[ i ] = observerArray[ i ];

                }

                for ( i = 0; i < length; i++ ) {

                    listener = array[ i ];
                    listener.call( this, notification );

                }

            }
        }


        if( _oneTimeObservers !== undefined ) {

            observerArray = _oneTimeObservers[ notification.type ];

            if( observerArray !== undefined ) {

                length = observerArray.length;
                array = new Array( length );

                for ( i = 0; i < length; i++ ) {

                    array[ i ] = observerArray[ i ];

                }

                for ( i = 0; i < length; i++ ) {

                    listener = array[ i ];
                    listener.call( this, notification );
                    _this.removeObserver( notification.type, listener );

                }

            }
        }
    }


}

module.exports = NotificationCenter;

