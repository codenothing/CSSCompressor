/**
 * 
 * Shrink Hex
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts long hex to short hex
 * 
 * @before:
 *     .example {
 *         color: #000000;
 *     }
 * 
 * @after:
 *     .example {
 *         color: #000;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rfullhex = /^#([0-9a-f]{6})$/i;

CSSCompressor.rule({

	name: 'Shrink Hex',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Color',
	description: "Converts long hex to short hex",
	priority: CSSCompressor.PRIORITY_LOW,

	callback: function( value, position, compressor ) {
		var m = rfullhex.exec( value ),
			before = value,
			hex;

		if ( m ) {
			hex = m[ 1 ];

			// All alternating positions must match
			if ( hex[ 0 ] === hex[ 1 ] && hex[ 2 ] === hex[ 3 ] && hex[ 4 ] === hex[ 5 ] ) {
				value = '#' + hex[ 0 ] + hex[ 2 ] + hex[ 4 ];

				if ( position ) {
					compressor.log(
						"Converting long hex to short hex code '" + before + "' => '" + value + "'",
						position
					);
				}

				return value;
			}
		}
	}

});
