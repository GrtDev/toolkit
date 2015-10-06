/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils
 */


/**
 * @namespace
 */
var elementUtils = {};





elementUtils.show = function ( opt_display ) {

    this.element.style.display = opt_display || 'block';

}

elementUtils.hide = function () {

    this.element.style.display = 'none';

}


elementUtils.hasClass = function ( name ) {

    return (new RegExp( '\\b' + name + '\\b' )).test( this.element.className )

}

elementUtils.addClass = function ( name ) {

    if( !this.hasClass( name ) ) this.element.className = this.element.className + ' ' + name;

}

elementUtils.removeClass = function ( name ) {

    this.element.className = this.element.className.replace( new RegExp( '\\b' + name + '\\b' ), '' );

}

elementUtils.toggleClass = function ( name ) {

    if( this.hasClass( name ) ) this.removeClass( name );
    else this.addClass( name );

}




Object.freeze( elementUtils ) // lock the object to minimize accidental changes
module.exports = elementUtils;