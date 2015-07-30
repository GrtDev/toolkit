var log = require( '../../debug/Log' );


var htmlUtils = {};

var classNameRegExp = /\.([\w\d]*)/ig;
var tagNameRegExp = /^([\w\d]*)/i;


/**
 * Returns description of a HTTPStatus code
 * @param number {number}
 * @returns {string}
 */
htmlUtils.parseHTMLData = function ( object ) {

    if( !object ) return '';

    if( Array.isArray( object ) ) {

        var html = '';

        for ( var i = 0, leni = object.length; i < leni; i++ ) {

            html += htmlUtils.parseHTMLData( object[ i ] );

        }

        return html;

    }


    var tag = 'div';
    var className;
    var attributes = '';
    var content = '';

    if( object.tag !== undefined ) {

        // grab tag name
        tag = tagNameRegExp.exec( object.tag )[ 0 ];

        classNameRegExp.lastIndex = 0; // reset regexp

        var match;
        while ( match = classNameRegExp.exec( object.tag ) ) {

            if( className )className += ' ' + match[ 1 ];
            else className = match[ 1 ];

        }

    }

    if( object.content !== undefined ) {

        if( Array.isArray( object.content ) ) {

            for ( var i = 0, leni = object.content.length; i < leni; i++ ) {

                content += htmlUtils.parseHTMLData( object.content[ i ] );

            }

        } else if( typeof object.content === 'object' ) {

            content = htmlUtils.parseHTMLData( object.content );

        } else {

            content = object.content;

        }

    }

    if( object.attr !== undefined ) {

        for ( var attribute in object.attr ) {

            attributes += ' ' + attribute + '=\"' + object.attr[ attribute ] + '\"';

        }

    }


    // return html string
    return '<' + tag + (className ? ' class=\"' + className + '\"' : '') + attributes + '>' + content + '</' + tag + '>';


}


if( typeof Object.freeze === 'function' ) Object.freeze( htmlUtils ) // lock the object to minimize accidental changes

module.exports = htmlUtils;