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

var CSSCompressor = global.CSSCompressor,
	table = CSSCompressor.tables[ 'Hex to Safe Color' ] = {
		"#808080": "gray",
		"#008000": "green",
		"#800000": "maroon",
		"#000080": "navy",
		"#808000": "olive",
		"#ff0000": "red",
		"#c0c0c0": "silver",
		"#008080": "teal",
		"#f00": "red"
	};

CSSCompressor.rule({

	name: 'Hex to Safe Color',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Color',
	description: "Converts hex codes to short safe color names",
	priority: CSSCompressor.PRIORITY_LOWER,

	callback: function( value, position, compressor ) {
		var match = table[ value.toLowerCase() ];

		if ( match ) {
			compressor.log(
				"Converting hex code to short safe color name '" + value + "' => '" + match + "'",
				position
			);

			return match;
		}
	}

});
