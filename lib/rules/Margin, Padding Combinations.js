/**
 * 
 * Margin, Padding Combinations
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Combines margin/padding directionals into a single property
 * 
 * @before:
 *     .example {
 *         margin-top: 5px;
 *         margin-right: 5px;
 *         margin-bottom: 5px;
 *         margin-top: 5px;
 *     }
 * 
 * @after:
 *     .example {
 *         margin: 5px;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.rule({

	name: 'Margin, Padding Combinations',
	type: CSSCompressor.RULE_TYPE_BLOCK,
	group: 'Directionals',
	description: "Combines margin/padding directionals into a single property",

	callback: function( branch, compressor ) {
		if ( ! branch.rules || ! branch.rules.length ) {
			return;
		}

		// Both margin and padding work the same way
		[ 'margin', 'padding' ].forEach(function( prop ) {
			var hash = {},
				used = [],
				parts = [],
				first = null,
				ptop = prop + '-top',
				pright = prop + '-right',
				pbottom = prop + '-bottom',
				pleft = prop + '-left',
				matchKeys = [
					ptop,
					pright,
					pbottom,
					pleft
				];

			// Build hash table of directionals
			branch.rules.forEach(function( rule ) {
				if ( rule.property.indexOf( prop ) === 0 ) {
					used.push( rule );
					hash[ rule.property ] = rule;
				}
			});

			// Either all four directionals have to exist, or the shorthand property has to exist
			if ( ( hash[ prop ] && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
				parts = [ '0', '0', '0', '0' ];
				first = used[ 0 ];

				// Override directionals in order that they are used
				used.forEach(function( rule ) {
					if ( rule.property == prop ) {
						parts = rule.parts;

						// Handle shorted parts
						if ( parts.length === 1 ) {
							parts.push( parts[ 0 ] );
							parts.push( parts[ 0 ] );
							parts.push( parts[ 0 ] );
						}
						else if ( parts.length === 2 ) {
							parts.push( parts[ 0 ] );
							parts.push( parts[ 1 ] );
						}
						else if ( parts.length === 3 ) {
							parts.push( parts[ 1 ] );
						}
					}
					else if ( rule.property == ptop ) {
						parts[ 0 ] = rule.parts[ 0 ];
					}
					else if ( rule.property == pright ) {
						parts[ 1 ] = rule.parts[ 0 ];
					}
					else if ( rule.property == pbottom ) {
						parts[ 2 ] = rule.parts[ 0 ];
					}
					else if ( rule.property == pleft ) {
						parts[ 3 ] = rule.parts[ 0 ];
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

				// See if we can shortcut the shorthand property
				// '3px 3px 3px 3px' => '3px'
				if ( parts[ 0 ] === parts[ 1 ] && parts[ 1 ] === parts[ 2 ] && parts[ 2 ] === parts[ 3 ] ) {
					parts = [ parts[ 0 ] ];
				}
				// '3px 2px 3px 2px' => '3px 2px'
				else if ( parts [ 0 ] === parts[ 2 ] && parts[ 1 ] === parts[ 3 ] ) {
					parts = [ parts[ 0 ], parts[ 1 ] ];
				}
				// '3px 2px 1px 2px' => '3px 2px 1px'
				else if ( parts[ 1 ] === parts[ 3 ] ) {
					parts.pop();
				}

				// Override the first property
				first.property = prop;
				first.parts = parts;
				used.shift();
				CSSCompressor.removeItems( branch.rules, used );
			}
		});
	}

});
