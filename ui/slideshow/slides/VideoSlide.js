// @formatter:off

var AbstractSlide               = require('./AbstractSlide');
var MediaEvent                  = require('../../../common/events/MediaEvent');
var CoreElement                 = require('../../../core/html/CoreElement');
var CoreVideo                   = require('../../../core/html/CoreVideo');
var CoreImage                   = require('../../../core/html/CoreImage');

var systemUtils                 = require('../../../core/utils/systemUtils');

//@formatter:on


AbstractSlide.extend( VideoSlide );

/**
 * A slide for the homepage video slider
 * @param element {HTMLElement|string}
 * @constructor
 */
function VideoSlide ( element ) {

    VideoSlide.super_.call( this, element );

    var _this = this;
    var _video;
    var _image;

    var video = _this.element.getElementsByTagName( 'video' )[ 0 ];
    var poster = _this.element.getElementsByTagName( 'img' )[ 0 ];

    _video = new CoreVideo( video );
    _video.element.style.position = 'absolute';
    _image = new CoreImage( poster );
    _image.element.style.position = 'absolute';

    _image.addEventListener( MediaEvent.DIMENSIONS_SET, handleImageDimensionEvent );
    _video.addEventListener( MediaEvent.DIMENSIONS_SET, handleVideoEvents );
    _video.element.addEventListener( 'loadeddata', handleVideoEvents );


    function handleVideoEvents ( event ) {

        switch ( event.type ) {
            case MediaEvent.DIMENSIONS_SET:

                _this.updateLayout();

                break;
            case 'loadeddata':

                _image.fadeOut();

                break;
            default:
                _this.logError( 'Unhandled video event: ' + event.type, event );
        }

    }

    function handleImageDimensionEvent ( event ) {

        _this.updateLayout();

    }

    Object.defineProperty( this, 'video', {
        enumerable: true,
        get: function () {
            return _video;
        }
    } );

    Object.defineProperty( this, 'poster', {
        enumerable: true,
        get: function () {
            return _image;
        }
    } );

    _this.setDestruct( function () {

        if( _video ) {

            _video.element.removeEventListener( 'loadeddata', handleVideoEvents );
            _video.removeEventListener( MediaEvent.DIMENSIONS_SET, handleVideoEvents );
            _video.destruct();
            _video = null;

        }

        if( _image ) {

            _image.removeEventListener( MediaEvent.DIMENSIONS_SET, handleImageDimensionEvent );
            _image.destruct();
            _image = null;

        }

        _this = undefined;

    } );

}

VideoSlide.prototype.play = function () {

    if( systemUtils.isMobile() | systemUtils.isTablet() ) return this.logWarn( 'Can not play video slides on mobile or tablet' );

    this.video.play();

}


VideoSlide.prototype.pause = function () {

    if( systemUtils.isMobile() | systemUtils.isTablet() ) return this.logWarn( 'Can not play video slides on mobile or tablet' );

    this.video.pause();

}

VideoSlide.prototype.preload = function ( opt_mode ) {

    if( systemUtils.isMobile() | systemUtils.isTablet() ) return this.logWarn( 'No need to preload video slides on mobile or tablet' );

    this.video.preload( opt_mode );

}

VideoSlide.prototype.activate = function () {

    this.video.play();

    VideoSlide.super_.prototype.activate.call( this );

}

VideoSlide.prototype.deactivate = function () {

    this.video.pause();

    VideoSlide.super_.prototype.deactivate.call( this );
}

VideoSlide.prototype.prepare = function () {

    this.video.preload();

    VideoSlide.super_.prototype.prepare.call( this );

}


VideoSlide.prototype.updateLayout = function () {

    if( this.poster ) {

        this.poster.position(
            -((this.poster.width - this.width) / 2),
            -((this.poster.height - this.height) / 2)
        );

    }

    if( this.video ) {

        this.video.position(
            -((this.video.width - this.width) / 2),
            -((this.video.height - this.height) / 2)
        );

    }

    if( this.debug ) this.logDebug( 'updated layout: ' + this.width + ', ' + this.height + ' - video pos: ' + this.video.x + ', ' + this.video.y );
}

VideoSlide.prototype.setSize = function ( width, height ) {

    VideoSlide.super_.prototype.setSize.call( this, width, height );

    if( this.video ) this.video.fillSize( width, height, true );
    if( this.poster ) this.poster.fillSize( width, height, true );

    this.updateLayout();

}


module.exports = VideoSlide;