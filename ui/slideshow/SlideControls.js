// @formatter:off

var CoreObject                  = require('../../core/CoreObject');
var CommonEvent                 = require('../../common/events/CommonEvent');
var SelectGroup                 = require('../../data/collection/SelectGroup');
var BulletList                  = require('./BulletList');



CoreObject.extend( SlideControls );

var CONTROL_BULLETS             = '.js-bullets';
var CONTROL_ACTIVE_MENU         = '.js-active-menu';
var CONTROL_NEXT                = '.js-next';
var CONTROL_PREVIOUS            = '.js-previous';
var INFO_CURRENT                = '.js-current';
var INFO_TOTAL                  = '.js-total';

//@formatter:on

/**
 * A slide for the homepage video slider
 * @param element {HTMLElement}
 * @constructor
 * @extends CoreElement
 */
function SlideControls ( slideShow ) {

    SlideControls.super_.call( this );

    if( !slideShow ) return this.logError( 'slide show can not be null!' );

    // @formatter:off

    var _this                   = this;
    var _slideShow              = slideShow;
    var _touchTarget            = slideShow.element;
    var _touchAdded;
    var _touchThreshold         = 30;   // how many pixels you need to drag to trigger a previous / next call.
    var _touchStartValue        = -1;
    var _touchCurrentValue      = -1;
    var _activeMenuGroup;
    var _activeMenu             = _slideShow.find( CONTROL_ACTIVE_MENU );
    var _nextButton             = _slideShow.find( CONTROL_NEXT );
    var _previousButton         = _slideShow.find( CONTROL_PREVIOUS );
    var _currentSlideInfo       = _slideShow.find( INFO_CURRENT );
    var _totalSlidesInfo        = _slideShow.find( INFO_TOTAL );
    var _bulletList             = _slideShow.find( CONTROL_BULLETS );

    // @formatter:on


    addTouch();



    if( _nextButton ) _nextButton.addEventListener( 'click', handleButtonClicks );
    if( _previousButton ) _previousButton.addEventListener( 'click', handleButtonClicks );

    if( _activeMenu ) {

        _activeMenuGroup = new SelectGroup( null, 'active' );
        var children = _activeMenu.children;

        for ( var i = 0, leni = children.length; i < leni; i++ ) {
            var childElement = children[ i ];
            _activeMenuGroup.add( childElement );
            childElement.addEventListener( 'click', handleActiveMenuClick );
        }

    }

    if( _bulletList ) {

        _bulletList = new BulletList( _bulletList );
        _bulletList.length = _slideShow.length;
        _bulletList.onIndexClick( onBulletIndexClick );

    }

    if( _currentSlideInfo || _totalSlidesInfo || _activeMenu || _bulletList ) {

        _slideShow.addEventListener( CommonEvent.UPDATE, handleSlideShowEvents );
        updateInfo();

    }


    function updateInfo () {

        // @formatter:off

        if( _currentSlideInfo ) _currentSlideInfo.innerHTML = _slideShow.currentSlideIndex + 1;
        if( _totalSlidesInfo )  _totalSlidesInfo.innerHTML = _slideShow.length;
        if( _activeMenuGroup )  _activeMenuGroup.select( _slideShow.currentSlideIndex );
        if( _bulletList )       _bulletList.select( _slideShow.currentSlideIndex );

        // @formatter:on

    }


    _this.setTouchTarget = function ( target ) {

        if( _touchTarget === target ) return;

        removeTouch();
        _touchTarget = target;
        addTouch();

    }


    function addTouch () {

        if( _touchAdded ) return;
        _touchAdded = true;

        _touchTarget.addEventListener( 'touchstart', handleTouchEvents );
        _touchTarget.addEventListener( 'touchmove', handleTouchEvents );
        _touchTarget.addEventListener( 'touchend', handleTouchEvents );

    }

    function removeTouch () {

        if( !_touchAdded ) return;
        _touchAdded = false;

        _touchTarget.removeEventListener( 'touchstart', handleTouchEvents );
        _touchTarget.removeEventListener( 'touchmove', handleTouchEvents );
        _touchTarget.removeEventListener( 'touchend', handleTouchEvents );

    }


    function onBulletIndexClick ( index ) {

        _slideShow.setCurrentSlide( index, false, false, 'bullet' );

    }

    function handleActiveMenuClick ( event ) {

        event.preventDefault();
        _slideShow.setCurrentSlide( _activeMenuGroup.indexOf( event.currentTarget ), false, false, 'menu' );

    }


    function handleSlideShowEvents ( event ) {

        switch ( event.type ) {
            case CommonEvent.CHANGE:

                if( _bulletList ) _bulletList.length = _slideShow.length;

                break;
            case CommonEvent.UPDATE:

                updateInfo();

                break;
            default:
                _this.logError( 'Unhandled switch case' );
        }

    }


    function handleButtonClicks ( event ) {

        event.preventDefault();

        switch ( event.currentTarget ) {
            case _nextButton:

                _slideShow.next( false, false, 'button-next');

                break;
            case _previousButton:

                _slideShow.previous( false, false, 'button-previous');

                break;
            default:
                _this.logError( 'Unhandled switch case' );
        }
    }

    /**
     *
     * @param event {TouchEvent|Event}
     */
    function handleTouchEvents ( event ) {

        if( _this.isDestructed ) return;


        switch ( event.type ) {
            case 'touchstart':

                if( _slideShow.isHorizontal ) _touchStartValue = event.touches[ 0 ].clientX;
                else  _touchStartValue = event.touches[ 0 ].clientY;


                break;
            case 'touchmove':

                if( _slideShow.isHorizontal ) _touchCurrentValue = event.touches[ 0 ].clientX;
                else  _touchCurrentValue = event.touches[ 0 ].clientY;


                if( (_touchCurrentValue - _touchStartValue) > _touchThreshold ) {

                    event.preventDefault();
                    _slideShow.previous( false, false, 'touch-previous');
                    _touchStartValue = _touchCurrentValue;

                }
                else if( (_touchCurrentValue - _touchStartValue) < -_touchThreshold ) {

                    event.preventDefault();
                    _slideShow.next( false, false, 'touch-next');
                    _touchStartValue = _touchCurrentValue;

                }


                break;
            case 'touchend':

                _touchCurrentValue = -1;
                _touchStartValue = -1;

                break;
            default:
                _this.logError( 'Unhandled touch event', event );
        }

    }

    Object.defineProperty( this, 'bulletList', {
        enumerable: true,
        get: function () {
            return _bulletList;
        }
    } );

     Object.defineProperty(this, 'nextButton', {
         enumerable: true,
     	get: function() {
              return _nextButton;
          }
     });


     Object.defineProperty(this, 'previousButton', {
         enumerable: true,
     	get: function() {
              return _previousButton;
          }
     });

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
            _slideShow.removeEventListener( CommonEvent.UPDATE, handleSlideShowEvents );
            _slideShow = undefined;
        }

        if( _activeMenuGroup ) {

            for ( var i = 0, leni = _activeMenuGroup.length; i < leni; i++ ) {
                _activeMenuGroup.items[ i ].removeEventListener( 'click', handleActiveMenuClick );
            }

            _activeMenuGroup.destruct();
            _activeMenuGroup = undefined;
        }

        if( _touchTarget ) {

            removeTouch();
            _touchTarget = undefined;

        }

        _currentSlideInfo = undefined;
        _totalSlidesInfo = undefined;
        _touchStartValue = NaN;
        _touchCurrentValue = NaN;

    } );

}


module.exports = SlideControls;
