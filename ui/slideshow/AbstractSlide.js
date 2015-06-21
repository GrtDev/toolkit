/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CoreHTMLElement             = require('../../core/CoreHTMLElement');

// @formatter:on

CoreHTMLElement.extend( AbstractSlide );


/**
 * @constructor
 * @extends CoreHTMLElement
 * @param element {HTMLElement}
 */
function AbstractSlide ( element ) {

    AbstractSlide.super_.call( this, element );

    var _this = this;

    // parse data attributes by default
    _this.parseData();


    _this.setDestruct( function () {


    } );

}

module.exports = AbstractSlide;