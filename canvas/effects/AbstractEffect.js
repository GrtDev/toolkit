/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

/**
 * 
 * @constructor
 */
function AbstractEffect() {
}

AbstractEffect.prototype.decorate = function(particle){

    if (!particle.effects) particle.effects = [this];
    else particle.effects.push(this);
}

AbstractEffect.prototype.applyEffect = function(particle, time){

    throw new Error('Abstract function! should be overridden!');
}

module.exports = AbstractEffect;