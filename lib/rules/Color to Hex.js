/**
 * 
 * Color to Hex
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts colors to shorter hex representation
 * 
 * @before:
 *     .example {
 *         color: aliceblue;
 *     }
 * 
 * @after:
 *     .example {
 *         color: #f0f8ff;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addValue({

	name: 'Color to Hex',
	group: 'Color',
	description: "Converts colors to shorter hex representation",

	callback: function( value, position, compressor ) {
		var match = CSSCompressor.tables.color2hex[ value.toLowerCase() ],
			before = value;

		if ( match ) {
			if ( position ) {
				compressor.log(
					"Converting color to short hex '" + before + "' => '" + match + "'",
					position
				);
			}

			return match;
		}
	}

});
