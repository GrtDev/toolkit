/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils
 */

// @formatter:off

var log                 = require('../../debug/Log' ).getInstance();

// @formatter:on

var debug;

/**
 * @namespace
 */
var documentUtils = {};

Object.defineProperty( documentUtils, 'debug', {
    enumerable: true,
    get: function () {
        return debug;
    },
    set: function ( value ) {
        debug = value;
    }
} );

/**
 * Find the index within a collection that contains the element based on HTML content
 * @param collection {HTMLCollection | NodeList | Array}
 * @param element {HTMLElement}
 * @returns {number}
 */
documentUtils.collectionIndexOfElement = function ( collection, element ) {

    for ( var i = 0, leni = collection.length; i < leni; i++ ) {

        var collectionElement = collection[ i ];

        if( collectionElement.outerHTML === element.outerHTML ) return i;

    }

    return -1;

}

/**
 * Updates the old head meta tags with the meta tags from the new head
 * @param head {HTMLElement}
 * @param newHead {HTMLElement}
 */
documentUtils.updateHeadMeta = function ( head, newHead ) {

    if( debug ) log.debug( documentUtils.toString(), 'updateHeadMeta: ', head, newHead );

    if( !head || !newHead ) return;

    // convert {HTMLCollection} to {Array} so we can use splice
    var newMeta = Array.prototype.slice.call( newHead.getElementsByTagName( 'meta' ) );
    var currentMeta = head.getElementsByTagName( 'meta' );
    var unusedCurrentMetaTags = [];
    var i, leni;

    for ( i = 0, leni = currentMeta.length; i < leni; i++ ) {

        var currentMetaTag = currentMeta[ i ];
        var indexCurrentTag = documentUtils.collectionIndexOfElement( newMeta, currentMetaTag );

        if( indexCurrentTag >= 0 ) {

            newMeta.splice( indexCurrentTag, 1 );

        } else {

            if( documentUtils.debug ) log.debug( documentUtils.toString(), 'removing current meta tag: ', currentMetaTag );
            // save unused tags to reuse for new meta
            unusedCurrentMetaTags.push( currentMetaTag );

        }
    }


    for ( i = 0, leni = newMeta.length; i < leni; i++ ) {

        var newMetaTag = newMeta[ i ];
        var metaTag;

        if( unusedCurrentMetaTags.length ) {

            metaTag = unusedCurrentMetaTags.pop();

        } else if( global.document ) {

            metaTag = global.document.createElement( 'meta' );
            head.appendChild( metaTag );

        } else {

            log.error( documentUtils.toString(), 'Failed to create a new meta tag' );
            return;

        }

        metaTag.outerHTML = newMetaTag.outerHTML;

    }

    // remove any unused meta tag elements
    while ( unusedCurrentMetaTags.length ) head.removeChild( unusedCurrentMetaTags.pop() );

}

/**
 * Merges attributes of given elements into the destination element.
 * @param source {HTMLElement}
 * @param destination {HTMLElement}
 * @param opt_removeOld {boolean=} remove old attributes
 * @param opt_filter {Array=} attributes not to copy over OR deleted
 */
documentUtils.copyAttributes = function ( source, destination, opt_removeOld, opt_filter ) {

    if( opt_removeOld ) {

        var attributes = destination.attributes;

        for ( var i = 0, leni = attributes.length; i < leni; i++ ) {

            var attribute = attributes[ i ];

            if( opt_filter && opt_filter.indexOf( attribute.nodeName ) !== -1 ) continue;
            
            destination.removeAttribute( attribute.nodeName )

            leni--; // Don't need to splice on the attributes because its a live list.

        }
    }


    attributes = source.attributes;

    for ( i = 0, leni = attributes.length; i < leni; i++ ) {

        var attribute = attributes[ i ];

        if( opt_filter && opt_filter.indexOf( attribute.nodeName ) !== -1 ) continue;

        destination.setAttribute( attribute.nodeName, attribute.nodeValue );

    }

}


documentUtils.toString = function () {

    return 'documentUtils'

}

if( typeof Object.freeze === 'function' ) Object.freeze( documentUtils ) // lock the object to minimize accidental changes
module.exports = documentUtils;