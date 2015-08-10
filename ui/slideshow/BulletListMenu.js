/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CommonEvent                 = require('../../common/events/CommonEvent');
var CoreHTMLElement             = require('../../core/html/CoreElement');

// @formatter:on

CoreHTMLElement.extend( BulletListMenu );


/**
 * @constructor
 * @extends AbstractSlideShow
 * @param element {HTMLElement}
 * @param opt_autoCreate {boolean}
 */
function BulletListMenu ( element ) {

    BulletListMenu.super_.call( this, element );

    var _this = this;
    var _listElement;
    var _listElements;
    var _listElementsLength;
    var _autoCreate;
    var _selectedBulletIndex;
    var _previousBulletIndex;
    var _onBulletIndexClick;

    _listElements = [];
    _listElementsLength = 0;


    var bulletItems = _this.element.getElementsByTagName( 'li' );
    if(bulletItems.length) _listElement = bulletItems[ 0 ].cloneNode( true );

    for ( var i = 0, leni = bulletItems.length; i < leni; i++ ) {

        _listElements.push( new CoreHTMLElement( bulletItems[ i ] ) );
        _listElementsLength++;

    }


    _this.select = function ( index ) {

        if( _this.debug ) _this.logDebug( 'select: ' + index );

        if( index < 0 || index >= _listElementsLength || _selectedBulletIndex === index ) return;

        _previousBulletIndex = _selectedBulletIndex;
        _selectedBulletIndex = index;

        update();

    }

    function updateBulletsLength ( length ) {

        if( _this.debug ) _this.logDebug( 'set length: ' + length );

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

        if( _this.debug ) _this.logDebug( 'update', _listElements );

        var bullet = _listElements[ _selectedBulletIndex ];
        bullet.addClass( 'selected' );

        if( _previousBulletIndex >= 0 ) {

            bullet = _listElements[ _previousBulletIndex ];
            bullet.removeClass( 'selected' );

        }

    }


    function handleClickEvent ( event ) {

        if( _this.debug ) _this.logDebug( 'handle click: ', event );

        if( typeof _onBulletIndexClick === 'function' ) {

            var bullet = event.target;
            var listElement;
            var index = -1;

            for ( var i = 0; i < _listElementsLength; i++ ) {

                listElement = _listElements[ i ];

                if( listElement.element === bullet ) {
                    index = i;
                    break;
                }

            }

            if( index < 0 ) return _this.logError( 'Failed to retrieve bullet index' );

            _onBulletIndexClick.call( _this, index );
        }

    }

    Object.defineProperty( this, 'length', {
        enumerable: true,
        get: function () {
            return _listElementsLength;
        },
        set: function ( value ) {
            updateBulletsLength( value );
        }
    } );

    Object.defineProperty( this, 'onBulletIndexClick', {
        enumerable: true,
        get: function () {
            return _onBulletIndexClick;
        },
        /**
         * @param value {function}
         */
        set: function ( value ) {

            if( value === _onBulletIndexClick ) return;

            _onBulletIndexClick = value;

            if( !_onBulletIndexClick ) {

                _this.element.removeEventListener( 'click', handleClickEvent );

            }
            else {

                _this.element.addEventListener( 'click', handleClickEvent );

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