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

CSSCompressor.addValue({

	name: 'HSLA to HSL',
	group: 'Color',
	description: "Converts HSLA to HSL when opacity is 1",

	callback: function( value, position, compressor ) {
		var m = rhsla.exec( value ),
			before = value,
			opacity;

		if ( m && m.length > 4 && ( opacity = parseFloat( m[ 4 ] ) ) >= 1  ) {
			value = "hsl(" + m[ 1 ] + "," + m[ 2 ] + "%," + m[ 3 ] + "%)";

			if ( position ) {
				compressor.log(
					"Converting HSLA to HSL '" + before + "' => '" + value + "'",
					position
				);
			}

			return value;
		}
	}

});