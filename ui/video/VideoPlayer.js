/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
// @formatter:off

var CoreObject              = require('../../core/CoreObject');


var mp4RegExp               =   /\.mp4(\?.*)?$/

//@formatter:on

CoreObject.extend( VideoPlayer );


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
    var _keepAspectRatio;

    if( !element ) return _this.logError( 'VideoPlayer element is required at the moment.' );

    init( element );

    function init ( element ) {

        _element = element;
        _source = _element.getAttribute( 'src' );
        _dataSource = _element.getAttribute( 'data-src' );
        _element.addEventListener( 'error', handleVideoEvents );

    }

    function handleVideoEvents ( event ) {

        switch ( event.type ) {
            case 'error':

                if( !_element.getAttribute( 'src' ) ) {
                    // only do a debug log since we don't really count this as an error.
                    if( _this.debug ) _this.logDebug( 'Received an error most likely due to the video not having a \'src\' value.', event );
                    return;
                }

                _this.logError( 'Unkown Error: ', event );

                break;
            default:

                _this.logError( 'Unhandled video event: ' + event.type, event );

        }
    }

    function updateAspectRation () {

        var videoWidth = _element.videoWidth;
        var videoHeight = _element.videoHeight

        _aspectRatio = videoWidth / videoHeight;

    }

    /**
     * Sets the source attribute on the video element
     * @param source {string}
     */
    function setSource ( source ) {

        if( !source ) source = '';// convert to empty string to prevent
        _element.setAttribute( 'src', source );
        if( mp4RegExp.test( source ) ) _element.setAttribute( 'type', 'video/mp4' );

        //if(!source)

    }


    _this.play = function () {

        if( !_element ) return;

        if( _this.debug ) _this.logDebug( 'play' );

        if( !_this.source && _dataSource ) setSource( _dataSource );
        else return _this.logWarn( 'Can not play the video because there is no source.' );

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

    _this.kill = function () {

        if( _this.debug ) _this.logDebug( 'kill' );

        if( _element ) {

            this.stop( true );
            _element.removeEventListener( 'error', handleVideoEvents );

        }

        _element = null;
        _source = null;

    }
}

VideoPlayer.prototype.destruct = function () {

    if( this.isDestructed ) return;

    this.kill();

    VideoPlayer.super_.prototype.destruct.call( this );

}


module.exports = VideoPlayer;
