/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

// Pull in polyfill for 'requestAnimationFrame' for cross-browser functionality
require('../polyfill/requestAnimationFrame');

var inherits = require('../utils/inherits');
var CoreObject = require('../core/CoreObject')
var AbstractAnimationLayer = require('./layer/AbstractAnimationLayer');
var FocusListener = require('../utils/focus/FocusListener')

inherits(AnimationCanvas, CoreObject)

/**
 * Creates a canvas object used for animations, works with 'AbstractAnimationLayer' to maintain layers and control the animations.
 * Don't forget to initialize the object!
 * @param opt_id {string=} - id of the canvas HTMLElement, specify an id or it will take the first canvas element it can find.
 * @param opt_contextType {string='2d'} - type of canvas
 * @constructor
 * @augments CoreObject
 */
function AnimationCanvas(opt_id, opt_contextType) {
    // initialize the super
    AnimationCanvas.super_.call(this);

    var _this = this;
    var _layers = [];
    var _layersLength = 0; // We'll keep track of the length ourselves for speed.
    var _isAnimating = false;
    var _isPaused = false;
    var _animationFrameRequestId;
    var _lastRun;
    var _stopOnBlur;
    var _timePassed; // used to calculate the time that passes between update calls
    var _pausedNotification;
    var _focusListener

    _this.updateCallback = null;
    _this.clearCanvas = true;


    _this.pause = function () {
        if (_isPaused) return;
        if (_this.debug) _this.logDebug('pausing animation..');
        stopAnimation();
        _isPaused = true;
    }

    _this.resume = function () {
        if (!_isPaused) return;
        if (_this.debug) _this.logDebug('resuming animation..');
        startAnimation();
        _isPaused = false;
    }

    function startAnimation() {
        if (_isAnimating || (_stopOnBlur && !_focusListener.hasFocus)) return;
        if (_this.debug) _this.logDebug('starting animation..');

        _lastRun = Date.now();  // set initial value
        _animationFrameRequestId = requestAnimationFrame(_this.update);
        _isAnimating = true;
        if (_pausedNotification) _pausedNotification.style.display = _isAnimating ? 'none' : 'block';
    }

    function stopAnimation() {
        if (!_isAnimating) return;
        if (_this.debug) _this.logDebug('stopping animation..');

        cancelAnimationFrame(_animationFrameRequestId);
        _isAnimating = false;
        if (_pausedNotification) _pausedNotification.style.display = _isAnimating ? 'none' : 'block';
    }


    /**
     * Updates all the elements added to the canvas.
     * @function update
     */
    this.update = function () {
        if (_isAnimating) _animationFrameRequestId = requestAnimationFrame(_this.update);

        // clear canvas
        if (_this.clearCanvas) _this.context.clearRect(0, 0, _this.htmlElement.width, _this.htmlElement.height);

        _timePassed = Date.now() - _lastRun; // in seconds
        if (_this.updateCallback) _this.updateCallback(_timePassed); // trigger callback if set

        for (var i = 0; i < _layersLength; i++) _layers[i].update(_timePassed, _this.context);

        _lastRun = Date.now();
    }

    /**
     * Adds an animation layer to the canvas
     * @function addAnimationLayer
     * @param layer {AbstractAnimationLayer} - Element must contain an 'update; & 'draw(context)' function!
     */
    this.addAnimationLayer = function (layer) {
        if (!(layer instanceof AbstractAnimationLayer)) {
            _this.logError('Attempting to add an animation layer that does not extend the AbstractAnimationLayer class!', layer)
            return;
        }
        if (_this.debug)_this.logDebug('Added layer to canvas: ' + layer);

        _layers.push(layer);
        _layersLength += 1;

        startAnimation(); // autostart
    }

    /**
     * Removes an animation layer previously added to the canvas.
     * @function removeAnimationLayer
     * @param {AbstractAnimationLayer} - layer to remove.
     */
    _this.removeAnimationLayer = function (layer) {
        var index = _layers.indexOf(layer);
        if (index < 0) {
            _this.logError('Attempting to remove an animation layer that is not in the canvas.', layer);
            return null;
        }
        _layers.splice(index, 1);
        _layersLength -= 1;

        if (_this.debug) _this.logDebug('Removed animation layer from canvas: ' + layer);
        if (_layersLength <= 0) stopAnimation();
    }

    function handleWindowFocusEvent(event) {
        switch (event.type) {
            case 'blur':
                break;
            case 'focus':
                break;
            default:
                _this.logError('handleWindowFocusEvent: uncaught event: ' + event.type);
        }
    }

    /**
     * Handles window focus changes
     * @param event
     */
    function onFocusChange(hasFocus) {
        if (hasFocus) {
            if (!_isAnimating && !_isPaused) startAnimation();
        }
        else {
            stopAnimation();
        }
    }

    /**
     * @returns {HTMLElement} - HTMLElement to show during a pause
     */
    /**
     * @param value {HTMLElement} - HTMLElement to show during a pause
     */
    Object.defineProperty(this, 'pausedNotification', {
        get: function () {
            return _pausedNotification;
        },
        set: function (value) {
            _pausedNotification = value;
            if (_pausedNotification) _pausedNotification.style.display = _isAnimating ? 'none' : 'block';
        }
    });

    /**
     * Gets whether the animations are stopped when the window loses focus.
     * @returns {boolean}
     */
    /**
     * Sets whether the animations are stopped when the window loses focus.
     * @param value
     */
    Object.defineProperty(this, 'stopOnBlur', {
        get: function () {
            return _stopOnBlur;
        },
        set: function (value) {
            if (_stopOnBlur === value) return;
            _stopOnBlur = value;

            if (_stopOnBlur && !_focusListener) {
                _focusListener = new FocusListener(onFocusChange);
                onFocusChange(_focusListener.hasFocus);
            }
            if (_focusListener) _focusListener.enabled = _stopOnBlur;
        }
    });


    /**
     * @returns {boolean} - Canvas animation is paused.
     * @readonly
     */
    Object.defineProperty(_this, 'isPaused', {
        get: function () {
            return _isPaused;
        }
    });

    /**
     * @returns {number} - width of the canvas element
     * @readonly
     */
    Object.defineProperty(this, 'width', {
        get: function () {
            return _this.htmlElement.width;
        }
    });
    /**
     * @returns {number} - height of the canvas element
     * @readonly
     */
    Object.defineProperty(this, 'height', {
        get: function () {
            return _this.htmlElement.height;
        }
    });

}


/**
 *  Initializes the the canvas object by:
 *  - Retrieving the canvas element.
 *  - Retrieving the canvas rendering context.
 *  - Creating read-only properties for canvas & context.
 *  - Resize the canvas to it's full parent container size.
 *  @function init
 */
AnimationCanvas.prototype.init = function (id, contextType) {
    var canvas = id ? document.getElementById(id) : document.getElementsByTagName('canvas');
    if (canvas && canvas.length) canvas = canvas[0];
    var context = canvas ? canvas.getContext(contextType || '2d') : null;

    if (!canvas || !context) {
        this.logError('Failed to retrieve the canvas element...');
        return;
    }

    /**
     * @returns {HTMLElement} - Canvas HTMLElement
     * @readonly
     */
    Object.defineProperty(this, 'htmlElement', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: canvas
    })
    /**
     * @returns {CanvasRenderingContext} - Canvas Rendering Context
     * @readonly
     */
    Object.defineProperty(this, 'context', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: context
    });

    this.stopOnBlur = true;
    this.updateSize();

    window.addEventListener('resize', this.handleWindowResizeEvent.bind(this), false);
}

AnimationCanvas.prototype.handleWindowResizeEvent = function () {
    this.updateSize();
}

/**
 * @function updateSize
 * Updates the size of the canvas to the full size of its parent element.
 */
AnimationCanvas.prototype.updateSize = function () {
    var parentSize = this.htmlElement.parentNode.getBoundingClientRect();
    this.htmlElement.width = parentSize.width;
    this.htmlElement.height = parentSize.height;
}


module.exports = AnimationCanvas;