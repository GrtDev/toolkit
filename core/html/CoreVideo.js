/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
// @formatter:off

var AbstractMediaElement                = require('./AbstractMediaElement');
var CommonEvent                         = require('../events/CommonEvent');
var MediaEvent                          = require('./MediaEvent');


var mp4RegExp                       =   /\.mp4(\?.*)?$/

//@formatter:on

AbstractMediaElement.extend( CoreVideo );


/**
 * @param element {HTMLElement} <video>
 * @extends {AbstractMediaElement}
 * @constructor
 */
function CoreVideo ( element ) {

    CoreVideo.super_.call( this, element );

    var _this = this;

    _this.parseData();

    _this.element.addEventListener( 'error', handleVideoErrorEvent );
    _this.element.addEventListener( 'loadedmetadata', handleVideoEvents );

    _this.addEventListener( MediaEvent.SOURCE_CHANGE, handleSourceChange );


    function handleSourceChange ( event ) {

        if( _this.source ) {

            if( mp4RegExp.test( _this.source ) ) _this.element.setAttribute( 'type', 'video/mp4' );

        } else {

            if( _this.element.hasAttribute( 'type' ) ) _this.element.removeAttribute( 'type' );

        }


    }


    _this.play = function () {

        if( !_this.source ) {
            if( _this.data && _this.data.src ) _this.source = _this.data.src;
            else return _this.logWarn( 'Can not play the video because there is no source.' );
        }

        if( _this.debug ) _this.logDebug( 'play: ' + _this.source );

        _this.element.play();

    }


    _this.pause = function () {

        if( _this.debug ) _this.logDebug( 'pause' );

        _this.element.pause();

    }

    /**
     * Stops the video and optionally stops the loading of the video
     * @param opt_stopLoad {boolean=}
     */
    _this.stop = function ( opt_stopLoad ) {

        if( !_this.element ) return;

        if( _this.debug ) _this.logDebug( 'stop' );


        _this.pause();
        _this.element.currentTime = 0;

        // empty the source attribute so it won't continue loading.
        if( opt_stopLoad ) _this.source = null;

    }

    _this.preload = function (opt_mode) {

        if( _this.source ) return _this.logWarn( 'Video already has a source so it already is preloading...' );

        if( !_this.data || !_this.data.src ) return _this.logError( 'Could not find a source' );

        _this.element.setAttribute( 'preload', opt_mode || 'auto' );

        _this.source  = _this.data.src;

        if( _this.debug ) _this.logDebug( 'preloading video.. ' + _this.source );

    }

    function handleVideoEvents ( event ) {

        if( _this.isDestructed ) return;

        switch ( event.type ) {

            case 'loadedmetadata':

                if( _this.debug ) _this.logDebug( 'Meta data loaded.' );

                _this.setSourceDimensions( _this.element.videoWidth, _this.element.videoHeight );

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
                if( !_this.source ) return _this.logWarn( 'Video does not have a source.' );

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
            return !!_this.source;
        }
    } );


    _this.setDestruct( function () {

        _this.removeEventListener( MediaEvent.SOURCE_CHANGE, handleSourceChange );

        if( _this.element ) {

            this.stop( true );

            _this.element.removeEventListener( 'error', handleVideoErrorEvent );
            _this.element.removeEventListener( 'loadedmetadata', handleVideoEvents );

        }

    } );
}


module.exports = CoreVideo;
