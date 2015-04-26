/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

var isoCodes = [
    {iso2: 'AF', iso3: 'AFG', num: '004'},
    {iso2: 'AX', iso3: 'ALA', num: '248'},
    {iso2: 'AL', iso3: 'ALB', num: '008'},
    {iso2: 'DZ', iso3: 'DZA', num: '012'},
    {iso2: 'AS', iso3: 'ASM', num: '016'},
    {iso2: 'AD', iso3: 'AND', num: '020'},
    {iso2: 'AO', iso3: 'AGO', num: '024'},
    {iso2: 'AI', iso3: 'AIA', num: '660'},
    {iso2: 'AQ', iso3: 'ATA', num: '010'},
    {iso2: 'AG', iso3: 'ATG', num: '028'},
    {iso2: 'AR', iso3: 'ARG', num: '032'},
    {iso2: 'AM', iso3: 'ARM', num: '051'},
    {iso2: 'AW', iso3: 'ABW', num: '533'},
    {iso2: 'AU', iso3: 'AUS', num: '036'},
    {iso2: 'AT', iso3: 'AUT', num: '040'},
    {iso2: 'AZ', iso3: 'AZE', num: '031'},
    {iso2: 'BS', iso3: 'BHS', num: '044'},
    {iso2: 'BH', iso3: 'BHR', num: '048'},
    {iso2: 'BD', iso3: 'BGD', num: '050'},
    {iso2: 'BB', iso3: 'BRB', num: '052'},
    {iso2: 'BY', iso3: 'BLR', num: '112'},
    {iso2: 'BE', iso3: 'BEL', num: '056'},
    {iso2: 'BZ', iso3: 'BLZ', num: '084'},
    {iso2: 'BJ', iso3: 'BEN', num: '204'},
    {iso2: 'BM', iso3: 'BMU', num: '060'},
    {iso2: 'BT', iso3: 'BTN', num: '064'},
    {iso2: 'BO', iso3: 'BOL', num: '068'},
    {iso2: 'BA', iso3: 'BIH', num: '070'},
    {iso2: 'BW', iso3: 'BWA', num: '072'},
    {iso2: 'BV', iso3: 'BVT', num: '074'},
    {iso2: 'BR', iso3: 'BRA', num: '076'},
    {iso2: 'VG', iso3: 'VGB', num: '092'},
    {iso2: 'IO', iso3: 'IOT', num: '086'},
    {iso2: 'BN', iso3: 'BRN', num: '096'},
    {iso2: 'BG', iso3: 'BGR', num: '100'},
    {iso2: 'BF', iso3: 'BFA', num: '854'},
    {iso2: 'BI', iso3: 'BDI', num: '108'},
    {iso2: 'KH', iso3: 'KHM', num: '116'},
    {iso2: 'CM', iso3: 'CMR', num: '120'},
    {iso2: 'CA', iso3: 'CAN', num: '124'},
    {iso2: 'CV', iso3: 'CPV', num: '132'},
    {iso2: 'KY', iso3: 'CYM', num: '136'},
    {iso2: 'CF', iso3: 'CAF', num: '140'},
    {iso2: 'TD', iso3: 'TCD', num: '148'},
    {iso2: 'CL', iso3: 'CHL', num: '152'},
    {iso2: 'CN', iso3: 'CHN', num: '156'},
    {iso2: 'HK', iso3: 'HKG', num: '344'},
    {iso2: 'MO', iso3: 'MAC', num: '446'},
    {iso2: 'CX', iso3: 'CXR', num: '162'},
    {iso2: 'CC', iso3: 'CCK', num: '166'},
    {iso2: 'CO', iso3: 'COL', num: '170'},
    {iso2: 'KM', iso3: 'COM', num: '174'},
    {iso2: 'CG', iso3: 'COG', num: '178'},
    {iso2: 'CD', iso3: 'COD', num: '180'},
    {iso2: 'CK', iso3: 'COK', num: '184'},
    {iso2: 'CR', iso3: 'CRI', num: '188'},
    {iso2: 'CI', iso3: 'CIV', num: '384'},
    {iso2: 'HR', iso3: 'HRV', num: '191'},
    {iso2: 'CU', iso3: 'CUB', num: '192'},
    {iso2: 'CY', iso3: 'CYP', num: '196'},
    {iso2: 'CZ', iso3: 'CZE', num: '203'},
    {iso2: 'DK', iso3: 'DNK', num: '208'},
    {iso2: 'DJ', iso3: 'DJI', num: '262'},
    {iso2: 'DM', iso3: 'DMA', num: '212'},
    {iso2: 'DO', iso3: 'DOM', num: '214'},
    {iso2: 'EC', iso3: 'ECU', num: '218'},
    {iso2: 'EG', iso3: 'EGY', num: '818'},
    {iso2: 'SV', iso3: 'SLV', num: '222'},
    {iso2: 'GQ', iso3: 'GNQ', num: '226'},
    {iso2: 'ER', iso3: 'ERI', num: '232'},
    {iso2: 'EE', iso3: 'EST', num: '233'},
    {iso2: 'ET', iso3: 'ETH', num: '231'},
    {iso2: 'FK', iso3: 'FLK', num: '238'},
    {iso2: 'FO', iso3: 'FRO', num: '234'},
    {iso2: 'FJ', iso3: 'FJI', num: '242'},
    {iso2: 'FI', iso3: 'FIN', num: '246'},
    {iso2: 'FR', iso3: 'FRA', num: '250'},
    {iso2: 'GF', iso3: 'GUF', num: '254'},
    {iso2: 'PF', iso3: 'PYF', num: '258'},
    {iso2: 'TF', iso3: 'ATF', num: '260'},
    {iso2: 'GA', iso3: 'GAB', num: '266'},
    {iso2: 'GM', iso3: 'GMB', num: '270'},
    {iso2: 'GE', iso3: 'GEO', num: '268'},
    {iso2: 'DE', iso3: 'DEU', num: '276'},
    {iso2: 'GH', iso3: 'GHA', num: '288'},
    {iso2: 'GI', iso3: 'GIB', num: '292'},
    {iso2: 'GR', iso3: 'GRC', num: '300'},
    {iso2: 'GL', iso3: 'GRL', num: '304'},
    {iso2: 'GD', iso3: 'GRD', num: '308'},
    {iso2: 'GP', iso3: 'GLP', num: '312'},
    {iso2: 'GU', iso3: 'GUM', num: '316'},
    {iso2: 'GT', iso3: 'GTM', num: '320'},
    {iso2: 'GG', iso3: 'GGY', num: '831'},
    {iso2: 'GN', iso3: 'GIN', num: '324'},
    {iso2: 'GW', iso3: 'GNB', num: '624'},
    {iso2: 'GY', iso3: 'GUY', num: '328'},
    {iso2: 'HT', iso3: 'HTI', num: '332'},
    {iso2: 'HM', iso3: 'HMD', num: '334'},
    {iso2: 'VA', iso3: 'VAT', num: '336'},
    {iso2: 'HN', iso3: 'HND', num: '340'},
    {iso2: 'HU', iso3: 'HUN', num: '348'},
    {iso2: 'IS', iso3: 'ISL', num: '352'},
    {iso2: 'IN', iso3: 'IND', num: '356'},
    {iso2: 'ID', iso3: 'IDN', num: '360'},
    {iso2: 'IR', iso3: 'IRN', num: '364'},
    {iso2: 'IQ', iso3: 'IRQ', num: '368'},
    {iso2: 'IE', iso3: 'IRL', num: '372'},
    {iso2: 'IM', iso3: 'IMN', num: '833'},
    {iso2: 'IL', iso3: 'ISR', num: '376'},
    {iso2: 'IT', iso3: 'ITA', num: '380'},
    {iso2: 'JM', iso3: 'JAM', num: '388'},
    {iso2: 'JP', iso3: 'JPN', num: '392'},
    {iso2: 'JE', iso3: 'JEY', num: '832'},
    {iso2: 'JO', iso3: 'JOR', num: '400'},
    {iso2: 'KZ', iso3: 'KAZ', num: '398'},
    {iso2: 'KE', iso3: 'KEN', num: '404'},
    {iso2: 'KI', iso3: 'KIR', num: '296'},
    {iso2: 'KP', iso3: 'PRK', num: '408'},
    {iso2: 'KR', iso3: 'KOR', num: '410'},
    {iso2: 'KW', iso3: 'KWT', num: '414'},
    {iso2: 'KG', iso3: 'KGZ', num: '417'},
    {iso2: 'LA', iso3: 'LAO', num: '418'},
    {iso2: 'LV', iso3: 'LVA', num: '428'},
    {iso2: 'LB', iso3: 'LBN', num: '422'},
    {iso2: 'LS', iso3: 'LSO', num: '426'},
    {iso2: 'LR', iso3: 'LBR', num: '430'},
    {iso2: 'LY', iso3: 'LBY', num: '434'},
    {iso2: 'LI', iso3: 'LIE', num: '438'},
    {iso2: 'LT', iso3: 'LTU', num: '440'},
    {iso2: 'LU', iso3: 'LUX', num: '442'},
    {iso2: 'MK', iso3: 'MKD', num: '807'},
    {iso2: 'MG', iso3: 'MDG', num: '450'},
    {iso2: 'MW', iso3: 'MWI', num: '454'},
    {iso2: 'MY', iso3: 'MYS', num: '458'},
    {iso2: 'MV', iso3: 'MDV', num: '462'},
    {iso2: 'ML', iso3: 'MLI', num: '466'},
    {iso2: 'MT', iso3: 'MLT', num: '470'},
    {iso2: 'MH', iso3: 'MHL', num: '584'},
    {iso2: 'MQ', iso3: 'MTQ', num: '474'},
    {iso2: 'MR', iso3: 'MRT', num: '478'},
    {iso2: 'MU', iso3: 'MUS', num: '480'},
    {iso2: 'YT', iso3: 'MYT', num: '175'},
    {iso2: 'MX', iso3: 'MEX', num: '484'},
    {iso2: 'FM', iso3: 'FSM', num: '583'},
    {iso2: 'MD', iso3: 'MDA', num: '498'},
    {iso2: 'MC', iso3: 'MCO', num: '492'},
    {iso2: 'MN', iso3: 'MNG', num: '496'},
    {iso2: 'ME', iso3: 'MNE', num: '499'},
    {iso2: 'MS', iso3: 'MSR', num: '500'},
    {iso2: 'MA', iso3: 'MAR', num: '504'},
    {iso2: 'MZ', iso3: 'MOZ', num: '508'},
    {iso2: 'MM', iso3: 'MMR', num: '104'},
    {iso2: 'NA', iso3: 'NAM', num: '516'},
    {iso2: 'NR', iso3: 'NRU', num: '520'},
    {iso2: 'NP', iso3: 'NPL', num: '524'},
    {iso2: 'NL', iso3: 'NLD', num: '528'},
    {iso2: 'AN', iso3: 'ANT', num: '530'},
    {iso2: 'NC', iso3: 'NCL', num: '540'},
    {iso2: 'NZ', iso3: 'NZL', num: '554'},
    {iso2: 'NI', iso3: 'NIC', num: '558'},
    {iso2: 'NE', iso3: 'NER', num: '562'},
    {iso2: 'NG', iso3: 'NGA', num: '566'},
    {iso2: 'NU', iso3: 'NIU', num: '570'},
    {iso2: 'NF', iso3: 'NFK', num: '574'},
    {iso2: 'MP', iso3: 'MNP', num: '580'},
    {iso2: 'NO', iso3: 'NOR', num: '578'},
    {iso2: 'OM', iso3: 'OMN', num: '512'},
    {iso2: 'PK', iso3: 'PAK', num: '586'},
    {iso2: 'PW', iso3: 'PLW', num: '585'},
    {iso2: 'PS', iso3: 'PSE', num: '275'},
    {iso2: 'PA', iso3: 'PAN', num: '591'},
    {iso2: 'PG', iso3: 'PNG', num: '598'},
    {iso2: 'PY', iso3: 'PRY', num: '600'},
    {iso2: 'PE', iso3: 'PER', num: '604'},
    {iso2: 'PH', iso3: 'PHL', num: '608'},
    {iso2: 'PN', iso3: 'PCN', num: '612'},
    {iso2: 'PL', iso3: 'POL', num: '616'},
    {iso2: 'PT', iso3: 'PRT', num: '620'},
    {iso2: 'PR', iso3: 'PRI', num: '630'},
    {iso2: 'QA', iso3: 'QAT', num: '634'},
    {iso2: 'RE', iso3: 'REU', num: '638'},
    {iso2: 'RO', iso3: 'ROU', num: '642'},
    {iso2: 'RU', iso3: 'RUS', num: '643'},
    {iso2: 'RW', iso3: 'RWA', num: '646'},
    {iso2: 'BL', iso3: 'BLM', num: '652'},
    {iso2: 'SH', iso3: 'SHN', num: '654'},
    {iso2: 'KN', iso3: 'KNA', num: '659'},
    {iso2: 'LC', iso3: 'LCA', num: '662'},
    {iso2: 'MF', iso3: 'MAF', num: '663'},
    {iso2: 'PM', iso3: 'SPM', num: '666'},
    {iso2: 'VC', iso3: 'VCT', num: '670'},
    {iso2: 'WS', iso3: 'WSM', num: '882'},
    {iso2: 'SM', iso3: 'SMR', num: '674'},
    {iso2: 'ST', iso3: 'STP', num: '678'},
    {iso2: 'SA', iso3: 'SAU', num: '682'},
    {iso2: 'SN', iso3: 'SEN', num: '686'},
    {iso2: 'RS', iso3: 'SRB', num: '688'},
    {iso2: 'SC', iso3: 'SYC', num: '690'},
    {iso2: 'SL', iso3: 'SLE', num: '694'},
    {iso2: 'SG', iso3: 'SGP', num: '702'},
    {iso2: 'SK', iso3: 'SVK', num: '703'},
    {iso2: 'SI', iso3: 'SVN', num: '705'},
    {iso2: 'SB', iso3: 'SLB', num: '090'},
    {iso2: 'SO', iso3: 'SOM', num: '706'},
    {iso2: 'ZA', iso3: 'ZAF', num: '710'},
    {iso2: 'GS', iso3: 'SGS', num: '239'},
    {iso2: 'SS', iso3: 'SSD', num: '728'},
    {iso2: 'ES', iso3: 'ESP', num: '724'},
    {iso2: 'LK', iso3: 'LKA', num: '144'},
    {iso2: 'SD', iso3: 'SDN', num: '736'},
    {iso2: 'SR', iso3: 'SUR', num: '740'},
    {iso2: 'SJ', iso3: 'SJM', num: '744'},
    {iso2: 'SZ', iso3: 'SWZ', num: '748'},
    {iso2: 'SE', iso3: 'SWE', num: '752'},
    {iso2: 'CH', iso3: 'CHE', num: '756'},
    {iso2: 'SY', iso3: 'SYR', num: '760'},
    {iso2: 'TW', iso3: 'TWN', num: '158'},
    {iso2: 'TJ', iso3: 'TJK', num: '762'},
    {iso2: 'TZ', iso3: 'TZA', num: '834'},
    {iso2: 'TH', iso3: 'THA', num: '764'},
    {iso2: 'TL', iso3: 'TLS', num: '626'},
    {iso2: 'TG', iso3: 'TGO', num: '768'},
    {iso2: 'TK', iso3: 'TKL', num: '772'},
    {iso2: 'TO', iso3: 'TON', num: '776'},
    {iso2: 'TT', iso3: 'TTO', num: '780'},
    {iso2: 'TN', iso3: 'TUN', num: '788'},
    {iso2: 'TR', iso3: 'TUR', num: '792'},
    {iso2: 'TM', iso3: 'TKM', num: '795'},
    {iso2: 'TC', iso3: 'TCA', num: '796'},
    {iso2: 'TV', iso3: 'TUV', num: '798'},
    {iso2: 'UG', iso3: 'UGA', num: '800'},
    {iso2: 'UA', iso3: 'UKR', num: '804'},
    {iso2: 'AE', iso3: 'ARE', num: '784'},
    {iso2: 'GB', iso3: 'GBR', num: '826'},
    {iso2: 'US', iso3: 'USA', num: '840'},
    {iso2: 'UM', iso3: 'UMI', num: '581'},
    {iso2: 'UY', iso3: 'URY', num: '858'},
    {iso2: 'UZ', iso3: 'UZB', num: '860'},
    {iso2: 'VU', iso3: 'VUT', num: '548'},
    {iso2: 'VE', iso3: 'VEN', num: '862'},
    {iso2: 'VN', iso3: 'VNM', num: '704'},
    {iso2: 'VI', iso3: 'VIR', num: '850'},
    {iso2: 'WF', iso3: 'WLF', num: '876'},
    {iso2: 'EH', iso3: 'ESH', num: '732'},
    {iso2: 'YE', iso3: 'YEM', num: '887'},
    {iso2: 'ZM', iso3: 'ZMB', num: '894'},
    {iso2: 'ZW', iso3: 'ZWE', num: '716'}
]
if(typeof Object.freeze === 'function') Object.freeze(isoCodes) // lock the object to minimize accidental changes

var i;
var isoCodesLength = isoCodes.length;

//@formatter:off

var iso2RegExp      = /^[A-Z][A-Z]$/i;
var iso3RegExp      = /^[A-Z][A-Z][A-Z]$/i;
var numRegExp       = /^[0-9][0-9][0-9]$/i;

var ISO_TYPE_ISO2   = 'iso2';
var ISO_TYPE_ISO3   = 'iso3';
var ISO_TYPE_NUM    = 'num';

//@formatter:on

function CountryIsoConverter() {

    var _this = this;

    _this.isIso2 = function (iso) {
        return (getIsoType(iso) === ISO_TYPE_ISO2);
    }
    _this.isIso3 = function (iso) {
        return (getIsoType(iso) === ISO_TYPE_ISO3);
    }
    _this.isNum = function (iso) {
        return (getIsoType(iso) === ISO_TYPE_NUM);
    }

    _this.iso2 = function (iso) {
        if(!iso || _this.isIso2(iso)) return iso;
        return getIso(iso, ISO_TYPE_ISO2);
    }
    _this.iso3 = function (iso) {
        if(!iso || _this.isIso3(iso)) return iso;
        return getIso(iso, ISO_TYPE_ISO2);
    }
    _this.num = function (iso) {
        if(!iso || _this.isNum(iso)) return iso;
        return getIso(iso, ISO_TYPE_ISO2);
    }

    function getIso(iso, type) {

        var currentType = getIsoType(iso);
        if(!currentType) return null;

        for (i = 0; i < isoCodesLength; i++) if(isoCodes[i][currentType] === iso) return isoCodes[i][type];

        return null;
    }

    function getIsoType(iso) {

        if(iso2RegExp.test(iso)) return ISO_TYPE_ISO2;
        if(iso3RegExp.test(iso)) return ISO_TYPE_ISO3;
        if(numRegExp.test(iso)) return ISO_TYPE_NUM;

        return null;
    }

}


module.exports = CountryIsoConverter;