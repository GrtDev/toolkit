/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils
 */

var UIUtils = {};

/**
 * Check if the element is within viewport.
 * @static
 * @param   element {HTMLelement}       - HTMLElement in question.
 * @param   opt_complete {boolean=false}    - Check if the complete element is within the view.
 * @returns {boolean}                   - Returns whether the element is (completely) within viewport.
 */
UIUtils.isElementInViewport = function (element, opt_complete) {

    var rect = element.getBoundingClientRect();

    return !complete ? (
    rect.top <= window.innerHeight &&
    rect.bottom >= 0 &&
    rect.left <= window.innerWidth &&
    rect.right >= 0
    ) : (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
    );
}

module.exports = UIUtils;