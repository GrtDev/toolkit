/**
 * @author Geert Fokke [geert@sector22.com]
 * @www www.sector22.com
 * @module
 */

//@formatter:off

var CoreObject              = require('../../core/CoreObject')

//@formatter:on

CoreObject.extend(LanguageManager);

LanguageManager.prototype.instances = {};

/**
 * @constructor
 */
function LanguageManager(iso)
{
    // Force the use of a single instance (Singleton)
    if(typeof LanguageManager.prototype.instances[iso] !== 'undefined') {
        LanguageManager.getInstance().logError('Attempting to instantiate a Singleton! Use `getInstance` method to retrieve a reference instead!');
        return null;
    }

    LanguageManager.super_.call(this);
    LanguageManager.prototype.instances[iso] = this;

    var _this = this;
    var _texts = {};
    var _textGroups = {};

    _this.createGroup = function (groupID)
    {
        if(!groupID){
            _this.logError('id can not be null!');
            return;
        }
        groupID = groupID.toLowerCase();

        if(_this.hasGroup(groupID)) {
            _this.logError('Translation group with id: \'' + groupID + '\' already exists!');
            return;
        }
        _textGroups[groupID] = {};
    }

    _this.addText = function (id, label, opt_groupID)
    {
        if(!id || !label){
            _this.logError('id and label can not be null!');
            return;
        }
        var labelGroup = _texts;
        if(opt_groupID) {
            opt_groupID = opt_groupID.toLowerCase();
            if(!_this.hasGroup(opt_groupID)) {
                _this.logError('Failed to retrieve the translation group! group id: ' + opt_groupID);
                return;
            }
            labelGroup = _textGroups[opt_groupID];
        }

        id = id.toLowerCase();
        if(typeof labelGroup[id] !== 'undefined') {
            _this.logError('A text with ID: \'' + id + '\' has already been added' + (opt_groupID ? ' to this group: \'' + opt_groupID + '\'' : '') + '!');
            return;
        }

        labelGroup[id] = label;

        console.log('_texts: ', _texts);
    }

    _this.getText = function (id, opt_groupID)
    {
        if(!id){
            _this.logError('id can not be null!');
            return;
        }
        id = id.toLowerCase();
        var labelGroup = _texts;

        if(opt_groupID) {
            opt_groupID = opt_groupID.toLowerCase();
            if(!_this.hasGroup(opt_groupID)) {
                _this.logError('Failed to retrieve the translation group! group id: ' + opt_groupID);
                return null;
            }
            labelGroup = _textGroups[opt_groupID];
        }

        if(typeof labelGroup[id] === 'undefined') {
            _this.logError('A text with ID: \'' + id + '\' has NOT been added' + (opt_groupID ? ' to this group: \'' + opt_groupID + '\'' : '') + '!');
            return null;
        }
        return labelGroup[id]
    }

    _this.hasText = function (id, opt_groupID)
    {
        if(!id) return false;
        id = id.toLowerCase();

        if(opt_groupID) {
            opt_groupID = opt_groupID.toLowerCase();
            if(typeof _textGroups[opt_groupID] === 'undefined') return false;
            return (typeof _textGroups[opt_groupID][id] !== 'undefined');
        }
        return (typeof _texts[id] !== 'undefined');
    }

    _this.hasGroup = function (groupID)
    {
        return (!groupID || typeof _textGroups[groupID.toLowerCase()] !== 'undefined');
    }

     Object.defineProperty(this, 'texts', {
         enumerable: true,
     	get: function() {
              return _texts;
          }
     });

}

/**
 * Returns an instance of the language manager.
 * @static
 * @function getInstance
 * @param opt_iso {=string} optional language iso to retrieve a specific language manager.
 * @returns {Log} A logger instance.
 */
LanguageManager.getInstance = function (opt_iso)
{
    opt_iso = opt_iso || 'default';
    return LanguageManager.prototype.instances[opt_iso] || new LanguageManager(opt_iso);
};

module.exports = LanguageManager;