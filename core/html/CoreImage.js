/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
// @formatter:off

var AbstractMedia                       = require('./AbstractMedia');
var CommonEvent                         = require('../../common/events/CommonEvent');

//@formatter:on

AbstractMedia.extend( CoreImage );


/**
 * @param element {HTMLElement} <img>
 * @extends {AbstractMediaElement}
 * @constructor
 */
function CoreImage ( element ) {

    CoreImage.super_.call(this, element);

    var _this = this;


    _this.element.style.maxWidth = 'none';
    _this.element.style.maxHeight = 'none'; //TODO: move this to the width/height setter?

    if( _this.element.complete ) {

        _this.setSourceDimensions(_this.element.naturalWidth, _this.element.naturalHeight);

    } else {

        _this.element.addEventListener( 'load', handleImageLoadEvent );

    }


    function handleImageLoadEvent () {

        _this.element.removeEventListener( 'load', handleImageLoadEvent );

        _this.setSourceDimensions(_this.element.naturalWidth, _this.element.naturalHeight);

    }


    _this.setDestruct( function () {

        if(_this.element) _this.element.removeEventListener( 'load', handleImageLoadEvent );

    } );
}


module.exports = CoreImage;
