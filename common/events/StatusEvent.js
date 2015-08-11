/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var AbstractEvent                   = require('./../../core/events/AbstractEvent');

//@formatter:on

AbstractEvent.extend( StatusEvent );

/**
 * Creates a new Status Event
 * @param type {string}
 * @param status {string}
 * @param opt_target {object=}
 * @extends {CommonEvent}
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


module.exports = StatusEvent