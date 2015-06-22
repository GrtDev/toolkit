/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CommonEvent                 = require('../../core/events/CommonEvent');
var CoreHTMLElement             = require('../../core/CoreHTMLElement');

// @formatter:on

CoreHTMLElement.extend( BulletListMenu );


/**
 * @constructor
 * @extends AbstractSlideShow
 * @param element {HTMLElement}
 * @param opt_autoCreate {boolean}
 */
function BulletListMenu ( element, opt_autoCreate ) {

    BulletListMenu.super_.call( this, element );

    var _this = this;
    var _listElement;
    var _listElements;
    var _listElementsLength;
    var _autoCreate;
    var _selectedBulletIndex;
    var _previousBulletIndex;
    var _onBulletClick;
    var _listening;


    _autoCreate = (opt_autoCreate === undefined) ? true : opt_autoCreate;
    _listElements = [];
    _listElementsLength = 0;

    if( _autoCreate ) {

        _listElement = _this.element.getElementsByTagName( 'li' )[ 0 ];
        _this.empty();

    } else {

        var bulletItems = _this.element.getElementsByTagName( 'li' );

        for ( var i = 0, leni = bulletItems.length; i < leni; i++ ) {

            _listElements.push( new CoreHTMLElement( bulletItems[ i ] ) );
            _listElementsLength++;

        }
    }


    _this.select = function ( index ) {

        if( _selectedBulletIndex === index ) return;

        _previousBulletIndex = _selectedBulletIndex;
        _selectedBulletIndex = index;

        update();

    }

    _this.setLength = function ( length ) {

        if( _listElementsLength === length ) return;

        if( _listElementsLength > length ) {

            while ( _listElements.length > length ) {

                var bullet = _listElements.pop();
                _listElementsLength--;
                _this.removeChild( bullet );
                bullet.destruct();

            }

        } else {

            while ( _listElements.length < length ) {

                var bullet = new CoreHTMLElement( _listElement.cloneNode( true ) );
                _this.addChild( bullet );
                _listElements.push( bullet );
                _listElementsLength++;

            }

        }

    }

    function update () {

        var bullet = _listElements[ _this.currentSlideIndex ];
        bullet.addClass( 'selected' );

        bullet = _listElements[ _this.previousSlideIndex ];
        bullet.removeClass( 'selected' );

    }


    function handleClickEvent ( event ) {

        if( typeof _onBulletClick === 'function' ) {

            var bullet = event.target;

            var index;

            for ( var i = 0, leni = _listElementsLength; i < leni; i++ ) {
                var listElement = [ i ];

                if(listElement.element === bullet) {
                    index = i;
                    break;
                }

            }

            _onBulletClick.call( _this, index );
        }

    }

    Object.defineProperty( this, 'length', {
        enumerable: true,
        get: function () {
            return _listElementsLength;
        }
    } );

    Object.defineProperty( this, 'onBulletClick', {
        enumerable: true,
        get: function () {
            return _onBulletClick;
        },
        /**
         * @param value {function}
         */
        set: function ( value ) {

            if( value === _onBulletClick ) return;

            _onBulletClick = value;

            if( !_onBulletClick ) {

                _this.element.addEventListener( 'click', handleClickEvent );

            }
            else {

                _this.element.removeEventListener( 'click', handleClickEvent );

            }
        }
    } );


    _this.setDestruct( function () {

        _listElement = undefined;
        _listElements = undefined;
        _autoCreate = undefined;
        _selectedBulletIndex = NaN;
        _previousBulletIndex = NaN;

    } );

}


module.exports = BulletListMenu;