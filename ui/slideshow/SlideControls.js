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

    var _this = this;
    var _slideShow = slideShow;
    var _activeMenuGroup;
    var _activeMenu         = _slideShow.find( CONTROL_ACTIVE_MENU );
    var _nextButton         = _slideShow.find( CONTROL_NEXT );
    var _previousButton     = _slideShow.find( CONTROL_PREVIOUS );
    var _currentSlideInfo   = _slideShow.find( INFO_CURRENT );
    var _totalSlidesInfo    = _slideShow.find( INFO_TOTAL );
    var _bulletList         = _slideShow.find( CONTROL_BULLETS );

    // @formatter:on

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

    }

    if( _currentSlideInfo || _totalSlidesInfo || _activeMenu || _bulletList ) {

        _slideShow.addEventListener( CommonEvent.UPDATE, handleSlideShowEvents );
        updateInfo();

    }


    function updateInfo () {

        if( _currentSlideInfo ) _currentSlideInfo.innerHTML = _slideShow.currentSlideIndex + 1;
        if( _totalSlidesInfo ) _totalSlidesInfo.innerHTML = _slideShow.length;
        if( _activeMenuGroup ) _activeMenuGroup.select( _slideShow.currentSlideIndex );
        if( _bulletList ) _bulletList.select( _slideShow.currentSlideIndex );

    }

    function handleActiveMenuClick ( event ) {

        event.preventDefault();
        _slideShow.setCurrentSlide( _activeMenuGroup.indexOf( event.currentTarget ) );

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

                _slideShow.next();

                break;
            case _previousButton:

                _slideShow.previous();

                break;
            default:
                _this.logError( 'Unhandled switch case' );
        }
    }




    /**
     *
     *  TODO:
     *
     * @param listElement {HTMLElement}
     * @param opt_autoCreate {boolean=true}
     */
        //_this.addBulletListMenu = function ( listElement, opt_autoCreate ) {
        //
        //    if( _bulletList ) return _this.logError( 'bullets already exist!' );
        //
        //    _bulletList = new BulletList( listElement, opt_autoCreate );
        //
        //    if( opt_autoCreate ) {
        //
        //        _bulletList.length = _this.length;
        //        _this.addEventListener( CommonEvent.CHANGE, handleSlideShowEvents );
        //
        //    }
        //
        //    _bulletList.select( _this.currentSlideIndex );
        //    _bulletList.onBulletIndexClick = _this.setCurrentSlide;
        //
        //    _this.addEventListener( CommonEvent.UPDATE, handleSlideShowEvents );
        //
        //}

        //function handleSlideShowEvents ( event ) {
        //
        //    switch ( event.type ) {
        //        case CommonEvent.CHANGE:
        //
        //            if( _bulletList ) _bulletList.length = _this.length;
        //
        //            break;
        //        case CommonEvent.UPDATE:
        //
        //            if( _bulletList ) _bulletList.select( _this.currentSlideIndex );
        //
        //            break;
        //        default:
        //            _this.logError( 'Unhandled slide show event' );
        //    }
        //
        //
        //}


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

        _currentSlideInfo = undefined;
        _totalSlidesInfo = undefined;

    } );

}


module.exports = SlideControls;
