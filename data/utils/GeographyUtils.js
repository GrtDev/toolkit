/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
//@formatter:off

var CoreObject           = require('../../core/CoreObject');
var countries           = require('../iso2/countries');
var continents          = require('../iso2/continents');

//@formatter:on


// parse continents data into an Array
var continentsList = [];
for (var iso2 in continents) if(continents.hasOwnProperty(iso2)) continentsList.push(continents[iso2]);
var continentsLength = continentsList.length;


CoreObject.extend(GeographyUtils);

function GeographyUtils()
{
    var _this = this;
    var _customRegions = {};

    _this.getContinent = function (iso2)
    {
        for (var i = 0; i < continentsLength; i++) {
            var continent = continentsList[i];
            if(typeof continent.countries[iso2] !== 'undefined') return continent;
        }

        return null;
    }

    _this.defineRegion = function (id, name, countries)
    {
        if(!id || !countries) return _this.logError('id and country list can not be null! id: \'' + id + '\', country list: ', countries);
        if(typeof _customRegions[id] !== 'undefined') return _this.logError('Custom region with id: \'' + id + '\' already exists!');

        var region = _customRegions[id] = {id:id, name:name, countries:{}};

        // parse Array or Object
        if(countries.constructor === Array){

            for (var i = 0, leni = countries.length; i < leni; i++) region.countries[countries[i]] = true;

        } else {

            for(var countryID in countries){
                if(!countries.hasOwnProperty(countryID)) continue;
                var country = countries[countryID];
                region.countries[countryID] = country;
            }

        }

    }

    _this.getRegion = function (iso)
    {
        for(var regionID in _customRegions){
            if(!_customRegions.hasOwnProperty(regionID)) continue;
            var region = _customRegions[regionID];
            if(typeof region.countries[iso] !== 'undefined') return region;
        }
    }

}

module.exports = GeographyUtils;