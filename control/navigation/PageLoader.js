/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

require('../../core/polyfill/corePolyfill');

var documentUtils               = require('../../utils/document/documentUtils');
var eventDispatcherMixin        = require('../../core/events/eventDispatcherMixin');
var CoreSingleton               = require('../../core/CoreSingleton');
var HTMLLoader                  = require('../../core/loader/HTMLLoader');

//@formatter:on


CoreSingleton.extend( PageLoader );

eventDispatcherMixin.apply( PageLoader );


/**
 * @constructor
 * @singleton
 * @extends {CoreSingleton}
 */
function PageLoader () {

    PageLoader.super_.call( this );

    var _this = this;
    var _isSupported = (global.history && global.history.pushState);

    var _loader;
    var _document;
    var _documentHead;
    var _host;
    var _links;
    var _isTransitioning;
    var _newPageContent;
    var _containerID;
    var _currentContentContainer;
    var _history;
    var _restoringPopState;
    var _newPageUrl;


    _this.init = function ( containerID ) {

        if( !_isSupported ) return _this.logWarn( 'No push state support found.. can not initialize...' );

        if( !containerID ) {
            _this.logError( 'Container ID can not be null or empty. PageLoader needs to know what content to grab from new pages...' );
            return;
        }

        _containerID = containerID;
        _loader = new HTMLLoader();
        _history = global.history;
        _document = document;
        _documentHead = _document.getElementsByTagName( 'head' )[ 0 ];
        _currentContentContainer = _document.getElementById( _containerID );
        _host = global.location.host;
        _links = [];

        global.addEventListener( 'popstate', handleHistoryPopState );

        updateLinks();

    }


    function updateLinks () {

        var i, leni;
        var link;

        // clean up the old links first
        for ( i = 0, leni = _links.length; i < leni; i++ ) {

            link = _links[ i ];

            if( !_document.contains( link ) ) {

                link.removeEventListener( 'click', handleLinkClick );
                _links.splice( i, 1 );
                i--, leni--;

                if( _this.debug ) _this.logDebug( 'Removed link: ' + link.href + ' (' + link.textContent + ')' );

            }

        }

        var links = _currentContentContainer.getElementsByTagName( 'a' );

        for ( i = 0, leni = links.length; i < leni; i++ ) {

            link = links[ i ];

            if( !link._parsed && link.host === _host ) {

                link.addEventListener( 'click', handleLinkClick, true );
                link._parsed = true;
                _links.push( link );

                if( _this.debug ) _this.logDebug( 'Added link: ' + link.href + ' (' + link.textContent + ')' );

            }
        }

    }

    function handleLinkClick ( event ) {

        if( _this.debug ) _this.logDebug( 'handle link click: ', event );

        if( _isTransitioning ) return; // ignore link clicks during transitions

        event.preventDefault();

        var link = event.target;

        if( !link || !link.href ) {

            _this.logError( 'Failed to retrieve the href of a link', event );
            return;

        }

        loadPage( link.href );

    }

    /**
     * Starts loading a new page
     * @param url {string}
     * @param opt_isHistory {boolean=} defines whether the page to load comes from the history (back button)
     */
    function loadPage ( url, opt_isHistory ) {

        if( _loader.isLoading ) _loader.abort();

        _restoringPopState = opt_isHistory;

        _loader.load( url, onPageLoadResult );

    }


    function handleHistoryPopState ( event ) {

        if( _this.debug ) _this.logDebug( 'Handle pop state', event.state );

        loadPage( global.location.href, true );

    }

    /**
     * Callback for html loader
     * @param result {DataResult}
     */
    function onPageLoadResult ( result ) {

        if( result.success ) {

            if( _this.debug ) _this.logDebug( 'Successfully loaded the HTML data', result.data );

            _this.startPageTransition( result.data, result.url );

        } else {

            _this.logError( 'Failed to load the HTML...' );

        }

    }


    /**
     * Update the current page with the new html content.
     * @param   opt_container {HTMLElement=} a container for the new content, if none
     *          is given it will load the content into the container found with the default container id.
     */
    _this.updatePage = function ( opt_container ) {

        if( _this.debug ) _this.logDebug( 'updating new page content....', _newPageContent );

        if( !_newPageContent ) return _this.logError( 'no new page content was found?!' );

        _currentContentContainer = opt_container ? opt_container : _currentContentContainer;
        if( !_currentContentContainer ) return _this.logError( 'Failed to find the new container!', _document );


        // If the page did not come from the history, add it to the History
        if( !_restoringPopState ) {

            _history.pushState( {}, _document.title, _newPageUrl );

        }


        var head = _newPageContent.getElementsByTagName( 'head' )[ 0 ];
        var content = _newPageContent.getElementById( _containerID );

        if( head ) {

            // replace title & meta tags
            var title = head.getElementsByTagName( 'title' )[ 0 ];
            if( title ) _document.title = title.textContent;
            documentUtils.updateHeadMeta( _documentHead, head );

        } else {

            _this.logWarn( 'Failed to retrieve the documents head!' );

        }

        if( content ) {

            // replace container's content
            _currentContentContainer.innerHTML = content.innerHTML;
            updateLinks();

        } else {

            _this.logError( 'Failed to retrieve the page content container! container id: ' + _containerID );

        }




    }

    /**
     * Set the transitioning flag.
     * If true, it also disables the PageLoader from reacting to any new link clicks.
     * @function _setTransitioning
     * @private
     * @param value
     */
    _this._setTransitioning = function ( value ) {

        _isTransitioning = value;

    }

    /**
     * Sets the new page content
     * @function _setNewPageContent
     * @private
     * @param newPage {HTMLDocument}
     * @param newURL {string}
     */
    _this._setNewPageData = function ( newPage, newURL ) {

        _newPageUrl = newURL;
        _newPageContent = newPage;

    }

    Object.defineProperty( this, 'currentContentContainer', {
        enumerable: true,
        get: function () {
            return _currentContentContainer;
        }
    } );

    Object.defineProperty( this, 'newPageContent', {
        enumerable: true,
        get: function () {
            return _newPageContent;
        }
    } );

    Object.defineProperty( this, 'isTransitioning', {
        enumerable: true,
        get: function () {
            return _isTransitioning;
        }
    } );

    Object.defineProperty( this, 'isSupported', {
        enumerable: true,
        get: function () {
            return _isSupported;
        }
    } );

}

/**
 * Starts the transitioning process
 * @param newPage {HTMLDocument}
 * @param url {string} url of the new page
 */
PageLoader.prototype.startPageTransition = function ( newPage, url ) {

    if( !newPage ) {
        this.logError( 'Attempting to start a page transition but no new page was found!' );
        return;
    }

    this._setNewPageData( newPage, url );
    this._setTransitioning( true );

    this.onTransitionStart();

}

/**
 * Override this function to add a custom transition
 * @function transitionOut
 */
PageLoader.prototype.onTransitionStart = function () {

    var _this = this;

    simpleFade( false, _this.currentContentContainer, function () {

        _this.updatePage();

        simpleFade( true, _this.currentContentContainer, _this.onTransitionComplete.bind( _this ) );

    } );

}


/**
 * Override this to add a custom functionality on transition complete.
 * Note: Always call this function after you are done!
 * @public
 * @function onTransitionComplete
 */
PageLoader.prototype.onTransitionComplete = function () {

    this._setTransitioning( false );

}


module.exports = PageLoader;


/**
 * Provides a very basic fade in and out functionality
 * @param fadeIn {boolean}
 * @param element {HTMLElement}
 * @param callback {function}
 * @param opt_time {number=} in milliseconds
 */
function simpleFade ( fadeIn, element, callback, opt_time ) {

    var opacity = element.style.opacity = fadeIn ? 0 : 1;
    var opacityStep = (1 / (opt_time || 250));
    var last = Date.now();

    var tick = function () {

        opacity += (((Date.now() - last) * opacityStep) * (fadeIn ? 1 : -1));

        if( opacity < 0 || opacity > 1 ) opacity = (fadeIn ? 1 : 0);
        element.style.opacity = opacity;
        last = Date.now();

        if( fadeIn ? (opacity < 1) : (opacity > 0) ) {

            window.requestAnimationFrame( tick );

        } else if( typeof callback === 'function' ) {

            callback();

        }
    };

    tick();
}

