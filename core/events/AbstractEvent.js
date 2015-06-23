/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var inherits                    = require('../utils/inherits');

// @formatter:on


/**
 * Creates a new CoreEvent with some basic event types
 * @param type {string}
 * @param opt_target {object=}
 * @constructor
 */
function AbstractEvent ( type, opt_target ) {

    var _type = type;
    var _target = opt_target;


    Object.defineProperty( this, 'type', {
        enumerable: true,
        get: function () {
            return _type;
        }
    } );

     Object.defineProperty(this, 'target', {
          enumerable: true,
          get: function() {
              return _target;
          },
          set: function(value) {
              _target = value;
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
AbstractEvent.prototype.extend = function ( constructor ) {
    inherits( constructor, this );
    constructor.extend = AbstractEvent.extend;
}

AbstractEvent.extend = AbstractEvent.prototype.extend;


module.exports = AbstractEvent;