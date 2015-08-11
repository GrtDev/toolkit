/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CoreHTMLElement             = require('../../core/html/CoreElement');
var SearchEvent                 = require('./SearchEvent');

// @formatter:on

CoreElement.extend( SearchInput );


var SEARCH_INPUT_CLASS = 'js-search-input';
var SEARCH_SUBMIT_CLASS = 'js-search-submit';

/**
 * @constructor
 * @extends CoreHTMLElement
 * @param element {HTMLElement}
 */
function SearchInput ( element, opt_searchOnEnter, opt_searchOnChange ) {

    SearchInput.super_.call( this, element );

    // @formatter:off

    var _this                       = this;
    var _inputField                 = (_this.tagName === 'input') ? _this.element : (_this.find( SEARCH_INPUT_CLASS ) || _this.find( 'input' ));

    if( !_inputField ) return _this.logError( 'Failed to retrieve the search input field!' );

    var _submitButton               = _this.find( SEARCH_SUBMIT_CLASS );
    var _value                      = _inputField.value;

    var _searchOnEnter              = opt_searchOnEnter;
    var _searchOnChange             = opt_searchOnChange;
    var _triggerLength              = 3;
    var _triggerDelay               = -1;
    var _delayTimeout;

    // @formatter:on

    _this.debug = true;

    _inputField.addEventListener( 'keydown', handleInputEvent );
    _inputField.addEventListener( 'keyup', handleInputEvent );
    _inputField.addEventListener( 'change', handleInputEvent );

    if( _submitButton ) _submitButton.addEventListener( 'click', handleSubmitButtonClick );


    function handleSubmitButtonClick ( event ) {

        _this.search();

    }

    function handleInputEvent ( event ) {

        // check if ENTER was pressed
        if( _searchOnEnter && event.type === 'keydown' && event.keyCode === 13 ) {

            _this.search();
            return;

        }

        _this.setValue( _inputField.value );

    }

    _this.setValue = function ( value ) {

        if( _value === value ) return;

        _value = value;

        if( _inputField.value !== _value ) _inputField.value = _value;

        _this.dispatchEvent( new SearchEvent( SearchEvent.CHANGE ) );

        if( _this.debug ) _this.logDebug( 'value change: ' + _this.value );

        if( _value.length <= 0 ) {

            if( _this.debug ) _this.logDebug( 'clear' );
            _this.dispatchEvent( new SearchEvent( SearchEvent.CLEAR ) );
            return;

        }

        if( _searchOnChange && _value.length >= _triggerLength ) {

            if( _triggerDelay > 0 ) {

                if( _delayTimeout ) clearTimeout( _delayTimeout );

                _delayTimeout = setTimeout( _this.search, _triggerDelay );

            } else {

                _this.search();

            }
        }

    }

    _this.search = function () {

        if( _this.debug ) _this.logDebug( 'search: ' + _value );

        _this.dispatchEvent( new SearchEvent( SearchEvent.SEARCH ) );

    }

    Object.defineProperty( this, 'value', {
        enumerable: true,
        get: function () {
            return _value;
        }
    } );

    Object.defineProperty( this, 'searchOnChange', {
        enumerable: true,
        get: function () {
            return _searchOnChange;
        },
        set: function ( value ) {
            _searchOnChange = value;
        }
    } );

    Object.defineProperty( this, 'searchOnEnter', {
        enumerable: true,
        get: function () {
            return _searchOnEnter;
        },
        set: function ( value ) {
            _searchOnEnter = value;
        }
    } );

    Object.defineProperty( this, 'triggerLength', {
        enumerable: true,
        get: function () {
            return _triggerLength;
        },
        set: function ( value ) {
            _triggerLength = value;
        }
    } );

    Object.defineProperty( this, 'triggerDelay', {
        enumerable: true,
        get: function () {
            return _triggerDelay;
        },
        set: function ( value ) {
            _triggerDelay = value;
        }
    } );


    _this.setDestruct( function () {

        _this = undefined;

    } );

}


module.exports = SearchInput;