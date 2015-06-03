/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/control/navigation
 */

// @formatter:off

var CoreEvent                           = require('../../core/events/CoreEvent');


PageLoaderEvent.BEFORE_PAGE_UPDATE      = 'PageLoaderEvent.BEFORE_PAGE_UPDATE';
PageLoaderEvent.AFTER_PAGE_UPDATE       = 'PageLoaderEvent.AFTER_PAGE_UPDATE';

//@formatter:on


CoreEvent.extend( PageLoaderEvent );

/**
 * Creates a new PageLoaderEvent
 * @param type {string}
 * @param opt_url {string=}
 * @param opt_target {object=}
 * @extends {CoreEvent}
 * @constructor
 */
function PageLoaderEvent ( type, opt_url, opt_target) {

    PageLoaderEvent.super_.call(this, type, opt_target);

    var _url    = opt_url;

     Object.defineProperty(this, 'url', {
         enumerable: true,
     	get: function() {
              return _url;
          }
     });

}


module.exports = PageLoaderEvent;