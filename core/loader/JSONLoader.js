/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
//@formatter:off
var CoreLoader              = require('./CoreLoader');

CoreLoader.extend(JSONLoader);


//@formatter:on

/**
 * A loader for loading JSON files.
 * @constructor
 * @extends {CoreLoader}
 */
function JSONLoader() {

    JSONLoader._super.call(this);

    var _this = this;

    _this.setMimeType(CoreLoader.MIMETYPE_JSON);
    _this.setResponseType(CoreLoader.RESPONSE_TYPE_JSON);

}


JSONLoader.prototype.parseData = function  ( xmlHttpRequest ) {

    if(!xmlHttpRequest || !xmlHttpRequest.responseText) return null;

    return JSON.parse( xmlHttpRequest.responseText );

}



/**
 * @see CoreObject.destruct
 */
JSONLoader.prototype.destruct = function () {

    JSONLoader.super_.prototype.destruct.call(this);

}

module.exports = JSONLoader;
