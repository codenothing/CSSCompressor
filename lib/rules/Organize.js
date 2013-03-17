var CSSCompressor = global.CSSCompressor,
	ruppercase = /[A-Z]/,
	rcharset = /^@charset$/i,
	rimport = /^@import$/i;


CSSCompressor.addRule([

	{
		name: 'Lowercase Properties',
		group: 'Organize',
		description: "Lowercases property names for better chance at compression during gzip",
		callback: function( rule, branch, compressor ) {
			if ( rule.property && ruppercase.exec( rule.property ) ) {
				compressor.log(
					"Lowercasing property '" + rule.property + "' => '" + rule.property.toLowerCase() + "'",
					rule.position
				);

				rule.property = rule.property.toLowerCase();
			}
		}
	}

]);

CSSCompressor.addRuleBlock([

	{
		name: 'Sort Properties',
		group: 'Organize',
		description: "Sorts property-values for a better chance at compression during gzip",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			var copy = branch.rules.slice( 0 );
			branch.rules.sort(function( a, b ) {
				if ( a.property && a.property.length && b.property && b.property.length ) {
					if ( a.property == b.property ) {
						if ( a.parts && a.parts.length && b.parts && b.parts.length ) {
							return a.parts.join( '' ) > b.parts.join( '' ) ? 1 : -1;
						}
						else {
							return 0;
						}
					}
					else {
						return a.property > b.property ? 1 : -1;
					}
				}
				else {
					return a.property && a.property.length ? 1 : -1;
				}
			});

			if ( ! CSSCompressor.objectsMatch( copy, branch.rules ) ) {
				compressor.rerun = true;
				compressor.log( 'Sorted rule block properties', branch.position );
			}
		}
	},

	{
		name: 'Sort Multi Selectors',
		group: 'Organize',
		description: "Sorts comma separated selectors for a better chance at compression during gzip",
		callback: function( branch, compressor ) {
			if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
				return;
			}

			var section = { selector: '', parts: [] },
				sections = [ section ],
				parts = [], compare;

			// Build out each section for reference
			branch.parts.forEach(function( part ) {
				if ( part == ',' ) {
					sections.push( section = { selector: '', parts: [] } );
				}
				else {
					if ( section.selector.length ) {
						section.selector += ' ';
					}

					section.selector += CSSCompressor.isArray( part ) ? part.join( '' ) : part;
					section.parts.push( part );
				}
			});

			// Generate a sorted comparison array to see if order has changed
			compare = sections.slice( 0 ).sort(function( a, b ) {
				if ( a.selector.length && b.selector.length ) {
					return a.selector == b.selector ? 0 :
						a.selector > b.selector ? 1 : -1;
				}
				else {
					return a.selector.length ? 1 : -1;
				}
			});

			// Order changed, apply and log
			if ( ! CSSCompressor.objectsMatch( compare, sections ) ) {
				compare.forEach(function( section, i ) {
					parts = parts.concat( section.parts );
					if ( i + 1 !== compare.length ) {
						parts.push( ',' );
					}
				});
				branch.parts = parts;
				compressor.log( 'Sorted comma separated selectors', branch.position );
			}
		}
	}

]);


CSSCompressor.addRuleSheet([

	{
		name: 'Order Atrules',
		group: 'Organize',
		description: "Moves charset and import declarations to the top of the stylesheet (to help with concatenation).",
		callback: function( branches, compressor ) {
			var imports = [], charsets = [], pos = -1;

			// Find all import and charset declarations (after the first rule filled branch)
			branches.forEach(function( branch, i ) {
				if ( pos === -1 ) {
					if ( ( branch.rules && branch.rules.length ) || ( branch.branches && branch.branches.length ) ) {
						pos = i;
					}
				}
				else if ( branch.atrule && branch.parts && branch.parts.length ) {
					if ( rcharset.exec( branch.parts[ 0 ] || '' ) ) {
						charsets.push( branch );
					}
					else if ( rimport.exec( branch.parts[ 0 ] || '' ) ) {
						imports.push( branch );
					}
				}
			});

			// Shift imports to the top
			if ( imports.length ) {
				imports.forEach(function( branch ) {
					CSSCompressor.removeItem( branches, branch );
					branches.splice( pos, 0, branch );
					compressor.log( 'Moving import to the top', branch.position );
				});
			}

			// Shift charset to the top after imports
			if ( charsets.length ) {
				charsets.forEach(function( branch ) {
					CSSCompressor.removeItem( branches, branch );
					branches.splice( pos, 0, branch );
					compressor.log( 'Moving charset to the top', branch.position );
				});
			}
		}
	}

]);
