/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var AbstractSlideShow           = require('./AbstractSlideShow');

var TweenLite                   = require('../../extern/gsap/TweenLite');
var CSSPlugin                   = require('../../extern/gsap/plugins/CSSPlugin');
var EasePack                    = require('../../extern/gsap/easing/EasePack');

SlideShow.VERTICAL              = 'vertical';
SlideShow.HORIZONTAL            = 'horizontal';

// @formatter:on

AbstractSlideShow.extend( SlideShow );


/**
 * @constructor
 */
function SlideShow () {

    var _this = this;
    var _direction = SlideShow.HORIZONTAL;
    var _animationTime = 1;
    var _animationEase = Power3.easeInOut;

    SlideShow.super_.call( this );


    _this.setDirection = function () {

        // TODO:

    }

     Object.defineProperty(this, 'direction', {
         enumerable: true,
     	get: function() {
              return _direction;
          }
     });

    Object.defineProperty( this, 'animationTime', {
        enumerable: true,
        get: function () {
            return _animationTime;
        }
    } );

    Object.defineProperty( this, 'animationEase', {
        enumerable: true,
        get: function () {
            return _animationEase;
        }
    } );

    _this.setDestruct( function () {

        if( _this.currentSlide ) TweenLite.killTweensOf( _this.currentSlide );
        if( _this.previousSlide ) TweenLite.killTweensOf( _this.previousSlide );

    } );

}

SlideShow.prototype.updateLayout = function () {

}

SlideShow.prototype.updateShow = function ( opt_instant ) {

    this.setAnimating( true );

    var animationOut = { ease: this.animationEase };
    var animationIn = { ease: this.animationEase, onComplete: this.setAnimating, onCompleteParams: [ false ] };
    var animationInFrom = {};


    if( this.direction === SlideShow.HORIZONTAL ) {

        animationOut.x = ( this.slideForward ? -this.previousSlide.width : 0 );
        animationIn.x = ( this.slideForward ? 0 : -this.currentSlide.width );
        animationInFrom.x = ( this.slideForward ? this.currentSlide.width : -this.currentSlide.width );

    }
    else {

        animationOut.y = (this.slideForward ? -this.previousSlide.height : this.previousSlide.height);
        animationIn.y = (this.slideForward ? this.currentSlide.height : -this.currentSlide.height);
        animationInFrom.y = ( this.slideForward ? this.currentSlide.height : -this.currentSlide.height );

    }


    if(this.previousSlide) TweenLite.tween( this.previousSlide, opt_instant ? 0 : this.animationTime, animationOut );

    TweenLite.fromTo( this.currentSlide, opt_instant ? 0 : this.animationTime, animationInFrom, animationIn );

}


module.exports = SlideShow;