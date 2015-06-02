/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var CoreObject          = require('./../CoreObject');

//@formatter:on

CoreObject.extend( CoreEvent );

/**
 * Creates a new CoreEvent
 * @param type {string}
 * @param opt_target {object=}
 * @extends {CoreObject}
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


module.exports = CoreEvent