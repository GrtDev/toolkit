/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */
// @formatter:off

var CoreElement             = require('../../../core/html/CoreElement');

// @formatter:on

CoreElement.extend( AbstractSlide );


/**
 * @constructor
 * @extends CoreElement
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

AbstractSlide.prototype.activate = function () {

    if(this.debug) this.logDebug('activate');

}

AbstractSlide.prototype.deactivate = function () {

    if(this.debug) this.logDebug('deactivate');

}

AbstractSlide.prototype.prepare = function () {

    if(this.debug) this.logDebug('prepare');

}


module.exports = AbstractSlide;