/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

require('../core/polyfill/corePolyfill' ).apply(global);

var singletonMixin              = require('../core/mixin/singletonMixin');
var CoreObject                  = require('../core/CoreObject');

//@formatter:on

CoreObject.extend( ResizeManager );

singletonMixin.apply( ResizeManager );


/**
 * Provides an optimized resize listener
 * @constructor
 * @singleton
 * @mixes singletonMixin
 * @extends {CoreSingleton}
 */
function ResizeManager () {

    ResizeManager.singletonCheck( this );

    ResizeManager.super_.call( this );

    var _this = this;
    var _cachedEvent;
    var _triggered;
    var _callbacks = [];
    var _callbackLength = 0;
    var _oneTimeCallbacks = [];
    var _oneTimeCallbackLength = 0;
    var _callbackLengthTotal = 0;
    var _animationFrameRequest;
    var _window = window;

    _this.addCallback = function ( callback ) {

        if( _callbacks.indexOf( callback ) !== -1 )return;

        _callbacks.push( callback );
        _callbackLength++;
        _callbackLengthTotal++;

        // if there weren't any listeners yet
        if( _callbackLengthTotal === 1 )  _window.addEventListener( 'resize', handleResizeEvents );

    }

    _this.addCallbackOnce = function ( callback ) {

        if( _callbacks.indexOf( callback ) !== -1 )return;

        _oneTimeCallbacks.push( callback );
        _oneTimeCallbackLength++;
        _callbackLengthTotal++;

        // if there weren't any listeners yet
        if( _callbackLengthTotal === 1 )  _window.addEventListener( 'resize', handleResizeEvents );

    }

    _this.removeCallback = function ( callback ) {

        // check the regular callback collection
        var index = _callbacks.indexOf( callback );

        if( index !== -1 ) {

            _callbacks.splice( index, 1 );
            _callbackLength--;
            _callbackLengthTotal--;

        }

        // check the one time callback collection
        index = _oneTimeCallbacks.indexOf( callback );

        if( index !== -1 ) {

            _oneTimeCallbacks.splice( index, 1 );
            _oneTimeCallbackLength--;
            _callbackLengthTotal--;

        }

        if( _callbackLengthTotal === 0 ) _window.removeEventListener( 'resize', handleResizeEvents );
    }

    function handleResizeEvents ( event ) {

        _cachedEvent = event;

        if( _triggered ) return;
        _triggered = true;

        _animationFrameRequest = window.requestAnimationFrame( runCallbacks );

    }

    function runCallbacks () {

        // first make a copy of the array in case a callback gets removed during the callback event.
        var array = [];

        for ( var i = 0; i < _callbackLength; i++ ) array[ i ] = _callbacks[ i ];

        for ( i = 0; i < _callbackLength; i++ ) array[ i ].call( this, _cachedEvent );

        // again for the one time listeners
        if( _oneTimeCallbackLength > 0 ) {

            array = [];

            for ( var i = 0; i < _callbackLength; i++ ) array[ i ] = _oneTimeCallbacks[ i ];

            for ( i = 0; i < _callbackLength; i++ ) {

                array[ i ].call( this, _cachedEvent );

                _this.removeCallback( array[ i ] );

            }
        }

        _triggered = false;

    }


}


module.exports = ResizeManager;

