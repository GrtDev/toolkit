/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var singletonMixin              = require('../../core/mixin/singletonMixin');
var CoreEventDispatcher         = require('../../core/events/CoreEventDispatcher');


var GTM_DEFAULT_EVENT           = 'gtm.trackEvent';

var GTM_ELEMENT_SELECTOR        = '.gtm';

var GTM_ATTR_EVENT              = 'data-gtm-event';
var GTM_ATTR_CATEGORY           = 'data-gtm-category';
var GTM_ATTR_ACTION             = 'data-gtm-action';
var GTM_ATTR_LABEL              = 'data-gtm-label';


var URL_VARIABLE                = /{url}/ig
var PATH_VARIABLE               = /{pathname}/ig
var VALUE_VARIABLE              = /{value}/ig
var TEXT_VARIABLE               = /{text}/ig

//@formatter:on

CoreEventDispatcher.extend( GTMManager );

singletonMixin.apply( GTMManager );


/**
 * @constructor
 * @singleton
 * @mixes singletonMixin
 * @extends {CoreEventDispatcher}
 */
function GTMManager () {

    GTMManager.singletonCheck( this );

    GTMManager.super_.call( this );

    var _this = this;
    var _dataLayerName = 'datalayer';   // default: 'datalayer'
    var _trackedElements = [];


    _this.trackContent = function ( opt_container ) {

        opt_container = opt_container || document;

        var elements = opt_container.querySelectorAll( '.gtm' );


        for ( var i = 0, leni = elements.length; i < leni; i++ ) {
            var element = elements[ i ];

            if( _trackedElements[ element ] === undefined ) {

                switch ( element.tagName ) {
                    case 'SELECT':

                        element.addEventListener( 'change', handleGTMElementEvents );

                        break;
                    default:

                        element.addEventListener( 'click', handleGTMElementEvents );
                }

                _trackedElements.push( element );

            }


        }


    }

    function handleGTMElementEvents ( event ) {

        var element = event.currentTarget;

        // @formatter:off

        var event       = element.getAttribute( GTM_ATTR_EVENT );
        var category    = element.getAttribute( GTM_ATTR_CATEGORY );
        var action      = element.getAttribute( GTM_ATTR_ACTION );
        var label       = element.getAttribute( GTM_ATTR_LABEL );

        // @formatter:on

        if( _this.debug ) _this.logDebug( '\ntracked element: \n\tcategory:\t' + category + ( action !== undefined ? ('\n\taction:\t\t' + action) : '') + ( label !== undefined ? ('\n\tlabel:\t\t' + label) : '') );


        console.log( element.tagName );
        console.log( typeof VALUE_VARIABLE );

        if( element.tagName === 'SELECT' ) {

            var value = element.options[ element.selectedIndex ].value;
            var text = element.options[ element.selectedIndex ].text;

            if( label ) {

                label = label.replace( VALUE_VARIABLE, value );
                label = label.replace( TEXT_VARIABLE, text );

            }

            if( action ) {

                action = action.replace( VALUE_VARIABLE, value );
                action = action.replace( TEXT_VARIABLE, text );

            }

        }


        var data = { 'event': event || GTM_DEFAULT_EVENT, 'eventCategory': category, 'eventAction': action };

        if( label ) data[ 'eventLabel' ] = event || GTM_DEFAULT_EVENT;

        _this.pushData( data );


    }


    /**
     * Default function for tracking purposes
     * @param category {string}
     * @param action {string}
     * @param opt_label {=string}
     */
    _this.track = function ( category, action, opt_label ) {


        if( _this.debug ) _this.logDebug( '\ntrack: \n\tcategory:\t' + category + '\n\taction:\t\t' + action + ( opt_label !== undefined ? ('\n\tlabel:\t\t' + opt_label) : '') );


        var data = { 'event': GTM_DEFAULT_EVENT, 'eventCategory': category, 'eventAction': action };

        if( opt_label !== undefined ) data[ 'eventLabel' ] = opt_label;

        _this.pushData( data )

    }

    _this.pushData = function ( data ) {

        if( !Array.isArray( global[ _dataLayerName ] ) ) {

            return _this.logError( 'Failed to push data to the Google Tag Manager, datalayer is undefined or not of type Array!', global[ _dataLayerName ] );

        }

        if( data[ 'eventAction' ] ) data[ 'eventAction' ] = parseValues( data[ 'eventAction' ] );
        if( data[ 'eventLabel' ] ) data[ 'eventLabel' ] = parseValues( data[ 'eventLabel' ] );

        if( _this.debug ) _this.logDebug( 'push data: ', data );

        global[ _dataLayerName ].push( data );

    }

    function parseValues ( string ) {

        string = string.replace( URL_VARIABLE, global.location.href );
        string = string.replace( PATH_VARIABLE, global.location.pathname );

        return string;

    }

    Object.defineProperty( this, 'dataLayerName', {
        enumerable: true,
        get: function () {
            return _dataLayerName;
        },
        set: function ( value ) {
            _dataLayerName = value;
        }
    } );

}

// track function shortcut
GTMManager.track = GTMManager.getInstance().track;
GTMManager.trackContent = GTMManager.getInstance().trackContent;


module.exports = GTMManager;


