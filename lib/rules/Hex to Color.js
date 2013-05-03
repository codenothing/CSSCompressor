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

var CSSCompressor = global.CSSCompressor,
	table = CSSCompressor.tables[ 'Hex to Color' ] = {
		"#f0ffff": "azure",
		"#f5f5dc": "beige",
		"#ffe4c4": "bisque",
		"#a52a2a": "brown",
		"#ff7f50": "coral",
		"#ffd700": "gold",
		"#808080": "gray",
		"#008000": "green",
		"#4b0082": "indigo",
		"#fffff0": "ivory",
		"#f0e68c": "khaki",
		"#faf0e6": "linen",
		"#800000": "maroon",
		"#000080": "navy",
		"#808000": "olive",
		"#ffa500": "orange",
		"#da70d6": "orchid",
		"#cd853f": "peru",
		"#ffc0cb": "pink",
		"#dda0dd": "plum",
		"#800080": "purple",
		"#ff0000": "red",
		"#fa8072": "salmon",
		"#a0522d": "sienna",
		"#c0c0c0": "silver",
		"#fffafa": "snow",
		"#d2b48c": "tan",
		"#008080": "teal",
		"#ff6347": "tomato",
		"#ee82ee": "violet",
		"#f5deb3": "wheat",
		"#f00": "red"
	};

CSSCompressor.addValue({

	name: 'Hex to Color',
	group: 'Color',
	description: "Converts hex codes to short color names",

	callback: function( value, position, compressor ) {
		var match = table[ value.toLowerCase() ],
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
