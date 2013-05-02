var CSSCompressor = global.CSSCompressor,
	toString = Object.prototype.toString,
	Slice = Array.prototype.slice;

// Type tests
"Boolean Number String Function Array Date RegExp Object Error".split(' ').forEach(function( method ) {
	if ( method == 'Array' && Array.isArray ) {
		return ( CSSCompressor.isArray = Array.isArray );
	}
	else if ( method == 'Error' ) {
		CSSCompressor.isError = function( object ) {
			return object && ( object instanceof Error );
		};

		return;
	}

	var match = '[object ' + method + ']';
	CSSCompressor[ 'is' + method ] = function( object ) {
		return object !== undefined && object !== null && toString.call( object ) == match;
	};
});

// Object extension utility
CSSCompressor.extend = function(){
	var args = Slice.call( arguments ), i = -1, l = args.length, deep = false, target = this, name, copy;

	// Check for deep copy
	if ( CSSCompressor.isBoolean( args[ 0 ] ) ) {
		deep = args.shift();
		l = args.length;
	}

	// Check for multi object extension
	if ( l > 1 ) {
		target = args.shift();
		l = args.length;
	}

	for ( ; ++i < l; ) {
		copy = args[ i ];
		for ( name in copy ) {
			if ( deep && copy[ name ] && CSSCompressor.isArray( copy[ name ] ) ) {
				target[ name ] = CSSCompressor.extend( deep, target[ name ] || [], copy[ name ] );
			}
			else if ( deep && CSSCompressor.isObject( copy[ name ] ) ) {
				target[ name ] = CSSCompressor.extend( deep, target[ name ] || {}, copy[ name ] );
			}
			else {
				target[ name ] = copy[ name ];
			}
		}
	}

	return target;
};


// Utilities
CSSCompressor.extend({

	// Empty fn
	noop: function(){},

	// Helper tables
	tables: {},

	// Priority Defaults
	PRIORITY_HIGHEST: 0.8,
	PRIORITY_HIGHER: 0.7,
	PRIORITY_HIGH: 0.6,
	PRIORITY_DEFAULT: 0.5,
	PRIORITY_LOW: 0.4,
	PRIORITY_LOWER: 0.3,
	PRIORITY_LOWEST: 0.2,

	// Iteration utility
	each: function( items, fn ) {
		var i = -1, l = items.length;

		if ( CSSCompressor.isArray( items ) ) {
			for ( ; ++i < l; ) {
				if ( fn( items[ i ], i, items ) === false ) {
					break;
				}
			}
		}
		else {
			for ( i in items ) {
				if ( fn( items[ i ], i, items ) === false ) {
					break;
				}
			}
		}

		return items;
	},

	// Iterating array of arguments
	eachArgs: function( items, fn ) {
		var i = -1, l = items.length;

		if ( CSSCompressor.isArray( items ) ) {
			for ( ; ++i < l; ) {
				if ( CSSCompressor.isArray( items[ i ] ) && fn.apply( items[ i ], items[ i ] ) === false ) {
					break;
				}
				else if ( fn( items[ i ] ) === false ) {
					break;
				}
			}
		}
		else {
			CSSCompressor.each( items, fn );
		}

		return items;
	},

	// Object matching
	objectsMatch: function( a, b ) {
		var isArray = CSSCompressor.isArray,
			isObject = CSSCompressor.isObject,
			i;

		if ( isArray( a ) ) {
			if ( ! isArray( b ) || a.length !== b.length ) {
				return false;
			}

			i = a.length;
			while ( i-- ) {
				if ( isArray( a[ i ] ) || isObject( a[ i ] ) ) {
					if ( ! CSSCompressor.objectsMatch( a[ i ], b[ i ] ) ) {
						return false;
					}
				}
				else if ( a[ i ] !== b[ i ] ) {
					return false;
				}
			}
		}
		else if ( isObject( a ) ) {
			if ( ! isObject( b ) ) {
				return false;
			}

			for ( i in a ) {
				if ( isArray( a[ i ] ) || isObject( a[ i ] ) ) {
					if ( ! CSSCompressor.objectsMatch( a[ i ], b[ i ] ) ) {
						return false;
					}
				}
				else if ( a[ i ] !== b[ i ] ) {
					return false;
				}
			}
		}
		else if ( a !== b ) {
			return false;
		}

		return true;
	},

	// Removes item from array
	removeItem: function( array, item ) {
		if ( ! CSSCompressor.isArray( array ) ) {
			return array;
		}

		var index = array.indexOf( item );
		if ( index !== -1 ) {
			array.splice( index, 1 );
		}

		return array;
	},

	// Removes list of items from array
	removeItems: function( array, items ) {
		items.forEach(function( item ) {
			CSSCompressor.removeItem( array, item );
		});

		return array;
	},

	// Takes an array of keys and ensures they exist in the object
	keysInHash: function( array, object ) {
		var exists = true;

		if ( ! array || ! array.length ) {
			return false;
		}

		CSSCompressor.each( array, function( key ) {
			if ( ! object.hasOwnProperty( key ) ) {
				return ( exists = false );
			}
		});

		return exists;
	},

	// Utility function to shortcut creating compressor object
	compress: function( css, options ) {
		return ( new CSSCompressor( options ) ).compress( css );
	}

});
