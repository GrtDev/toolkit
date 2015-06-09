/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils/key
 */


var CoreObject = require( '../../core/CoreObject' )

CoreObject.extend( KeyMapper );

/**
 * Creates a mapper for directly coupling Keyboard events to callbacks, without having to bother about event filtering.
 * @param opt_target {HTMLElement=window} - Defines on which object the listeners will be attached to.
 * @constructor
 * @extends {CoreObject}
 */
function KeyMapper ( opt_target, opt_autoEnable ) {
    var _this = this;
    var _callbackCollection = {};
    var _callbackCollectionLength = 0;
    var _paramsCollection = {};
    var _enabled;
    var _target = opt_target || window;
    var _autoEnable = typeof opt_autoEnable === 'undefined' || opt_autoEnable;
    var _callbacks;
    var _params;
    var _i;


    /**
     * Maps a callback to the given key code, and saves the arguments to use.
     * @memberOf sector22/utils/keys.KeyMapper
     * @public
     * @param keyCode {number} - the key code to listen to.
     * @param callback {function} - the callback to call when the key is pressed
     * @param opt_params {array=} - optional arguments to pass onto the callback when triggered.
     */
    this.map = function ( keyCode, callback, opt_params ) {

        if( this.isDestructed ) return;

        keyCode = String( keyCode );

        if( !( keyCode in _callbackCollection) ) {
            _callbackCollection[ keyCode ] = [ callback ];
            _paramsCollection[ keyCode ] = [ opt_params ];
            _callbackCollectionLength++;
        }
        else {
            _callbackCollection[ keyCode ].push( callback );
            _paramsCollection[ keyCode ].push( opt_params );
        }

        if( _autoEnable && !_enabled ) _this.enable();
    }

    /**
     * Removes a mapped callback.
     * @memberOf sector22/utils/keys.KeyMapper
     * @public
     * @param keyCode {number} - the key code the callback was mapped to.
     * @param callback - the callback to remove.
     */
    this.unmap = function ( keyCode, callback ) {
        if( !( keyCode in _callbackCollection) ) {
            _this.logError( callback( 'Callback of this key could not be found!' ) );
            return;
        }
        var index = _callbackCollection[ keyCode ].indexOf( callback );
        if( index >= 0 ) {
            _callbackCollection[ keyCode ].splice( index, 1 );
            _paramsCollection[ keyCode ].splice( index, 1 );
            _callbackCollectionLength--;
        }
    }

    /**
     * Clears all callbacks and corresponding parameter info.
     * @memberOf sector22/utils/keys.KeyMapper
     * @public
     */
    this.clear = function () {
        _callbackCollection = {};
        _callbackCollectionLength = 0;
        _paramsCollection = {};
        _callbacks = null;
    }

    /**
     * Handles the key down events & triggers the appropriate callbacks.
     * @memberOf sector22/utils/keys.KeyMapper
     * @private
     * @param event - the Event to handle
     */
    function handleKeyDownEvent ( event ) {

        if( String( event.keyCode ) in _callbackCollection ) {

            _callbacks = _callbackCollection[ String( event.keyCode ) ];
            _params = _paramsCollection[ String( event.keyCode ) ];

            for ( _i = 0; _i < _callbacks.length; _i++ ) _callbacks[ _i ].apply( null, _params[ _i ] );
        }

    }

    /**
     * Starts listening for key events events.
     * @memberOf sector22/utils/key.KeyMapper
     * @public
     * @function enable
     */
    this.enable = function () {
        if( _enabled || this.isDestructed ) return;
        _enabled = true;

        _target.addEventListener( 'keydown', handleKeyDownEvent, false );
    }

    /**
     * Stops listening for key events.
     * @memberOf sector22/utils/key.KeyMapper
     * @public
     * @function disable
     */
    this.disable = function () {
        if( !_enabled || this.isDestructed ) return;
        _enabled = false;

        _target.removeEventListener( 'keydown', handleKeyDownEvent, false );
    }

    /**
     * @memberOf sector22/utils/keys.KeyMapper
     * @public
     * @type enabled {boolean} - Whether the mapper is enabled
     */
    Object.defineProperty( this, 'enabled', {
        get: function () {
            return _enabled;
        },
        set: function ( value ) {
            value ? _this.enable() : _this.disable();
        }
    } );

}

/**
 * @memberOf sector22/utils/focus.FocusListener
 * @see module:sector22/core.CoreObject#destruct
 */
KeyMapper.prototype.destruct = function () {
    if( this.isDestructed ) return;
    this.disable();
    this.clear();
    KeyMapper.super_.prototype.destruct.call( this );
}

module.exports = KeyMapper;
