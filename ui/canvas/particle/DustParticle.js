/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

var inherits = require('../../../core/utils/inherits');
var CoreParticle = require('./CoreParticle');


inherits(DustParticle, CoreParticle);

/**
 * @see CoreParticle
 * @constructor
 * @augments CoreParticle
 */
function DustParticle(opt_params) {
    DustParticle.super_.call(this, opt_params);
}

/**
 * @see CoreParticle.draw
 */
DustParticle.prototype.draw = function (context) {
    if(!this.visible) return;
    context.fillStyle = "rgba(" + this.color + ", " + this.opacity + ")";
    context.beginPath();
    context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    context.closePath();
    context.fill();

}

module.exports = DustParticle;