// @formatter:off

var MediaEvent                  = require('../../common/events/MediaEvent');
var CoreElement                 = require('../../core/html/CoreElement');
var CoreVideo                   = require('../../core/html/CoreVideo');
var CoreImage                   = require('../../core/html/CoreImage');

//@formatter:on


CoreElement.extend( VideoPlayer );

/**
 * A slide for the homepage video slider
 * @param element {HTMLElement}
 * @constructor
 */
function VideoPlayer ( element, opt_debug ) {

    VideoPlayer.super_.call( this, element );

    var _this = this;
    var _video;
    var _poster;

    _this.debug = opt_debug;

    var video = _this.element.getElementsByTagName( 'video' )[ 0 ];
    var poster = _this.element.getElementsByTagName( 'img' )[ 0 ];

    _video = new CoreVideo( video );

    if( poster ) {
        _poster = new CoreImage( poster );
        _poster.element.style.position = 'absolute';
    }

    _video.addEventListener( MediaEvent.DIMENSIONS_SET, handleVideoEvents );


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

        _video.play();

    }

    _this.pause = function () {

        _video.pause();

    }

    _this.preload = function () {

        _video.preload();

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
            return _poster;
        }
    } );

    _this.setDestruct( function () {

        if( _video ) {

            _video.removeEventListener( MediaEvent.DIMENSIONS_SET, handleVideoEvents );
            _video.destruct();
            _video = null;

        }

        if( _poster ) {
            _poster.destruct();
            _poster = null;
        }

        _this = undefined;

    } );

}

VideoPlayer.prototype.updateLayout = function () {

    if( this.debug ) this.logDebug( 'updateLayout' );

    if( this.poster ) {

        this.poster.element.style.top = -((this.poster.height - this.height) / 2) + 'px';
        this.poster.element.style.left = -((this.poster.width - this.width) / 2) + 'px';

    }

    if( this.video ) {

        this.video.element.style.top = -((this.video.height - this.height) / 2) + 'px';
        this.video.element.style.left = -((this.video.width - this.width) / 2) + 'px';

    }

    if( this.debug ) this.logDebug( 'update layout: ' + this.width + ', ' + this.height + ' - video pos: ' + this.video.element.style.top + ', ' + this.video.element.style.left );
}

VideoPlayer.prototype.setSize = function ( width, height ) {

    VideoPlayer.super_.prototype.setSize.call( this, width, height );

    if( this.video ) this.video.fillSize( width, height, true );
    if( this.poster ) this.poster.fillSize( width, height, true );

    this.updateLayout();

}


module.exports = VideoPlayer;