/**
 * 
 * Hex to Safe Color
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts hex codes to short safe color names
 * 
 * @before:
 *     .example {
 *         color: #000080;
 *     }
 * 
 * @after:
 *     .example {
 *         color: navy;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addValue({

	name: 'Hex to Safe Color',
	group: 'Color',
	description: "Converts hex codes to short safe color names",

	callback: function( value, position, compressor ) {
		var match = CSSCompressor.tables.hex2shortsafe[ value.toLowerCase() ],
			before = value;

		if ( match ) {
			value = match;

			if ( position ) {
				compressor.log(
					"Converting hex code to short safe color name '" + before + "' => '" + value + "'",
					position
				);
			}

			return value;
		}
	}

});
