/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

/**
 * @namespace
 */
var systemUtils = {};

/**
 * Checks the user agent and tries to figure out if the user is using a mobile browser.
 * NOTE: Mind you though that this technique is not fool proof!
 * @link http://detectmobilebrowsers.com/
 * @function isMobile
 * @returns {boolean}
 */
systemUtils.isMobile = function () {
    var agent = (navigator.userAgent || navigator.vendor || window.opera);
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test( agent ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ) ));
}

/**
 * Checks the user agent and tries to figure out if the user is using a mobile browser.
 * NOTE: Mind you though that this technique is not fool proof!
 * @link http://detectmobilebrowsers.com/
 * @function isTablet
 * @returns {boolean}
 */
systemUtils.isTablet = function () {
    var agent = (navigator.userAgent || navigator.vendor || window.opera);
    return (/android|ipad|playbook|silk/i.test( agent ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ) ));
}

/**
 * Attempts to figure out what browser is used via the user agent.
 * NOTE: This is not foolproof!
 * @link http://stackoverflow.com/questions/5916900/detect-version-of-browser
 * @function getBrowser
 * @returns {string}
 */
systemUtils.getBrowser = function () {
    var agent = (navigator.userAgent || navigator.vendor || window.opera);

    var version;
    var M = agent.match( /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i ) || [];

    if( /trident/i.test( M[ 1 ] ) ) {
        version = /\brv[ :]+(\d+)/g.exec( agent ) || [];
        return 'IE' + (version[ 1 ] || '');
    }
    if( M[ 1 ] === 'Chrome' ) {
        version = agent.match( /\bOPR\/(\d+)/ )
        if( version != null ) {
            return 'Opera ' + version[ 1 ];
        }
    }
    M = M[ 2 ] ? [ M[ 1 ], M[ 2 ] ] : [ navigator.appName, navigator.appVersion, '-?' ];
    if( (version = agent.match( /version\/(\d+)/i )) != null ) {
        M.splice( 1, 1, version[ 1 ] );
    }
    return M[ 0 ];
}

/**
 * Uses document mode to check if the browser is in fact, Internet Explorer (8 and above).
 * @memberOf module:sector22/system.systemUtils
 * @link http://stackoverflow.com/questions/7690676/javascript-the-best-way-to-detect-ie
 * @function isIE
 * @returns {boolean} - current browser is IE8 or above
 */
systemUtils.isIE = function () {
    return (document[ 'documentMode' ] !== undefined);
    //isIE8 = (document.documentMode === 8),
    //isIE9 = (document.documentMode === 9),
    //isIE10 = (document.documentMode === 10),
    //isIE11 = (document.documentMode === 11);
}

/**
 * Returns whether you are on a touch device,
 * Some known problems in IE10 on some desktops though...
 * @see: http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
 * @returns {boolean}
 */
systemUtils.isTouchDevice = function () {
    return ( window[ 'ontouchstart' ] !== undefined // works on most browsers
    || window[ 'onmsgesturechange' ] !== undefined ); // works on ie10
}

/**
 * @see: http://stackoverflow.com/a/16459606/3404223
 * @returns {boolean}
 */
systemUtils.isWebkit = function () {
    return ('WebkitAppearance' in document.documentElement.style);
}


if( typeof Object.freeze === 'function' ) Object.freeze( systemUtils ) // lock the object to minimize accidental changes

module.exports = systemUtils;