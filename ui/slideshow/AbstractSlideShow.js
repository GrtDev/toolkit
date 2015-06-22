/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CoreHTMLElement                  = require('../../core/CoreHTMLElement');
var CommonEvent                     = require('../../core/events/CommonEvent');
var AnimationEvent                  = require('../animation/AnimationEvent');

// @formatter:on


CoreHTMLElement.extend( AbstractSlideShow );

/**
 * @constructor
 * @extends CoreEventDispatcher
 * @param {HTMLElement}
 * @event CommonEvent.CHANGE
 * @event AnimationEvent.START
 * @event AnimationEvent.COMPLETE
 */
function AbstractSlideShow ( element ) {

    AbstractSlideShow.super_.call(this, element);

    var _this = this;
    var _currentSlide;
    var _currentSlideIndex;
    var _previousSlide;
    var _previousSlideIndex;
    var _slides;
    var _slidesLength;
    var _slideForward;
    var _enabled;
    var _isAnimating;
    var _disableOnAnimation = true;


    // set initial styling
    var positionStyle = _this.getStyle( 'position' );

    if( positionStyle !== 'relative' && positionStyle !== 'absolute' ) _this.element.style = 'relative';
    _this.element.style.overflow = 'hidden';

    _this.addEventListener(CommonEvent.RESIZE, _this.handleResizeEvent);


    _this.enable = function () {

        if( _enabled ) return;
        _enabled = true;

    }

    _this.disable = function () {

        if( !_enabled ) return;
        _enabled = false;

    }

    _this.addSlide = function ( slide ) {

        if( _this.debug ) _this.logDebug( 'add slide', slide );

        if( _slides === undefined ) {

            _slides = [];
            _slidesLength = 0;

        }

        _slides.push( slide );
        _slidesLength++;

        _this.dispatchEvent( new CommonEvent( CommonEvent.CHANGE ) );

    }

    _this.removeSlide = function ( slide ) {

        if( _slides === undefined ) return;

        if( _this.debug ) _this.logDebug( 'remove slide', slide );

        var index = _slides.indexOf( slide );

        if( index < 0 ) return _this.logWarn( 'Failed to remove slide because it is not in the slide show.' );

        _slides.splice( index, 1 );
        _slidesLength--;

        _this.dispatchEvent( new CommonEvent( CommonEvent.CHANGE ) );

    }

    _this.previous = function () {

        if( _this.debug ) _this.logDebug( 'previous' );
        _this.setCurrentSlide( _this.currentSlideIndex - 1 );

    }


    _this.next = function () {

        if( _this.debug ) _this.logDebug( 'next' );
        _this.setCurrentSlide( _this.currentSlideIndex + 1 );

    }

    _this.setCurrentSlide = function ( slideIndex, opt_instant, opt_noUpdate ) {

        if( !_enabled || _this.isDestructed || (_disableOnAnimation && _isAnimating) ) return;

        if( slideIndex < 0 || slideIndex >= _slidesLength || slideIndex === _currentSlideIndex ) return;

        _previousSlideIndex = _currentSlideIndex;
        _previousSlide = _currentSlide;

        _slideForward = (!this.previousSlideIndex || this.previousSlideIndex <= this.currentSlideIndex);

        _currentSlideIndex = slideIndex;
        _currentSlide = _slides[ _currentSlideIndex ];


        _this.dispatchEvent( new CommonEvent( CommonEvent.UPDATE ) );


        if( !opt_noUpdate ) _this.updateShow( opt_instant );

    }


    _this.setAnimating = function ( value ) {

        if( _isAnimating === value ) return;

        _isAnimating = value;

        if( _isAnimating ) _this.dispatchEvent( new AnimationEvent( AnimationEvent.START ) );
        else _this.dispatchEvent( new AnimationEvent( AnimationEvent.COMPLETE ) );

    }

    _this.setDisableOnAnimation = function ( value ) {

        _disableOnAnimation = value;

    }

    Object.defineProperty( this, 'slidesLength', {
        enumerable: true,
        get: function () {
            return _slidesLength;
        }
    } );

    Object.defineProperty( this, 'currentSlideIndex', {
        enumerable: true,
        get: function () {
            return _currentSlideIndex;
        }
    } );

    Object.defineProperty( this, 'currentSlide', {
        enumerable: true,
        get: function () {
            return _currentSlide;
        }
    } );

    Object.defineProperty( this, 'previousSlide', {
        enumerable: true,
        get: function () {
            return _previousSlide;
        }
    } );

    Object.defineProperty( this, 'previousSlideIndex', {
        enumerable: true,
        get: function () {
            return _previousSlideIndex;
        }
    } );

    Object.defineProperty( this, 'slideForward', {
        enumerable: true,
        get: function () {
            return _slideForward;
        }
    } );

    Object.defineProperty( this, 'enabled', {
        enumerable: true,
        get: function () {
            return _enabled;
        }
    } );

    Object.defineProperty( this, 'isAnimating', {
        enumerable: true,
        get: function () {
            return _isAnimating;
        }
    } );

    Object.defineProperty( this, 'disableOnAnimation', {
        enumerable: true,
        get: function () {
            return _disableOnAnimation;
        }
    } );

    _this.setDestruct( function () {

        _this.removeEventListener(CommonEvent.RESIZE, _this.handleResizeEvent);

        _slides = undefined;
        _currentSlide = undefined;
        _currentSlideIndex = NaN;
        _previousSlide = undefined;
        _previousSlideIndex = NaN;

    } );

}

AbstractSlideShow.prototype.handleResizeEvent = function ( event ) {

    this.updateLayout();

}

AbstractSlideShow.prototype.updateLayout = function () {

    this.logError( 'abstract function, should be overridden!' );

}

AbstractSlideShow.prototype.updateShow = function ( opt_instant ) {

    this.logError( 'abstract function, should be overridden!' );

}


module.exports = AbstractSlideShow;