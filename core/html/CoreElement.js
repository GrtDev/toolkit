/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core
 */

// @formatter:off

var CoreEventDispatcher             = require('./../events/CoreEventDispatcher');
var log                             = require('./../debug/Log' ).getInstance();


// property that is set on the native element to save a reference to the CoreElement instances
// useful for retrieving the CoreElement with a reference of the native element. e.g. event.target.
var CORE_REFERENCES_PROPERTY            = '__coreElements';
// property containing the function for retrieving the CoreElement reference.
// TODO: Add automatic constructor testing.
var CORE_GET_PROPERTY                   = 'getCore';


var DEG2RAD =  Math.PI/180; // used to convert degrees to radians.
var ROUND   = 100000; // values for the matrix transform are rounded using this number

// used to determine display type when hidden/shown
var BLOCK_ELEMENTS = ['div', 'article', 'body', 'footer', 'header', 'section'];

//@formatter:on


CoreEventDispatcher.extend( CoreElement );

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

    var _skewX = 0;
    var _skewRad = 0;
    var _skewY = 0;
    var _scaleX = 1;
    var _scaleY = 1;
    var _rotation = 0;
    var _rotationRad = 0;
    var _matrix = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
    var _force3D; // Force the use of 3D matrix - and GPU rendering.

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


    _this.getStyle = function ( property ) {

        if( !_computedStyle ) _computedStyle = getComputedStyle( _element, null );
        return _computedStyle.getPropertyValue( property );

    }

    _this.show = function () {

        if( !_originalDisplay ) getOriginalDisplay();
        if( _this.opacity < 0 ) _this.opacity = 1;
        _element.style.display = _originalDisplay;

    }

    _this.hide = function () {

        if( !_originalDisplay ) getOriginalDisplay();
        _element.style.display = 'none';

    }

    /**
     * Performs a simple fade in animation. Will also automatically update the display property.
     * @param opt_milliseconds
     * @param opt_callback
     */
    _this.fadeIn = function ( opt_milliseconds, opt_callback ) {

        if( _animationId ) window.cancelAnimationFrame( _animationId );

        _this.show();
        _this.opacity = 0;
        _animationId = animate( _this, 'opacity', 1, opt_milliseconds, opt_callback );

    }

    /**
     * Performs a simple fade out animation. Will set display to none upon completion.
     * @param opt_milliseconds
     * @param opt_callback
     */
    _this.fadeOut = function ( opt_milliseconds, opt_callback ) {

        if( _animationId ) window.cancelAnimationFrame( _animationId );

        _animationId = animate( _this, 'opacity', 0, opt_milliseconds, function () {

            _this.hide();

            if( typeof opt_callback === 'function' ) opt_callback.call( _this );

        } );

    }

    /**
     * Resets the matrix and thus the position, scale, skew and rotation fo the element.
     */
    _this.resetMatrix = function () {

        this.matrix.a = this.matrix.d = _scaleX = _scaleY = 1;
        this.matrix.b = this.matrix.c = this.matrix.tx = this.matrix.ty = 0;
        _rotation = _rotationRad = _skewX = _skewRad = _skewY = 0;

        this.element.style.transform =
            this.element.style.OTransform =
                this.element.style.msTransform =
                    this.element.style.MozTransform =
                        this.element.style.webkitTransform = '';

    }

    /**
     * @private
     * updates the matrix and applies the transform to the element.
     */
    function updateMatrix () {

        _matrix.a = ((Math.cos( _rotationRad ) * _scaleX * ROUND) | 0) / ROUND;
        _matrix.b = ((Math.sin( _rotationRad ) * _scaleX * ROUND) | 0) / ROUND;
        _matrix.c = ((Math.sin( _skewRad ) * -_scaleY * ROUND) | 0) / ROUND;
        _matrix.d = ((Math.cos( _skewRad ) * _scaleY * ROUND) | 0) / ROUND;
        _this.applyTransform();

    }

    /**
     * @private
     * Retrieves and saves the original display of this element.
     */
    function getOriginalDisplay () {

        _originalDisplay = _this.getStyle( 'display' );

        if( _originalDisplay === 'none' ) {
            _originalDisplay = (BLOCK_ELEMENTS.indexOf( _element.tagName ) >= 0) ? 'block' : 'inline-block';
        }

    }

    /**
     * Returns the matrix of this element.
     * @readonly
     * @returns {a:{number}, b:{number}, c:{number}, d:{number}, tx:{number}, ty:{number}}
     */
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

            // lazy parse data attributes
            if( !_dataParsed ) {
                _dataParsed = true;
                _data = {};
                this.parseData();
            }

            return _data;
        }
    } );

    Object.defineProperty( this, 'dataParsed', {
        enumerable: true,
        get: function () {
            return _dataParsed;
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


    Object.defineProperty( this, 'force3D', {
        enumerable: true,
        get: function () {
            return _force3D;
        },
        set: function ( value ) {
            if( _force3D == value ) return;
            _force3D = value;
            _this.applyTransform();
        }
    } );

    Object.defineProperty( this, 'scale', {
        enumerable: true,
        get: function () {
            return _scaleX;
        },
        set: function ( value ) {
            _scaleX = _scaleY = value;
            updateMatrix();
        }
    } );

    Object.defineProperty( this, 'scaleX', {
        enumerable: true,
        get: function () {
            return _scaleX;
        },
        set: function ( value ) {
            _scaleX = value;
            updateMatrix();
        }
    } );

    Object.defineProperty( this, 'scaleY', {
        enumerable: true,
        get: function () {
            return _scaleY;
        },
        set: function ( value ) {
            _scaleY = value;
            updateMatrix();
        }
    } );

    Object.defineProperty( this, 'skewX', {
        enumerable: true,
        get: function () {
            return _skewX;
        },
        set: function ( value ) {
            _skewX = value;
            _skewRad = (_skewX + _skewY + _rotationRad) * DEG2RAD; // we simulate skewY with a combination of skewX and a rotation
            updateMatrix();
        }
    } );

    Object.defineProperty( this, 'skewY', {
        enumerable: true,
        get: function () {
            return _skewY;
        },
        set: function ( value ) {
            _skewY = value;
            // we simulate skewY with a combination of skewX and a rotation
            _skewRad = (_skewX + _skewY + _rotationRad) * DEG2RAD;
            _rotationRad = (_rotation + _skewY) * DEG2RAD;
            updateMatrix();
        }
    } );

    Object.defineProperty( this, 'rotation', {
        enumerable: true,
        get: function () {
            return _rotation;
        },
        set: function ( value ) {
            _rotation = value;
            _rotationRad = (_rotation + _skewY) * DEG2RAD; // we simulate skewY with a combination of skewX and a rotation
            _skewRad = (_skewX + _skewY + _rotationRad) * DEG2RAD;
            updateMatrix();
        }
    } );

    /**
     * @see CoreObject
     */
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

        animationStep = undefined;
        animationLast = undefined;
        animationNow = animationLast;

    } );

}


Object.defineProperty( CoreElement.prototype, 'text', {
    enumerable: true,
    get: function () {
        return this.element.textContent;
    },
    set: function ( value ) {
        this.element.textContent = value;
    }
} );

Object.defineProperty( CoreElement.prototype, 'html', {
    enumerable: true,
    get: function () {
        return this.element.innerHTML;
    },
    set: function ( value ) {
        this.element.innerHTML = value;
    }
} );

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
        this.applyTransform();
    }
} );

Object.defineProperty( CoreElement.prototype, 'y', {
    enumerable: true,
    get: function () {
        return this.matrix.ty;
    },
    set: function ( value ) {
        this.matrix.ty = value;
        this.applyTransform();
    }
} );

/**
 * Sets the position of the element using a matrix transform.
 * More optimized vs using x and y separate since this will only update the transform once.
 * @param x
 * @param y
 */
CoreElement.prototype.position = function ( x, y ) {

    this.matrix.tx = x;
    this.matrix.ty = y;
    this.applyTransform();

}

/**
 * Applies the current matrix transform.
 */
CoreElement.prototype.applyTransform = function () {

    if( !this.force3D ) {

        this.element.style.transform =
            this.element.style.OTransform =
                this.element.style.msTransform =
                    this.element.style.MozTransform =
                        this.element.style.webkitTransform = 'matrix(' + this.matrix.a + ', ' + this.matrix.b + ', ' + this.matrix.c + ', ' + this.matrix.d + ', ' + this.matrix.tx + ', ' + this.matrix.ty + ')';

    } else {

        this.element.style.transform =
            this.element.style.OTransform =
                this.element.style.msTransform =
                    this.element.style.MozTransform =
                        this.element.style.webkitTransform = 'matrix3d(' + this.matrix.a + ', ' + this.matrix.b + ', 0, 0, ' + this.matrix.c + ', ' + this.matrix.d + ', 0, 0, 0, 0, 1, 0, ' + this.matrix.tx + ', ' + this.matrix.ty + ', 0, 1)';
    }

}

/**
 * Set the size of this element.
 * @param width
 * @param height
 */
CoreElement.prototype.setSize = function ( width, height ) {

    this.width = width;
    this.height = height;

}

/**
 * Check if the element has a certain class
 * @param name
 * @returns {boolean}
 */
CoreElement.prototype.hasClass = function ( name ) {

    return (new RegExp( '\\b' + name + '\\b' )).test( this.element.className )

}

/**
 * Adds a class if the element does not yet have it.
 * @param name {string}
 */
CoreElement.prototype.addClass = function ( name ) {

    if( !this.hasClass( name ) ) this.element.className = this.element.className + ' ' + name;

}

/**
 * Removes a class.
 * @param name {string}
 */
CoreElement.prototype.removeClass = function ( name ) {

    this.element.className = this.element.className.replace( new RegExp( '\\b\\s?' + name + '\\b' ), '' );

}

/**
 * Adds or removes a class depending whether it already has the class or not.
 * @param name {string}
 */
CoreElement.prototype.toggleClass = function ( name ) {

    if( this.hasClass( name ) ) this.removeClass( name );
    else this.addClass( name );

}

/**
 * Removes a child element.
 * @param element {CoreElement|HTMLElement}
 */
CoreElement.prototype.removeChild = function ( element ) {

    if( element instanceof CoreElement ) element = element.element;
    this.element.removeChild( element );

}

/**
 * Adds a child element.
 * @param element {CoreElement|HTMLElement}
 */
CoreElement.prototype.addChild = function ( element ) {

    if( element instanceof CoreElement ) element = element.element;
    this.element.appendChild( element );

}

/**
 * Clears out the content of the element.
 */
CoreElement.prototype.empty = function () {

    this.element.innerHTML = '';

}

/**
 * Find an element within this element.
 * @param query {string} and valid querySelector argument.
 * @param opt_convert {boolean} will convert the object into a CoreElement if true.
 * @returns {CoreElement|HTMLElement}
 */
CoreElement.prototype.find = function ( query, opt_convert ) {

    var element = this.element.querySelector( query );
    return opt_convert ? element ? new CoreElement( element ) : element : this.element.querySelector( query );

}

/**
 * Finds all elements within this element.
 * @param query {string} and valid querySelector argument.
 * @param opt_convert {boolean} will convert the objects into a CoreElement if true.
 * @returns Array.{CoreElement|HTMLElement}
 */
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

/**
 * Appends an element or html within this element.
 * @param html {string|CoreElement|HTMLElement}
 */
CoreElement.prototype.append = function ( html ) {


    if( typeof html === 'string' ) {

        this.element.insertAdjacentHTML( 'beforeend', html );

    } else if( html instanceof CoreElement ) {

        this.append( html.element );

    } else {

        this.element.appendChild( html );

    }


}


/**
 * Function that parses all the data attributes [data-*] on the element.
 * The data will be stored in the data property in camelCase names.
 * @public
 */
CoreElement.prototype.parseData = function () {

    if( this.dataParsed ) return this.logWarn( 'data was already parsed.' );

    if( this.debug ) this.logDebug( 'parsing data attributes..' );

    var attributes = this.element.attributes;
    var cameCaseRexp = /-(\w)/g;
    var dataRegExp = /^data-/i;

    for ( var i = 0, leni = attributes.length; i < leni; i++ ) {

        var attribute = attributes[ i ];

        // check if the attribute is a data value, if so save it.
        if( dataRegExp.test( attribute.nodeName ) ) {

            var name = attribute.nodeName;
            name = name.replace( dataRegExp, '' );
            name = name.replace( cameCaseRexp, camelCaseReplacer );
            this.data[ name ] = attribute.nodeValue;
        }

    }

    if( this.debug ) this.logDebug( 'parsed data:', this.data );

}


module.exports = CoreElement;

/**
 * Removes core element reference from the native element.
 * @param element {HTMLElement}
 * @param coreElement {CoreElement} element reference to remove.
 */
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

/**
 * Function that can retrieve a CoreElement from a native element.
 * @param opt_constructor {function} if multiple CoreElements are registered on a HTMLElement this can be used determine which one you are looking form
 * @returns {CoreElement}
 */
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

// helper function to convert dashed variable names to camelCase.
function camelCaseReplacer ( match, p1 ) {

    return p1 ? p1.toUpperCase() : '';

}

/**
 * Provides a very simple animation function.
 * @param element {object} element that is the target of the animation
 * @param property {string} property to animate
 * @param to {number} the value the property needs to be
 * @param opt_milliseconds {number=} time to complete the animation
 * @param opt_callback {function} callback
 * @returns {number} id of the animation.
 */
function animate ( element, property, to, opt_milliseconds, opt_callback ) {

    var from = element[ property ] || 0;
    var animationID;
    var animationLast;
    var animationStep = ((from - to) / (opt_milliseconds || 450));
    var animationNow = animationLast = Date.now();
    var up = to > from;

    element[ property ] = from;

    var animationTick = function () {

        animationNow = Date.now();
        element[ property ] += (animationNow - animationLast) * animationStep;
        animationLast = animationNow;

        if( up ? (element[ property ] < to) : (element[ property ] < to) ) {

            animationID = window.requestAnimationFrame( animationTick );

        } else {

            element[ property ] = to;
            animationID = undefined;
            if( typeof opt_callback === 'function' ) opt_callback.call( element );

        }
    };

    animationTick();

    return animationID;

}
