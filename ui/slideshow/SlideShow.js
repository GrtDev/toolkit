/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var AbstractSlideShow           = require('./AbstractSlideShow');
var SlideControls               = require('./SlideControls');
var CommonEvent                 = require('../../common/events/CommonEvent');

var TweenLite                   = require('../../extern/gsap/TweenLite');
var eases                       = require('../../extern/gsap/easing/EasePack');

AbstractSlideShow.extend( SlideShow );

// @formatter:on

/**
 * @constructor
 * @extends AbstractSlideShow
 * @param element {HTMLElement|string} element or selector query
 */
function SlideShow ( element, opt_slideConstructor, opt_autoInit ) {

    SlideShow.super_.call( this, element, opt_slideConstructor, false );

    var _this = this;
    var _animationTime = 1;
    var _animationEase = eases.Power3.easeInOut;

    var _controls;


    _this.initControls = function () {

        if( _controls ) return _this.logWarn( 'controls are already initiated!' );
        _controls = new SlideControls( _this );

    }


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

     Object.defineProperty(this, 'controls', {
         enumerable: true,
     	get: function() {
              return _controls;
          }
     });

    _this.setDestruct( function () {

        if( _controls ) {

            _controls.destruct();
            _controls = undefined;
        }

        if( _this.currentSlide ) TweenLite.killTweensOf( _this.currentSlide );
        if( _this.previousSlide ) TweenLite.killTweensOf( _this.previousSlide );

        _animationEase = undefined;
        _animationTime = NaN;

    } );

    if( opt_autoInit === undefined || opt_autoInit ) _this.init();

}

SlideShow.prototype.init = function (opt_direction) {

    SlideShow.super_.prototype.init.call( this, opt_direction );

    this.initControls();

}

SlideShow.prototype.updateLayout = function () {

    SlideShow.super_.prototype.updateLayout.call( this );

    if( this.previousSlide ) TweenLite.killTweensOf( this.previousSlide );

    if( this.currentSlide ) {

        TweenLite.killTweensOf( this.currentSlide );
        TweenLite.to( this.currentSlide.element, 0, { y: 0, x: 0 } );

    }

    this.setTransitioning( false );

}

SlideShow.prototype.transitionSlides = function ( opt_instant ) {

    this.setTransitioning( true );

    var animationOut = { ease: this.animationEase };
    var animationIn = { ease: this.animationEase, onComplete: this.setTransitioning, onCompleteParams: [ false ] };
    var animationInFrom = {};

    if( this.isHorizontal ) {

        if( this.previousSlide ) animationOut.x = ( this.slideForward ? -this.previousSlide.width : this.previousSlide.width );
        animationIn.x = 0;
        animationInFrom.x = ( this.slideForward ? this.currentSlide.width : -this.currentSlide.width );
        animationInFrom.y = 0;

    }
    else if( this.isVertical ) {

        if( this.previousSlide ) animationOut.y = (this.slideForward ? -this.previousSlide.height : this.previousSlide.height);
        animationIn.y = 0;
        animationInFrom.y = ( this.slideForward ? this.currentSlide.height : -this.currentSlide.height );
        animationInFrom.x = 0;

    }

    if( this.debug ) this.logDebug( 'updating show: \ninstant: ' + opt_instant + '\nforward: ' + this.slideForward + '\ndirection:' + this.direction + ' \nanim in: ', animationIn, '\nanim in from:', animationInFrom, '\nanim out: ', animationOut );


    if( this.previousSlide ) TweenLite.to( this.previousSlide, opt_instant ? 0 : this.animationTime, animationOut );

    TweenLite.fromTo( this.currentSlide, opt_instant ? 0 : this.animationTime, animationInFrom, animationIn );

}


module.exports = SlideShow;