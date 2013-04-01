var CSSCompressor = global.CSSCompressor,
	rrgb = /^rgb\(\s*(\d{1,3}\%?(\s*,\s*\d{1,3}\%?\s*,\s*\d{1,3}\%?)?)\s*\)$/i,
	rrgba = /^rgba\(\s*(\d{1,3}\%?)\s*,\s*(\d{1,3}\%?)\s*,\s*(\d{1,3}\%?)\s*,\s*(\d*\.?\d*)\s*\)$/i,
	rhsl = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*\)$/i,
	rhsla = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*,\s*(\d*\.?\d*)\s*\)$/i,
	rfullhex = /^#([0-9a-f]{6})$/i,
	rshorthex = /^#([0-9a-f]{3})$/i,
	ruppercase = /[A-Z]/,
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

CSSCompressor.addValue([

	{
		name: 'RGBA to RGB',
		group: 'Color',
		description: "Converts RGBA to RGB when opacity is 1.",
		source: "https://developer.mozilla.org/en-US/docs/CSS/color_value#rgba()",
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
			}

			return value;
		}
	},

	{
		name: 'HSLA to HSL',
		group: 'Color',
		description: "Converts HSLA to HSL when opacity is 1.",
		source: "https://developer.mozilla.org/en-US/docs/CSS/color_value#hsla()",
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
			}

			return value;
		}
	},

	{
		name: 'RGB to Hex',
		group: 'Color',
		description: "Converts RGB to Hex code.",
		callback: function( value, position, compressor ) {
			var m = rrgb.exec( value ),
				before = value,
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
				CSSCompressor.each( values, function( v ) {
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


				value = str;
				if ( position ) {
					compressor.log(
						"Converting RGB to Hex code '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'HSL to Hex',
		group: 'Color',
		description: "Converts HSL to Hex code.",
		source: "http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript",
		callback: function( value, position, compressor ) {
			var m = rhsl.exec( value ),
				before = value,
				str = '#', rgb,
				h, s, l,
				r, g, b,
				q, p;

			if ( m ) {
				// Pull out hsl
				h = parseInt( m[ 1 ] || '0', 10 ) / 360;
				s = parseInt( m[ 2 ] || '0', 10 ) / 100;
				l = parseInt( m[ 3 ] || '0', 10 ) / 100;

				// Ensure range is correct
				if ( h > 1 || s > 1 || l > 1 || h < 0 || s < 0 || l < 0 ) {
					return value;
				}

				// Convert to rgb
				q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
				p = 2 * l - q;
				rgb = [
					Math.round( hslConversion( p, q, h + 1/3 ) * 255 ),
					Math.round( hslConversion( p, q, h ) * 255 ),
					Math.round( hslConversion( p, q, h - 1/3 ) * 255 )
				];

				// Convert each rgb value to it's hex form
				CSSCompressor.each( rgb, function( v ) {
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
				value = str;
				if ( position ) {
					compressor.log(
						"Converting HSL to Hex code '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Color to Hex',
		group: 'Color',
		description: "Converts colors to shorter hex representation.",
		callback: function( value, position, compressor ) {
			var match = CSSCompressor.tables.color2hex[ value.toLowerCase() ],
				before = value;

			if ( match ) {
				value = match;

				if ( position ) {
					compressor.log(
						"Converting color to short hex '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Hex to Color',
		group: 'Color',
		description: "Converts hex codes to short color names.",
		callback: function( value, position, compressor ) {
			var match = CSSCompressor.tables.hex2shortcolor[ value.toLowerCase() ],
				before = value;

			if ( match ) {
				value = match;

				if ( position ) {
					compressor.log(
						"Converting hex code to short color name '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Hex to Safe Color',
		group: 'Color',
		description: "Converts hex codes to short safe color names.",
		callback: function( value, position, compressor ) {
			var match = CSSCompressor.tables.hex2shortsafe[ value.toLowerCase() ],
				before = value;

			if ( match ) {
				value = match;

				if ( position ) {
					compressor.log(
						"Converting hex code to short safe color name '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Shrink Hex',
		group: 'Color',
		description: "Converts long hex to short hex.",
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
				}
			}

			return value;
		}
	},

	{
		name: 'Lowercase Hex',
		group: 'Color',
		description: "Lowercases hex color values for better gzip compression.",
		callback: function( value, position, compressor ) {
			if ( ( rfullhex.exec( value ) || rshorthex.exec( value ) ) && ruppercase.exec( value ) ) {
				if ( position ) {
					compressor.log(
						"Lowercasing hex code '" + value + "' => '" + value.toLowerCase() + "'",
						position
					);
				}

				value = value.toLowerCase();
			}

			return value;
		}
	}

]);
