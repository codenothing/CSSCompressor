var CSSCompressor = global.CSSCompressor,
	rvalueseparator = /^\/|,$/,
	rselectorbreak = /^[\~\+\*\,>]$/;

// Const
CSSCompressor.FORMAT_NONE = 'none';

// Tree rendering
function render( css, branches ) {
	branches.forEach(function( branch, branchIndex ) {
		var newparts = [], nextBranch = branches[ branchIndex + 1 ], selector = '';

		// Comments
		if ( branch.comment ) {
			css += branch.comment;
		}
		// Ruleset
		else if ( branch.selector ) {
			branch.parts.forEach(function( part, i ) {
				var prev = branch.parts[ i - 1 ];

				if ( selector.length && ! rselectorbreak.exec( part ) && ! rselectorbreak.exec( prev ) ) {
					selector += ' ';
				}

				selector += CSSCompressor.isArray( part ) ? part.join( '' ) : part;
			});

			// Add selector
			css += selector + "{";

			// Add rules
			branch.rules.forEach(function( rule, i ) {
				var value = '';
				rule.parts.forEach(function( part, ri ) {
					var prev = rule.parts[ ri - 1 ];
					if ( value.length && part != '!important' && ! rvalueseparator.exec( part ) && ! rvalueseparator.exec( prev ) ) {
						value += ' ';
					}

					value += part;
				});

				// Prop:val
				css += rule.property + ":" + value;

				// Skip last semi-colon
				if ( i < branch.rules.length - 1 ) {
					css += ';';
				}
			});

			// Closing brace
			css += "}";
		}
		// At rules
		else if ( branch.atrule ) {
			selector = '';
			branch.parts.forEach(function( part, i ) {
				var prev = branch.parts[ i - 1 ];

				if ( selector.length && part != ',' && prev != ',' ) {
					selector += ' ';
				}

				selector += part;
			});

			// Nested selectors
			if ( branch.branches || branch.rules ) {
				// TODO: Handle atrule selector parts
				css += selector + "{";

				// Add rules
				( branch.rules || [] ).forEach(function( rule, i ) {
					var value = '';
					rule.parts.forEach(function( part, ri ) {
						var prev = rule.parts[ ri - 1 ];
						if ( value.length && ! rvalueseparator.exec( part ) && ! rvalueseparator.exec( prev ) ) {
							value += ' ';
						}

						value += part;
					});

					// Prop:val
					css += rule.property + ":" + value;

					// Skip last semi-colon
					if ( i < branch.rules.length - 1 ) {
						css += ';';
					}
				});

				// Add nested selectors
				if ( branch.branches ) {
					css += branch.rules && branch.rules.length ? ';' : '';
					css = render( css, branch.branches );
				}

				// Closing brace
				css += "}";
			}
			// One-liners, @imports
			else {
				css += selector + ";";
			}
		}
	});

	return css;
}

// Format addition
CSSCompressor.addFormat( CSSCompressor.FORMAT_NONE, function( compressor ) {
	return render( '', compressor.branches );
});
