// @formatter:off

var stringUtils         = require('../stringUtils');


var classNameRegExp     = /\.([\w\d]*)/ig;
var tagNameRegExp       = /^([\w\d]*)/i;

// @formatter:on

/**
 * @name: htmlDataParser
 * A simple parses for generating HTML strings. Parses HTML Data object and returns HTML string.
 *
 * HTML Data object are objects that contain data about HTML markup and look like this:
 *  {
 *      tag:     'div.lorem',
 *      attr:    { dataTitle: 'title' },
 *      content: 'Lorem Ipsum'
 *  }
 *
 *  tag {string}                        HTMLZen based string, first part identifies a tag name and can be
 *                                      appended with multiple class names and an ID tag. Defaults to 'div'.
 *                                      e.g.: 'div#some-id.some-class'
 *  attr {object}                       Object containing attributes to be added to the element.
 *                                      Automatically converts camelCase properties to hyphenated equivalents.
 *                                      e.g.: { href: 'http://google.com', target: '_blank' }
 *  content {string|HTMLData|Array}     Contents of the element. Can be text, another HTMLData object or
 *                                      an Array with multiple HTMLData objects.
 *                                      e.g.: [ { content:'div with text content 1' }, { content:'div with text content 2' } ]
 *
 */
var htmlDataParser = {};

/**
 * Parses a HTML Data object and returns HTML markup as a string.
 * @param htmlData {object|Array}
 * @returns {string}
 */
htmlDataParser.parseHTMLData = function ( htmlData ) {

    if( !htmlData ) return '';

    if( Array.isArray( htmlData ) ) {

        var html = '';

        for ( var i = 0, leni = htmlData.length; i < leni; i++ ) {

            html += htmlDataParser.parseHTMLData( htmlData[ i ] );

        }

        return html;

    }


    var tag = 'div';
    var className;
    var attributes = '';
    var content = '';

    if( htmlData.tag !== undefined ) {

        // grab tag name
        tag = tagNameRegExp.exec( htmlData.tag )[ 0 ];

        classNameRegExp.lastIndex = 0; // reset regexp

        var match;
        while ( match = classNameRegExp.exec( htmlData.tag ) ) {

            if( className )className += ' ' + match[ 1 ];
            else className = match[ 1 ];

        }

    }

    if( htmlData.content !== undefined ) {

        if( Array.isArray( htmlData.content ) ) {

            for ( var i = 0, leni = htmlData.content.length; i < leni; i++ ) {

                content += htmlDataParser.parseHTMLData( htmlData.content[ i ] );

            }

        } else if( typeof htmlData.content === 'object' ) {

            content = htmlDataParser.parseHTMLData( htmlData.content );

        } else {

            content = htmlData.content;

        }

    }

    if( htmlData.attr !== undefined ) {

        for ( var attribute in htmlData.attr ) {

            attributes += ' ' + stringUtils.hyphenate( attribute ) + '=\"' + htmlData.attr[ attribute ] + '\"';

        }

    }


    // return html string
    return '<' + tag + (className ? ' class=\"' + className + '\"' : '') + attributes + '>' + content + '</' + tag + '>';


}


if( typeof Object.freeze === 'function' ) Object.freeze( htmlDataParser ) // lock the object to minimize accidental changes

module.exports = htmlDataParser;