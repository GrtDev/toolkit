/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
// @formatter:off

var AbstractMedia                       = require('./AbstractMedia');
var CommonEvent                         = require('../../common/events/CommonEvent');
var MediaEvent                          = require('./../../common/events/MediaEvent');


var mp4RegExp                           =   /\.mp4(\?.*)?$/

//@formatter:on

AbstractMedia.extend( CoreVideo );


/**
 * @param element {HTMLElement} <video>
 * @extends {AbstractMediaElement}
 * @constructor
 */
function CoreVideo ( element ) {

    CoreVideo.super_.call( this, element );

    var _this = this;

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

            case event.target.error[ 'MEDIA_ERR_SRC_NOT_SUPPORTED' ]:

                // only do a warning log since we don't really count this as an error.
                if( !_this.source ) return _this.logWarn( 'Video does not have a source.' );

                _this.logError( 'Media Source is not supported! source: ', _this.source );

                break;
            case event.target.error[ 'MEDIA_ERR_DECODE' ]:

                _this.logError( 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support. source: ', _this.source );

                break;
            case event.target.error[ 'MEDIA_ERR_NETWORK' ]:

                _this.logError( 'A network error caused the video download to fail part-way.' );

                break;
            case event.target.error[ 'MEDIA_ERR_ABORTED' ]:

                _this.logError( 'Video playback was aborted!' );

                break;
            default:

                _this.logError( 'Unhandled video error event: ' + event.type, event );

        }
    }

    _this.setDestruct( function () {

        _this.removeEventListener( MediaEvent.SOURCE_CHANGE, handleSourceChange );

        if( _this.element ) {

            this.stop( true );

            _this.element.removeEventListener( 'error', handleVideoErrorEvent );
            _this.element.removeEventListener( 'loadedmetadata', handleVideoEvents );

        }

    } );
}

Object.defineProperty( CoreVideo.prototype, 'hasVideo', {
    enumerable: true,
    get: function () {
        return this.hasSource;
    }
} );

CoreVideo.prototype.play = function () {

    if( !this.source ) {
        if( this.data && this.data.src ) this.source = this.data.src;
        else return this.logWarn( 'Can not play the video because there is no source.' );
    }

    if( this.debug ) this.logDebug( 'play: ' + this.source );

    this.element.play();

}


CoreVideo.prototype.pause = function () {

    if( this.debug ) this.logDebug( 'pause' );

    this.element.pause();

}

/**
 * Stops the video and optionally stops the loading of the video
 * @param opt_stopLoad {boolean=}
 */
CoreVideo.prototype.stop = function ( opt_stopLoad ) {

    if( !this.element ) return;

    if( this.debug ) this.logDebug( 'stop' );


    this.pause();
    this.element.currentTime = 0;

    // empty the source attribute so it won't continue loading.
    if( opt_stopLoad ) this.source = null;

}

/**
 * starts preloading the video
 * preload modes:
 *      none:       hints that either the author thinks that the user won't need to consult that video or that the server wants to minimize its traffic; in others terms this hint indicates that the video should not be cached.
 *      metadata:   hints that though the author thinks that the user won't need to consult that video, fetching the metadata (e.g. length) is reasonable.
 *      auto:       hints that the user needs have priority; in others terms this hint indicated that, if needed, the whole video could be downloaded, even if the user is not expected to use it.
 * @param opt_mode {string=} defaults to 'auto'
 */
CoreVideo.prototype.preload = function ( opt_mode ) {

    this.element.setAttribute( 'preload', opt_mode || 'auto' );

    CoreVideo.super_.prototype.preload.call( this );

}


module.exports = CoreVideo;
