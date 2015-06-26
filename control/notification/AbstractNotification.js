/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/control/notification
 */

// @formatter:off

var inherits                    = require('../../core/utils/inherits');

// @formatter:on

/**
 * Creates a new Notification to be used with the notification center.
 * @param type {string}
 * @param opt_target {object=}
 * @param opt_message {string=}
 * @param opt_data {object=}
 * @constructor
 */
function AbstractNotification ( type, opt_target, opt_message, opt_data ) {

    var _type       = type;
    var _target     = opt_target;
    var _message    = opt_message;
    var _data       = opt_data;

     Object.defineProperty(this, 'type', {
         enumerable: true,
     	get: function() {
              return _type;
          }
     });

     Object.defineProperty(this, 'target', {
         enumerable: true,
     	get: function() {
              return _target;
          }
     });

     Object.defineProperty(this, 'message', {
         enumerable: true,
     	get: function() {
              return _message;
          }
     });

     Object.defineProperty(this, 'data', {
         enumerable: true,
     	get: function() {
              return _data;
          }
     });

}


/**
 * Function to easily inherit the CoreEvent class.
 * @memberOf sector22/core/events.CoreEvent
 * @protected
 * @function extend
 * @param constructor {function} the class that should inherit the CoreEvent
 */
AbstractNotification.prototype.extend = function ( constructor ) {

    inherits( constructor, this );
    constructor.extend = AbstractNotification.extend;

}

AbstractNotification.extend = AbstractNotification.prototype.extend;

module.exports = AbstractNotification;