// @formatter:off

var MediaEvent                  = require('../../common/events/MediaEvent');
var CoreElement                 = require('../../core/html/CoreElement');
var CoreVideo                   = require('../../core/html/CoreVideo');
var CoreImage                   = require('../../core/html/CoreImage');

//@formatter:on


CoreElement.extend( AbstractVideoPlayer );

/**
 * A slide for the homepage video slider
 * @param element {HTMLElement}
 * @constructor
 * @extends CoreElement
 */
function AbstractVideoPlayer ( element, opt_debug ) {

    AbstractVideoPlayer.super_.call( this, element );

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

AbstractVideoPlayer.prototype.play = function () {

    this.video.play();

}

AbstractVideoPlayer.prototype.pause = function () {

    this.video.pause();

}

AbstractVideoPlayer.prototype.preload = function ( opt_mode ) {

    this.video.preload( opt_mode );

}

AbstractVideoPlayer.prototype.updateLayout = function () {

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

AbstractVideoPlayer.prototype.setSize = function ( width, height ) {

    AbstractVideoPlayer.super_.prototype.setSize.call( this, width, height );

    if( this.video ) this.video.fillSize( width, height, true );
    if( this.poster ) this.poster.fillSize( width, height, true );

    this.updateLayout();

}


module.exports = AbstractVideoPlayer;