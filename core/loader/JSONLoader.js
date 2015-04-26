/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
//@formatter:off
var inherits                = require('../../utils/inherits');
var CoreObject              = require('../CoreObject');
var DataResult              = require('../../data/result/DataResult');

inherits(JSONLoader, CoreObject);


var XREQUEST_STATE_UNSENT               = 0;
var XREQUEST_STATE_OPENED               = 1;
var XREQUEST_STATE_HEADERS_RECEIVED     = 2;
var XREQUEST_STATE_LOADING              = 3;
var XREQUEST_STATE_DONE                 = 4;


//@formatter:on

// TODO: Add cross domain config

function JSONLoader() {

    var _this = this;
    var _url;
    var _xRequest;
    var _callback;
    var _lastXRequestState;

    _this.load = function (url, callback, opt_options) {

        if(_this.isLoading) {
            _this.logError('Still busy loading...');
            return;
        } else if(!callback || typeof callback !== 'function') {
            _this.logError('Callback can not be null & has to be a function!');
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

        if(_this.debug) _this.logDebug('Loading new JSON, url: ' + _url + ', async: ' + async + ', user: \'' + user + '\', password: \'' + password + '\'');

        _xRequest = new XMLHttpRequest();
        if(_xRequest.overrideMimeType) _xRequest.overrideMimeType("application/json"); // IE9 does not support overrideMimeType
        _xRequest.onreadystatechange = handleXRequestStateChange;
        _xRequest.open('GET', _url, async, user, password);
        _xRequest.send(null);


    }

    function handleXRequestStateChange() {

        // ignore duplicate state 'changes'
        if(_lastXRequestState === _xRequest.readyState) return;
        _lastXRequestState = _xRequest.readyState;

        switch (_xRequest.readyState) {

            case XREQUEST_STATE_UNSENT:
                if(_this.debug) _this.logDebug('handleXRequestStateChange: UNSENT');

                break;
            case XREQUEST_STATE_OPENED:
                if(_this.debug) _this.logDebug('handleXRequestStateChange: OPENED');

                break;
            case XREQUEST_STATE_HEADERS_RECEIVED:
                if(_this.debug) _this.logDebug('handleXRequestStateChange: RECEIVED');

                break;
            case XREQUEST_STATE_LOADING:
                if(_this.debug) _this.logDebug('handleXRequestStateChange: LOADING');

                break;
            case XREQUEST_STATE_UNSENT:
                if(_this.debug) _this.logDebug('handleXRequestStateChange: UNSENT');

                break;
            case XREQUEST_STATE_DONE:
                if(_this.debug) _this.logDebug('handleXRequestStateChange: DONE');

                var result;
                if(_xRequest.status === 200) {
                    result = new DataResult(JSON.parse(_xRequest.responseText), true, 'Successfully loaded the data', _xRequest.status);
                } else {
                    _this.logWarn('Failed to load the file... status: ' + _xRequest.status);
                    result = new DataResult(null, false, 'Failed to load the data', _xRequest.status);
                }

                if(_callback && typeof _callback === 'function') _callback(result);
                else _this.logError('Finished loading, but no callback was registered?');

                break;
            default:
                _this.logError('Unhandled xRequest state change?! state: ' + _xRequest.readyState);
        }
    }

    _this.abort = function () {
        if(_this.debug) _this.logDebug('aborting load...');
        if(_xRequest) {
            _xRequest.abort();
            _this.reset();
        }
    }

    _this.reset = function () {

        if(!_xRequest) return;
        if(_this.debug) _this.logDebug('Resetting loader...');
        _xRequest.abort();
        _xRequest.onreadystatechange = null;
        _xRequest = null;
        _url = null;
        _callback = null;

    }

    Object.defineProperty(this, 'isLoading', {
        get: function () {
            return (_xRequest && _xRequest !== XREQUEST_STATE_DONE);
        }
    });
    Object.defineProperty(this, 'url', {
        get: function () {
            return _url;
        }
    });

}


/**
 * @see CoreObject.destruct
 */
JSONLoader.prototype.destruct = function () {

    this.reset();

    JSONLoader.super_.prototype.destruct.call(this);

}

module.exports = JSONLoader;
