/**
 * 
 * HSLA to HSL
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @source: MDN #rgba <https://developer.mozilla.org/en-US/docs/CSS/color_value#hsla()>
 * @description: Converts HSLA to HSL when opacity is 1
 * 
 * @before:
 *     .example {
 *         color: hsla(312,54%,68%,1);
 *     }
 * 
 * @after:
 *     .example {
 *         color: hsl(312,54%,68%);
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rhsla = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*,\s*(\d*\.?\d*)\s*\)$/i;

CSSCompressor.rule({

	name: 'HSLA to HSL',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Color',
	description: "Converts HSLA to HSL when opacity is 1",
	priority: CSSCompressor.PRIORITY_HIGH,

	callback: function( value, position, compressor ) {
		var m = rhsla.exec( value ),
			before = value;

		if ( m && m.length > 4 && parseFloat( m[ 4 ] ) >= 1  ) {
			value = "hsl(" + m[ 1 ] + "," + m[ 2 ] + "%," + m[ 3 ] + "%)";

			compressor.log(
				"Converting HSLA to HSL '" + before + "' => '" + value + "'",
				position
			);
			return value;
		}
	}

});
