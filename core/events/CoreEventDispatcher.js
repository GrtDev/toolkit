/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var log                             = require('../../debug/Log').getInstance();
var CoreObject                      = require('./../CoreObject');
var eventDispatcherMixin            = require('./eventDispatcherMixin');

//@formatter:on

CoreObject.extend( CoreEventDispatcher );

eventDispatcherMixin.apply( CoreEventDispatcher );

/**
 * Creates a new CoreEventDispatcher
 * @constructor
 * @extends {CoreObject}
 */
function CoreEventDispatcher () {console.log('CoreEventDispatcher', this);}


module.exports = CoreEventDispatcher