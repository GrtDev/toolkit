/**
 * Provides HTML parsing functionality with regular DOM document parsing as fallback
 * From: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 * @see: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 * @see: https://gist.github.com/1129031
 * @param DOMParser {function}
 */
function domParserPolyfill ( DOMParser ) {

    var proto = DOMParser.prototype;
    var nativeParse = proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if( (new DOMParser()).parseFromString( "", "text/html" ) ) {
            // text/html parsing is natively supported
            return;
        }
    } catch ( ex ) {}

    proto.parseFromString = function ( markup, type ) {

        if( /^\s*text\/html\s*(?:;|$)/i.test( type ) ) {

            var doc = document.implementation.createHTMLDocument( "" );

            if( markup.toLowerCase().indexOf( '<!doctype' ) > -1 ) {

                doc.documentElement.innerHTML = markup;

            }
            else {

                doc.body.innerHTML = markup;

            }
            return doc;

        } else {

            return nativeParse.apply( this, arguments );

        }

    };

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
    domParserPolyfill( opt_global.DOMParser );

}

module.exports = polyfill;
