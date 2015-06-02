/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
//@formatter:off

var Result          = require('./Result');
var inherits        = require('../../core/utils/inherits');

//@formatter:on

inherits(DataResult, Result);

/**
 * An object containing result data with a data object
 * @param data {*}
 * @constructor
 * @extends {Result}
 */
function DataResult(data, success, message, code, opt_url) {

    DataResult.super_.call(this, success, message, code, opt_url);

    var _data = data;

    Object.defineProperty(this, 'data', {
        enumerable: true,
        get: function () {
            return _data;
        }
    });
}

module.exports = DataResult;