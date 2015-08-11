/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var AbstractEvent                           = require('./../../core/events/AbstractEvent');

MediaEvent.SOURCE_CHANGE                    = 'CommonEvent.SOURCE_CHANGE';
MediaEvent.DIMENSIONS_SET                   = 'CommonEvent.DIMENSIONS_SET';

// @formatter:on


AbstractEvent.extend( MediaEvent );

/**
 * Creates a new CommonEvent with some basic event types
 * @param type {string}
 * @param opt_target {object=}
 * @constructor
 */
function MediaEvent ( type, opt_target ) {

    MediaEvent.super_.call( this, type, opt_target );

}

module.exports = MediaEvent;