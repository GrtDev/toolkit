/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CoreHTMLElement             = require('../../../core/CoreHTMLElement');

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

    // add some basic styling
    _this.element.style.overflow = 'hidden';
    _this.element.style.position = 'absolute';

    // parse data attributes by default
    _this.parseData();

    _this.setDestruct( function () {

        _this = undefined;

    } );

}


module.exports = AbstractSlide;