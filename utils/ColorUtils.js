/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils
 */

/**
 * @namespace
 */
var colorUtils = {};

/**
 * Calculates the rgb value between 2 colors given a percentage.
 * @param rgb1
 * @param rgb2
 * @param percentage
 * @returns {string} - the new rgb value as string
 */
colorUtils.getGradientValue = function (rgb1, rgb2, percentage) {
    var rgb = rgb1.split(',');

    var red = parseInt(rgb[0]);
    var green = parseInt(rgb[1]);
    var blue = parseInt(rgb[2]);

    rgb = rgb2.split(',');

    red += (parseInt(rgb[0]) - red) * percentage;
    green += (parseInt(rgb[1]) - green) * percentage;
    blue += (parseInt(rgb[2]) - blue) * percentage;

    return ((red << 0) + ',' + (green << 0) + ',' + (blue << 0));
}

module.exports = colorUtils;