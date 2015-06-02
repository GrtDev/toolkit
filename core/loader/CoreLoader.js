/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

//@formatter:off

var CoreObject                          = require('../CoreObject');
var DataResult                          = require('../../data/result/DataResult');
var httpStatusUtils                     = require('./httpStatusUtils');


var XREQUEST_STATE_UNSENT               = 0;
var XREQUEST_STATE_OPENED               = 1;
var XREQUEST_STATE_HEADERS_RECEIVED     = 2;
var XREQUEST_STATE_LOADING              = 3;
var XREQUEST_STATE_DONE                 = 4;


CoreLoader.RESPONSE_TYPE_DOCUMENT       = 'document';
CoreLoader.RESPONSE_TYPE_TEXT           = 'text';
CoreLoader.RESPONSE_TYPE_BLOB           = 'blob';
CoreLoader.RESPONSE_TYPE_JSON           = 'json';
CoreLoader.RESPONSE_TYPE_ARRAY_BUFFER   = 'arraybuffer';

CoreLoader.MIMETYPE_HTML                = 'text/html';
CoreLoader.MIMETYPE_JSON                = 'application/json';

//@formatter:on

// TODO: Add cross domain support ( CORS )
// @see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS


CoreObject.extend(CoreLoader);

/**
 * @constructor
 * @extends {CoreObject}
 */
function CoreLoader () {

    var _this = this;
    var _url;
    var _xRequest;
    var _callback;
    var _lastXRequestState;
    var _mimeType;
    var _responseType;
    var _isLoading;

    /**
     * Start loading new content
     * @param url {string}
     * @param callback {function} Should accept a DataResult
     * @param opt_options {object}
     */
    _this.load = function ( url, callback, opt_options ) {

        if( _this.isLoading ) {

            _this.logError( 'Still busy loading...' );
            return;

        } else if( !callback || typeof callback !== 'function' ) {

            _this.logError( 'Callback can not be null & has to be a function!' );
            return;

        } else {

            _this.reset();

        }


        opt_options = opt_options || {};

        var async = (typeof opt_options.async === 'undefined' || opt_options.async) ? true : false;
        var user = opt_options.user || '';
        var password = opt_options.password || '';

        _url = url;
        _callback = callback;

        if( _this.debug ) _this.logDebug( 'Loading new url: ' + _url + ', async: ' + async + ', user: \'' + user + '\', password: \'' + password + '\'' );

        _xRequest = new XMLHttpRequest();

        if( _xRequest.overrideMimeType && _mimeType ) _xRequest.overrideMimeType( _mimeType ); // IE9 does not support overrideMimeType
        if( _xRequest.responseType && _responseType ) _xRequest.responseType = _responseType;

        _xRequest.onreadystatechange = handleXRequestStateChange;
        _xRequest.open( 'GET', _url, async, user, password );
        _xRequest.send( null );


    }

    function handleXRequestStateChange () {

        // ignore duplicate state 'changes'
        if( _lastXRequestState === _xRequest.readyState ) return;
        _lastXRequestState = _xRequest.readyState;

        switch ( _xRequest.readyState ) {

            case XREQUEST_STATE_UNSENT:
                if( _this.debug ) _this.logDebug( 'handleXRequestStateChange: UNSENT' );

                _this.reset();

                break;
            case XREQUEST_STATE_OPENED:
                if( _this.debug ) _this.logDebug( 'handleXRequestStateChange: OPENED' );

                break;
            case XREQUEST_STATE_HEADERS_RECEIVED:
                if( _this.debug ) _this.logDebug( 'handleXRequestStateChange: RECEIVED' );

                break;
            case XREQUEST_STATE_LOADING:
                if( _this.debug ) _this.logDebug( 'handleXRequestStateChange: LOADING' );

                break;
            case XREQUEST_STATE_DONE:
                if( _this.debug ) _this.logDebug( 'handleXRequestStateChange: DONE' );

                var result;
                if( _xRequest.status === 200 ) {

                    var data = _this.parseData(_xRequest);
                    result = new DataResult( data, true, 'Successfully loaded the data', _xRequest.status, _url);

                } else {

                    _this.logWarn( 'Failed to load the file... status: ' + _xRequest.status + ' - ' + httpStatusUtils.getDescription(_xRequest.status) );
                    result = new DataResult( null, false, 'Failed to load the data: ' + httpStatusUtils.getDescription(_xRequest.status), _xRequest.status, _url );
                    
                }

                if( _callback && typeof _callback === 'function' ) _callback( result );
                else _this.logError( 'Finished loading, but no callback was registered?' );

                _this.reset(); // automatically reset after load has finished

                break;
            default:
                _this.logError( 'Unhandled xRequest state change?! state: ' + _xRequest.readyState );
        }

    }

    _this.abort = function () {

        if( _this.debug ) _this.logDebug( 'aborting load...' );
        if( _xRequest ) {
            _xRequest.abort();
            _this.reset();
        }

    }

    _this.reset = function () {

        if( !_xRequest ) return;
        if( _this.debug ) _this.logDebug( 'Resetting loader...' );
        _xRequest.abort();
        _xRequest.onreadystatechange = null;
        _xRequest = null;
        _url = null;
        _callback = null;
        _isLoading = false;

    }

    /**
     * If set it will attempt to override mime type on request.
     * @see: http://en.wikipedia.org/wiki/Internet_media_type
     * @param type {string}
     */
    _this.setMimeType = function ( type ) {

        _mimeType = type;

    }

    /**
     * Define response type
     * @param type {string}
     */
    _this.setResponseType = function ( type ) {

        _responseType = type;

    }

     Object.defineProperty(this, 'responseType', {
         enumerable: true,
     	get: function() {
              return _responseType;
          }
     });

    Object.defineProperty( this, 'mimeType', {
        enumerable: true,
        get: function () {
            return _mimeType;
        }
    } );

    Object.defineProperty( this, 'isLoading', {
        get: function () {
            return _isLoading;
        }
    } );
    Object.defineProperty( this, 'url', {
        get: function () {
            return _url;
        }
    } );

}

/**
 * A function you can override to parse the data before its sent to the callback
 * @param xmlHttpRequest {XMLHttpRequest}
 */
CoreLoader.prototype.parseData = function  ( xmlHttpRequest ) {

    return xmlHttpRequest.responseText;

}

/**
 * @see CoreObject.destruct
 */
CoreLoader.prototype.destruct = function () {

    this.reset();

    CoreLoader.super_.prototype.destruct.call( this );

}

module.exports = CoreLoader;
