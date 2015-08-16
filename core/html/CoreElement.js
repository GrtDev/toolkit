/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core
 */

// @formatter:off

var CoreEventDispatcher             = require('./../events/CoreEventDispatcher');
var log                             = require('./../debug/Log' ).getInstance();



CoreEventDispatcher.extend( CoreElement );

var CORE_REFERENCES_PROPERTY            = '__coreElements';
var CORE_GET_PROPERTY                   = 'getCore';

//@formatter:on

/**
 * Creates a new CoreHTMLElement with basic element manipulation & log capabilities and a destruct method.
 * @constructor
 * @extends CoreEventDispatcher
 * @param {HTMLElement|CoreElement|string} element
 */
function CoreElement ( element ) {

    CoreElement.super_.call( this );

    var _this = this;
    var _element = typeof element === 'string' ? document.querySelector( element ) : element instanceof CoreElement ? element.element : element;

    if( !_element || !(_element instanceof HTMLElement) ) return _this.logError( 'element is null or an invalid type!  element: ', element );

    var _data = {};
    var _dataParsed;
    var _width;
    var _height;
    var _computedStyle;
    var _originalDisplay;
    var _matrix = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };

    // simple animation vars
    var _animationId;
    var _animationStep;
    var _animationLast;
    var _animationNow;
    var _animationTick;

    if( _element[ CORE_GET_PROPERTY ] === undefined ) {

        _element[ CORE_REFERENCES_PROPERTY ] = [ _this ];
        _element[ CORE_GET_PROPERTY ] = getCoreReference;

    } else {

        _element[ CORE_REFERENCES_PROPERTY ].push( _this );

    }


    _this.getStyle = function ( property, opt_clearCache ) {

        if( !_computedStyle || opt_clearCache ) _computedStyle = getComputedStyle( _element, null );

        return _computedStyle.getPropertyValue( property );

    }

    /**
     * Function that parses all the data attributes on the element.
     * @public
     * @function
     */
    _this.parseData = function () {

        if( _dataParsed ) return _this.logWarn( 'data was already parsed.' );
        _dataParsed = true;

        if( _this.debug ) _this.logDebug( 'parsing data attributes..' );

        var attributes = _element.attributes;
        var cameCaseRexp = /-(\w)/g;
        var dataRegExp = /^data-/i;

        for ( var i = 0, leni = attributes.length; i < leni; i++ ) {

            var attribute = attributes[ i ];

            // check if the attribute is a data value, if so save it.
            if( dataRegExp.test( attribute.nodeName ) ) {

                var name = attribute.nodeName;
                name = name.replace( dataRegExp, '' );
                name = name.replace( cameCaseRexp, camelCaseReplacer );
                _data[ name ] = attribute.nodeValue;
            }

        }

        if( _this.debug ) _this.logDebug( 'parsed data:', _this.data );

        // helper function to convert dashed variable names to camelCase.
        function camelCaseReplacer ( match, p1 ) {

            return p1 ? p1.toUpperCase() : '';

        }

    }


    _this.show = function ( opt_display ) {

        if( _this.opacity < 0 ) _this.opacity = 1;
        _element.style.display = opt_display || _originalDisplay || 'block';

    }

    _this.hide = function () {

        if( !_originalDisplay ) {
            _originalDisplay = _this.getStyle( 'display' );
            if( _originalDisplay === 'none' ) _originalDisplay = 'block';
        }
        _element.style.display = 'none';

    }


    _this.fadeIn = function ( opt_milliseconds, opt_callback ) {

        if( _animationId ) window.cancelAnimationFrame( _animationId );

        _animationStep = (1 / (opt_milliseconds || 450));
        _animationNow = _animationLast = Date.now();

        _this.opacity = 0;
        _this.show();

        _animationTick = function () {

            _animationNow = Date.now();
            _this.opacity += (_animationNow - _animationLast) * _animationStep;
            _animationLast = _animationNow;

            if( _this.opacity < 1 ) {

                _animationId = window.requestAnimationFrame( _animationTick );

            } else {

                _animationId = undefined;
                if( typeof opt_callback === 'function' ) opt_callback.call( this );

            }
        };

        _animationTick();

    }

    _this.fadeOut = function ( opt_milliseconds, opt_callback ) {

        if( _animationId ) window.cancelAnimationFrame( _animationId );

        _animationStep = (1 / (opt_milliseconds || 450));
        _animationNow = _animationLast = Date.now();

        _this.opacity = 1;

        _animationTick = function () {

            _animationNow = Date.now();
            _this.opacity -= (_animationNow - _animationLast) * _animationStep;
            _animationLast = _animationNow;

            if( _this.opacity > 0 ) {

                _animationId = window.requestAnimationFrame( _animationTick );

            } else {

                _animationId = undefined;
                _this.hide();
                if( typeof opt_callback === 'function' ) opt_callback.call( this );

            }
        };

        _animationTick();

    }

    Object.defineProperty( this, 'matrix', {
        enumerable: true,
        get: function () {
            return _matrix;
        }
    } );

    Object.defineProperty( this, 'opacity', {
        enumerable: true,
        get: function () {
            return _element.style.opacity || 1;
        },
        set: function ( value ) {
            _element.style.opacity = (value > 1) ? 1 : (value < 0) ? 0 : value;
        }
    } );

    Object.defineProperty( this, 'height', {
        enumerable: true,
        get: function () {

            if( _height >= 0 ) return _height; // 'auto' will also be false
            return _element.offsetHeight;

        },
        set: function ( value ) {

            _height = value;
            _element.style.height = _height === 'auto' ? _height : _height + 'px';

        }
    } );

    Object.defineProperty( this, 'width', {
        enumerable: true,
        get: function () {

            if( _width >= 0 ) return _width; // 'auto' will also be false
            return _element.offsetWidth;

        },
        set: function ( value ) {

            _width = value;
            _element.style.width = _width === 'auto' ? _width : _width + 'px';

        }
    } );


    Object.defineProperty( this, 'data', {
        enumerable: true,
        get: function () {
            return _data;
        }
    } );


    Object.defineProperty( this, 'element', {
        enumerable: true,
        get: function () {
            return _element;
        }
    } );

    Object.defineProperty( this, 'tagName', {
        enumerable: true,
        get: function () {
            return _element.tagName;
        }
    } );

    _this.setDestruct( function () {

        if( _element ) {
            removeCoreReference( _element, _this );
            _element = undefined;
        }

        _data = undefined;
        _width = NaN;
        _height = NaN;

        if( _animationId !== undefined ) {
            window.cancelAnimationFrame( _animationId );
            _animationId = undefined;
        }

        _animationStep = undefined;
        _animationLast = undefined;
        _animationNow = _animationLast;

    } );

}


 Object.defineProperty(CoreElement.prototype, 'text', {
      enumerable: true,
      get: function() {
          return this.element.textContent;
      },
      set: function(value) {
          this.element.textContent = value;
      }
 });

 Object.defineProperty(CoreElement.prototype, 'html', {
      enumerable: true,
      get: function() {
          return this.element.innerHTML;
      },
      set: function(value) {
          this.element.innerHTML = value;
      }
 });

Object.defineProperty( CoreElement.prototype, 'idName', {
    enumerable: true,
    get: function () {
        if( !this.element ) return undefined;
        return this.element.getAttribute( 'id' );
    }
} );

Object.defineProperty( CoreElement.prototype, 'x', {
    enumerable: true,
    get: function () {
        return this.matrix.tx;
    },
    set: function ( value ) {
        this.matrix.tx = value;
        this.applyTranslation();
    }
} );

Object.defineProperty( CoreElement.prototype, 'y', {
    enumerable: true,
    get: function () {
        return this.matrix.ty;
    },
    set: function ( value ) {
        this.matrix.ty = value;
        this.applyTranslation();
    }
} );

Object.defineProperty( CoreElement.prototype, 'scaleX', {
    enumerable: true,
    get: function () {
        return this.matrix.a;
    },
    set: function ( value ) {
        this.matrix.a = value;

        //TODO:
    }
} );

Object.defineProperty( CoreElement.prototype, 'scaleY', {
    enumerable: true,
    get: function () {
        return this.matrix.d;
    },
    set: function ( value ) {
        this.matrix.d = value;

        //TODO:
    }
} );

CoreElement.prototype.position = function ( x, y ) {

    this.matrix.tx = x;
    this.matrix.ty = y;
    this.applyTranslation();

}

CoreElement.prototype.resetMatrix = function () {

    this.matrix.a = this.matrix.d = 1;
    this.matrix.b = this.matrix.c = this.matrix.tx = this.matrix.ty = 0;

    this.element.style.transform =
        this.element.style.OTransform =
            this.element.style.msTransform =
                this.element.style.MozTransform =
                    this.element.style.webkitTransform = '';

}

CoreElement.prototype.applyTranslation = function () {

    this.element.style.transform =
        this.element.style.OTransform =
            this.element.style.msTransform =
                this.element.style.MozTransform =
                    this.element.style.webkitTransform = 'translate3d( ' + this.matrix.tx + 'px, ' + this.matrix.ty + 'px, 0)';
    //this.element.style.webkitTransform = 'matrix(' + this.matrix.a + ', ' + this.matrix.b + ', ' + this.matrix.c + ', ' + this.matrix.d + ', ' + this.matrix.tx + ', ' + this.matrix.ty + ')';

}

CoreElement.prototype.setSize = function ( width, height ) {

    this.width = width;
    this.height = height;

}


CoreElement.prototype.hasClass = function ( name ) {

    return (new RegExp( '\\b' + name + '\\b' )).test( this.element.className )

}

CoreElement.prototype.addClass = function ( name ) {

    if( !this.hasClass( name ) ) this.element.className = this.element.className + ' ' + name;

}

CoreElement.prototype.removeClass = function ( name ) {

    this.element.className = this.element.className.replace( new RegExp( '\\b\\s?' + name + '\\b' ), '' );

}

CoreElement.prototype.toggleClass = function ( name ) {

    if( this.hasClass( name ) ) this.removeClass( name );
    else this.addClass( name );

}

CoreElement.prototype.removeChild = function ( element ) {

    if( element instanceof CoreElement ) element = element.element;
    this.element.removeChild( element );

}

CoreElement.prototype.addChild = function ( element ) {

    if( element instanceof CoreElement ) element = element.element;
    this.element.appendChild( element );

}

CoreElement.prototype.empty = function () {

    this.element.innerHTML = '';

}



CoreElement.prototype.find = function ( query, opt_convert ) {

    var element = this.element.querySelector( query );
    return opt_convert ? element ? new CoreElement( element ) : element : this.element.querySelector( query );

}

CoreElement.prototype.findAll = function ( query, opt_convert ) {

    if( opt_convert ) {

        var elements = this.element.querySelectorAll( query );
        var coreElements = [];

        for ( var i = 0, leni = elements.length; i < leni; i++ ) {

            coreElements.push( new CoreElement( elements[ i ] ) );

        }

        return coreElements;

    } else {

        return this.element.querySelectorAll( query );

    }

}

CoreElement.prototype.append = function ( html ) {


    if( typeof html === 'string' ) {

        this.element.insertAdjacentHTML( 'beforeend', html );

    } else if( html instanceof CoreElement ) {

        this.append( html.element );

    } else {

        this.element.appendChild( html );

    }


}

CoreElement.prototype.get = function ( selector ) {

    console.log( this );
    console.log( this.prototype );
    console.log( this.constructor );

}


module.exports = CoreElement;


function removeCoreReference ( element, coreElement ) {

    if( element[ CORE_REFERENCES_PROPERTY ] ) {

        var index = element[ CORE_REFERENCES_PROPERTY ].indexOf( coreElement );
        element[ CORE_REFERENCES_PROPERTY ].splice( index, 1 );

        if( element[ CORE_REFERENCES_PROPERTY ].length <= 0 ) {

            element[ CORE_REFERENCES_PROPERTY ] = undefined;
            element[ CORE_GET_PROPERTY ] = undefined;
            element
        }

    }

}

function getCoreReference ( opt_constructor ) {

    var length = this[ CORE_REFERENCES_PROPERTY ].length;
    if( length === 1 ) return this[ CORE_REFERENCES_PROPERTY ][ 0 ];

    if( !opt_constructor ) return log.error( 'CoreElement', 'getCoreElement: Could not get core element reference because there are multiple and no constructor was given....' );

    var selectedCoreElement;

    for ( var i = 0; i < length; i++ ) {

        var coreElement = this[ CORE_REFERENCES_PROPERTY ][ i ];

        if( coreElement instanceof opt_constructor ) {

            if( selectedCoreElement ) return log.error( 'CoreElement', 'getCoreElement: Could not narrow down the core element you are looking for since there are multiple of the same type..!' );
            selectedCoreElement = coreElement;

        }

    }
    return selectedCoreElement;

};