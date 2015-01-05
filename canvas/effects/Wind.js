/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

var inherits = require('../../utils/inherits');

var AbstractEffect = require('./AbstractEffect');
var GeomUtils = require('../../geom/GeomUtils');


inherits(Wind, AbstractEffect);

/**
 *
 * @param opt_direction
 * @param opt_speed
 * @param opt_maxDirectionChange
 * @param opt_maxSpeedChange
 * @constructor
 * @augments AbstractEffect
 */
function Wind(opt_direction, opt_speed, opt_maxDirectionChange, opt_maxSpeedChange) {

    this.direction = typeof opt_direction === 'number' ? opt_direction : -40 * (Math.PI / 180);
    this.speed = typeof opt_speed === 'number' ? opt_speed : 400;

}

Wind.prototype.decorate = function (particle) {

    particle.wind = {enabled:true}; // create a variable to keep our wind data in
    particle.wind.effect = Math.random() * .02 + 0.01; // how fast it changes speed & direction
    particle.wind.lightness = Math.random() * .8 + .2; // how much speed it gets from the wind
    particle.wind.directionOffset = (Math.random() * 30 - 60) * Math.PI / 180;

   AbstractEffect.prototype.decorate.call(this, particle);
}

Wind.prototype.applyEffect = function (particle, time) {

    if (time < 1 || !particle.wind.enabled) return;
    //console.log('this.direction: ' + (this.direction* 180/Math.PI)  + ' wind: ' + (_wind.direction * 180/Math.PI) +', dif: '+  (dif* 180/Math.PI));
    particle.direction -= GeomUtils.differenceAngle(particle.direction, this.direction + particle.wind.directionOffset) * particle.wind.effect;

    var moveTo = GeomUtils.polar(particle.speed * time, particle.direction);
    var change = GeomUtils.polar(this.speed * time, this.direction);

    moveTo.x += change.x;
    moveTo.y += change.y;

    var speed = GeomUtils.distance(0, 0, moveTo.x, moveTo.y);

    var newSpeed = (speed / time);
    if (newSpeed > this.speed) newSpeed = this.speed;
    newSpeed = newSpeed * particle.wind.lightness;
    particle.speed = (particle.speed - (particle.speed - newSpeed));// * particle.wind.effect);

}

module.exports = Wind;