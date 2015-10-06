/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils/focus
 */
var CoreObject = require( '../../core/CoreObject' )

CoreObject.extend( FocusListener );

/**
 * Creates a new FocusListener to listen for document focus status changes.
 * @param onChangeCallback {function} - The callback to be called when the focus state changes, should accept a {boolean} as argument.
 * @constructor
 * @extends sector22/core.CoreObject
 */
function FocusListener ( onChangeCallback ) {

    var _this = this,
        _onChangeCallback = onChangeCallback,
        _hasFocus = true,
        _enabled,
    // for modern browsers
        _hiddenProperty,
        _visibilityChangeEvent;

    if( typeof document.hasFocus === 'function' ) _hasFocus = document.hasFocus();

    // Set the name of the hidden property and the change event for visibility
    // @link https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
    if( typeof document[ 'hidden' ] !== 'undefined' ) { // Opera 12.10 and Firefox 18 and later support
        _hiddenProperty = 'hidden';
        _visibilityChangeEvent = 'visibilitychange';
    } else if( typeof document[ 'mozHidden' ] !== 'undefined' ) {
        _hiddenProperty = 'mozHidden';
        _visibilityChangeEvent = 'mozvisibilitychange';
    } else if( typeof document[ 'msHidden' ] !== 'undefined' ) {
        _hiddenProperty = 'msHidden';
        _visibilityChangeEvent = 'msvisibilitychange';
    } else if( typeof document[ 'webkitHidden' ] !== 'undefined' ) {
        _hiddenProperty = 'webkitHidden';
        _visibilityChangeEvent = 'webkitvisibilitychange';
    }


    /**
     * Starts listening for changing focus events
     * @memberOf sector22/utils/focus.FocusListener
     * @public
     * @function enable
     */
    this.enable = function () {
        if( _enabled || this.isDestructed ) return;
        _enabled = true;

        window.addEventListener( 'blur', handleFocusEvent, false );
        window.addEventListener( 'focus', handleFocusEvent, false );
        if( typeof document[ _hiddenProperty ] !== "undefined" ) document.addEventListener( _visibilityChangeEvent, handleFocusEvent, false );
    }

    /**
     * Stops listening for changing focus events
     * @memberOf sector22/utils/focus.FocusListener
     * @public
     * @function disable
     */
    this.disable = function () {
        if( !_enabled || this.isDestructed ) return;
        _enabled = false;

        window.removeEventListener( 'blur', handleFocusEvent );
        window.removeEventListener( 'focus', handleFocusEvent );
        if( typeof document[ _hiddenProperty ] !== "undefined" ) document.removeEventListener( _visibilityChangeEvent, handleFocusEvent );
    }


    /**
     * Handles window focus events
     * @memberOf sector22/utils/focus.FocusListener
     * @private
     * @param event
     */
    function handleFocusEvent ( event ) {
        var oldFocus = _hasFocus;
        switch ( event.type ) {
            case 'blur':
                _hasFocus = false;
                break;
            case 'focus':
                _hasFocus = true;
                break;
            case _visibilityChangeEvent:
                _hasFocus = !document[ _hiddenProperty ];
                break;
            default:
                throw new Error( 'uncaught event type: ' + event.type );
        }
        // check if the focus has changed & whether the callback is set.
        if( oldFocus !== _hasFocus && typeof _onChangeCallback === 'function' ) _onChangeCallback( _hasFocus );
    }

    /**
     * @memberOf sector22/utils/focus.FocusListener
     * @type {function} - The function to be called when the focus changes, should accept the new focus state as a parameter {boolean}.
     */
    Object.defineProperty( this, 'onChangeCallback', {
        get: function () {
            return _onChangeCallback;
        },
        set: function ( value ) {
            if( _this.isDestructed ) {
                _this.logError( 'Attempting to set the onChangeCallback even though this Object has been destructed!' );
                return;
            }
            _onChangeCallback = value;
        }
    } );

    /**
     * @memberOf sector22/utils/focus.FocusListener
     * @public
     * @type {boolean} - Whether the focus listener is enabled
     */
    Object.defineProperty( this, 'enabled', {
        get: function () {
            return _enabled;
        },
        set: function ( value ) {
            value ? _this.enable() : _this.disable();
        }
    } );

    /**
     * @memberOf sector22/utils/focus.FocusListener
     * @public
     * @returns {boolean} - Whether the document has focus.
     * @readonly
     */
    Object.defineProperty( this, 'hasFocus', {
        get: function () {
            return _hasFocus;
        }
    } );

}

/**
 * @memberOf sector22/utils/focus.FocusListener
 * @see module:sector22/core.CoreObject#destruct
 */
FocusListener.prototype.destruct = function () {
    if( this.isDestructed ) return;
    this.disable();
    this.onChangeCallback = null;
    FocusListener.super_.prototype.destruct.call( this );
}

module.exports = FocusListener;