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
	rdecimal = /^(\+|\-)?(\d*\.[1-9]*0*)(\%|[a-z]{2})$/i;

CSSCompressor.addValue({

	name: 'Trailing Zeroes',
	group: 'Numeric',
	description: "Removes unecessary trailing zeroes from values",

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

});
