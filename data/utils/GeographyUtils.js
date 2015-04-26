/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */
//@formatter:off

var countries           = require('../iso2/countries');
var continents          = require('../iso2/continents');

//@formatter:on

// parse continents data into an Array
var continentsList = [];
for (var iso2 in continents) if(continents.hasOwnProperty(iso2)) continentsList.push(continents[iso2]);
var continentsLength = continentsList.length;

function GeographyUtils() {

    var _this = this;

    _this.getContinent = function (iso2) {

        for (var i = 0; i < continentsLength; i++) {
            var continent = continentsList[i];
            if(typeof continent.countries[iso2] !== 'undefined') return continent;
        }

    }

}

module.exports = GeographyUtils;