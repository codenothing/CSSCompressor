/**
 * 
 * Leading Zeroes
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes unecessary leading zeroes from values
 * 
 * @before:
 *     .example {
 *         left: 0.2px;
 *     }
 * 
 * @after:
 *     .example {
 *         left: .2px;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rzero = /^(\+|\-)?0(\.\d+)(\%|[a-z]{2})?$/i;

CSSCompressor.addValue({

	name: 'Leading Zeroes',
	group: 'Numeric',
	description: "Removes unecessary leading zeroes from values",

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

});
