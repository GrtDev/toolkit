/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var documentUtils               = require('../../utils/document/documentUtils');
var CoreEventDispatcher         = require('../../core/events/CoreEventDispatcher');
var HTMLLoader                  = require('../../core/loader/HTMLLoader');

//@formatter:on

/**
 * Returns an instance of the Page Loader.
 * @static
 * @function getInstance
 * @returns {PageLoader} The page loader instance.
 */
PageLoader.getInstance = function () { return PageLoader.prototype._singletonInstance || new PageLoader(); };

CoreEventDispatcher.extend( PageLoader );


/**
 * @constructor
 * @singleton
 * @extends {CoreEventDispatcher}
 */
function PageLoader () {

    // Force the use of a single instance (Singleton)
    if( PageLoader.prototype._singletonInstance ) {
        throw new Error('Attempting to instantiate an Singleton. Use `getInstance` method to retrieve a reference instead!');
        return null;
    }
    PageLoader.prototype._singletonInstance = this;

    var _this = this;
    var _isSupported = (global.history && global.history.pushState);

    var _loader;
    var _document;
    var _documentHead;
    var _host;
    var _links;
    var _parser;


    _this.init = function () {

        if( !_isSupported ) return;

        _loader = new HTMLLoader();
        _loader.debug = _this.debug;
        _document = document;
        _documentHead = _document.getElementsByTagName( 'head' )[ 0 ];
        _parser = new DOMParser();
        _host = location.host;
        _links = [];

        updateLinks();

    }


    function updateLinks () {

        var links = _document.getElementsByTagName( 'a' );

        for ( var i = 0, leni = links.length; i < leni; i++ ) {
            var link = links[ i ];

            if( !link.parsed && link.host === _host ) {

                link.addEventListener( 'click', handleLinkClick, true );
                link.parsed = true;
                _links.push( link );

                if( _this.debug ) _this.logDebug( 'Added link: ' + link.href + ' (' + link.textContent + ')' );

            }


        }

    }

    function handleLinkClick ( event ) {
        if( _this.debug ) _this.logDebug( 'handle link click: ', event );

        event.preventDefault();

        var link = event.target;

        if( !link || !link.href ) {

            _this.logError( 'Failed to retrieve the href of a link', event );
            return;

        }

        if(_loader.isLoading) _loader.abort();

        _loader.load( link.href, onPageLoadResult );

    }

    /**
     * Callback for html loader
     * @param result {DataResult}
     */
    function onPageLoadResult ( result ) {

        if( result.success ) {

            if( _this.debug ) _this.logDebug( 'Successfully loaded the HTML data', result.data );

            updatePage( result.data );

        } else {

            _this.logError( 'Failed to load the HTML...' );

        }

    }

    /**
     * Update the current page with the new html
     * @param html {HTMLDocument} the new html page
     */
    function updatePage ( html ) {

        var head = html.getElementsByTagName( 'head' )[ 0 ];
        var body = html.getElementsByTagName( 'body' )[ 0 ];

        if( !head ) {

            _this.logError( 'Failed to retrieve the documents head!' );

        } else {

            var title = head.getElementsByTagName('title')[0];
            if(title) _document.title = title.textContent;
            documentUtils.updateHeadMeta(_documentHead, head);

        }

    }

    Object.defineProperty( this, 'isSupported', {
        enumerable: true,
        get: function () {
            return _isSupported;
        }
    } );

}





module.exports = PageLoader;