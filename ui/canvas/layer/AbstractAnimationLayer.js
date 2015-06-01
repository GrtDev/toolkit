/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

var inherits   = require('../../utils/inherits');
var CoreObject = require('../../core/CoreObject');

inherits(AbstractAnimationLayer, CoreObject);

/**
 * Abstract class for canvas animation layers
 * @constructor
 */
function AbstractAnimationLayer(canvas) {

    var _canvas = canvas;

    // @readonly
    Object.defineProperty(this, 'canvas', {
         enumerable: true,
         configurable: false,
         writable: false,
         value: _canvas
    });
}

/**
 * Function that needs to implement updating the layer and drawing its contents.
 * @param timePassed {number} - time that passed since the last update call, in seconds
 * @param context {CanvasRenderingContext2D} - context to draw the contents in
 */
AbstractAnimationLayer.prototype.update = function (timePassed, context) {
    throw new Error('AbstractAnimationLayer.update: Abstract method! Should be overridden!');
}


module.exports = AbstractAnimationLayer;