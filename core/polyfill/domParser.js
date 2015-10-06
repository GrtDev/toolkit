var polyfillApplied;

/**
 * Provides HTML parsing functionality with regular DOM document parsing as fallback
 * @see: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 * @see: https://gist.github.com/1129031
 * @param { object } [ opt_global = global || window ] - Defines the global scope on which the polyfill is applied to.
 */
module.exports = function domParserPolyfill ( opt_global ) {

    if( polyfillApplied ) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;


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

};