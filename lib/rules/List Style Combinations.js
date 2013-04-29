/**
 * 
 * List Style Combinations
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Combines list-style properties into their shorter alternative
 * 
 * @before:
 *     .example {
 *         list-style-type: square;
 *         list-style-position: outside;
 *         list-style-image: none;
 *     }
 * 
 * @after:
 *     .example {
 *         list-style: square outside none;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleBlock({

	name: 'List Style Combinations',
	group: 'List',
	description: "Combines list-style properties into their shorter alternative",

	callback: function( branch, compressor ) {
		if ( ! branch.rules || ! branch.rules.length ) {
			return;
		}

		// Locals
		var used = [],
			hash = {},
			parts = [],
			matchKeys = [
				'list-style-type',
				'list-style-position',
				'list-style-image'
			];

		// Build up used properties
		branch.rules.forEach(function( rule ) {
			if ( ( rule.property == 'list-style' || matchKeys.indexOf( rule.property ) > -1 ) && rule.parts.length ) {
				hash[ rule.property ] = rule;
				used.push( rule );
			}
		});

		// Can-not safely combine into list-style, need sane ordering logic
		if ( ! hash[ 'list-style' ] && CSSCompressor.keysInHash( matchKeys, hash ) ) {
			parts = [ 'none', '', '' ];
			first = used[ 0 ];

			used.forEach(function( rule ) {
				if ( rule.property == 'list-style' ) {
					if ( rule.parts.length === 3 ) {
						parts = rule.parts;
					}
					else if ( rule.parts.length === 1 && rule.parts[ 0 ].toLowerCase() == 'none' ) {
						parts = [ 'none', '', '' ];
					}
				}
				else if ( rule.property == 'list-style-type' ) {
					parts[ 0 ] = rule.parts[ 0 ];
				}
				else if ( rule.property == 'list-style-position' ) {
					parts[ 1 ] = rule.parts[ 0 ];
				}
				else if ( rule.property == 'list-style-image' ) {
					parts[ 2 ] = rule.parts[ 0 ];
				}

				// Log each conversion
				if ( rule !== first && rule.position && first.position ) {
					compressor.log(
						"Combining '" + rule.property + "' on line " + rule.position.start.line +
						" with '" + first.property + "' on line " + first.position.start.line,
						[ rule.position, first.position ]
					);
				}
			});

			// Override the first property
			first.property = 'list-style';
			first.parts = parts;
			used.shift();
			CSSCompressor.removeItems( branch.rules, used );
		}
	}

});
