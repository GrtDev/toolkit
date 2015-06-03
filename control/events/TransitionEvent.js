/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/control/events
 */

// @formatter:off

var CoreEvent          = require('../../core/events/CoreEvent');


TransitionEvent.START               = 'TransitionEvent.START';
TransitionEvent.COMPLETE            = 'TransitionEvent.COMPLETE';
TransitionEvent.IN                  = 'TransitionEvent.IN';
TransitionEvent.IN_COMPLETE         = 'TransitionEvent.IN_COMPLETE';
TransitionEvent.OUT                 = 'TransitionEvent.OUT';
TransitionEvent.OUT_COMPLETE        = 'TransitionEvent.OUT_COMPLETE';

//@formatter:on


CoreEvent.extend( TransitionEvent );

/**
 * Creates a new TransitionEvent
 * @param type {string}
 * @param opt_url {string=}
 * @extends {CoreEvent}
 * @constructor
 */
function TransitionEvent ( type, opt_target) {

    TransitionEvent.super_.call(this, type, opt_target);

}


module.exports = TransitionEvent;