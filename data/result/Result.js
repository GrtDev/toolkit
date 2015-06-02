/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

/**
 * An object containing result data
 * @param success {boolean}
 * @param message {string}
 * @param code {number}
 * @param opt_url {string=}
 * @constructor
 */
function Result(success, message, code, opt_url) {

    var _success = success;
    var _message = message;
    var _code = code;
    var _url = opt_url;

    Object.defineProperty(this, 'success', {
        enumerable: true,
        get: function () {
            return _success;
        }
    });
    Object.defineProperty(this, 'message', {
        enumerable: true,
        get: function () {
            return _message;
        }
    });
    Object.defineProperty(this, 'code', {
        enumerable: true,
        get: function () {
            return _code;
        }
    });

     Object.defineProperty(this, 'url', {
         enumerable: true,
     	get: function() {
              return _url;
          }
     });

}

module.exports = Result;