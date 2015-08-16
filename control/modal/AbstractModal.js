/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var CoreElement              = require('../../core/html/CoreElement');
var CommonEvent              = require('../../common/events/CommonEvent');

//@formatter:on

CoreElement.extend( AbstractModal );


var CLOSE_BUTTON_SELECTOR = '.js-close';


function AbstractModal ( element ) {


    AbstractModal.super_.call( this, element );

    var _this = this;
    var _closeButton = _this.find( CLOSE_BUTTON_SELECTOR );

    if( _closeButton ) _closeButton.addEventListener('click', handleCloseButtonClick );


    function handleCloseButtonClick ( event ) {

        _this.close();

    }
    
}

AbstractModal.prototype.open = function ( opt_data, opt_instant ) {

    this.show();

    this.dispatchEvent( new CommonEvent( CommonEvent.OPEN ) );

    if( this.debug ) this.logDebug( 'modal opened' );

}

AbstractModal.prototype.close = function ( opt_instant ) {

    this.hide();

    this.dispatchEvent( new CommonEvent( CommonEvent.CLOSE ) );

    if( this.debug ) this.logDebug( 'modal closed' );

}


module.exports = AbstractModal;

