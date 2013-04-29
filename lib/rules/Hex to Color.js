/**
 * 
 * Hex to Color
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts hex codes to short color names
 * 
 * @before:
 *     .example {
 *         color: #fffff0;
 *     }
 * 
 * @after:
 *     .example {
 *         color: ivory;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addValue({

	name: 'Hex to Color',
	group: 'Color',
	description: "Converts hex codes to short color names",

	callback: function( value, position, compressor ) {
		var match = CSSCompressor.tables.hex2shortcolor[ value.toLowerCase() ],
			before = value;

		if ( match ) {
			value = match;

			if ( position ) {
				compressor.log(
					"Converting hex code to short color name '" + before + "' => '" + value + "'",
					position
				);
			}

			return value;
		}
	}

});
