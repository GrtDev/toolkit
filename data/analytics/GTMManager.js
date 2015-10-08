/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var singletonMixin              = require('../../core/mixin/singletonMixin');
var CoreEventDispatcher         = require('../../core/events/CoreEventDispatcher');
var Map                         = require('../../data/collection/Map');


var GTM_DEFAULT_EVENT           = 'gtm.trackEvent';

var GTM_ELEMENT_SELECTOR        = '.gtm';

var GTM_ATTR_EVENT              = 'data-gtm-event';
var GTM_ATTR_CATEGORY           = 'data-gtm-category';
var GTM_ATTR_ACTION             = 'data-gtm-action';
var GTM_ATTR_LABEL              = 'data-gtm-label';


var VARIABLE_URL                = /{url}/ig
var VARIABLE_PATH               = /{pathname}/ig
var VARIABLE_VALUE              = /{value}/ig
var VARIABLE_TEXT               = /{text}/ig
var VARIABLE_COUNT              = /{count}/ig

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
    var _dataLayerName = 'dataLayer';   // default: 'dataLayer'
    var _trackedElements = new Map();

    _this.trackContent = function ( opt_container ) {

        opt_container = opt_container || document;

        var elements = opt_container.querySelectorAll( '.gtm' );

        if(_this.debug) _this.logDebug('track content: ', elements);

        for ( var i = 0, leni = elements.length; i < leni; i++ ) {

            var element = elements[ i ];
            
            if( !_trackedElements.has( element ) ) {

                switch ( element.tagName ) {
                    case 'SELECT':

                        element.addEventListener( 'change', handleGTMElementEvents );

                        break;
                    default:

                        element.addEventListener( 'click', handleGTMElementEvents );
                }

                _trackedElements.set( element, 0 ); // keep track of the tracked element and the track count

            }


        }


    }

    function handleGTMElementEvents ( event ) {

        var element = event.currentTarget;
        var count = _trackedElements.get( element ) + 1; // increase track count

        _trackedElements.set( element, count );

        // @formatter:off

        var event       = element.getAttribute( GTM_ATTR_EVENT );
        var category    = element.getAttribute( GTM_ATTR_CATEGORY );
        var action      = element.getAttribute( GTM_ATTR_ACTION );
        var label       = element.getAttribute( GTM_ATTR_LABEL );

        // @formatter:on

        if( _this.debug ) _this.logDebug( '\ntracked element: \n\tcategory:\t' + category + ( action !== undefined ? ('\n\taction:\t\t' + action) : '') + ( label !== undefined ? ('\n\tlabel:\t\t' + label) : '') );


        if( element.tagName === 'SELECT' ) {

            var value = element.options[ element.selectedIndex ].value;
            var text = element.options[ element.selectedIndex ].text;

            if( label ) {

                label = label.replace( VARIABLE_VALUE, value );
                label = label.replace( VARIABLE_TEXT, text );

            }

            if( action ) {

                action = action.replace( VARIABLE_VALUE, value );
                action = action.replace( VARIABLE_TEXT, text );

            }

        }

        if( action ) action = action.replace( VARIABLE_COUNT, count );
        if( label ) label = label.replace( VARIABLE_COUNT, count );


        var data = { 'event': event || GTM_DEFAULT_EVENT, 'eventCategory': category, 'eventAction': action };

        if( label ) data[ 'eventLabel' ] = label;

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

            return _this.logError( 'Failed to push data to the Google Tag Manager, ' + _dataLayerName + ' is undefined or not of type Array!', global[ _dataLayerName ] );

        }

        if( data[ 'eventAction' ] ) data[ 'eventAction' ] = parseValues( data[ 'eventAction' ] );
        if( data[ 'eventLabel' ] ) data[ 'eventLabel' ] = parseValues( data[ 'eventLabel' ] );

        if( _this.debug ) _this.logDebug( 'push data: ', data );

        global[ _dataLayerName ].push( data );

    }

    function parseValues ( string ) {

        string = string.replace( VARIABLE_URL, global.location.href );
        string = string.replace( VARIABLE_PATH, global.location.pathname );

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


