/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 */

// A counter to keep track of the number of maps created and to ensure unique hash IDs for the keys.
Map.__counter = 0;

/**
 * A hash map alternative for linking key-value pairs
 * @see: http://stackoverflow.com/questions/368280/javascript-hashmap-equivalent
 * @constructor
 */
function Map () {

    this.__length = 0;
    this.__hashCounter = 0;
    this.__collection = {};

    // Set a unique ID for this map
    Object.defineProperty( this, 'toolkitId', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: ('map_' + ++Map.__counter)
    } );

}

Object.defineProperty( Map.prototype, 'length', {
    enumerable: true,
    get: function () { return this.__length; }
} );

/**
 * Retrieves / creates a unique hash id for the given key.
 * Can be overwritten if necessary.
 * @param key
 * @returns {string}
 */
Map.prototype.hash = function ( key ) {

    return ( typeof key === 'object' ) ? ( key.__hash || ( key.__hash = this.id + ' object ' + this.__hashCounter++ ) ) : this.id + ' ' + ( typeof key ) + ' ' + key.toString();

}

/**
 * Returns whether the map contains a value for this key.
 * @param key {*}
 * @returns {*}
 */
Map.prototype.has = function ( key ) {

    return this.__collection[ this.hash( key ) ] !== undefined;

};


/**
 * Get the value for the given key.
 * @param key {*}
 * @returns {*}
 */
Map.prototype.get = function ( key ) {

    var item = this.__collection[ this.hash( key ) ];
    return item === undefined ? undefined : item.value;

};

/**
 * Save a key / value pair.
 * @param key {*}
 * @param value {*}
 * @returns {Map}
 */
Map.prototype.set = function ( key, value ) {

    var hash = this.hash( key );

    if( this.__collection[ hash ] === undefined ) {

        this.__collection[ hash ] = { key: key, value: value };
        this.size++;

    } else {

        this.__collection[ hash ].value = value;

    }

    return this;
};

/**
 * Delete a key / value pair from the map
 * @param key
 * @returns {Map}
 */
Map.prototype.remove = function ( key ) {

    var hash = this.hash( key );
    var item = this.__collection[ hash ];

    if( item !== undefined ) {
        this.size--;
        delete this.__collection[ hash ];
    }

    return this;
};

/**
 * Remove all key / value pairs from the map.
 * @returns {Map}
 */
Map.prototype.removeAll = function () {

    this.__collection = {};

    return this;
};


module.exports = Map;