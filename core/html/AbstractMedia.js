/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
// @formatter:off

var CoreElement                         = require('./CoreElement');
var MediaEvent                          = require('./../../common/events/MediaEvent');

//@formatter:on

CoreElement.extend( AbstractMedia );


/**
 * A slide for the homepage video slider
 * @param element {HTMLElement}
 * @extends {CoreElement}
 * @constructor
 */
function AbstractMedia ( element ) {

    AbstractMedia.super_.call( this, element );

    var _this = this;
    var _aspectRatio;

    var _fillAutoUpdate;
    var _fillWidth;
    var _fillHeight;
    var _sourceWidth;
    var _sourceHeight;
    var _source = _this.element.getAttribute( 'src' );
    var _loaded;

    _this.parseData();

    /**
     * @protected
     * @param width
     * @param height
     */
    _this.setSourceDimensions = function ( width, height ) {

        _sourceWidth = width;
        _sourceHeight = height

        _aspectRatio = _sourceWidth / _sourceHeight;

        if( _this.debug ) _this.logDebug( 'updated aspect ratio: ' + _sourceWidth + ', ' + _sourceHeight + ', ratio: ' + _aspectRatio );

        if( _fillAutoUpdate ) _this.fillSize( _fillWidth, _fillHeight );

        _loaded = true;//TODO:

        _this.dispatchEvent( new MediaEvent( MediaEvent.DIMENSIONS_SET ) );

    }

    _this.fillSize = function ( width, height, opt_autoUpdate ) {

        if( _this.debug ) _this.logDebug( 'fillSize : ' + width + ', ' + height );

        _fillAutoUpdate = opt_autoUpdate;

        _fillWidth = width;
        _fillHeight = height

        // rerun this function later if the meta data has not been loaded yet...
        if( _aspectRatio ) {

            var fillRatio = width / height;

            if( fillRatio > _aspectRatio ) {

                width = _fillWidth
                height = width / _aspectRatio;

            } else {

                height = _fillHeight;
                width = height * _aspectRatio;

            }

        }

        _this.setSize( width, height );
    }


    Object.defineProperty( this, 'source', {
        enumerable: true,
        get: function () {
            return _source;
        },
        set: function ( value ) {
            _source = value;
            _this.element.setAttribute( 'src', _source );
            _this.dispatchEvent( new MediaEvent( MediaEvent.SOURCE_CHANGE ) );
        }
    } );

    Object.defineProperty( this, 'aspectRatio', {
        enumerable: true,
        get: function () {
            return _aspectRatio;
        }
    } );

    Object.defineProperty( this, 'fillAutoUpdate', {
        enumerable: true,
        get: function () {
            return _fillAutoUpdate;
        },
        set: function ( value ) {
            _fillAutoUpdate = value;
        }
    } );

    Object.defineProperty( this, 'hasSource', {
        enumerable: true,
        get: function () {
            return _source !== undefined;
        }
    } );

    Object.defineProperty( this, 'sourceWidth', {
        enumerable: true,
        get: function () {
            return _sourceWidth;
        }
    } );

    Object.defineProperty( this, 'sourceHeight', {
        enumerable: true,
        get: function () {
            return _sourceHeight;
        }
    } );

    Object.defineProperty( this, 'loaded', {
        enumerable: true,
        get: function () {
            return _loaded;
        }
    } );

    _this.setDestruct( function () {

        _aspectRatio = NaN;

        _fillAutoUpdate = undefined;
        _fillWidth = NaN;
        _fillHeight = NaN;
        _sourceWidth = NaN;
        _sourceHeight = NaN;

    } );
}


AbstractMedia.prototype.preload = function () {

    if( this.source ) return this.logWarn( 'Source is already set, so it already is (pre)loading...' );

    if( !this.data || !this.data.src ) return this.logWarn( 'Could not find a source' );

    this.source = this.data.src;

    if( this.debug ) this.logDebug( 'preloading... ' + this.source );

}

module.exports = AbstractMedia;
