/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var CoreObject              = require('../../core/CoreObject')
var HTMLLoader              = require('../../core/loader/HTMLLoader')

//@formatter:on

CoreObject.extend( PageLoader );

/**
 * @constructor
 */
function PageLoader () {

    // Force the use of a single instance (Singleton)
    if( PageLoader.prototype._singletonInstance ) {
        PageLoader.getInstance().error( 'Log', 'Attempting to instantiate a PageLoader object but this is a Singleton! Use `getInstance` method to retrieve a reference instead!' );
        return null;
    }
    PageLoader.prototype._singletonInstance = this;

    var _loader;
    var _enabled = (global.history && global.history.pushState);
    var _document;
    var _host;
    var _links;

    function init () {

        if( !_enabled ) return;

        _loader = new HTMLLoader();
        _document = document;
        _host = location.host;
        _links = [];

        updateLinks();

    }


    function updateLinks () {

        var links = _document.getElementsByTagName( 'a' );

        for ( var i = 0, leni = links.length; i < leni; i++ ) {
            var link = links[ i ];

            if( !link.parsed && link.host === _host ) {

                link.addEventListener('click', handleLinkClick, true);
                link.parsed = true;
                _links.push(link);

            }


        }

    }

    function handleLinkClick ( event ) {

        event.preventDefault();

    }

    Object.defineProperty( this, 'enabled', {
        enumerable: true,
        get: function () {
            return _enabled;
        }
    } );

}


/**
 * Returns an instance of the Page Loader.
 * @static
 * @function getInstance
 * @returns {PageLoader} The page loader instance.
 */
PageLoader.getInstance = function () {

    return PageLoader.prototype._singletonInstance || new PageLoader();

};

module.exports = PageLoader;