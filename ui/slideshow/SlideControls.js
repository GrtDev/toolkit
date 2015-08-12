// @formatter:off

var CoreObject                  = require('../../core/CoreObject');
var CommonEvent                 = require('../../common/events/CommonEvent');
var SelectGroup                 = require('../../data/collection/SelectGroup');



CoreObject.extend( SlideControls );

var CONTROL_ACTIVE_MENU         = '.js-active-menu';
var CONTROL_NEXT                = '.js-next';
var CONTROL_PREVIOUS            = '.js-previous';
var INFO_CURRENT                = '.js-current';
var INFO_TOTAL                  = '.js-total';
var BULLETS                     = '.js-bullets'; // TODO:

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
    var _selectGroup;
    var _activeMenu         = _slideShow.find( CONTROL_ACTIVE_MENU );
    var _nextButton         = _slideShow.find( CONTROL_NEXT );
    var _previousButton     = _slideShow.find( CONTROL_PREVIOUS );
    var _currentSlideInfo   = _slideShow.find( INFO_CURRENT );
    var _totalSlidesInfo    = _slideShow.find( INFO_TOTAL );

    // @formatter:on

    if( _nextButton ) _nextButton.addEventListener( 'click', handleButtonClicks );
    if( _previousButton ) _previousButton.addEventListener( 'click', handleButtonClicks );

    if( _activeMenu ) {

        _selectGroup = new SelectGroup( null, 'active' );
        var children = _activeMenu.children;

        for ( var i = 0, leni = children.length; i < leni; i++ ) {
            var childElement = children[ i ];
            _selectGroup.add( childElement );
            childElement.addEventListener( 'click', handleSelectGroupClick );
        }

    }

    if( _currentSlideInfo || _totalSlidesInfo || _activeMenu ) {

        _slideShow.addEventListener( CommonEvent.UPDATE, handleSlideShowUpdate );
        updateInfo();

    }

    function handleSelectGroupClick ( event ) {

        event.preventDefault();
        _slideShow.setCurrentSlide( _selectGroup.indexOf( event.currentTarget ) );

    }


    function handleSlideShowUpdate ( event ) {

        updateInfo();

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

    function updateInfo () {

        if( _currentSlideInfo ) _currentSlideInfo.innerHTML = _slideShow.currentSlideIndex + 1;
        if( _totalSlidesInfo ) _totalSlidesInfo.innerHTML = _slideShow.length;
        if( _selectGroup ) _selectGroup.select( _slideShow.currentSlideIndex );

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
            _slideShow.removeEventListener( CommonEvent.UPDATE, handleSlideShowUpdate );
            _slideShow = undefined;
        }

        if(_selectGroup){

            for ( var i = 0, leni = _selectGroup.length; i < leni; i++ ) {
                _selectGroup.items[ i ].removeEventListener('click', handleSelectGroupClick);
            }

            _selectGroup.destruct();
            _selectGroup = undefined;
        }

        _currentSlideInfo = undefined;
        _totalSlidesInfo = undefined;

    } );

}


module.exports = SlideControls;
