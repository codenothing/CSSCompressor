/**
 * 
 * Unit Suffix
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes unecessary suffix from zero unit values
 * 
 * @before:
 *     .example {
 *         margin: 0px;
 *     }
 * 
 * @after:
 *     .example {
 *         margin: 0;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	runit = /^(\+|\-)?0(\%|[a-z]{2})$/i;

CSSCompressor.addValue({

	name: 'Unit Suffix',
	group: 'Numeric',
	description: "Removes unecessary suffix from zero unit values",

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

});
