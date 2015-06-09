/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/control/navigation
 */

// @formatter:off

var CoreEvent                           = require('../../core/events/CoreEvent');

PageTransitionEvent.BEFORE_PAGE_UPDATE      = 'PageTransitionEvent.BEFORE_PAGE_UPDATE';
PageTransitionEvent.AFTER_PAGE_UPDATE       = 'PageTransitionEvent.AFTER_PAGE_UPDATE';

//@formatter:on


CoreEvent.extend(PageTransitionEvent)

/**
 * Creates a new PageTransitionEvent
 * @param type {string}
 * @param opt_url {string=}
 * @param opt_target {object=}
 * @extends {CoreEvent}
 * @constructor
 */
function PageTransitionEvent ( type, opt_url, opt_target) {

    PageTransitionEvent.super_.call(this, type, opt_target);

    var _url    = opt_url;

     Object.defineProperty(this, 'url', {
         enumerable: true,
     	get: function() {
              return _url;
          }
     });

}


module.exports = PageTransitionEvent;