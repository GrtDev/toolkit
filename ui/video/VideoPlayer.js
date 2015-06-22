/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
// @formatter:off

var CoreEventDispatcher             = require('../../core/events/CoreEventDispatcher');
var CommonEvent                       = require('../../core/events/CommonEvent');


var mp4RegExp                       =   /\.mp4(\?.*)?$/

//@formatter:on

CoreEventDispatcher.extend( VideoPlayer );


/**
 * A slide for the homepage video slider
 * @param element {HTMLElement} <video>
 * @extend {CoreObject}
 * @constructor
 */
function VideoPlayer ( element ) {

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
    var _videoWidth;
    var _videoHeight;

    if( !element ) return _this.logError( 'VideoPlayer element is required at the moment.' );

    init( element );


    function init ( element ) {

        _element = element;
        _source = _element.getAttribute( 'src' );
        _dataSource = _element.getAttribute( 'data-src' );

        _element.addEventListener( 'error', handleVideoErrorEvent );
        _element.addEventListener( 'loadedmetadata', handleVideoEvents );
    }


    function updateAspectRatio () {

        _videoWidth = _element.videoWidth;
        _videoHeight = _element.videoHeight

        _aspectRatio = _videoWidth / _videoHeight;

        if( _this.debug ) _this.logDebug( 'updated aspect ratio: ' + _videoWidth + ', ' + _videoHeight + ' = ratio: ' + _aspectRatio );

        if( _fillSize ) _this.fillSize( _fillWidth, _fillHeight );

    }

    /**
     * Sets the source attribute on the video element
     * @param value {string}
     */
    function setSource ( value ) {


        _source = value;

        if( _source ) {

            _element.setAttribute( 'src', _source );

            if( mp4RegExp.test( _source ) ) _element.setAttribute( 'type', 'video/mp4' );

        } else {

            if( _element.hasAttribute( 'src' ) ) _element.removeAttribute( 'src' );
            if( _element.hasAttribute( 'type' ) ) _element.removeAttribute( 'type' );

        }

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

        _this.dispatchEvent( new CommonEvent( CommonEvent.RESIZE ) );
    }


    _this.play = function () {

        if( !_element ) return;

        if( !_this.source ) {
            if( _dataSource ) setSource( _dataSource );
            else return _this.logWarn( 'Can not play the video because there is no source.' );
        }

        if( _this.debug ) _this.logDebug( 'play: ' + _source );

        _element.play();

    }


    _this.pause = function () {

        if( !_element ) return;

        if( _this.debug ) _this.logDebug( 'pause' );

        _element.pause();

    }

    /**
     * Stops the video and optionally stops the loading of the video
     * @param opt_stopLoad {boolean=}
     */
    _this.stop = function ( opt_stopLoad ) {

        if( !_element ) return;

        if( _this.debug ) _this.logDebug( 'stop' );


        _this.pause();
        _element.currentTime = 0;

        // empty the source attribute so it won't continue loading.
        if( opt_stopLoad ) setSource( null );

    }

    _this.preload = function () {

        if( _source ) return _this.logWarn( 'Video already has a source so it already is preloading...' );

        if( !_dataSource ) return _this.logError( 'Could not find a source' );

        _element.setAttribute( 'preload', 'auto' );

        setSource( _dataSource );

        if( _this.debug ) _this.logDebug( 'preloading video.. ' + _source );

    }

    function handleVideoEvents ( event ) {

        if( _this.isDestructed ) return;

        switch ( event.type ) {
            case 'loadedmetadata':

                if( _this.debug ) _this.logDebug( 'Meta data loaded.' );

                updateAspectRatio();

                break;
            default:
                _this.logError( 'Unhandled video event: ' + event.type, event );
        }

    }

    function handleVideoErrorEvent ( event ) {

        if( _this.isDestructed ) return;

        if( !event.target.error || typeof event.target.error.code === 'undefined' ) return _this.logError( 'Can not handle Video Error event because the error code could not be found!', event );


        switch ( event.target.error.code ) {
            case event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:

                // only do a warning log since we don't really count this as an error.
                if( !_source ) return _this.logWarn( 'Video does not have a source.' );

                _this.logError( 'Media Source is not supported! source: ', _this.source );

                break;
            case event.target.error.MEDIA_ERR_DECODE:

                _this.logError( 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support. source: ', _this.source );

                break;
            case event.target.error.MEDIA_ERR_NETWORK:

                _this.logError( 'A network error caused the video download to fail part-way.' );

                break;
            case event.target.error.MEDIA_ERR_ABORTED:

                _this.logError( 'Video playback was aborted!' );

                break;
            default:

                _this.logError( 'Unhandled video error event: ' + event.type, event );

        }
    }

    Object.defineProperty( this, 'hasVideo', {
        enumerable: true,
        get: function () {
            return !!_source;
        }
    } );

    Object.defineProperty( this, 'height', {
        enumerable: true,
        get: function () {
            return _height;
        }
    } );

    Object.defineProperty( this, 'width', {
        enumerable: true,
        get: function () {
            return _width;
        }
    } );

    Object.defineProperty( this, 'aspectRatio', {
        enumerable: true,
        get: function () {
            return _aspectRatio;
        }
    } );

    Object.defineProperty( this, 'source', {
        enumerable: true,
        get: function () {
            return _source;
        }
    } );

    Object.defineProperty( this, 'element', {
        enumerable: true,
        get: function () {
            return _element;
        }
    } );

    _this.setDestruct( function () {

        if( _element ) {

            this.stop( true );

            _element.removeEventListener( 'error', handleVideoErrorEvent );
            _element.removeEventListener( 'loadedmetadata', handleVideoEvents );

        }

        _element = null;
        _source = null;

        _width = NaN;
        _height = NaN;
        _fillWidth = NaN;
        _fillHeight = NaN;
        _videoWidth = NaN;
        _videoHeight = NaN;

    } );
}


module.exports = VideoPlayer;
