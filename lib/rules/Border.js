var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleBlock([

	{
		name: 'Border, Outline Style Combinations',
		group: 'Border',
		description: "Combine border & outline expanded properties into shorthand.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			// Both margin and padding work the same way
			[ 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'outline' ].forEach(function( prop ) {
				var hash = {},
					used = [],
					parts = [],
					first = null,
					pwidth = prop + '-width',
					pstyle = prop + '-style',
					pcolor = prop + '-color',
					matchKeys = [
						pwidth,
						pstyle,
						pcolor
					];

				// Build hash table of directionals
				branch.rules.forEach(function( rule ) {
					if ( rule.property == prop || matchKeys.indexOf( rule.property ) > -1 ) {
						used.push( rule );
						hash[ rule.property ] = rule;
					}
				});

				// Either all four directionals have to exist, or the shorthand property has to exist
				if ( ( hash[ prop ] && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
					parts = [ '', '', '' ];
					first = used[ 0 ];

					// Override directionals in order that they are used
					used.forEach(function( rule ) {
						if ( rule.property == prop ) {
							parts = rule.parts;
						}
						else if ( rule.property == pwidth ) {
							parts[ 0 ] = rule.parts[ 0 ];
						}
						else if ( rule.property == pstyle ) {
							parts[ 1 ] = rule.parts[ 0 ];
						}
						else if ( rule.property == pcolor ) {
							parts[ 2 ] = rule.parts[ 0 ];
						}

						// Log the compression
						if ( rule !== first && rule.position && first.position ) {
							compressor.log(
								"Combining '" + rule.property + "' on line " + rule.position.start.line +
								" with '" + first.property + "' on line " + first.position.start.line,
								[ rule.position, first.position ]
							);
						}
					});

					// Override the first property
					first.property = prop;
					first.parts = parts;
					used.shift();
					CSSCompressor.removeItems( branch.rules, used );
				}
			});
		}
	},

	{
		name: 'Border Combinations',
		group: 'Border',
		description: "Combines border directionals into single border property.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			var hash = {}, i, l, rule,
				used = [],
				parts = [],
				first = null,
				matchKeys = [
					'border-top',
					'border-right',
					'border-bottom',
					'border-left'
				];

			// Build hash table of directionals
			branch.rules.forEach(function( rule ) {
				if ( rule.property == 'border' || matchKeys.indexOf( rule.property ) > -1 ) {
					used.push( rule );
					hash[ rule.property ] = rule;
				}
			});

			// Either all four directionals have to exist, or the shorthand property has to exist
			if ( ( hash.border && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
				first = used[ 0 ];

				// All property values have to match for combination to work
				for ( i = -1, l = used.length; ++i < l; ) {
					rule = used[ i ];

					if ( ! CSSCompressor.objectsMatch( first.parts, rule.parts ) ) {
						return;
					}
				}

				// Log the compression of each rule
				used.forEach(function( rule ) {
					if ( rule !== first && rule.position && first.position ) {
						compressor.log(
							"Combining '" + rule.property + "' on line " + rule.position.start.line +
							" with '" + first.property + "' on line " + first.position.start.line,
							[ rule.position, first.position ]
						);
					}
				});

				// Override the first property
				first.property = 'border';
				used.shift();
				CSSCompressor.removeItems( branch.rules, used );
			}
		}
	}

]);
