/**
 * 
 * Calc Units
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Compresses individual units in calc function, and removes whitespace
 * 
 * @before:
 *     .example {
 *         width: calc( 100% - 10.0px );
 *     }
 * 
 * @after:
 *     .example {
 *         width: calc(100% - 10px);
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rcalc = /^((-webkit-|-moz-)?calc)\(([^\)]+)\)$/i,
	rwhitespace = /\r\n|\r|\n|\t|\s/,
	roperator = /^\*|\/|\+|\-$/;

CSSCompressor.addValue({

	name: 'Calc Units',
	group: 'Numeric',
	description: "Compresses individual units in calc function, and removes whitespace",

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

});