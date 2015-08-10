// @formatter:off
var log                     = require('./Log');
// @formatter:on

function createWeelEventPolyfill(global){
    /**
     * Mouse wheel polyfill inspired by cross-browser example on mdn wiki.
     *
     * It supports relatively modern browsers, which already support addEventListener and Array forEach methods.
     * Effectively it is targeting webkit based browsers. I didn't have opportunity to test it on old Firefox.
     * Method addEventListener is supported in IE9, which already supports wheel event. I guess one could combine
     * it with polyfill for addEventListener to have support in IE 6-8. In that case one would have to also wrap
     * all addEventListener methods provided by the polyfill (last block below).
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel?redirectlocale=en-US&redirectslug=DOM%2FMozilla_event_reference%2Fwheel#Listening_to_this_event_across_browser
     */
    (!("onwheel" in document.createElement("div")) &&
    "EventTarget" in window // IE does not have shared parent for Node and Window
    ) && (function () {

        var evType = "wheel",
            refProperty = "__pf_wheel_cb",
            support = document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll", // Webkit and IE support at least "mousewheel";
            count = 0,
            wheelEventProps = {
                type: {
                    value: evType,
                    writable: false
                },
                preventDefault: { // Chrome complains when native methods are called with custom events
                    value: function () {
                        Object.getPrototypeOf(this).preventDefault();
                    }
                }
            };

        function handleLegacyEvent(legacyEvent, callback) {
            var event = Object.create(legacyEvent, wheelEventProps);
            event.deltaMode = legacyEvent.type == "MozMousePixelScroll" ? 0 : 1;
            event.deltaX = 0;
            event.delatZ = 0;
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * legacyEvent.wheelDelta;
                legacyEvent.wheelDeltaX && ( event.deltaX = - 1/30 * legacyEvent.wheelDeltaX ); // Webkit also support wheelDeltaX
            } else {
                event.deltaY = legacyEvent.detail;
            }
            if (typeof callback == "function") {
                return callback(event);
            } else if (callback.handleEvent) {
                return callback.handleEvent.call(callback, event);
            }
        };

        function createWheelListener(el, callback) {
            var handler = function (e) { return handleLegacyEvent(e, callback); },
                ref = "cb" + ++count;
            (el[refProperty] = el[refProperty] || {})[ref] = handler;
            callback[refProperty] = ref;
            return handler;
        }

        function getWheelListener(el, callback) {
            var ref = callback[refProperty],
                handler = el[refProperty][ref];
            if (handler) {
                delete el[refProperty][ref];
                callback = handler;
            }
            return callback;
        }

        (function interceptEventTargetMethods(proto) {
            var addListener = proto.addEventListener,
                removeListener = proto.removeEventListener;
            proto.addEventListener = function (name, callback, useCapture) {
                if (name == evType) {
                    name = support;
                    callback = createWheelListener(this, callback);
                }
                return addListener.call(this, name, callback, useCapture);
            };
            proto.removeEventListener = function (name, callback, useCapture){
                if (name == evType) {
                    name = support;
                    callback = getWheelListener(this, callback);
                }
                return removeListener.call(this, name, callback, useCapture);
            };
        }(EventTarget.prototype));
    }());
}



var polyfillApplied;
var polyfill = {}

/**
 * Applies basic polyfill to add basic cross-browser functionality
 * Aims to support IE9+
 * @function apply
 * @param opt_global {object=}
 */
polyfill.apply = function ( opt_global ) {

    if( polyfillApplied ) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;

    createWeelEventPolyfill( opt_global );

}

if( typeof Object.freeze === 'function' ) Object.freeze( polyfill ) // lock the object to minimize accidental changes
module.exports = polyfill;
