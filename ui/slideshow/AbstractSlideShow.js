/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CoreHTMLElement                         = require('../../core/CoreHTMLElement');
var CommonEvent                             = require('../../core/events/CommonEvent');
var AnimationEvent                          = require('../animation/AnimationEvent');


AbstractSlideShow.DIRECTION_VERTICAL        = 'vertical';
AbstractSlideShow.DIRECTION_HORIZONTAL      = 'horizontal';
AbstractSlideShow.DIRECTION_NONE            = 'none';

// @formatter:on

CoreHTMLElement.extend( AbstractSlideShow );

/**
 * @constructor
 * @extends CoreHTMLElement
 * @param {HTMLElement}
 * @event CommonEvent.CHANGE
 * @event AnimationEvent.START
 * @event AnimationEvent.COMPLETE
 */
function AbstractSlideShow ( element ) {

    AbstractSlideShow.super_.call( this, element );

    var _this = this;
    var _currentSlide;
    var _currentSlideIndex = -1;
    var _previousSlide;
    var _previousSlideIndex = -1;
    var _slides;
    var _slidesLength;
    var _slideForward;
    var _enabled;
    var _isTransitioning;
    var _disableOnAnimation = true;
    var _fullSizeSlides = true;
    var _autoHide = true;
    var _direction;


    _this.enable = function () {

        if( _enabled ) return;
        _enabled = true;

    }

    _this.disable = function () {

        if( !_enabled ) return;
        _enabled = false;

    }

    _this.parseSlides = function ( selector, constructor ) {

        if( _this.debug ) _this.logDebug( 'parsing slides..  \'' + selector + '\'' );

        var slideElements = _this.element.querySelectorAll( selector );

        for ( var i = 0, leni = slideElements.length; i < leni; i++ ) {

            var slideElement = slideElements[ i ];
            _this.addSlide( new constructor( slideElement ) );


        }

    }

    _this.addSlide = function ( slide ) {

        if( _this.debug ) _this.logDebug( 'add slide', slide );

        if( _slides === undefined ) {

            _slides = [];
            _slidesLength = 0;

        }

        if(_autoHide) slide.hide();

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


    _this.setCurrentSlide = function ( slideIndex, opt_instant, opt_noUpdate ) {

        if( !_enabled || _this.isDestructed || (_disableOnAnimation && _isTransitioning) ) return;

        if( slideIndex < 0 || slideIndex >= _slidesLength || slideIndex === _currentSlideIndex ) return;

        if( _this.debug ) _this.logDebug( 'setting new current slide: ' + slideIndex );

        _previousSlideIndex = _currentSlideIndex;
        _previousSlide = _currentSlide;

        _currentSlideIndex = slideIndex;
        _currentSlide = _slides[ _currentSlideIndex ];

        if(_autoHide) _currentSlide.show();

        _slideForward = (!this.previousSlideIndex || this.previousSlideIndex <= this.currentSlideIndex);

        _this.dispatchEvent( new CommonEvent( CommonEvent.UPDATE ) );


        if( !opt_noUpdate ) _this.transitionSlides( opt_instant );

    }


    _this.setTransitioning = function ( value ) {

        if( _isTransitioning === value ) return;

        _isTransitioning = value;

        _this.dispatchEvent( new AnimationEvent( _isTransitioning ? AnimationEvent.START : AnimationEvent.COMPLETE ) );

    }

    _this.setDisableOnAnimation = function ( value ) {

        _disableOnAnimation = value;

    }

    _this.setDirection = function ( value ) {

        switch ( value ) {
            case AbstractSlideShow.DIRECTION_HORIZONTAL:
            case AbstractSlideShow.DIRECTION_VERTICAL:
            case AbstractSlideShow.DIRECTION_NONE:

                _direction = value;

                break;
            default:
                _this.logError( 'Unknown direction' );
        }

    }

    Object.defineProperty( this, 'isVertical', {
        enumerable: true,
        get: function () {
            return _direction === AbstractSlideShow.DIRECTION_VERTICAL;
        }
    } );

    Object.defineProperty( this, 'isHorizontal', {
        enumerable: true,
        get: function () {
            return _direction === AbstractSlideShow.DIRECTION_HORIZONTAL;
        }
    } );


    Object.defineProperty( this, 'fullSizeSlides', {
        enumerable: true,
        get: function () {
            return _fullSizeSlides;
        },
        set: function ( value ) {
            if( value === _fullSizeSlides ) return;
            _fullSizeSlides = value;
        }
    } );

    Object.defineProperty( this, 'slides', {
        enumerable: true,
        get: function () {
            return _slides;
        }
    } );

    Object.defineProperty( this, 'length', {
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

    Object.defineProperty( this, 'isTransitioning', {
        enumerable: true,
        get: function () {
            return _isTransitioning;
        }
    } );

    Object.defineProperty( this, 'disableOnAnimation', {
        enumerable: true,
        get: function () {
            return _disableOnAnimation;
        }
    } );


    Object.defineProperty( this, 'direction', {
        enumerable: true,
        get: function () {
            return _direction;
        }
    } );

    _this.setDestruct( function () {

        _slides = undefined;
        _currentSlide = undefined;
        _currentSlideIndex = NaN;
        _previousSlide = undefined;
        _previousSlideIndex = NaN;

    } );

}

AbstractSlideShow.prototype.init = function ( opt_direction ) {

    if( this.debug ) this.logDebug( 'init' );

    this.setDirection( opt_direction || AbstractSlideShow.DIRECTION_HORIZONTAL );

    this.enable();

    // set initial styling
    var positionStyle = this.getStyle( 'position' );

    if( positionStyle !== 'relative' && positionStyle !== 'absolute' ) this.element.style = 'relative';
    this.element.style.overflow = 'hidden';

    if( this.length ) this.setCurrentSlide( 0, true );

}

AbstractSlideShow.prototype.previous = function () {

    if( this.debug ) this.logDebug( 'previous' );
    this.setCurrentSlide( this.currentSlideIndex - 1 );

}


AbstractSlideShow.prototype.next = function () {

    if( this.debug ) this.logDebug( 'next' );
    this.setCurrentSlide( this.currentSlideIndex + 1 );

}

AbstractSlideShow.prototype.setSize = function ( width, height ) {

    AbstractSlideShow.super_.prototype.setSize.call( this, width, height );

    if( this.fullSizeSlides ) {

        for ( var i = 0, leni = this.length; i < leni; i++ ) {

            this.slides[ i ].setSize( width, height );

        }

    }

}


AbstractSlideShow.prototype.transitionSlides = function ( opt_instant ) {

    this.logError('abstract function, should be overridden!');

}


module.exports = AbstractSlideShow;