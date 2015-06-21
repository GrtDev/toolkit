/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/control/events
 */

// @formatter:off

var CoreEvent          = require('../../core/events/CoreEvent');


AnimationEvent.START                            = 'TransitionEvent.START';
AnimationEvent.COMPLETE                         = 'TransitionEvent.COMPLETE';
AnimationEvent.TRANSITION_IN                    = 'TransitionEvent.TRANSITION_IN';
AnimationEvent.TRANSITION_IN_COMPLETE           = 'TransitionEvent.TRANSITION_IN_COMPLETE';
AnimationEvent.TRANSITION_OUT                   = 'TransitionEvent.TRANSITION_OUT';
AnimationEvent.TRANSITION_OUT_COMPLETE          = 'TransitionEvent.TRANSITION_OUT_COMPLETE';

//@formatter:on


CoreEvent.extend( AnimationEvent );

/**
 * Creates a new TransitionEvent
 * @param type {string}
 * @param opt_url {string=}
 * @extends CoreEvent
 * @constructor
 */
function AnimationEvent ( type, opt_target) {

    AnimationEvent.super_.call(this, type, opt_target);

}


module.exports = AnimationEvent;