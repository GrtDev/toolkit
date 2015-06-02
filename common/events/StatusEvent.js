/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var CoreEvent          = require('../../core/events/CoreEvent');

//@formatter:on

CoreEvent.extend( StatusEvent );

/**
 * Creates a new Status Event
 * @param type {string}
 * @param status {string}
 * @param opt_target {object=}
 * @extends {CoreEvent}
 * @constructor
 */
function StatusEvent ( type, status, opt_target ) {

    var _this = this;
    var _status = status;

    StatusEvent._super(type, opt_target);

     Object.defineProperty(this, 'status', {
         enumerable: true,
     	get: function() {
              return _status;
          }
     });
}


module.exports = CoreEvent