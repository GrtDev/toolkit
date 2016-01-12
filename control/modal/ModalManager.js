/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var singletonMixin              = require('../../core/mixin/singletonMixin');
var CoreObject                  = require('../../core/CoreObject');
var CoreElement                 = require('../../core/html/CoreElement');
var CommonEvent                 = require('../../common/events/CommonEvent');
var Notification                = require('../../control/notification/Notification');
var NotificationCenter          = require('../../control/notification/NotificationCenter');
var AbstractModal               = require('./AbstractModal');



var MODAL_SELECTOR              = '.js-modal';
var BACKGROUND_SELECTOR         = '.js-background';

// default class that is added to the body;
var MODAL_OPEN_CLASS            = 'modal-open';

//@formatter:on


CoreObject.extend( ModalManager );

singletonMixin.apply( ModalManager );


/**
 * Singleton for conveying global notifications
 * @constructor
 * @singleton
 * @extends {CoreObject}
 * @mixes singletonMixin
 */
function ModalManager () {

    ModalManager.singletonCheck( this );

    ModalManager.super_.call( this );

    var _this = this;
    var _modal;
    var _isOpen;
    var _notificationCenter = NotificationCenter.getInstance();
    var _container;
    var _background;
    var _body = document.body;
    var _openClass;
    var _openClassRegExp;

    //_this.debug = true;


    _this.setModal = function ( modal ) {

        if( _this.debug ) _this.logDebug( 'set modal', modal );

        if( !_container ) return _this.logError( 'Initiate the modal manager first!' );

        if( !(modal instanceof AbstractModal) ) return _this.logError( 'modal need to be an instance of AbstractModal' );

        if( _modal ) {

            _modal.removeEventListener( CommonEvent.OPEN, handleModalEvents );
            _modal.removeEventListener( CommonEvent.CLOSE, handleModalEvents );
            _this.logWarn( 'replacing current modal..' );

        }

        _modal = modal;
        _modal.close( true );
        _container.hide();

        _modal.addEventListener( CommonEvent.OPEN, handleModalEvents );
        _modal.addEventListener( CommonEvent.CLOSE, handleModalEvents );

    }

    _this.init = function ( modalContainer, opt_modalConstructor, opt_openClass ) {

        if( _container ) return _this.logError( 'Modal manager was already initiated!' );

        if( _this.debug ) _this.logDebug( 'initating modal manager', modalContainer, opt_modalConstructor );

        _container = new CoreElement( modalContainer );
        _background = _container.find( BACKGROUND_SELECTOR, true );

        var modal = _container.find( MODAL_SELECTOR );

        if( opt_modalConstructor ) {

            if( !modal ) return _this.logError( 'Failed to find the modal. Make sure it complies to this selector: \'' + MODAL_SELECTOR + '\'' );
            modal = new opt_modalConstructor( modal );
            _this.setModal( modal );

        } else {

            _this.setModal( new AbstractModal( modal ) );

        }

        _background = _container.find( BACKGROUND_SELECTOR );
        if( _background ) _background.addEventListener( 'click', handleBackgroundClick );

        _this.openClass = opt_openClass ? opt_openClass : MODAL_OPEN_CLASS;

    }

    function handleBackgroundClick ( event ) {
        
        if(_this.debug) _this.logDebug('background click');

        _this.close();

    }

    function handleModalEvents ( event ) {

        if( _this.debug ) _this.logDebug( 'handle modal event: ' + event.type );

        switch ( event.type ) {
            case CommonEvent.OPEN:

                _isOpen = true;

                _notificationCenter.notify( new Notification( Notification.MODAL_OPENED, _modal, 'Modal was opened' ) );

                if( !_openClassRegExp.test( _body.className ) )_body.className = _body.className + ' ' + _openClass;

                _container.show();

                _body.style.overflow = 'hidden';

                break;
            case CommonEvent.CLOSE:


                _isOpen = false;

                _notificationCenter.notify( new Notification( Notification.MODAL_CLOSED, _modal, 'Modal was closed' ) );

                _body.className = _body.className.replace( _openClassRegExp, '' );

                _container.hide();

                _body.style.overflow = '';


                break;
            default:
                _this.logError( 'Unhandled switch case' );
        }

    }


    _this.open = function ( opt_data, opt_instant ) {

        if( !_container ) return _this.logError( 'Initiate the modal manager first!' );

        if( _isOpen ) return;

        if( !_modal ) return _this.logError( 'No modal was found! Set a modal on the manager first!' );


        if( _this.debug ) _this.logDebug( 'open instant:' + opt_instant + ', data: ', opt_data );

        _modal.open( opt_data, opt_instant );


    }

    _this.close = function ( opt_instant ) {

        if( !_container ) return _this.logError( 'Initiate the modal manager first!' );

        if( !_isOpen ) return;

        if( !_modal ) return _this.logError( 'No modal was found! Set a modal on the manager first!' );

        if( _this.debug ) _this.logDebug( 'close instant: ' + opt_instant );

        _modal.close( opt_instant );

    }

    Object.defineProperty( this, 'openClass', {
        enumerable: true,
        get: function () {
            return _openClass;
        },
        set: function ( value ) {
            _openClass = value;
            _openClassRegExp = new RegExp( '\\b\\s?' + _openClass + '\\b', 'i' );
        }
    } );

    Object.defineProperty( this, 'modal', {
        enumerable: true,
        get: function () {
            return _modal;
        }
    } );


}

module.exports = ModalManager;

