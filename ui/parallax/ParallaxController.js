/**
 * Created by gfokke on 24/11/14.
 */

ObjectUtils = require('../../utils/objectUtils');
Log = require('../../debug/Log');

// Just a check to make sure people do not try to instantiate the Singleton themselves.
var key = "_private_constructor_"

function ParallaxController(privateConstructor) {

    // Force the use of a single instance (Singleton),
    // and make sure a reference is retrieved only through the getInstance method.
    if (ParallaxController.prototype._singletonInstance || privateConstructor != key) {
        Log.warn("ParallaxController is a Singleton instance, use the getInstance method to get a reference.", this);
        return null;
    }
    ParallaxController.prototype._singletonInstance = this;

    var _parallaxObjects = [];
    var _numParallaxObjects = 0;
    var _listening;
    var _animationFrameRequested;

    this.addParallax = function (parallaxObject) {
        if (!ObjectUtils.hasMethods(parallaxObject, 'update')) {
            Log.error("Object given is not a parallax object!", this);
            return;
        }
        if (this.debug) Log.debug("Parallax Object added: " + ObjectUtils.getName(parallaxObject), this);
        _parallaxObjects.push(parallaxObject);
        _numParallaxObjects = _parallaxObjects.length;

        this.start();
    }

    this.removeParallax = function (parallaxObject) {
        if (_parallaxObjects.indexOf(parallaxObject) < 0) {
            Log.error("Object given is not found in the collection!", this);
            return;
        }
        if (this.debug) Log.debug("Parallax Object removed: " + ObjectUtils.getName(parallaxObject), this);
        _parallaxObjects.splice(_parallaxObjects.indexOf(parallaxObject), 1);
        _numParallaxObjects = _parallaxObjects.length;
    }


    this.start = function () {
        if (_numParallaxObjects && !_listening) window.addEventListener('scroll', handleScrollEvent);
        _listening = true;
    }

    this.stop = function () {
        if (_listening) window.removeEventListener('scroll', handleScrollEvent);
        _listening = false;
    }

    function handleScrollEvent(event) {
        if (_animationFrameRequested) return;
        window.requestAnimationFrame(updateParallax);
        _animationFrameRequested = true;
    }

    function updateParallax() {
        for (var i = 0; i < _numParallaxObjects; i++) _parallaxObjects[i].update();
        _animationFrameRequested = false;
    }

    this.destruct = function () {
        this.stop();
        //TODO
    }

}

// classic Singleton signature method
ParallaxController.getInstance = function () {
    return ParallaxController.prototype._singletonInstance || new ParallaxController(key);
};

module.exports = ParallaxController;