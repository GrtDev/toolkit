/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

var Log = require('../debug/Log');

/**
 * Collection of context helper functions to dot quick lines and shapes.
 * @namespace
 */
var contextUtils = {};

/**
 * Draws a dot using the given context
 * @function dot
 * @param context {CanvasRenderingContext2D}
 * @param x {number}
 * @param y {number}
 * @param opt_size {number=2}
 * @param opt_color {string=#FF0000}
 */
contextUtils.dot = function (context, x, y, opt_size, opt_color) {

    context.fillStyle = opt_color || '#FF0000';
    context.beginPath();
    context.arc(x, y, opt_size || 2, 0, Math.PI * 2);
    context.fill();
    context.closePath();

}

/**
 * Draws a circle using the given context
 * @function circle
 * @param context {CanvasRenderingContext2D}
 * @param x {number}
 * @param y {number}
 * @param opt_size {number=2}
 * @param opt_color {string=#FF0000}
 */
contextUtils.circle = function (context, x, y, opt_size, opt_color) {

    context.strokeStyle = opt_color || '#FF0000';
    context.beginPath();
    context.arc(x, y, opt_size || 2, 0, Math.PI * 2);
    context.stroke();
    context.closePath();

}


/**
 * Draws a line between 2 points
 * @function line
 * @param context {CanvasRenderingContext2D}
 * @param var_args - arguments can be, where points are objects containing x & y
 *     x, y, x2, y2, opt_color
 *     - or -
 *     point, point2, opt_color
 */
contextUtils.line = function (context, var_args) {

    if (arguments.length >= 5 && typeof arguments[1] === 'number') { // x & y values
        context.strokeStyle = arguments.length > 5 && typeof arguments[5] === 'string' ? arguments[5] : '#FF0000';
        context.beginPath();
        context.moveTo(arguments[1], arguments[2]);
        context.lineTo(arguments[3], arguments[4]);
        context.stroke();
        context.closePath();
    } else if (arguments.length >= 3 && 'x' in arguments[1] && 'y' in arguments[1] && 'x' in arguments[2] && 'y' in arguments[2]) { // points
        context.strokeStyle = arguments.length > 3 && typeof arguments[3] === 'string' ? arguments[3] : '#FF0000';
        context.beginPath();
        context.moveTo(arguments[1].x, arguments[1].y);
        context.lineTo(arguments[2].x, arguments[2].y);
        context.stroke();
        context.closePath();
    } else {
        Log.warn('Invalid arguments on contextUtils.line  : ' + arguments, this);
    }

}

/**
 * Draws a box outline
 * @function box
 * @param context
 * @param x
 * @param y
 * @param width
 * @param height
 * @param opt_color
 */
contextUtils.box = function (context, x, y, width, height, opt_color) {
    context.strokeStyle = opt_color || 'red';
    context.beginPath();
    context.rect(x, y, width, height);
    context.stroke();
    context.closePath();
}

if( typeof Object.freeze === 'function') Object.freeze(contextUtils) // lock the object to minimize accidental changes
module.exports = contextUtils;