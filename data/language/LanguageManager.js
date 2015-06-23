/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var CoreObject                  = require('../../core/CoreObject')
var singletonMixin              = require('../../core/mixin/singletonMixin');

//@formatter:on

CoreObject.extend( LanguageManager );

singletonMixin.apply( LanguageManager );

/**
 * Language Manager that can collect and maintain texts for different languages.
 * @constructor
 * @extends {CoreObject}
 */
function LanguageManager () {

    LanguageManager.singletonCheck( this );

    LanguageManager.super_.call( this );

    var _this = this;
    var _currentLanguage;
    var _languages = {};
    var _initialized;

    _this.init = function ( languageID ) {

        if( _initialized ) return _this.logWarn( 'Manager has al ready been initialized!' );
        if( !languageID || !languageID.length ) return _this.logError( 'languageID can not be null or empty! languageID: ' + languageID );

        _initialized = true;

        _this.addLanguage( languageID );
        _this.setLanguage( languageID );

    }

    _this.parseTextData = function ( textData, opt_groupID ) {

        if( !_initialized ) return _this.logError( 'The language manager has not been initialized yet... initialize the language manager first!' );

        for ( var textID in textData ) {

            if( !textData.hasOwnProperty( textID ) ) continue;
            _this.addText( textID, textData[ textID ], opt_groupID );

        }
    }

    _this.addLanguage = function ( languageID ) {

        if( typeof _languages[ languageID ] !== 'undefined' ) return _this.logError( 'Attempting to add a language that has al ready been added!' );

        _languages[ languageID ] = { id: languageID, texts: {}, groups: {} };

    }


    _this.setLanguage = function ( languageID ) {

        if( typeof _languages[ languageID ] === 'undefined' ) return _this.logError( 'Attempting to set a language that has not been added!' );

        _currentLanguage = _languages[ languageID ];

    }

    _this.addGroup = function ( groupID ) {

        if( !_initialized ) return _this.logError( 'The language manager has not been initialized yet... initialize the language manager first!' );
        if( !groupID ) return _this.logError( 'group id can not be null!' );

        groupID = groupID.toLowerCase();

        if( _this.hasGroup( groupID ) ) return _this.logError( 'text group with id: \'' + groupID + '\' already exists!' );

        _currentLanguage.groups[ groupID ] = {};

    }

    _this.addText = function ( id, text, opt_groupID ) {

        if( !_initialized ) return _this.logError( 'The language manager has not been initialized yet... initialize the language manager first!' );
        if( !id || !text || !id.length ) return _this.logError( 'id not be null or empty!, text can not be null! id: \'' + id + '\', text: \'' + text + '\'' );

        var textGroup = _currentLanguage.texts;
        if( opt_groupID ) {
            opt_groupID = opt_groupID.toLowerCase();

            if( !_this.hasGroup( opt_groupID ) ) return _this.logError( 'Failed to retrieve the translation group! group id: ' + opt_groupID );

            textGroup = _currentLanguage.groups[ opt_groupID ];
        }

        id = id.toLowerCase();

        if( typeof textGroup[ id ] !== 'undefined' ) return _this.logError( 'A text with ID: \'' + id + '\' has already been added' + (opt_groupID ? ' to this group: \'' + opt_groupID + '\'' : '') + '!' );

        textGroup[ id ] = text;
    }

    _this.getText = function ( id, opt_groupID ) {

        if( !_initialized ) return _this.logError( 'The language manager has not been initialized yet... initialize the language manager first!' );
        if( !id ) return _this.logError( 'id can not be null!' );

        id = id.toLowerCase();
        var labelGroup = _currentLanguage.texts;

        if( opt_groupID ) {
            opt_groupID = opt_groupID.toLowerCase();

            if( !_this.hasGroup( opt_groupID ) ) return _this.logError( 'Failed to retrieve the translation group! group id: ' + opt_groupID );

            labelGroup = _currentLanguage.groups[ opt_groupID ];
        }

        if( typeof labelGroup[ id ] === 'undefined' ) return _this.logError( 'A text with ID: \'' + id + '\' has NOT been added' + (opt_groupID ? ' to this group: \'' + opt_groupID + '\'' : '') + '!' );
        return labelGroup[ id ]
    }

    _this.hasText = function ( id, opt_groupID ) {

        if( !id || !_currentLanguage ) return false;
        id = id.toLowerCase();

        if( opt_groupID ) {
            opt_groupID = opt_groupID.toLowerCase();
            if( typeof _currentLanguage.groups[ opt_groupID ] === 'undefined' ) return false;
            return (typeof _currentLanguage.groups[ opt_groupID ][ id ] !== 'undefined');
        }

        return (typeof _currentLanguage.texts[ id ] !== 'undefined');

    }

    _this.hasGroup = function ( groupID ) {

        return (groupID && _currentLanguage && typeof _currentLanguage.groups[ groupID.toLowerCase() ] !== 'undefined');

    }

    _this.dump = function () {

        for ( var languageID in _languages ) {
            if( !_languages.hasOwnProperty( languageID ) ) continue;
            var language = _languages[ languageID ];
            _this.logInfo( 'language dump, \n\tid: ' + languageID, '\n\ttexts: ', language.texts, '\n\tgroups: ', language.groups );
        }

    }


    Object.defineProperty( this, 'language', {
        enumerable: true,
        get: function () {
            return _currentLanguage ? _currentLanguage[ 'id' ] : null;
        }
    } );

}

module.exports = LanguageManager;