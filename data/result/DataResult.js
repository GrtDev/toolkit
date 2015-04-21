/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
//@formatter:off

var Result          = require('./Result');
var inherits        = require('../../utils/inherits');

//@formatter:on

inherits(DataResult, Result);

function DataResult(data, success, message, code) {

    DataResult.super_.call(this, success, message, code);

    var _data = data;

    Object.defineProperty(this, 'data', {
        get: function () {
            return _data;
        }
    });
}

module.exports = DataResult;