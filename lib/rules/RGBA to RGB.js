/**
 * 
 * RGBA to RGB
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @source: MDN #rgba <https://developer.mozilla.org/en-US/docs/CSS/color_value#rgba()>
 * @description: Converts RGBA to RGB when opacity is 1
 * 
 * @before:
 *     .example {
 *         color: rgba(214,123,214,1.0);
 *     }
 * 
 * @after:
 *     .example {
 *         color: rgb(214,123,214);
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rrgba = /^rgba\(\s*(\d{1,3}\%?)\s*,\s*(\d{1,3}\%?)\s*,\s*(\d{1,3}\%?)\s*,\s*(\d*\.?\d*)\s*\)$/i;

CSSCompressor.rule({

	name: 'RGBA to RGB',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Color',
	description: "Converts RGBA to RGB when opacity is 1",
	priority: CSSCompressor.PRIORITY_HIGH,

	callback: function( value, position, compressor ) {
		var m = rrgba.exec( value ),
			before = value,
			opacity;

		if ( m && m.length > 4 &&  parseFloat( m[ 4 ] ) >= 1  ) {
			value = "rgb(" + m[ 1 ] + "," + m[ 2 ] + "," + m[ 3 ] + ")";

			compressor.log(
				"Converting RGBA to RGB '" + before + "' => '" + value + "'",
				position
			);
			return value;
		}
	}

});

