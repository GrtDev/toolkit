/**
 * Copied and edited from the inherits NodeJS Module
 * ISC ISC License - Copyright (c) Isaac Z. Schlueter
 *
 * A copy of the NodeJS 'Util.inherits' function.
 * Inherit the prototype methods from one constructor into another.
 * The prototype of constructor will be set to a new object created from superConstructor.
 * Also inherits the getInstance function for Singletons
 * Note: Assigned a temporary empty function for code completion.
 * @link http://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor
 * @function inherits
 * @param constructor {function} - The function to inherit the superConstructor's prototype.
 * @param superConstructor {function} - The function containing the prototype to be inherited.
 */
var inherits = function ( constructor, superConstructor ) {};

if( typeof Object.create === 'function' ) {

    // Implementation from standard node.js 'util' module.
    inherits = function ( constructor, superConstructor ) {

        constructor.super_ = superConstructor;

        constructor.prototype = Object.create( superConstructor.prototype, {

            constructor: {
                value: constructor,
                enumerable: false,
                writable: true,
                configurable: true
            }

        } );

    };

} else {

    // Old school shim for old browsers
    inherits = function ( constructor, superConstructor ) {

        constructor.super_ = superConstructor;
        var TempConstructor = function () {};
        TempConstructor.prototype = superConstructor.prototype;
        constructor.prototype = new TempConstructor();
        constructor.prototype.constructor = constructor;

    }

}

module.exports = inherits;
