/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/geom
 */

/**
 * Object containing useful geometry & trigonometry functions.
 * @module sector22/geom
 * @namespace
 * @type {object}
 */
var geomUtils = {};

/**
 * Calculates the point of intersection between 2 straight lines, base on the angle and a point on the line.
 * @memberOf module:sector22/geom.geomUtils
 * @static
 * @function intersect
 * @param x1
 * @param y1
 * @param angle1
 * @param x2
 * @param y2
 * @param angle2
 * @returns {x: {number}, y: {number}} - intersection point of given vectors, can be null!
 */
var slope1, slope2, yIntercept1, yIntercept2;
geomUtils.intersect = function(x1, y1, angle1, x2, y2, angle2) {

    slope1 = Math.tan(angle1);
    slope2 = Math.tan(angle2);
    // if the slopes are equal, the lines are parallel so there is not intersection.
    // if the y intercepts are equal as well, the lines are identical.
    if(slope1 === slope2) return null;
    yIntercept1 = y1 - (slope1 * x1);
    yIntercept2 = y2 - (slope2 * x2);

    return {
        x: (yIntercept2 - yIntercept1) / (slope1 - slope2),
        y: ((slope1 * yIntercept2) - (slope2 * yIntercept1)) / (slope1 - slope2)
    };

}

/**
 * Calculates the distance between 2 points
 * @memberOf module:sector22/geom.geomUtils
 * @static
 * @function distance
 * @param x
 * @param y
 * @param x2
 * @param y2
 * @returns {number}
 */
geomUtils.distance = function(x, y, x2, y2) {
    return Math.sqrt((x -= x2) * x + (y -= y2) * y);
}

/**
 * Calculates point based on the angle and distance
 * @memberOf module:sector22/geom.geomUtils
 * @static
 * @function polar
 * @param distance {number}
 * @param angle {number}
 * @param opt_offsetX {number=0}
 * @param opt_offsetY {number=0}
 * @returns {x: {number}, y: {number}}
 */
geomUtils.polar = function(distance, angle, opt_offsetX, opt_offsetY) {
    return {x: distance * Math.cos(angle) + (opt_offsetX || 0), y: distance * Math.sin(angle) + (opt_offsetY || 0)};
}

/**
 * Calculates the angle from point 1 to point 2
 * @memberOf module:sector22/geom.geomUtils
 * @static
 * @function angle
 * @param x
 * @param y
 * @param x2
 * @param y2
 */
geomUtils.angle = function(x, y, x2, y2) {
    return Math.atan2(y2 - y, x2 - x);
}


/**
 * Calculates the smallest different between 2 angles
 * @memberOf module:sector22/geom.geomUtils
 * @function differenceAngle
 * @param angle1
 * @param angle2
 * @returns {number}
 * @link http://stackoverflow.com/questions/1878907/the-smallest-difference-between-2-angles
 */
geomUtils.differenceAngle = function(angle1, angle2) {
    var threesixty = Math.PI * 2;
    return ((((angle1 - angle2) + threesixty / 2) % threesixty + threesixty) % threesixty) - threesixty / 2;
}


Object.freeze(geomUtils) // lock the object to minimize accidental changes

module.exports = geomUtils;