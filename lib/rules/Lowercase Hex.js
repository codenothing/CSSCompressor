/**
 * 
 * Lowercase Hex
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Lowercases hex color values for better gzip compression
 * 
 * @before:
 *     .example {
 *         color: #ABCDEF;
 *     }
 * 
 * @after:
 *     .example {
 *         color: #abcdef;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rfullhex = /^#([0-9a-f]{6})$/i,
	rshorthex = /^#([0-9a-f]{3})$/i,
	ruppercase = /[A-Z]/;

CSSCompressor.rule({

	name: 'Lowercase Hex',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'GZIP',
	description: "Lowercases hex color values for better gzip compression",
	priority: CSSCompressor.PRIORITY_LOW,

	callback: function( value, position, compressor ) {
		if ( ( rfullhex.exec( value ) || rshorthex.exec( value ) ) && ruppercase.exec( value ) ) {
			compressor.log(
				"Lowercasing hex code '" + value + "' => '" + value.toLowerCase() + "'",
				position
			);

			return value.toLowerCase();
		}
	}

});
