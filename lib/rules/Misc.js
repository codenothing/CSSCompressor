var CSSCompressor = global.CSSCompressor,
	rnoneprop = /^(border|background|border-(top|right|bottom|left))$/i,
	rurl = /^url\((.*?)\)$/i,
	rurls = /^url\('(.*?)'\)$/i,
	rurld = /^url\("(.*?)"\)$/i,
	rgradient = /^([\-a-z]*)gradient(\s*)\(/i;


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
	},

	{
		name: 'Gradient Compression',
		group: 'Misc',
		description: "Breaks down gradient properties and runs compressions on individual parts",
		callback: function( rule, block, compressor ) {
			var newparts = [];

			rule.parts.forEach(function( part ) {
				var m = rgradient.exec( part ),
					subparts = [], str = '', seek = null, sparts;

				if ( m ) {
					part.split( '' ).forEach(function( c ) {
						if ( ! subparts.length ) {
							str += c;

							if ( c == '(' ) {
								subparts.push( str );
								str = '';
							}
						}
						else if ( seek !== null ) {
							str += c;

							if ( c == seek ) {
								seek = null;
							}
						}
						else if ( c == '(' || c == '"' || c == "'" ) {
							str += c;
							seek = c == '(' ? ')' : c;
						}
						else if ( c == ')' || c == ',' ) {
							if ( str.indexOf( '(' ) > -1 ) {
								subparts.push( str.trim() );
							}
							else if ( str.indexOf( ' ' ) > -1 ) {
								sparts = [];
								str.split( ' ' ).forEach(function( spart ) {
									sparts.push( compressor.value( spart.trim(), rule.position ) );
								});

								subparts.push( sparts.join( ' ' ).trim() );
							}
							else {
								subparts.push( compressor.value( str.trim(), rule.position ) );
							}

							subparts.push( c );
							str = '';
						}
						else {
							str += c;
						}
					});

					newparts.push( subparts.join( '' ).trim() );
					compressor.log(
						"Trimming gradient value",
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