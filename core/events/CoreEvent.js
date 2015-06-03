/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var inherits                    = require('../utils/inherits');


CoreEvent.CHANGE                = 'CoreEvent.CHANGE';
CoreEvent.CANCEL                = 'CoreEvent.CANCEL';
CoreEvent.CLEAR                 = 'CoreEvent.CLEAR';
CoreEvent.ACTIVATE              = 'CoreEvent.ACTIVATE';
CoreEvent.DEACTIVATE            = 'CoreEvent.DEACTIVATE';
CoreEvent.OPEN                  = 'CoreEvent.OPEN';
CoreEvent.CLOSE                 = 'CoreEvent.CLOSE';

// @formatter:on


/**
 * Creates a new CoreEvent with some basic event types
 * @param type {string}
 * @param opt_target {object=}
 * @constructor
 */
function CoreEvent ( type, opt_target ) {

    var _this = this;
    var _type = type;
    var _target = opt_target;

    /**
     * Sets the target of the event
     * @param target {object}
     */
    _this.setTarget = function ( target ) {
        _target = target;

    }

    Object.defineProperty( this, 'type', {
        enumerable: true,
        get: function () {
            return _type;
        }
    } );

    Object.defineProperty( this, 'target', {
        enumerable: true,
        get: function () {
            return _target;
        }
    } );
}

/**
 * Function to easily inherit the CoreEvent class.
 * @memberOf sector22/core/events.CoreEvent
 * @protected
 * @function extend
 * @param constructor {function} the class that should inherit the CoreEvent
 */
CoreEvent.prototype.extend = function ( constructor ) {
    inherits( constructor, this );
    constructor.extend = CoreEvent.extend;
}

CoreEvent.extend = CoreEvent.prototype.extend;


module.exports = CoreEvent;