/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CoreEventDistpatcher            = require('../../core/events/CoreEventDispatcher');
var CommonEvent                     = require('../../core/events/CommonEvent');
var AnimationEvent                  = require('../animation/AnimationEvent');

// @formatter:on


CoreEventDistpatcher.extend( AbstractSlideShow );

/**
 * @constructor
 * @extends CoreEventDispatcher
 * @param {HTMLElement}
 * @event CommonEvent.CHANGE
 * @event AnimationEvent.START
 * @event AnimationEvent.COMPLETE
 */
function AbstractSlideShow ( container ) {

    if( !container ) return this.logError( 'container can not be null!' );

    var _this = this;
    var _currentSlide;
    var _currentSlideIndex;
    var _previousSlide;
    var _previousSlideIndex;
    var _slides;
    var _slidesLength;
    var _container;
    var _width;
    var _height;
    var _slideForward;
    var _enabled;
    var _isAnimating;
    var _disableOnAnimation = true;

    _container = container;

    // retrieve dimensions
    var boundingRectangle = _container.getBoundingClientRect();
    _width = boundingRectangle.width;
    _height = boundingRectangle.height;

    // set initial styling
    var style = getComputedStyle( _container, null );
    var positionStyle = style.getPropertyValue( 'position' );

    if( positionStyle !== 'relative' && positionStyle !== 'absolute' ) _container.style = 'relative';
    _container.style.overflow = 'hidden';

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

    _this.setSize = function ( width, height ) {

        _width = width;
        _height = height;
        _container.style.width = _width + 'px;';
        _container.style.height = _height + 'px;';

        _this.updateLayout();

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

     Object.defineProperty(this, 'container', {
         enumerable: true,
     	get: function() {
              return _container;
          }
     });

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

    Object.defineProperty( this, 'width', {
        enumerable: true,
        get: function () {
            return _width;
        }
    } );

    Object.defineProperty( this, 'height', {
        enumerable: true,
        get: function () {
            return _height;
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

        _slides = undefined;
        _container = undefined;
        _currentSlide = undefined;
        _currentSlideIndex = NaN;
        _previousSlide = undefined;
        _previousSlideIndex = NaN;

    } );

}

AbstractSlideShow.prototype.updateLayout = function () {

    this.logError( 'abstract function, should be overridden!' );

}

AbstractSlideShow.prototype.updateShow = function ( opt_instant ) {

    this.logError( 'abstract function, should be overridden!' );

}


module.exports = AbstractSlideShow;