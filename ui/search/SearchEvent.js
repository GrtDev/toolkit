/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

// @formatter:off

var AbstractEvent                   = require('../../core/events/AbstractEvent');

SearchEvent.CHANGE                  = 'SearchEvent.CHANGE';
SearchEvent.CLEAR                   = 'SearchEvent.CLEAR';
SearchEvent.SEARCH                  = 'SearchEvent.ACTIVATE';

// @formatter:on


AbstractEvent.extend( SearchEvent );

/**
 * Creates a new CommonEvent with some basic event types
 * @param type {string}
 * @param opt_target {object=}
 * @constructor
 */
function SearchEvent ( type, opt_target ) {

    SearchEvent.super_.call( this, type, opt_target );

}

module.exports = SearchEvent;