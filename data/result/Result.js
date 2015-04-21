/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

function Result(success, message, code) {

    var _success = success;
    var _message = message;
    var _code = code;

    Object.defineProperty(this, 'success', {
        get: function () {
            return _success;
        }
    });
    Object.defineProperty(this, 'message', {
        get: function () {
            return _message;
        }
    });
    Object.defineProperty(this, 'code', {
        get: function () {
            return _code;
        }
    });

}

module.exports = Result;