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
	StringIterator = CSSCompressor.StringIterator,
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
			iter = new StringIterator( ( m || [] )[ 3 ] || '' ),
			string = '', parts = [];

		if ( iter.length > 0 ) {
			iter.each(function( c ) {
				if ( c == "\\" ) {
					string += c + iter.skip();
				}
				else if ( c == '*' || c == '/' ) {
					parts.push( string.trim() );
					parts.push( c );
					string = '';
				}
				else if ( ( c == '-' || c == '+' ) && rwhitespace.exec( iter.next ) ) {
					parts.push( string.trim() );
					parts.push( c );
					string = '';
				}
				else {
					string += c;
				}
			});

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
