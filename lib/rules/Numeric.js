var CSSCompressor = global.CSSCompressor,
	rdecimal = /^(\+|\-)?(\d*\.[1-9]*0*)(\%|[a-z]{2})$/i,
	rzero = /^(\+|\-)?0(\.\d+)(\%|[a-z]{2})?$/i,
	runit = /^(\+|\-)?0(\%|[a-z]{2})$/i,
	rrect = /^rect\(([^\)]+)\)$/i,
	rcomma = /,/g,
	rcalc = /^((-webkit-|-moz-)?calc)\(([^\)]+)\)$/i,
	roperator = /^\*|\/|\+|\-$/,
	rwhitespace = /\r\n|\r|\n|\t|\s/;


CSSCompressor.addValue([

	{
		name: 'Calc Units',
		group: 'Numeric',
		description: "Compresses individual units in calc function, and removes whitespace.",
		callback: function( value, position, compressor ) {
			var m = rcalc.exec( value ),
				before = value,
				prefix = ( m || [] )[ 1 ] || '',
				match = ( m || [] )[ 3 ] || '',
				string = '', parts = [],
				i = -1, l = match.length, c;

			if ( l > 0 ) {
				for ( ; ++i < l; ) {
					c = match[ i ];

					if ( c == "\\" ) {
						string += c + match[ ++i ];
					}
					else if ( c == '*' || c == '/' ) {
						parts.push( string.trim() );
						parts.push( c );
						string = '';
					}
					else if ( ( c == '-' || c == '+' ) && rwhitespace.exec( match[ i + 1 ] ) ) {
						parts.push( string.trim() );
						parts.push( c );
						string = '';
					}
					else {
						string += c;
					}
				}

				if ( string.length ) {
					parts.push( string.trim() );
				}

				// Only work if you have values
				if ( parts.length ) {
					value = prefix + '(';

					// Compress individual units
					parts.forEach(function( part ) {
						if ( ! roperator.exec( part ) ) {
							part = compressor.value( part );
						}

						if ( part == '+' || part == '-' ) {
							part = ' ' + part + ' ';
						}

						value += part;
					});

					// Mark
					value += ')';
					if ( position ) {
						compressor.log(
							"Removing unecesary trailing zeroes '" + before + "' => '" + value + "'",
							position
						);
					}

					return value;
				}
			}
		}
	},

	{
		name: 'Trailing Zeroes',
		group: 'Numeric',
		description: "Removes unecessary trailing zeroes from values.",
		callback: function( value, position, compressor ) {
			var m = rdecimal.exec( value ),
				before = value;

			if ( m ) {
				value = ( m[ 1 ] ? m[ 1 ] : '' ) + parseFloat( m[ 2 ] ) + ( m[ 3 ] ? m[ 3 ] : '' );

				if ( position ) {
					compressor.log(
						"Removing unecesary trailing zeroes '" + before + "' => '" + value + "'",
						position
					);
				}

				return value;
			}
		}
	},

	{
		name: 'Leading Zeroes',
		group: 'Numeric',
		description: "Removes unecessary leading zeroes from values.",
		callback: function( value, position, compressor ) {
			var m = rzero.exec( value ),
				before = value;

			if ( m ) {
				value = ( m[ 1 ] ? m[ 1 ] : '' ) + m[ 2 ] + ( m[ 3 ] ? m[ 3 ] : '' );

				if ( position ) {
					compressor.log(
						"Removes unecessary leading zeroes '" + before + "' => '" + value + "'",
						position
					);
				}

				return value;
			}
		}
	},

	{
		name: 'Unit Suffix',
		group: 'Numeric',
		description: "Removes unecessary suffix from zero unit values.",
		callback: function( value, position, compressor ) {
			var m = runit.exec( value ),
				before = value;

			if ( m ) {
				value = '0';

				if ( position ) {
					compressor.log(
						"Removing unecesary trailing zeroes '" + before + "' => '" + value + "'",
						position
					);
				}

				return value;
			}
		}
	},

	{
		name: 'Rect Shape',
		group: 'Numeric',
		description: "Compressing rect shape declarations",
		callback: function( value, position, compressor ) {
			var m = rrect.exec( value ) || [],
				content = m[ 1 ] || '',
				before = value,
				parts;

			if ( content.length ) {
				parts = content.split( rcomma );
				parts.forEach(function( value, index ) {
					parts[ index ] = compressor.value( value.trim(), position );
				});
				value = "rect(" + parts.join( ',' ) + ")";

				if ( value != before && position ) {
					compressor.log(
						"Removing whitespace and compressing numerics in rect shape. '" + before + "' => '" + value + "'",
						position
					);
				}

				return value;
			}
		}
	}

]);
