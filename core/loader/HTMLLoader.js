/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
//@formatter:off

require('../../polyfill/domParser').apply();

var CoreLoader              = require('./CoreLoader');

//@formatter:on


CoreLoader.extend(HTMLLoader);

/**
 * A loader for loading HTML files.
 * @constructor
 * @extends {HTMLLoader}
 */
function HTMLLoader() {

    HTMLLoader.super_.call(this);

    var _this = this;
    var _parser = new DOMParser();

    _this.setMimeType(CoreLoader.MIMETYPE_HTML);
    _this.setResponseType(CoreLoader.RESPONSE_TYPE_DOCUMENT);

     Object.defineProperty(this, 'parser', {
         enumerable: true,
     	get: function() {
              return _parser;
          }
     });

}


HTMLLoader.prototype.parseData = function  ( xmlHttpRequest ) {

    if(!xmlHttpRequest || !xmlHttpRequest.responseText) return null;

    // @type {DOMString}
    var data = xmlHttpRequest.response;

    data = this.parser.parseFromString(data, 'text/html');

    return data;

}



/**
 * @see CoreObject.destruct
 */
HTMLLoader.prototype.destruct = function () {

    HTMLLoader.super_.prototype.destruct.call(this);

}

module.exports = HTMLLoader;
