/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var AbstractSlideShow           = require('./AbstractSlideShow');
var BulletListMenu              = require('./BulletListMenu');
var CoreHTMLElement             = require('../../core/CoreHTMLElement');
var CommonEvent                 = require('../../core/events/CommonEvent');

                                  require('../../extern/gsap/plugins/CSSPlugin');
                                  require('../../extern/gsap/easing/EasePack');
var TweenLite                   = require('../../extern/gsap/TweenLite');

SlideShow.VERTICAL              = 'vertical';
SlideShow.HORIZONTAL            = 'horizontal';

// @formatter:on

AbstractSlideShow.extend( SlideShow );


/**
 * @constructor
 * @extends AbstractSlideShow
 */
function SlideShow () {

    var _this = this;
    var _eventTarget;
    var _direction;
    var _animationTime = 1;
    var _animationEase = Power3.easeInOut;
    var _touchValue = -1;
    var _previousTouchValue = -1;
    var _bulletMenu;

    SlideShow.super_.call( this );

    _this.init = function ( opt_direction, opt_eventTarget ) {

        if( opt_direction ) _direction = opt_direction || SlideShow.HORIZONTAL;
        if( opt_eventTarget ) _eventTarget = opt_eventTarget || _this.container;

        _eventTarget.addEventListener( 'touchstart', handleTouchEvents );
        _eventTarget.addEventListener( 'touchmove', handleTouchEvents );
        _eventTarget.addEventListener( 'touchend', handleTouchEvents );

    }

    /**
     *
     * @param listElement {HTMLElement}
     * @param opt_autoCreate {boolean=true}
     */
    _this.addBulletListMenu = function ( listElement, opt_autoCreate ) {

        if(_bulletMenu) return _this.logError('bullet list menu was already added!');

        _bulletMenu = new BulletListMenu( listElement, opt_autoCreate );

        _bulletMenu.setLength( _this.slidesLength );
        _bulletMenu.select( _this.currentSlideIndex );

        _this.addEventListener( CommonEvent.UPDATE, handleSlideShowEvents );
        _this.addEventListener( CommonEvent.CHANGE, handleSlideShowEvents );

    }


    function handleSlideShowEvents ( event ) {

        switch ( event.type ) {
            case CommonEvent.CHANGE:

                if( _bulletMenu ) _bulletMenu.setLength( _this.slidesLength );

                break;
            case CommonEvent.UPDATE:

                if( _bulletMenu ) _bulletMenu.select( _this.currentSlideIndex );

                break;
            default:
                _this.logError( 'Unhandled slide show event' );
        }


    }


    _this.setDirection = function () {

        // TODO:

    }

    /**
     *
     * @param event {TouchEvent|Event}
     */
    function handleTouchEvents ( event ) {

        if( _this.isDestructed ) return;


        switch ( event.type ) {
            case 'touchstart':

                if( _direction === SlideShow.HORIZONTAL ) _touchValue = event.touches[ 0 ].clientX;
                else  _touchValue = event.touches[ 0 ].clientY;


                break;
            case 'touchmove':

                _previousTouchValue = _touchValue;

                if( _direction === SlideShow.HORIZONTAL ) _touchValue = event.touches[ 0 ].clientX;
                else  _touchValue = event.touches[ 0 ].clientY;

                if( _previousTouchValue >= 0 ) {

                    if( _touchValue > _previousTouchValue ) _this.previous();
                    else _this.next();

                }

                break;
            case 'touchend':

                _previousTouchValue = -1;

                break;
            default:
                _this.logError( 'Unhandled touch event', event );
        }

    }


    Object.defineProperty( this, 'direction', {
        enumerable: true,
        get: function () {
            return _direction;
        }
    } );

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

        if( _eventTarget ) {

            _eventTarget.addEventListener( 'touchstart', handleTouchEvents );
            _eventTarget.addEventListener( 'touchmove', handleTouchEvents );
            _eventTarget.addEventListener( 'touchend', handleTouchEvents );
            _eventTarget = undefined;
        }

        _this.removeEventListener( CommonEvent.UPDATE, handleSlideShowEvents );
        _this.removeEventListener( CommonEvent.CHANGE, handleSlideShowEvents );

        if( _this.currentSlide ) TweenLite.killTweensOf( _this.currentSlide );
        if( _this.previousSlide ) TweenLite.killTweensOf( _this.previousSlide );

        _animationEase = undefined;
        _animationTime = NaN;
        _touchValue = NaN;
        _previousTouchValue = NaN;

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


    if( this.previousSlide ) TweenLite.tween( this.previousSlide, opt_instant ? 0 : this.animationTime, animationOut );

    TweenLite.fromTo( this.currentSlide, opt_instant ? 0 : this.animationTime, animationInFrom, animationIn );

}


module.exports = SlideShow;