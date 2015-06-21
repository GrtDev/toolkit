/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core
 */

// @formatter:off

var CoreObject              = require('./CoreObject');

//@formatter:on


CoreObject.extend(CoreHTMLElement);


/**
 * Creates a new CoreHTMLElement with basic element manipulation & log capabilities and a destruct method.
 * @constructor
 * @extends CoreObject
 * @param {HTMLElement}
 */
function CoreHTMLElement (element) {

    if( !element ) return this.logError( 'element can not be null!' );

    var _this = this;
    var _element = element;
    var _data;
    var _width;
    var _height;

    // retrieve dimensions
    var boundingRectangle = _element.getBoundingClientRect();
    _width = boundingRectangle.width;
    _height = boundingRectangle.height;

    /**
     * Function that parses all the data attributes on the element.
     * @public
     * @function
     */
    _this.parseData = function  (  ) {
        
        if(_data !== undefined) return _this.logWarn('data was already parsed.');

        _data = {};
        var attributes          = _element.attributes;
        var cameCaseRexp        = /-(\w)/g;
        var dataRegExp          = /^data-/i;

        for ( var i = 0, leni = attributes.length; i < leni; i++ ) {

            var attribute = attributes[ i ];

            // check if the attribute is a data value, if so save it.
            if(dataRegExp.test(attribute.nodeName)) {

                var name = attribute.nodeName;
                name = name.replace(dataRegExp, '');
                name = name.replace(cameCaseRexp, camelCaseReplacer);
                _data[name] = attribute.nodeValue;
            }

        }

        // helper function to convert dashed variable names to camelCase.
        function camelCaseReplacer(match, p1){

            return p1 ? p1.toUpperCase() : '';

        }

    }

    _this.setSize = function ( width, height ) {

        _width = width;
        _height = height;
        _element.style.width = _width + 'px;';
        _element.style.height = _height + 'px;';

    }


     Object.defineProperty(this, 'element', {
         enumerable: true,
     	get: function() {
              return _element;
          }
     });

     Object.defineProperty(this, 'data', {
         enumerable: true,
     	get: function() {
              return _data;
          }
     });

    this.setDestruct( function () {

        _element = undefined;
        _data = undefined;
        _width = NaN;
        _height = NaN;

    } );

}



CoreHTMLElement.prototype.hasClass = function ( name ) {
    
    return (new RegExp( '\\b' + name + '\\b' )).test( this.element.className )

}

CoreHTMLElement.prototype.addClass = function ( name ) {

    if( !this.hasClass( name ) ) this.element.className = this.element.className + ' ' + name;

}

CoreHTMLElement.prototype.removeClass = function ( name ) {

    this.element.className = this.element.className.replace( new RegExp( '\\b' + name + '\\b' ), '' );

}

CoreHTMLElement.prototype.toggleClass = function ( name ) {

    if( this.hasClass( name ) ) this.removeClass( name );
    else this.addClass( name );

}


module.exports = CoreHTMLElement;