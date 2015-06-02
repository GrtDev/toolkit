/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
//@formatter:off
var CoreLoader              = require('./CoreLoader');

CoreLoader.extend(HTMLLoader);


//@formatter:on

/**
 * A loader for loading HTML files.
 * @constructor
 * @extends {HTMLLoader}
 */
function HTMLLoader() {

    HTMLLoader._super();

    var _this = this;

    _this.setMimeType('text/html');
    _this.setResponseType(CoreLoader.RESPONSE_TYPE_DOCUMENT);

}


HTMLLoader.prototype.parseData = function  ( xmlHttpRequest ) {

    if(!xmlHttpRequest || !xmlHttpRequest.responseText) return null;

    return JSON.parse( xmlHttpRequest.responseText );

}



/**
 * @see CoreObject.destruct
 */
HTMLLoader.prototype.destruct = function () {

    HTMLLoader.super_.prototype.destruct.call(this);

}

module.exports = HTMLLoader;
