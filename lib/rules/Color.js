var CSSCompressor = global.CSSCompressor,
	rrgb = /^rgb\(\s*(\d{1,3}\%?(\s*,\s*\d{1,3}\%?\s*,\s*\d{1,3}\%?)?)\s*\)$/i,
	rfullhex = /^#([0-9a-f]{6})$/i,
	rshorthex = /^#([0-9a-f]{3})$/i,
	ruppercase = /[A-Z]/,
	HEX = '0123456789abcdef';


CSSCompressor.addValue([

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
