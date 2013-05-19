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

CSSCompressor.rule({

	name: 'Calc Units',
	type: CSSCompressor.RULE_TYPE_VALUE,
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

			// Catch last part
			if ( string.length ) {
				parts.push( string.trim() );
			}

			// Only work if you have values
			if ( parts.length ) {
				string = prefix + '(';

				// Compress individual units
				parts.forEach(function( part ) {
					if ( ! roperator.exec( part ) ) {
						part = compressor.value( part );
					}

					if ( part == '+' || part == '-' ) {
						part = ' ' + part + ' ';
					}

					string += part;
				});

				// Finalize calc
				string += ')';

				// Only log if a change actually occured
				if ( string !== value ) {
					compressor.log(
						"Removing unecesary trailing zeroes '" + before + "' => '" + string + "'",
						position
					);

					return string;
				}
			}
		}
	}

});
