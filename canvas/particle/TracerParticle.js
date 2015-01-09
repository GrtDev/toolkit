/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

var inherits = require('../../utils/inherits');
var CoreParticle = require('./CoreParticle');
var GeomUtils = require('../../geom/geomUtils');


//TODO Fix comments

inherits(TracerParticle, CoreParticle);

/**
 * @see CoreParticle
 * @constructor
 * @extends CoreParticle
 */
function TracerParticle(opt_params) {

    opt_params = opt_params || {};

    var _this = this;
    var _length = opt_params.length || 200;

    this.x = opt_params.x || 0;
    this.y = opt_params.y || 0;
    this.size = opt_params.size || 5;
    this.direction = opt_params.direction || 0; // in radians

    this.numJoints = opt_params.numJoints || Math.round(_length/ (this.size * 4));
    this.joints = [];
    this.maxJointDistance = _length / this.numJoints;
    this.minJointSize = opt_params.minJointSize || 1;
    this.stiffness = opt_params.stiffness || .2;
    this.maxDirectionChange = opt_params.maxDirectionChange || 15 * Math.PI / 180;
    this.directionChange = 0;

    // set up the joints
    for (var i = 0; i < this.numJoints; i++) this.joints[i] = new Joint(this.x, this.y, this.direction, this.size);

    TracerParticle.super_.call(this, opt_params);

    this.updateJoints();


     Object.defineProperty(this, 'length', {
          get: function() {
              return _length;
          },
          set: function(value) {
              _length = value;
              _this.maxJointDistance = _length / this.numJoints;
          }
     });

}

/**
 * Updates direction of the particle and abides by the maxDirectionChange value
 * @function updateDirection
 * @param newDirection
 */
TracerParticle.prototype.updateDirection = function (newDirection) {

    var change = geomUtils.differenceAngle(this.direction, newDirection);
    if (change > this.maxDirectionChange) change = this.maxDirectionChange;
    this.direction -= change;

}

/**
 * @function updateJoints
 */
TracerParticle.prototype.updateJoints = function () {
    var trim = (this.size - this.minJointSize) / this.numJoints;
    for (var i = 0; i < this.numJoints; i++) {
        var joint = this.joints[i];
        joint.x = this.x;
        joint.y = this.y;
        joint.direction = this.direction;
        joint.size = this.size - trim * (i + 1);
    }
}
/**
 * @function updateJointSize
 */
TracerParticle.prototype.updateSize = function () {
    var trim = (this.size - this.minJointSize) / this.numJoints;
    for (var i = 0; i < this.numJoints; i++) {
        var joint = this.joints[i].size = this.size - trim * (i + 1);
    }
}



/**
 * @see CoreParticle.update
 */
TracerParticle.prototype.update = function (time) {

    TracerParticle.super_.prototype.update.call(this, time);

    // update all the joints to keep it moving
    this.direction += this.directionChange;
    var leader = this;
    for (var i = 0; i < this.numJoints; i++) {

        var follower = this.joints[i]; // Joint

        var distance = geomUtils.distance(leader.x, leader.y, follower.x, follower.y);
        if (distance <= this.maxJointDistance) break; // followers will not be further either..

        var angleToFollower = geomUtils.angle(leader.x, leader.y, follower.x, follower.y);
        var angleDifference = geomUtils.differenceAngle(leader.direction - Math.PI, angleToFollower);
        var newPosition = geomUtils.polar(this.maxJointDistance, (angleToFollower + angleDifference * this.stiffness), leader.x, leader.y);

        follower.x = newPosition.x;
        follower.y = newPosition.y;

        var backOfLeader = geomUtils.polar(this.maxJointDistance / 2, leader.direction - Math.PI, leader.x, leader.y);
        var angleToBack = geomUtils.angle(follower.x, follower.y, backOfLeader.x, backOfLeader.y);
        angleDifference = geomUtils.differenceAngle(follower.direction, angleToBack);

        follower.direction = follower.direction - angleDifference;

        leader = follower // followers become leaders..
    }


}


/**
 * @see CoreParticle.draw
 */
TracerParticle.prototype.draw = function (context) {

    var distance, cp1, cp2;
    var followerLeftX, followerLeftY;
    var followerRightX, followerRightY;

    var leader = this;
    var follower;

    var leaderRightX = leader.x + Math.cos(leader.direction + Math.PI / 2) * leader.size / 2; // leader right side
    var leaderRightY = leader.y + Math.sin(leader.direction + Math.PI / 2) * leader.size / 2;

    var leaderLeftX = leader.x + Math.cos(leader.direction - Math.PI / 2) * leader.size / 2; // leader left side
    var leaderLeftY = leader.y + Math.sin(leader.direction - Math.PI / 2) * leader.size / 2;

    // in drawing order, starting with leader coords followed with the rest:
    // [ cp1.x, cp1.y, cp2.x, cp2.y, followRightX, followRightY, cp1.x, cp1.y, cp2.x, cp2.y, leaderLeftX, leaderLeftY]
    var coords = [leaderLeftX, leaderLeftY, leaderRightX, leaderRightY];

    for (var i = 0, leni = this.numJoints; i < leni; i++) {
        follower = this.joints[i];

        followerRightX = follower.x + Math.cos(follower.direction + Math.PI / 2) * follower.size / 2; // follower right side
        followerRightY = follower.y + Math.sin(follower.direction + Math.PI / 2) * follower.size / 2;

        followerLeftX = follower.x + Math.cos(follower.direction - Math.PI / 2) * follower.size / 2;  // follower left side
        followerLeftY = follower.y + Math.sin(follower.direction - Math.PI / 2) * follower.size / 2;

        // calculate the bezier control points
        distance = geomUtils.distance(leaderRightX, leaderRightY, followerRightX, followerRightY);
        cp1 = geomUtils.polar(distance / 3, leader.direction - Math.PI, leaderRightX, leaderRightY);
        cp2 = geomUtils.polar(distance / 3, follower.direction, followerRightX, followerRightY);
        coords.push(cp1.x, cp1.y, cp2.x, cp2.y);
        coords.push(followerRightX, followerRightY);

        // calculate the bezier control points
        distance = geomUtils.distance(followerLeftX, followerLeftY, leaderLeftX, leaderLeftY);
        cp1 = geomUtils.polar(distance / 3, follower.direction, followerLeftX, followerLeftY);
        cp2 = geomUtils.polar(distance / 3, leader.direction - Math.PI, leaderLeftX, leaderLeftY);
        coords.push(cp1.x, cp1.y, cp2.x, cp2.y);
        coords.push(leaderLeftX, leaderLeftY);


        leader = follower; // follower becomes the leader
        leaderRightX = followerRightX;
        leaderRightY = followerRightY;
        leaderLeftX = followerLeftX;
        leaderLeftY = followerLeftY;
    }

    // lets start drawing!
    context.fillStyle = "rgba(" + this.color + ", " + this.opacity + ")";
    context.beginPath();

    // draw the leader
    context.moveTo(this.x, this.y);
    context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);

    // fill joints
    for (var i = 0; i < this.numJoints; i++) {
        var joint = this.joints[i];
        context.moveTo(joint.x, joint.y);
        context.arc(joint.x, joint.y, joint.size / 2, 0, Math.PI * 2);
    }

    // draw shape
    context.moveTo(coords[0], coords[1]); // leader left
    context.lineTo(coords[2], coords[3]); // leader right

    //coords: [ cp1.x, cp1.y, cp2.x, cp2.y, followRightX, followRightY, cp1.x, cp1.y, cp2.x, cp2.y, leaderLeftX, leaderLeftY]
    for (var i = 4, leni = coords.length; i < leni; i += 12) {
        context.bezierCurveTo(coords[i], coords[i + 1], coords[i + 2], coords[i + 3], coords[i + 4], coords[i + 5]);
    }
    context.lineTo(followerLeftX, followerLeftY); // move to other side
    for (i = leni - 1; i > 4; i -= 12) {  // jump back through the curves
        context.bezierCurveTo(coords[i - 5], coords[i - 4], coords[i - 3], coords[i - 2], coords[i - 1], coords[i]);
    }

    context.fill();
    context.closePath();
}


/**
 * @see CoreParticle.draw
 */
TracerParticle.prototype.updateBoundingRect = function () {

    var left = this.x - this.size/2;
    var right = this.x + this.size/2;
    var top = this.y - this.size/2;
    var bottom = this.y + this.size/2;

    for (var i = 0; i < this.numJoints; i++) {

        var joint = this.joints[i]; // Joint

        if (left > joint.x - joint.size/2) left = joint.x - joint.size/2;
        if (right < joint.x + joint.size/2) right = joint.x + joint.size/2;
        if (top > joint.y - joint.size/2) top = joint.y - joint.size/2;
        if (bottom < joint.y + joint.size/2) bottom = joint.y + joint.size/2;

    }

    this.boundingRect.x = left;
    this.boundingRect.y = top;
    this.boundingRect.width = right - left;
    this.boundingRect.height = bottom - top;
}

module.exports = TracerParticle;


/**
 * Small class to keep information on the tracer points
 * @param x
 * @param y
 * @param direction
 * @param size
 * @constructor
 */
function Joint(x, y, direction, size) {
    this.x = x || 0;
    this.y = y || 0;
    this.direction = direction || 0;
    this.size = size || 5;
}