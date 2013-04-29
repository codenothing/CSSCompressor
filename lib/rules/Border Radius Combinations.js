/**
 * 
 * Border Radius Combinations
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Combines border radius directionals into their shorter alternative
 * 
 * @before:
 *     .example {
 *         border-top-left-radius: 10px;
 *         border-top-right-radius: 10px;
 *         border-bottom-left-radius: 10px;
 *         border-bottom-right-radius: 10px;
 *     }
 * 
 * @after:
 *     .example {
 *         border-radius: 10px;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleBlock({

	name: 'Border Radius Combinations',
	group: 'Border Radius',
	description: "Combines border radius directionals into their shorter alternative",

	callback: function( branch, compressor ) {
		if ( ! branch.rules || ! branch.rules.length ) {
			return;
		}

		[

			// CSS3
			{
				topleft: 'border-top-left-radius',
				topright: 'border-top-right-radius',
				bottomleft: 'border-bottom-left-radius',
				bottomright: 'border-bottom-right-radius',
				shorthand: 'border-radius'
			},

			// Mozilla
			{
				topleft: '-moz-border-radius-topleft',
				topright: '-moz-border-radius-topright',
				bottomleft: '-moz-border-radius-bottomleft',
				bottomright: '-moz-border-radius-bottomright',
				shorthand: '-moz-border-radius'
			},

			// Webkit
			{
				topleft: '-webkit-border-top-left-radius',
				topright: '-webkit-border-top-right-radius',
				bottomleft: '-webkit-border-bottom-left-radius',
				bottomright: '-webkit-border-bottom-right-radius',
				shorthand: '-webkit-border-radius'
			}

		].forEach(function( graph ) {
			var used = [],
				hash = {},
				sections = [ [ '0', '0', '0', '0' ], [ '0', '0', '0', '0' ] ],
				first = null,
				separator = false,
				matchKeys = [
					'topleft',
					'topright',
					'bottomright',
					'bottomleft'
				];

			// Build up the hash table for comparison
			branch.rules.forEach(function( rule ) {
				CSSCompressor.each( graph, function( property, name ) {
					if ( rule.property == property ) {
						hash[ name ] = rule;
						used.push( rule );
					}
				});
			});

			// If shorthand is used, go with it, otherwise all 4 directionals have to exist
			if ( ( hash.shorthand && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
				first = used[ 0 ];

				used.forEach(function( rule ) {
					var inner = [[]], si = false;

					// Shorthand
					if ( rule.property == graph.shorthand ) {
						rule.parts.forEach(function( part, i ) {
							if ( part == '/' ) {
								separator = si = true;
								inner.push([]);
							}
							else {
								inner[ si ? 1 : 0 ].push( part );
							}
						});

						// Expand shorthand properties so they can be used
						inner.forEach(function( parts, i ) {
							if ( parts.length === 1 ) {
								parts.push( parts[ 0 ] );
								parts.push( parts[ 0 ] );
								parts.push( parts[ 0 ] );
							}
							else if ( parts.length === 2 ) {
								parts.push( parts[ 0 ] );
								parts.push( parts[ 1 ] );
							}
							else if ( parts.length === 1 ) {
								parts.push( parts[ 1 ] );
							}

							sections[ i ] = parts;
						});
					}
					// top-left
					else if ( rule.property == graph.topleft ) {
						if ( rule.parts.length == 2 ) {
							separator = true;
							sections[ 0 ][ 0 ] = rule.parts[ 0 ];
							sections[ 1 ][ 0 ] = rule.parts[ 1 ];
						}
						else {
							sections[ 0 ][ 0 ] = rule.parts[ 0 ];
						}
					}
					// top-right
					else if ( rule.property == graph.topright ) {
						if ( rule.parts.length == 2 ) {
							separator = true;
							sections[ 0 ][ 1 ] = rule.parts[ 0 ];
							sections[ 1 ][ 1 ] = rule.parts[ 1 ];
						}
						else {
							sections[ 0 ][ 1 ] = rule.parts[ 0 ];
						}
					}
					// bottom-right
					else if ( rule.property == graph.bottomright ) {
						if ( rule.parts.length == 2 ) {
							separator = true;
							sections[ 0 ][ 2 ] = rule.parts[ 0 ];
							sections[ 1 ][ 2 ] = rule.parts[ 1 ];
						}
						else {
							sections[ 0 ][ 2 ] = rule.parts[ 0 ];
						}
					}
					// bottom-left
					else if ( rule.property == graph.bottomleft ) {
						if ( rule.parts.length == 2 ) {
							separator = true;
							sections[ 0 ][ 3 ] = rule.parts[ 0 ];
							sections[ 1 ][ 3 ] = rule.parts[ 1 ];
						}
						else {
							sections[ 0 ][ 3 ] = rule.parts[ 0 ];
						}
					}

					// Log result
					if ( rule !== first && rule.position && first.position ) {
						compressor.log(
							"Combining '" + rule.property + "' on line " + rule.position.start.line +
							" with '" + graph.shorthand + "' on line " + first.position.start.line,
							[ rule.position, first.position ]
						);
					}
				});

				// See if we can compress the directionals
				sections.forEach(function( section, i ) {
					// '3px 3px 3px 3px' => '3px'
					if ( section[ 0 ] === section[ 1 ] && section[ 1 ] === section[ 2 ] && section[ 2 ] === section[ 3 ] ) {
						section = [ section[ 0 ] ];
					}
					// '3px 2px 3px 2px' => '3px 2px'
					else if ( section [ 0 ] === section[ 2 ] && section[ 1 ] === section[ 3 ] ) {
						section = [ section[ 0 ], section[ 1 ] ];
					}
					// '3px 2px 1px 2px' => '3px 2px 1px'
					else if ( section[ 1 ] === section[ 3 ] ) {
						section.pop();
					}

					// Override section
					sections[ i ] = section;
				});

				// Override parts
				first.property = graph.shorthand;
				first.parts = sections[ 0 ];
				if ( separator ) {
					first.parts.push( '/' );
					first.parts.push.apply( first.parts, sections[ 1 ] );
				}

				// Remove all used rules
				used.shift();
				CSSCompressor.removeItems( branch.rules, used );
			}
		});
	}

});
