/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
// @formatter:off

var CoreEventDispatcher             = require('../../core/events/CoreEventDispatcher');
var CoreEvent                       = require('../../core/events/CoreEvent');

//@formatter:on

CoreEventDispatcher.extend( Image );


/**
 * A slide for the homepage video slider
 * @param element {HTMLElement} <video>
 * @extend {CoreEventDispatcher}
 * @constructor
 */
function Image ( element ) {

    var _this = this;
    var _element;
    var _source;
    var _dataSource;
    var _aspectRatio;
    var _fillSize;

    var _width;
    var _height;
    var _fillWidth;
    var _fillHeight;
    var _imageWidth;
    var _imageHeight;

    if( !element ) return _this.logError( 'Image element is required at the moment.' );

    init( element );


    function init ( element ) {

        _element = element;
        _source = _element.getAttribute( 'src' );
        _dataSource = _element.getAttribute( 'data-src' );


        if( _element.complete ) {
            updateAspectRatio();
        } else {
            _element.addEventListener( 'load', handleImageLoadEvent );
        }

    }

    function handleImageLoadEvent () {

        _element.removeEventListener( 'load', handleImageLoadEvent );

        updateAspectRatio();

    }


    function updateAspectRatio () {

        _imageWidth = _element.width;
        _imageHeight = _element.height

        _aspectRatio = _imageWidth / _imageHeight;

        if( _this.debug ) _this.logDebug( 'updated aspect ratio: ' + _imageWidth + ', ' + _imageHeight + ' = ratio: ' + _aspectRatio );

        if( _fillSize ) _this.fillSize( _fillWidth, _fillHeight );

    }

    _this.show = function ( opt_display ) {
        _element.style.display = opt_display || 'block';
    }

    _this.hide = function () {
        _element.style.display = 'none';
    }

    _this.fillSize = function ( width, height ) {

        if( _this.debug ) _this.logDebug( 'fillSize : ' + width + ', ' + height );

        _fillSize = true;

        _fillWidth = width;
        _fillHeight = height

        // rerun this function later if the meta data has not been loaded yet...
        if( !_aspectRatio ) return;

        var fillRatio = width / height;

        if( fillRatio > _aspectRatio ) {

            _width = _fillWidth
            _height = _width / _aspectRatio;

        } else {

            _height = _fillHeight;
            _width = _height * _aspectRatio;

        }

        updateElementSize();
    }

    _this.setSize = function ( width, height ) {

        _fillSize = false;

        _width = width;
        _height = height;

        updateElementSize();

    }

    function updateElementSize () {

        if( _this.debug ) _this.logDebug( 'updating element size: ' + _width + ', ' + _height );

        _element.style.width = _width + 'px';
        _element.style.height = _height + 'px';

        _this.dispatchEvent( new CoreEvent( CoreEvent.RESIZE ) );
    }


    Object.defineProperty( this, 'element', {
        enumerable: true,
        get: function () {
            return _element;
        }
    } );


    _this.setDestruct( function () {

        if( _element ) {
            _element.removeEventListener( 'load', handleImageLoadEvent );
        }

        _element = null;
        _source = null;

        _width = NaN;
        _height = NaN;
        _fillWidth = NaN;
        _fillHeight = NaN;
        _imageWidth = NaN;
        _imageHeight = NaN;

    } );
}


module.exports = Image;
