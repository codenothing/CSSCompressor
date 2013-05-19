/**
 * 
 * Trailing Zeroes
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes unecessary trailing zeroes from values
 * 
 * @before:
 *     .example {
 *         width: 5.0px;
 *     }
 * 
 * @after:
 *     .example {
 *         width: 5px;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rdecimal = /^(\+|\-)?(\d*\.[1-9]*0*)(\%|[a-z]{2})$/i,
	rleadzero = /^\-?0/;

CSSCompressor.rule({

	name: 'Trailing Zeroes',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Numeric',
	description: "Removes unecessary trailing zeroes from values",

	callback: function( value, position, compressor ) {
		var m = rdecimal.exec( value ),
			before = value,
			n;

		if ( m ) {
			// Remove possible leading zero that comes from parseFloat
			n = parseFloat( m[ 2 ] );
			if ( ( n > 0 && n < 1 ) || ( n > -1 && n < 0 ) ) {
				n = ( n + '' ).replace( rleadzero, '' );
			}

			value = ( m[ 1 ] ? m[ 1 ] : '' ) + n + ( m[ 3 ] ? m[ 3 ] : '' );
			compressor.log(
				"Removing unecesary trailing zeroes '" + before + "' => '" + value + "'",
				position
			);

			return value;
		}
	}

});
