/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils
 */


/**
 * A pool to recycle items in.
 * @param createItemCallback {function} - Function to call to create a new item
 * @param resetItemCallback {function} - Function to call to reset an items value when it is recycled.
 * @param opt_limit {number=100} - Sets a limit for the number of items that can be created, set to -1 for no limit
 * @constructor
 */
function Pool(createItemCallback, resetItemCallback, opt_limit) {

    var _this = this;
    var _createItemCallback = createItemCallback;
    var _resetItemCallback = resetItemCallback;
    var _reserve = [];
    var _reserveLength = 0; // Cache length for speed.
    var _inUse = [];
    var _inUseLength = 0; // Cache length for speed.
    var _limit = (typeof opt_limit === 'number' && opt_limit > 0) ? opt_limit : 100;
    var _initialized = false;


    /**
     * @function init
     * @param opt_initSize {number=} - Number of initial items that will be created for the pool
     */
    _this.init = function (opt_initSize) {
        if (opt_initSize) {
            // Fill the pool with an initial number of items
            for (var i = 0; i < opt_initSize; i++) {
                _reserve.push(_createItemCallback());
                _reserveLength += 1;
            }
        }
        _initialized = true;
    }

    /**
     *  If an item is available or the limit has not been reached:
     *  it will retrieve the item not in use or create a new item, and put it onto the inUse collection
     * @function useItem
     * @param item {object} - Item that is used, can be null!
     */
    _this.useItem = function () {
        if (_reserveLength > 0) {
            var item = _reserve.pop();
            _reserveLength -= 1;
        }
        else if (!_limit || _inUseLength < _limit) {
            item = _createItemCallback();
        } else {
            return;
        }

        _inUse.push(item);
        _inUseLength += 1;

        return item;
    }


    /**
     * Removes an items that is being used and recycles it into the reserve.
     * @function recycleItem
     * @param item {object} - item to recycle, must be in the inUse collection!
     */
    _this.recycleItem = function (item) {

        var index = _inUse.indexOf(item);
        if (index < 0) {
            throw new Error('Out of bounds! Item is not in use! item: ' + item);
            return;
        }

        _inUse.splice(index, 1);
        _inUseLength -= 1;

        _resetItemCallback(item);

        _reserve.push(item);
        _reserveLength += 1;
    }

    /**
     * Useful for setting special properties on the initial pool items.
     * @returns {boolean} - whether the pool is initialized (filled the pool with the number of init items)
     * @readonly
     */
    Object.defineProperty(this, 'initialized', {
        get: function () {
            return _initialized;
        }
    });

    /**
     * @returns {number} - number of items in use
     * @readonly
     */
    Object.defineProperty(this, 'inUseLength', {
        get: function () {
            return _inUseLength;
        }
    });

    /**
     * @returns {number} - number of items in the reserve
     * @readonly
     */
    Object.defineProperty(this, 'reserveLength', {
        get: function () {
            return _reserveLength;
        }
    });

    /**
     * @returns {array} - Collection of items that are in use.
     * @readonly
     */
    Object.defineProperty(this, 'inUse', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: _inUse
    })

    /**
     * @returns {boolean} - whether an item is available or limit has not been reached yet.
     * @readonly
     */
    Object.defineProperty(this, 'itemAvailable', {
        get: function () {
            return _reserveLength > 0 || !_limit || _inUseLength < _limit;
        }
    });

}

module.exports = Pool;