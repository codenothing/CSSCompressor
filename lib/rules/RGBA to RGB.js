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

CSSCompressor.addValue({

	name: 'RGBA to RGB',
	group: 'Color',
	description: "Converts RGBA to RGB when opacity is 1",
	priority: CSSCompressor.PRIORITY_HIGH,

	callback: function( value, position, compressor ) {
		var m = rrgba.exec( value ),
			before = value,
			opacity;

		if ( m && m.length > 4 && ( opacity = parseFloat( m[ 4 ] ) ) >= 1  ) {
			value = "rgb(" + m[ 1 ] + "," + m[ 2 ] + "," + m[ 3 ] + ")";

			if ( position ) {
				compressor.log(
					"Converting RGBA to RGB '" + before + "' => '" + value + "'",
					position
				);
			}

			return value;
		}
	}

});

