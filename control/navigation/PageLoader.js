/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var documentUtils               = require('../../utils/document/documentUtils');
var CoreSingleton               = require('../../core/CoreSingleton');
var eventDispatcherMixin        = require('../../core/events/eventDispatcherMixin');
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


    _this.init = function ( containerID ) {

        if( !_isSupported ) return;

        if( !containerID ) {
            _this.logError( 'Container ID can not be null or empty. PageLoader needs to know what content to grab from new pages...' );
            return;
        }

        _containerID = containerID;
        _loader = new HTMLLoader();
        _loader.debug = _this.debug;
        _document = document;
        _documentHead = _document.getElementsByTagName( 'head' )[ 0 ];
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

        if( _isTransitioning ) return; // ignore link clicks during transitions

        event.preventDefault();

        var link = event.target;

        if( !link || !link.href ) {

            _this.logError( 'Failed to retrieve the href of a link', event );
            return;

        }

        if( _loader.isLoading ) _loader.abort();

        _loader.load( link.href, onPageLoadResult );

    }

    /**
     * Callback for html loader
     * @param result {DataResult}
     */
    function onPageLoadResult ( result ) {

        if( result.success ) {

            if( _this.debug ) _this.logDebug( 'Successfully loaded the HTML data', result.data );

            _this.startPageTransition( result.data );

        } else {

            _this.logError( 'Failed to load the HTML...' );

        }

    }


    /**
     * Update the current page with the new html content.
     * @param   opt_container {HTMLElement=} a container for the new content, if none
     *          is given it will load the content into the container found with the default container id.
     */
    _this.updatePageContents = function ( opt_container ) {

        if( _this.debug ) _this.logDebug( 'updating new page content....', _newPageContent );

        if( !_newPageContent ) return _this.logError( 'no new page content was found?!' );

        if( !opt_container ) opt_container = _document.getElementById( _containerID );
        if( !opt_container ) return _this.logError( 'Failed to find the new container!', _document );


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
            opt_container.innerHTML = content.innerHTML;

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
     * @param newPage
     */
    _this._setNewPageContent = function ( newPage ) {

        _newPageContent = newPage;

    }

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
 */
PageLoader.prototype.startPageTransition = function ( newPage ) {

    if( !newPage ) {
        this.logError( 'Attempting to start a page transition but no new page was found!' );
        return;
    }

    this._setNewPageContent( newPage );
    this._setTransitioning( true );

    this.transitionOut();

}

/**
 * Override this to add a custom transition out
 * @function transitionOut
 */
PageLoader.prototype.transitionOut = function () {

    this.onTransitionOutComplete();

}

/**
 * Override this to add a custom functionality on transition out complete.
 * Always call this function at some point!
 * @function onTransitionOutComplete
 */
PageLoader.prototype.onTransitionOutComplete = function () {

    this.updatePageContents();
    this.transitionIn();

}

/**
 * Override this to add a custom transition in
 * @function transitionIn
 */
PageLoader.prototype.transitionIn = function () {

    this.onTransitionInComplete();

}

/**
 * Override this to add a custom functionality on transition out complete.
 * Always call this function at some point!
 * @function onTransitionOutComplete
 */
PageLoader.prototype.onTransitionInComplete = function () {

    this._setTransitioning( false );

}

module.exports = PageLoader;