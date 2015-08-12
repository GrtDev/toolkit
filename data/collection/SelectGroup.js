/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils
 */

var DEFAULT_CLASS = 'selected';

function SelectGroup ( opt_items, opt_class ) {

    var _this = this;
    var _selectedClass;
    var _selectedClassRegExp;
    var _items = [];
    var _itemsLength = 0;
    var _selected;
    var _selectedIndex;
    var _hasClassMethods;

    _this.debug = true;

    _this.add = function ( item ) {

        _items.push( item );
        _itemsLength++;

        _hasClassMethods = typeof item.removeClass === 'function' && typeof item.addClass === 'function';

    }

    _this.remove = function ( item ) {

        if( !item ) return;

        var index = _items.indexOf( item );

        if( index < 0 ) return;

        _items.splice( 1, index );
        _itemsLength--;
    }

    _this.indexOf = function ( item ) {

        return _items.indexOf( item );

    }

    /**
     * Select item
     * @param item {object|number} object or index number
     */
    _this.select = function ( item ) {

        if( _this.debug ) console.log( 'select: ', item );

        if( item === null || item === undefined ) {

            _selectedIndex = -1;

        } else {

            // convert item to index
            if( !isFinite( item ) ) item = _items.indexOf( item );

            if( item < 0 || item > _itemsLength || item === _selectedIndex ) return;

            _selectedIndex = item;

        }


        if( _selectedClass ) {

            if( _selected ) {

                if( _hasClassMethods ) _selected.removeClass( _selectedClass );
                else _selected.className = _selected.className.replace( _selectedClassRegExp, '' );

            }

            _selected = _selectedIndex >= 0 ? _items[ _selectedIndex ] : null;

            // check if the item already has the class, if not - add it
            if( _selected && !_selectedClassRegExp.test( _selected ) ) {

                if( _hasClassMethods ) _selected.addClass( _selectedClass );
                else _selected.className = _selected.className += ' ' + _selectedClass;

            }

        } else {

            _selected = _selectedIndex >= 0 ? _items[ _selectedIndex ] : null;

        }

    }

    Object.defineProperty( this, 'selectedClass', {
        enumerable: true,
        get: function () {
            return _selectedClass;
        },
        set: function ( value ) {

            if( value === _selectedClass ) return;

            if( _selectedClass && _selected ) {

                if( _hasClassMethods ) _selected.removeClass( _selectedClass );
                else _selected.className = _selected.className.replace( _selectedClassRegExp, '' );

            }

            _selectedClass = value;
            _selectedClassRegExp = new RegExp( '\\b\\s?' + _selectedClass + '\\b' );

            // check if the item already has the class, if not - add it
            if( _selected && !_selectedClassRegExp.test( _selected ) ) {

                if( _hasClassMethods ) _selected.addClass( _selectedClass );
                else _selected.className = _selected.className += ' ' + _selectedClass;

            }
        }
    } );

    Object.defineProperty( this, 'items', {
        enumerable: true,
        get: function () {
            return _items;
        }
    } );

    Object.defineProperty( this, 'length', {
        enumerable: true,
        get: function () {
            return _itemsLength;
        }
    } );

    Object.defineProperty( this, 'selected', {
        enumerable: true,
        get: function () {
            return _selected;
        }
    } );

    Object.defineProperty( this, 'selectedIndex', {
        enumerable: true,
        get: function () {
            return _selectedIndex;
        }
    } );

    _this.destruct = function () {

        if( _this.isDestructed ) return;

        // @formatter:off

        _this                   = undefined;
        _selectedClass          = undefined;
        _selectedClassRegExp    = undefined;
        _items                  = undefined
        _itemsLength            = undefined;
        _selected               = undefined;
        _selectedIndex          = undefined;

        Object.defineProperty( this, 'isDestructed', {
            enumerable: true,
            value: true
        } );

        // @formatter:on
    }


    if( opt_class ) {

        if( typeof opt_class === 'string' ) _this.selectedClass = opt_class;
        else  _this.selectedClass = DEFAULT_CLASS;

    }

    if( opt_items ) {

        for ( var i = 0, leni = opt_items.length; i < leni; i++ ) {

            _this.add( opt_items[ i ] );

        }
    }

}

module.exports = SelectGroup;