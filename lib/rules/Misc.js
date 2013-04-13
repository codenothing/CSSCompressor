var CSSCompressor = global.CSSCompressor,
	rnoneprop = /^(border|background|border-(top|right|bottom|left))$/i,
	rurl = /^url\((.*?)\)$/i,
	rurls = /^url\('(.*?)'\)$/i,
	rurld = /^url\("(.*?)"\)$/i,
	rgradient = /^([\-a-z]*)gradient(\s*)\(/i,
	rfunction = /^([a-z\-_]+)\((.*?)\)$/i;


CSSCompressor.addValue([

	{
		name: 'Function Units',
		group: 'Misc',
		description: "General whitespace removal and unit compression of css functions.",
		callback: function( value, position, compressor ) {
			var m = rfunction.exec( value ),
				string = '', c = '',
				parts = [], match, seek,
				i = -1, l,
				k, kl;

			if ( m ) {
				for ( match = m[ 2 ] || '', l = match.length; ++i < l; ) {
					c = match[ i ];

					if ( c == "\\" ) {
						string += c + match[ ++i ];
					}
					else if ( c == ',' ) {
						parts.push( string.trim() );
						string = '';
					}
					else if ( c == "'" || c == '"' || c == '(' ) {
						seek = c == '(' ? ')' : c;
						string += c;

						// Seek
						for ( k = i, kl = match.length; ++k < kl; ) {
							c = match[ k ];

							if ( c == "\\" ) {
								string += c + match[ ++k ];
							}
							else {
								string += c;

								if ( c == seek ) {
									break;
								}
							}
						}

						i = k;
					}
					else {
						string += c;
					}
				}

				// Generate new value string
				parts.push( string.trim() );
				string = m[ 1 ] + '(';
				parts.forEach(function( part, index ) {
					if ( index > 0 ) {
						string += ',';
					}

					string += compressor.value( part, position );
				});
				string += ')';

				// Log it before updating the value
				if ( position ) {
					compressor.log(
						"Trimming whitespace in grouping '" + value + "' => '" + string + "'",
						position
					);
				}

				return string;
			}
		}
	}

]);


CSSCompressor.addRule([

	{
		name: 'None Conversions',
		group: 'Misc',
		description: "Converts none values to zeroes for allowed properties.",
		callback: function( rule, block, compressor ) {
			if ( rnoneprop.exec( rule.property ) && rule.parts.length === 1 && rule.parts[ 0 ].toLowerCase() == 'none' ) {
				compressor.log(
					"Converting color to short hex '" + rule.parts[ 0 ] + "' => '0'",
					rule.position
				);

				rule.parts = [ '0' ];
			}
		}
	},

	{
		name: 'URL Trim',
		group: 'Misc',
		description: "Removes quotes around url wrappers.",
		callback: function( rule, block, compressor ) {
			var newparts = [], m;
			rule.parts.forEach(function( part ) {
				if ( ( m = rurls.exec( part ) ) || ( m = rurld.exec( part ) ) ) {
					newparts.push( "url(" + m[ 1 ] + ")" );
					compressor.log(
						"Trimming url '" + part + "' => 'url(" + m[ 1 ] + ")'",
						rule.position
					);
				}
				else {
					newparts.push( part );
				}
			});

			rule.parts = newparts;
		}
	}

]);


CSSCompressor.addRuleBlock([

	{
		name: 'Atrule URL Trim',
		group: 'Misc',
		description: "Converts at-rule one liner url's to strings.",
		callback: function( branch, compressor ) {
			if ( ! branch.atrule || ! branch.parts.length || ( branch.rules && branch.rules.length > 0 ) ) {
				return;
			}

			var parts = [ branch.parts[ 0 ] ];
			branch.parts.slice( 1 ).forEach(function( part ) {
				var m = rurld.exec( part ) || rurls.exec( part ) || rurl.exec( part );

				if ( m ) {
					parts.push( '"' + m[ 1 ] + '"' );
					compressor.log(
						"Converting @import url '" + part + "' => '\"" + m[ 1 ] + "\"'",
						branch.position
					);
				}
				else {
					parts.push( part );
				}
			});
			branch.parts = parts;
		}
	}

]);
