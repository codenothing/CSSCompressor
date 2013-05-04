var CSSCompressor = global.CSSCompressor,
	rnewlinespace = /\n\s/,
	rnewline = /\r\n|\r|\n/,
	rvalueseparator = /^\/|,$/;

// Const
CSSCompressor.FORMAT_MAX = 'max';

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

			sections.forEach(function( s ) {
				newparts.push( s.join( ' ' ) );
			});

			// Add selector
			css += indent +
				newparts.join( ",\n" + indent ).replace( rnewlinespace, "\n" ).replace( rnewline, "\n" + indent ) +
				" {";

			// Add rules
			branch.rules.forEach(function( rule, i ) {
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
				css += "\n\t" + indent + rule.property + ": " + value;

				// Skip last semi colon
				if ( i < branch.rules.length - 1 ) {
					css += ';';
				}
			});

			// Closing brace
			css += "\n" + indent + "}";

			// Add two lines after each ruleset
			if ( branchIndex < branches.length - 1 ) {
				css += "\n\n";
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

				// Add selector
				css += indent + selector + " {";

				// Add rules
				branch.rules.forEach(function( rule, i ) {
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
					css += "\n\t" + indent + rule.property + ": " + value;

					// Skip last semi colon
					if ( i < branch.rules.length - 1 ) {
						css += ';';
					}
				});

				// Handle nested selectors
				if ( branch.branches ) {
					css += branch.rules.length ? ";\n\n" : "\n";
					css = render( css, branch.branches, indent + "\t" );
				}

				// Closing brace
				css += "\n" + indent + "}";

				// Add two lines after each ruleset
				if ( branchIndex < branches.length - 1 && indent.length === 0 ) {
					css += "\n\n";
				}
			}
			// One-liners, @imports
			else {
				css += indent + selector + ";\n";

				// Add extra spacing if one-liners are complete
				if ( ! nextBranch.atrule || nextBranch.branches || nextBranch.rules ) {
					css += "\n";
				}
			}
		}
	});

	return css;
}

// Format addition
CSSCompressor.addFormat( CSSCompressor.FORMAT_MAX, function( compressor ) {
	return render( '', compressor.branches );
});
