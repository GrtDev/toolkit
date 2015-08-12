/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CommonEvent                 = require('../../common/events/CommonEvent');
var CoreElement                 = require('../../core/html/CoreElement');
var SelectGroup                 = require('../../data/collection/SelectGroup');

// @formatter:on

CoreElement.extend( BulletList );


/**
 * @constructor
 * @extends CoreElement
 * @param element {HTMLElement}
 */
function BulletList ( element ) {

    BulletList.super_.call( this, element );

    var _this = this;
    var _selectGroup;
    var _listElement;
    var _onClickCallback;

    var listElements = _this.findAll( 'li', true );

    if( listElements.length ) {

        _listElement = listElements[ 0 ].element.cloneNode( true );

    } else {

        _listElement = document.createElement( 'li' );

    }

    _selectGroup = new SelectGroup( listElements, 'active' );


    _this.select = function ( index ) {

        _selectGroup.select( index );

    }

    _this.onIndexClick = function ( callback ) {

        if( !_onClickCallback ) {

            for ( var i = 0, leni = _selectGroup.length; i < leni; i++ ) {
                var bullet = _selectGroup.items[ i ];
                bullet.element.addEventListener( 'click', handleBulletIndexClick );
            }

        }

        _onClickCallback = callback;

    }

    function handleBulletIndexClick ( event ) {

        var bullet = event.currentTarget.getCore();

        if( _onClickCallback ) _onClickCallback.call( null, _selectGroup.indexOf( bullet ) );

    }

    function updateLength ( length ) {

        if( _this.debug ) _this.logDebug( 'set length: ' + length );

        if( isNaN( length ) ) return _this.logError( 'Invalid length! ', length );

        if( _selectGroup.length === length ) return;

        if( _selectGroup.length > length ) {

            while ( _selectGroup.length > length ) {

                var bullet = _selectGroup.items.pop();
                _this.removeChild( bullet );
                bullet.destruct();

            }

        } else {

            while ( _selectGroup.length < length ) {

                var bullet = new CoreElement( _listElement.cloneNode( true ) );
                _this.addChild( bullet );
                _selectGroup.add( bullet );

            }

        }

    }

    Object.defineProperty( this, 'length', {
        enumerable: true,
        get: function () {
            return _selectGroup.length;
        },
        set: function ( value ) {
            updateLength( value );
        }
    } );


    _this.setDestruct( function () {

        _listElement = undefined;
        if( _selectGroup ) {
            _selectGroup.destruct();
            _selectGroup = undefined;
        }

    } );

}


module.exports = BulletList;