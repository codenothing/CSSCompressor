/**
 * 
 * RGB to Hex
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts RGB to Hex code
 * 
 * @before:
 *     .example {
 *         color: rgb(214,123,214);
 *     }
 * 
 * @after:
 *     .example {
 *         color: #d67bd6;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rrgb = /^rgb\(\s*(\d{1,3}\%?(\s*,\s*\d{1,3}\%?\s*,\s*\d{1,3}\%?)?)\s*\)$/i,
	HEX = '0123456789abcdef';

CSSCompressor.rule({

	name: 'RGB to Hex',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Color',
	description: "Converts RGB to Hex code",

	callback: function( value, position, compressor ) {
		var m = rrgb.exec( value ),
			str = '#', values;

		if ( m ) {
			// Create array of r,g,b values
			if ( m[ 1 ].indexOf( ',' ) > -1 ) {
				values = m[ 1 ].split( ',' );
			}
			else {
				values = [ m[ 1 ], m[ 1 ], m[ 1 ] ];
			}

			// Convert each value to it's hex form
			values.forEach(function( v ) {
				v = v.trim();

				// Convert entry to integer
				if ( v.indexOf( '%' ) > -1 ) {
					v = parseInt( v.substr( 0, v.length - 1 ), 10 );
					v = parseInt( ( v / 100 ) * 255, 10 );
				}
				else {
					v = parseInt( v, 10 );
				}

				// Enforce Max/Min
				if ( v > 255 ) {
					v = 255;
				}
				else if ( v < 0 ) {
					v = 0;
				}

				str += HEX[ ( v - ( v % 16 ) ) / 16 ];
				str += HEX[ v % 16 ];
			});

			// Log and convert
			compressor.log(
				"Converting RGB to Hex code '" + value + "' => '" + str + "'",
				position
			);
			return str;
		}
	}

});
