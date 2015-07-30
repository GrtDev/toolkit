/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
// @formatter:off

var AbstractMediaElement                = require('./AbstractMediaElement');
var CommonEvent                         = require('../events/CommonEvent');

//@formatter:on

AbstractMediaElement.extend( CoreImage );


/**
 * @param element {HTMLElement} <img>
 * @extends {AbstractMediaElement}
 * @constructor
 */
function CoreImage ( element ) {

    CoreImage.super_.call(this, element);

    var _this = this;


    _this.element.style.maxWidth = 'none';
    _this.element.style.maxHeight = 'none';

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
