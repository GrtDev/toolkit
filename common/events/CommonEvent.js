/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var AbstractEvent                       = require('./../../core/events/AbstractEvent');

CommonEvent.UPDATE                  = 'CommonEvent.UPDATE';
CommonEvent.CHANGE                  = 'CommonEvent.CHANGE';
CommonEvent.CANCEL                  = 'CommonEvent.CANCEL';
CommonEvent.CLEAR                   = 'CommonEvent.CLEAR';
CommonEvent.ACTIVATE                = 'CommonEvent.ACTIVATE';
CommonEvent.DEACTIVATE              = 'CommonEvent.DEACTIVATE';
CommonEvent.OPEN                    = 'CommonEvent.OPEN';
CommonEvent.CLOSE                   = 'CommonEvent.CLOSE';
CommonEvent.RESIZE                  = 'CommonEvent.RESIZE';

// @formatter:on


AbstractEvent.extend( CommonEvent );

/**
 * Creates a new CommonEvent with some basic event types
 * @param type {string}
 * @param opt_target {object=}
 * @constructor
 */
function CommonEvent ( type, opt_target ) {

    CommonEvent.super_.call( this, type, opt_target );

}

module.exports = CommonEvent;