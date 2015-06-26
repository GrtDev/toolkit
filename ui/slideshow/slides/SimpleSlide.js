// @formatter:off

var AbstractSlide               = require('./AbstractSlide');


//@formatter:on


AbstractSlide.extend( SimpleSlide );

/**
 * A slide for the homepage video slider
 * @param element {HTMLElement}
 * @constructor
 */
function SimpleSlide ( element, opt_debug ) {

    SimpleSlide.super_.call( this, element );

    var _this = this;

    _this.debug = opt_debug;



    _this.setDestruct( function () {

        _this = undefined;

    } );

}

SimpleSlide.prototype.updateLayout = function () {

    if( this.debug ) this.logDebug( 'updateLayout' );


    if( this.debug ) this.logDebug( 'update layout: ' + this.width + ', ' + this.height + ' - video pos: ' + this.videoPlayer.element.style.top + ', ' + this.videoPlayer.element.style.left );
}

SimpleSlide.prototype.setSize = function ( width, height ) {

    SimpleSlide.super_.prototype.setSize.call(this, width, height);


    this.updateLayout();

}


module.exports = SimpleSlide;