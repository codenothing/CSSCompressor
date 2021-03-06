var CSSCompressor = global.CSSCompressor,
	rnewline = /\r\n|\r|\n/,
	rvalueseparator = /^\/|,$/;

// Const
CSSCompressor.FORMAT_MIN = 'minimum';

// Tree rendering
function render( css, branches, indent ) {
	if ( indent === undefined ) {
		indent = '';
	}

	branches.forEach(function( branch, branchIndex ) {
		var section = [], sections = [ section ], newparts = [], nextBranch = branches[ branchIndex + 1 ], selector = '';

		// Comments
		if ( branch.comment ) {
			css += indent + branch.comment.replace( rnewline, "\n" + indent ) + "\n";
		}
		// Ruleset
		else if ( branch.selector ) {
			// Combine selector sections based on comma's
			branch.parts.forEach(function( part, i ) {
				if ( part === ',' ) {
					sections.push( section = [] );
					return;
				}
				else if ( CSSCompressor.isArray( part ) ) {
					part = part.join( '' );
				}

				section.push( part );
			});

			// Join sections
			sections.forEach(function( s ) {
				newparts.push( s.join( ' ' ) );
			});

			// Add selector
			css += indent + newparts.join( ', ' ) + " { ";

			// Add rules
			branch.rules.forEach(function( rule, i ) {
				if ( i > 0 ) {
					css += " ";
				}

				// Value combination
				var value = '', prev, spacing;
				rule.parts.forEach(function( part, ri ) {
					prev = rule.parts[ ri - 1 ];
					spacing = value.length &&
						! rvalueseparator.exec( part ) &&
						( ! rvalueseparator.exec( prev ) || prev == ',' );

					if ( spacing  ) {
						value += ' ';
					}

					value += part;
				});

				// Prop:val
				css += rule.property + ":" + value;

				// Skip last semi colon
				if ( i < branch.rules.length - 1 ) {
					css += ';';
				}
			});

			// Closing brace
			css += " }";

			// Add two lines after each ruleset
			if ( branchIndex < branches.length - 1 ) {
				css += "\n";
			}
		}
		// Atrules
		else if ( branch.atrule ) {
			selector = '';
			branch.parts.forEach(function( part, i ) {
				var prev = branch.parts[ i - 1 ];

				if ( selector.length && part != ',' ) {
					selector += ' ';
				}

				selector += part;
			});

			// Actual rule block
			if ( branch.branches || branch.rules ) {
				css += indent + selector + " {" + ( branch.rules && branch.branches ? "\n\t" + indent : '' );

				// Add rules
				branch.rules.forEach(function( rule, i ) {
					if ( i > 0 ) {
						css += " ";
					}

					// Value combination
					var value = '', prev, spacing;
					rule.parts.forEach(function( part, ri ) {
						prev = rule.parts[ ri - 1 ];
						spacing = value.length &&
							! rvalueseparator.exec( part ) &&
							( ! rvalueseparator.exec( prev ) || prev == ',' );

						if ( spacing  ) {
							value += ' ';
						}

						value += part;
					});

					// Prop:val
					css += rule.property + ":" + value;

					// Skip last semi colon
					if ( i < branch.rules.length - 1 ) {
						css += ';';
					}
				});

				// Handle nested selectors
				if ( branch.branches ) {
					css += branch.rules.length ? ";\n" : "\n";
					css = render( css, branch.branches, indent + "\t" );
					css += "\n";
				}

				// Closing brace
				css += "}";

				// Add two lines after each ruleset
				if ( branchIndex < branches.length - 1 && indent.length === 0 ) {
					css += "\n";
				}
			}
			// One-liners, @imports
			else {
				css += indent + selector + ";\n";
			}
		}
	});

	return css;
}

// Format addition
CSSCompressor.format( CSSCompressor.FORMAT_MIN, function( compressor ) {
	return render( '', compressor.branches );
});
