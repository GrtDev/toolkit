/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var PageLoader                  = require('./PageLoader');

//@formatter:on


PageLoader.extend( CustomPageLoader );


/**
 * @constructor
 * @extends {PageLoader}
 */
function CustomPageLoader () {

    CustomPageLoader.super_.call(this);
    
    var _this = this;

    _this.test = function () {

    }
    
}





module.exports = CustomPageLoader;