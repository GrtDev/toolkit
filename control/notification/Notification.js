/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/core/events
 */

// @formatter:off

var AbstractNotification                    = require('./AbstractNotification');

Notification.MENU_OPENED                    = 'Notification.MENU_OPENED';
Notification.MENU_CLOSED                    = 'Notification.MENU_CLOSED';
Notification.MODAL_OPENED                   = 'Notification.MODAL_OPENED';
Notification.MODAL_CLOSED                   = 'Notification.MODAL_CLOSED';

// @formatter:on


AbstractNotification.extend( Notification );

/**
 * Creates a new Notification to be used with the notification center.
 * @param type {string}
 * @param opt_target {object=}
 * @param opt_message {string=}
 * @param opt_data {object=}
 * @constructor
 */
function Notification ( type, opt_target, opt_message, opt_data ) {

    Notification.super_.call( this, type, opt_target, opt_message, opt_data );

}

module.exports = Notification;