/**
 * 
 * HSL to Hex
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @source: Michael Jackson's formula for HSL to RGB conversion <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
 * @description: Converts HSL to Hex code
 * 
 * @before:
 *     .example {
 *         color: hsl(312,54%,68%);
 *     }
 * 
 * @after:
 *     .example {
 *         color: #d981c8;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rhsl = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*\)$/i,
	HEX = '0123456789abcdef',
	hslConversion = function( p, q, t ) {
		if ( t < 0 ) {
			t += 1;
		}

		if ( t > 1 ) {
			t -= 1;
		}

		if ( t < 1/6 ) {
			return p + ( q - p ) * 6 * t;
		}

		if ( t < 1/2 ) {
			return q;
		}

		if ( t < 2/3 ) {
			return p + ( q - p ) * ( 2/3 - t ) * 6;
		}

		return p;
	};

CSSCompressor.rule({

	name: 'HSL to Hex',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Color',
	description: "Converts HSL to Hex code",

	callback: function( value, position, compressor ) {
		var m = rhsl.exec( value ),
			str = '#',
			h, s, l,
			p, q;

		if ( m ) {
			// Pull out hsl
			h = parseInt( m[ 1 ] || '0', 10 ) / 360;
			s = parseInt( m[ 2 ] || '0', 10 ) / 100;
			l = parseInt( m[ 3 ] || '0', 10 ) / 100;

			// Ensure range is correct
			if ( h > 1 || s > 1 || l > 1 || h < 0 || s < 0 || l < 0 ) {
				return;
			}

			// Convert to rgb
			q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
			p = 2 * l - q;

			// Generate rgb format
			[

				Math.round( hslConversion( p, q, h + 1/3 ) * 255 ),
				Math.round( hslConversion( p, q, h ) * 255 ),
				Math.round( hslConversion( p, q, h - 1/3 ) * 255 )

			// Convert each rgb value to it's hex form
			].forEach(function( v){
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


			// Final hex string
			compressor.log(
				"Converting HSL to Hex code '" + value + "' => '" + str + "'",
				position
			);
			return str;
		}
	}

});
