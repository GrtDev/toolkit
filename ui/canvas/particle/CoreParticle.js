/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

/**
 * Constructor of a CoreParticle
 * @param opt_params {object} - Set the properties for the particle.
 * opt_params:
 *     x {number} - x position of the particle
 *     y {number} - y position of the particle
 *     size {number} - size of the particle
 *     direction {number} - movement direction of the particle in radians
 *     speed {number} - movement speed of the particle, in pixels per second
 *     color {string} - comma separated RGB values
 *     opacity {number} - opacity value 0 - 1
 * @constructor
 */
function CoreParticle(opt_params) {
    opt_params = opt_params || {};
    this.direction = opt_params.direction || 0; // in radians
    this.speed = opt_params.speed || 0; // pixels per milliseconds
    this.x = opt_params.x || 0;
    this.y = opt_params.y || 0;
    this.size = opt_params.size || 5;
    this.color = opt_params.color || "127,48,51"; // RGB values
    this.opacity = (typeof opt_params.opacity === 'number') ? opt_params.opacity : 1;
    this.velY = NaN;
    this.velX = NaN;
    this.effects = null;
    this.visible = true;

    this.updateBoundingRect();

    // @readonly
    Object.defineProperty(this, 'id', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: ('particle_' + ++CoreParticle.numParticles)
    });
}

CoreParticle.numParticles = 0;

/**
 * @returns {Rectangle x, y, width, height} - Bounding rectangle of this particle
 */
Object.defineProperty(CoreParticle.prototype, 'boundingRect', {
    enumerable: true,
    configurable: false,
    writable: false,
    value: {x: 0, y: 0, width: 0, height: 0}
});

/**
 * Function that updates the position of the particle
 * @function update
 * @param time {number} - seconds since the last update call
 */
CoreParticle.prototype.update = function (time) {
    // apply any effects
    if (this.effects) for (var i = 0, leni = this.effects.length; i < leni; i++) this.effects[i].applyEffect(this, time);
    this.velX = this.speed * time * Math.cos(this.direction);
    this.velY = this.speed * time * Math.sin(this.direction);
    this.x += this.velX;
    this.y += this.velY;
    this.updateBoundingRect();
}

/**
 * Function that draws the particle in the given (2d) context
 * @function draw
 * @param context {CanvasRenderingContext2D} - The context to draw the particle in.
 */
CoreParticle.prototype.draw = function (context) {
    if(!this.visible) return;
    context.fillStyle = 'rgba(' + this.color + ',' + this.opacity + ')';
    context.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
}

/**
 * @function updateBoundingRect
 * Function that updates the bounding rectangle of this particle
 */
CoreParticle.prototype.updateBoundingRect = function () {
    this.boundingRect.x = this.x - this.size / 2;
    this.boundingRect.y = this.y - this.size / 2;
    this.boundingRect.width = this.size;
    this.boundingRect.height = this.size;
}


module.exports = CoreParticle;