// @formatter:off

var CoreHTMLElement             = require('../../core/CoreHTMLElement');
var CommonEvent                 = require('../../core/events/CommonEvent');

//@formatter:on


CoreHTMLElement.extend( SlideShowControls );

/**
 * A slide for the homepage video slider
 * @param element {HTMLElement}
 * @constructor
 * @extends CoreHTMLElement
 */
function SlideShowControls ( element ) {

    SlideShowControls.super_.call( this, element );

    var _this = this;
    var _nextButton;
    var _previousButton;
    var _currentSlide;
    var _totalSlides;
    var _slideShow;
    var _initiated;

    /**
     * Initates the controls
     * @param slideShow {AbstractSlideShow}
     * @returns {*}
     */
    _this.init = function ( slideShow ) {

        if( !slideShow ) return _this.logError( 'slideshow can not be null!' );

        if( _initiated ) return _this.logError( 'controls have already been initiated!' );
        _initiated = true;

        _slideShow = slideShow;

        _nextButton = _this.find( '.js-next' );
        _previousButton = _this.find( '.js-previous' );
        _currentSlide = _this.find( '.js-current' );
        _totalSlides = _this.find( '.js-total' );

        if( _nextButton ) _nextButton.addEventListener( 'click', handleButtonClicks );
        if( _previousButton ) _previousButton.addEventListener( 'click', handleButtonClicks );

        if( _currentSlide || _totalSlides ) _slideShow.addEventListener( CommonEvent.UPDATE, handleSlideShowUpdate );

        update();


    }

    function handleSlideShowUpdate ( event ) {

        update();

    }

    function handleButtonClicks ( event ) {

        if( !_slideShow ) return;

        switch ( event.currentTarget ) {
            case _nextButton:

                _slideShow.next();

                break;
            case _previousButton:

                _slideShow.previous();

                break;
            default:
                _this.logError( 'Unhandled switch case' );
        }
    }

    function update () {

        if( !_slideShow ) return;

        if( _currentSlide ) _currentSlide.innerHTML = _slideShow.currentSlideIndex + 1;
        if( _totalSlides ) _totalSlides.innerHTML = _slideShow.length;

    }


    _this.setDestruct( function () {

        if( _nextButton ) {
            _nextButton.removeEventListener( 'click', handleButtonClicks );
            _nextButton = undefined;
        }
        if( _previousButton ) {
            _previousButton.removeEventListener( 'click', handleButtonClicks );
            _previousButton = undefined;
        }
        if( _slideShow ) {
            _slideShow.removeEventListener( CommonEvent.UPDATE, handleSlideShowUpdate );
            _slideShow = undefined;
        }

        _currentSlide = undefined;
        _totalSlides = undefined;
        _initiated = undefined;

    } );

}


module.exports = SlideShowControls;
