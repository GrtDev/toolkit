/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CoreElement                             = require('../../core/html/CoreElement');
var CommonEvent                             = require('../../common/events/CommonEvent');
var AnimationEvent                          = require('../animation/AnimationEvent');
var ResizeManager                           = require('../../control/ResizeManager' );


AbstractSlideShow.DIRECTION_VERTICAL        = 'vertical';
AbstractSlideShow.DIRECTION_HORIZONTAL      = 'horizontal';
AbstractSlideShow.DIRECTION_NONE            = 'none';

var SLIDES_CONTAINER                        = '.js-slides-container';
var SLIDE                                   = '.js-slide';


// @formatter:on


CoreElement.extend( AbstractSlideShow );

/**
 * @constructor
 * @extends CoreElement
 * @param {HTMLElement}
 * @event CommonEvent.CHANGE
 * @event AnimationEvent.START
 * @event AnimationEvent.COMPLETE
 */
function AbstractSlideShow ( element, opt_slideConstructor, opt_autoInit ) {

    AbstractSlideShow.super_.call( this, element );

    var _this = this;
    var _slideConstructor = opt_slideConstructor;
    var _currentSlide;
    var _currentSlideIndex = -1;
    var _previousSlide;
    var _previousSlideIndex = -1;
    var _slides;
    var _slidesLength;
    var _slideForward;
    var _enabled;
    var _isTransitioning;
    var _disableDuringTransition = true;
    var _fullSizeSlides = true;
    var _autoHide = true;
    var _direction = AbstractSlideShow.DIRECTION_HORIZONTAL;
    var _autoResize;
    var _resizeManager;
    var _slidesContainer = _this.find( SLIDES_CONTAINER );
    _slidesContainer = _slidesContainer ? new CoreElement( _slidesContainer ) : _this;

    // set initial styling
    var positionStyle = _this.getStyle( 'position' );
    if( positionStyle !== 'relative' && positionStyle !== 'absolute' ) _this.element.style = 'relative';

    /* this fixes the overflow:hidden and position absolute bug in Chrome/Opera */
    _slidesContainer.element.style.webkitMaskImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC)';
    _slidesContainer.element.style.overflow = 'hidden';


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

        var slideElements = _slidesContainer.findAll( selector );

        for ( var i = 0, leni = slideElements.length; i < leni; i++ ) {

            _this.addSlide( new constructor( slideElements[ i ] ), true );

        }

        if( leni <= 0 ) {

            _this.logWarn( 'Failed to find any slides.. selector: ' + selector );

        }  else {

            _this.dispatchEvent( new CommonEvent( CommonEvent.CHANGE ) );

        }

    }

    _this.addSlide = function ( slide, opt_silent ) {

        if( _this.debug ) _this.logDebug( 'add slide', slide );

        if( _slides === undefined ) {

            _slides = [];
            _slidesLength = 0;

        }

        if( _autoHide ) slide.hide();

        _slides.push( slide );
        _slidesLength++;

        if( !opt_silent  ) _this.dispatchEvent( new CommonEvent( CommonEvent.CHANGE ) );

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

        if( !_enabled || _this.isDestructed || (_disableDuringTransition && _isTransitioning) ) return;

        if( slideIndex < 0 || slideIndex >= _slidesLength || slideIndex === _currentSlideIndex ) return;

        if( _this.debug ) _this.logDebug( 'setting new current slide: ' + slideIndex + ', current: ' + _currentSlideIndex + ', prev: ' + _previousSlideIndex );

        _previousSlideIndex = _currentSlideIndex;
        _previousSlide = _currentSlide;

        _currentSlideIndex = slideIndex;
        _currentSlide = _slides[ _currentSlideIndex ];

        if( _autoHide ) _currentSlide.show();

        _slideForward = (!_previousSlideIndex || _previousSlideIndex <= _currentSlideIndex);

        _this.dispatchEvent( new CommonEvent( CommonEvent.UPDATE ) );


        if( !opt_noUpdate ) _this.transitionSlides( opt_instant );

    }


    _this.setTransitioning = function ( value ) {

        if( _isTransitioning === value ) return;

        _isTransitioning = value;

        if( !_isTransitioning ) {

            if( _currentSlide ) _currentSlide.activate();
            if( _previousSlide ) _previousSlide.hide();

        } else {

            if( _previousSlide ) _previousSlide.deactivate();

        }


        if( _slidesLength > _currentSlideIndex + 1 ) _slides[ _currentSlideIndex + 1 ].prepare();

        _this.dispatchEvent( new AnimationEvent( _isTransitioning ? AnimationEvent.START : AnimationEvent.COMPLETE ) );

    }

    _this.setDirection = function ( value ) {

        if( _direction === value ) return;

        switch ( value ) {
            case AbstractSlideShow.DIRECTION_HORIZONTAL:
            case AbstractSlideShow.DIRECTION_VERTICAL:
            case AbstractSlideShow.DIRECTION_NONE:

                _direction = value;

                break;
            default:
                _this.logError( 'Unknown direction' );
        }

        _this.updateLayout();

    }

    _this.previous = function () {

        if( _this.debug ) _this.logDebug( 'previous' );
        _this.setCurrentSlide( _this.currentSlideIndex - 1 );

    }


    _this.next = function () {

        if( _this.debug ) _this.logDebug( 'next' );
        _this.setCurrentSlide( _this.currentSlideIndex + 1 );

    }

    function handleWindowResize () {

        _this.updateLayout();

    }

    Object.defineProperty( this, 'autoResize', {
        enumerable: true,
        get: function () {

            return _autoResize;

        },
        set: function ( value ) {

            if( value === _autoResize ) return;
            _autoResize = value;

            if( _autoResize ) {

                if( !_resizeManager ) _resizeManager = ResizeManager.getInstance();
                _resizeManager.addCallback( handleWindowResize );

            } else {

                _resizeManager.removeCallback( handleWindowResize );

            }

        }
    } );

    Object.defineProperty( this, 'slideConstructor', {
        enumerable: true,
        get: function () {
            return _slideConstructor;
        }
    } );

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

    Object.defineProperty( this, 'disableDuringTransition', {
        enumerable: true,
        get: function () {
            return _disableDuringTransition;
        },
        set: function ( value ) {
            _disableDuringTransition = value;
        }
    } );

    Object.defineProperty( this, 'direction', {
        enumerable: true,
        get: function () {
            return _direction;
        }
    } );

    Object.defineProperty( this, 'slidesContainer', {
        enumerable: true,
        get: function () {
            return _slidesContainer;
        }
    } );

    _this.setDestruct( function () {

        if( _resizeManager ) {

            _resizeManager.removeCallback( handleWindowResize );
            _resizeManager = undefined;

        }

        _slides = undefined;
        _currentSlide = undefined;
        _currentSlideIndex = NaN;
        _previousSlide = undefined;
        _previousSlideIndex = NaN;

    } );


    if( opt_autoInit === undefined || opt_autoInit ) _this.init();

}

AbstractSlideShow.prototype.init = function ( opt_direction ) {

    if( this.debug ) this.logDebug( 'init' );

    if(opt_direction !== undefined) this.setDirection( opt_direction );

    if( this.slideConstructor ) this.parseSlides( SLIDE, this.slideConstructor );

    this.enable();

    if( this.length ) this.setCurrentSlide( 0, true );

    this.autoResize = true;

    this.updateLayout();


}


AbstractSlideShow.prototype.setSize = function ( width, height ) {

    if( this.debug ) this.logDebug( 'update slide show size: ' + width + ', ' + height );

    AbstractSlideShow.super_.prototype.setSize.call( this, width, height );

    this.updateLayout();


}

AbstractSlideShow.prototype.updateLayout = function () {


    if( this.fullSizeSlides ) {

        var width = this.slidesContainer.width;
        var height = this.slidesContainer.height;

        if( this.debug ) this.logDebug( 'update layout ' + width + ', ' + height );

        for ( var i = 0, leni = this.length; i < leni; i++ ) {

            this.slides[ i ].setSize( width, height );

        }

    }

}


AbstractSlideShow.prototype.transitionSlides = function ( opt_instant ) {

    this.logError( 'abstract function, should be overridden!' );

}


module.exports = AbstractSlideShow;