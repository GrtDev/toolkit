// @formatter:off

var AbstractSlide               = require('./AbstractSlide');
var MediaEvent                  = require('../../../core/media/MediaEvent');
var VideoPlayer                 = require('../../../core/media/CoreVideo');
var Image                       = require('../../../core/media/CoreImage');
var systemUtils                 = require('../../../core/utils/systemUtils');


//@formatter:on


AbstractSlide.extend( VideoSlide );

/**
 * A slide for the homepage video slider
 * @param element {HTMLElement}
 * @constructor
 */
function VideoSlide ( element, opt_debug ) {

    VideoSlide.super_.call( this, element );

    var _this = this;
    var _videoPlayer;
    var _posterImage;
    var _isMobile = systemUtils.isMobile();
    var _isTablet = systemUtils.isTablet();

    _this.debug = opt_debug;


    _videoPlayer = new VideoPlayer( element.getElementsByTagName( 'video' )[ 0 ] );

    _videoPlayer.element.style.position = 'relative';
    _videoPlayer.element.style.top = '0px';
    _videoPlayer.element.style.left = '0px';

    // no video support on mobile and tablet
    if( _isMobile || _isTablet ) _videoPlayer.element.style.display = 'none';


    _posterImage = new Image( _this.element.querySelector( 'img' ) );
    _posterImage.element.style.position = 'absolute';

    _videoPlayer.addEventListener( MediaEvent.DIMENSIONS_SET, handleVideoEvents );


    function handleVideoEvents ( event ) {

        switch ( event.type ) {
            case MediaEvent.DIMENSIONS_SET:

                _this.updateLayout();

                break;
            default:
                _this.logError( 'Unhandled video event: ' + event.type, event );
        }

    }


    _this.play = function () {

        if( _isMobile || _isTablet ) return;

        _videoPlayer.play();
        //_posterImage.hide();

    }

    _this.pause = function () {

        if( _isMobile || _isTablet ) return;
        _videoPlayer.pause();

    }

    _this.preload = function () {

        if( _isMobile || _isTablet ) return;
        _videoPlayer.preload();

    }

    Object.defineProperty( this, 'videoPlayer', {
        enumerable: true,
        get: function () {
            return _videoPlayer;
        }
    } );

    Object.defineProperty( this, 'posterImage', {
        enumerable: true,
        get: function () {
            return _posterImage;
        }
    } );

    _this.setDestruct( function () {

        if( _videoPlayer ) {

            _videoPlayer.removeEventListener( MediaEvent.DIMENSIONS_SET, handleVideoEvents );
            _videoPlayer.destruct();
            _videoPlayer = null;

        }

        if( _posterImage ) {
            _posterImage.destruct();
            _posterImage = null;
        }

        _this = undefined;

    } );

}

VideoSlide.prototype.updateLayout = function () {

    if( this.debug ) this.logDebug( 'updateLayout' );

    if( this.posterImage ) {

        this.posterImage.element.style.top = -((this.posterImage.height - this.height) / 2) + 'px';
        this.posterImage.element.style.left = -((this.posterImage.width - this.width) / 2) + 'px';
    }

    if( this.video ) {

        this.videoPlayer.element.style.top = -((this.videoPlayer.height - this.height) / 2) + 'px';
        this.videoPlayer.element.style.left = -((this.videoPlayer.width - this.width) / 2) + 'px';
    }

    if( this.debug ) this.logDebug( 'update layout: ' + this.width + ', ' + this.height + ' - video pos: ' + this.videoPlayer.element.style.top + ', ' + this.videoPlayer.element.style.left );
}

VideoSlide.prototype.setSize = function ( width, height ) {

    VideoSlide.super_.prototype.setSize.call(this, width, height);

    if( this.videoPlayer ) this.videoPlayer.fillSize( width, height, true );
    if( this.posterImage ) this.posterImage.fillSize( width, height, true );

    this.updateLayout();

}


module.exports = VideoSlide;