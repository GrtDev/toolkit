/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

                                  require('../../core/polyfill/corePolyfill' ).apply(global);

var singletonMixin              = require('../../core/mixin/singletonMixin');
var CoreEventDispatcher         = require('../../core/events/CoreEventDispatcher');
var eases                       = require('../../extern/gsap/easing/EasePack');
var TweenLite                   = require('../../extern/gsap/TweenLite');

//@formatter:on


var SCROLL_EASE = eases.Power3.easeInOut;
var SCROLL_TIME = .5;

CoreEventDispatcher.extend( PageScroller );

singletonMixin.apply( PageScroller );

var idLinkRegExp = /\#[\w|-]*/;
var ACTIVE_LINK_CLASS = 'active';


// TODO: Mayor cleanup & support multiple links to items


/**
 * @constructor
 * @singleton
 * @mixes singletonMixin
 * @extends {CoreEventDispatcher}
 *
 * @event TransitionEvent.START
 * @event TransitionEvent.COMPLETE
 * @event PageTransitionEvent.BEFORE_PAGE_UPDATE
 * @event PageTransitionEvent.AFTER_PAGE_UPDATE
 */
function PageScroller () {

    PageScroller.singletonCheck( this );

    PageScroller.super_.call( this );

    var _this = this;
    var _links = [];
    var _document = document;
    var _scrollContainer = document.documentElement;//systemUtils.isIE() ? document.documentElement : document.body;
    var _scrollTween;
    var _tracking;
    var _trackedItems;

    var _activeLink;
    var _activeLinkClass = ACTIVE_LINK_CLASS;
    var _activeLinkClassRegExp = new RegExp( '\\b\\s?' + _activeLinkClass + '\\b', 'i' );

    


    _this.addLinks = function ( element, opt_track ) {

        var links = element.getElementsByTagName( 'a' );

        if( opt_track && !_tracking ) {
            window.addEventListener( 'scroll', handleWindowScroll );
            _trackedItems = [];
        }

        for ( var i = 0, leni = links.length; i < leni; i++ ) {

            var link = links[ i ];

            if( !link.__parsedPageScroller ) {

                link.__parsedPageScroller = true;

                var href = link.getAttribute( 'href' );

                if( href && idLinkRegExp.test( href ) ) {

                    link.addEventListener( 'click', handleLinkClick, true );
                    _links.push( link );

                    if( opt_track ) {

                        var element = _document.getElementById( href.slice( 1 ) );
                        if( element ) {

                            _trackedItems.push( { element: element, link: link } );

                        }

                    }

                }

                if( _this.debug ) _this.logDebug( 'Added link: ' + link.href + ' (' + link.textContent + ')' );

            }
        }

    }

    function handleWindowScroll ( event ) {


        for ( var i = 0, leni = _trackedItems.length; i < leni; i++ ) {

            var tracked = _trackedItems[ i ];
            var trackedElement = tracked.element;
            var trackedLink = tracked.link;


            var rect = trackedElement.getBoundingClientRect();
            var midTop = (window.innerWidth / 2) - 100;
            var midBottom = (window.innerWidth / 2) + 100;

            if( rect.top < midBottom && rect.bottom > midTop ) {


                if( _activeLink ) {

                    _activeLink.className = _activeLink.className.replace( _activeLinkClassRegExp, '' );

                }

                _activeLink = trackedLink;

                if( !_activeLinkClassRegExp.test( _activeLink.className ) ) _activeLink.className = _activeLink.className + ' ' + _activeLinkClass;


                break;

            }


        }

    }

    /**
     * Scroll to an item
     * @param item {string|HTMLElement}
     * @returns null
     */
    _this.scrollTo = function ( item ) {

        var element;

        if( typeof item === 'string' ) {

            if( !idLinkRegExp.test( item ) ) return _this.logError( 'invalid id given! ', item );

            element = _document.getElementById( item.slice( 1 ) );
            if( !element ) return;

            history.replaceState( {}, "", window.location.origin + (window.location.pathname || '/') + item );


        } else {

            element = item;
            if( !element ) return;

        }


        var y = 0;
        while ( element && !isNaN( element.offsetTop ) ) {

            y += element.offsetTop - element.scrollTop;
            element = element.parentNode;

        }

        //y = _scrollContainer.scrollTop + y;
        y = (document.documentElement.scrollTop || document.body.scrollTop) + y;

        TweenLite.to( [document.documentElement,  document.body], SCROLL_TIME, { scrollTop: y, ease: SCROLL_EASE } );

    }

    function handleLinkClick ( event ) {

        var link = event.currentTarget;

        if( _this.debug ) _this.logDebug( 'handle link click: ', link );

        event.preventDefault();

        if( _scrollTween ) _scrollTween.kill();
        _scrollTween = _this.scrollTo( link.getAttribute( 'href' ) );

    }


    //function updateLinks () {
    //
    //
    //    // clean up the old links first
    //    for ( var i = 0, leni = _links.length; i < leni; i++ ) {
    //
    //        var link = _links[ i ];
    //
    //        if( !_document.contains( link ) ) {
    //
    //            link.removeEventListener( 'click', handleLinkClick );
    //            _links.splice( i, 1 );
    //            i--, leni--;
    //
    //            if( _this.debug ) _this.logDebug( 'Removed link: ' + link.href + ' (' + link.textContent + ')' );
    //
    //        }
    //    }
    //
    //    _this.addLinks( _contentContainer );
    //}

    _this.setDestruct( function () {
        if( _scrollTween ) {
            _scrollTween.kill();
            _scrollTween = undefined;
        }
    } )


}


module.exports = PageScroller;


