/**
 * 
 * Font Combinations
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Combines font declarations into single property
 * 
 * @before:
 *     .example {
 *         font-weight: bold;
 *         font-size: 12px;
 *         font-family: Helvetica;
 *     }
 * 
 * @after:
 *     .example {
 *         font: bold 12px Helvetica;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.rule({

	name: 'Font Combinations',
	type: CSSCompressor.RULE_TYPE_BLOCK,
	group: 'Font',
	description: "Combines font declarations into single property",

	callback: function( branch, compressor ) {
		if ( ! branch.rules || ! branch.rules.length ) {
			return;
		}

		[

			[ 'font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family' ],
			[ 'font-style', 'font-variant', 'font-weight', 'font-size', 'font-family' ],
			[ 'font-style', 'font-variant', 'font-size', 'line-height', 'font-family' ],
			[ 'font-style', 'font-variant', 'font-size', 'font-family' ],
			[ 'font-style', 'font-weight', 'font-size', 'line-height', 'font-family' ],
			[ 'font-style', 'font-weight', 'font-size', 'font-family' ],
			[ 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family' ],
			[ 'font-variant', 'font-weight', 'font-size', 'font-family' ],
			[ 'font-weight', 'font-size', 'line-height', 'font-family' ],
			[ 'font-weight', 'font-size', 'font-family' ],
			[ 'font-variant', 'font-size', 'line-height', 'font-family' ],
			[ 'font-variant', 'font-size', 'font-family' ],
			[ 'font-style', 'font-size', 'line-height', 'font-family' ],
			[ 'font-style', 'font-size', 'font-family' ],
			[ 'font-size', 'line-height', 'font-family' ],
			[ 'font-size', 'font-family' ]

		].forEach(function( graph ) {
			var used = [],
				hash = {},
				first = null,
				parts = [],
				newparts = [],
				fsi = -1,
				lhi = -1;

			branch.rules.forEach(function( rule ) {
				if ( graph.indexOf( rule.property ) !== -1 ) {
					used.push( rule );
					hash[ rule.property ] = rule;
				}
				else if ( rule.property == 'font' ) {
					hash[ rule.property ] = true;
				}
			});

			if ( ! hash.font && CSSCompressor.keysInHash( graph, hash ) ) {
				parts = new Array( graph.length );
				first = used[ 0 ];

				used.forEach(function( rule ) {
					parts[ graph.indexOf( rule.property ) ] = rule.parts.length > 1 ? rule.parts : rule.parts[ 0 ];

					// Log the compression
					if ( rule !== first && rule.position && first.position ) {
						compressor.log(
							"Combining '" + rule.property + "' on line " + rule.position.start.line +
							" with '" + first.property + "' on line " + first.position.start.line,
							[ rule.position, first.position ]
						);
					}
				});

				// Handle font-size/line-height combination
				fsi = graph.indexOf( 'font-size' );
				lhi = graph.indexOf( 'line-height' );
				if ( fsi > -1 && lhi == fsi + 1 ) {
					parts[ fsi ] = [ parts[ fsi ], '/', parts[ lhi ] ];
					parts.splice( lhi, 1 );
				}

				// Expand out any nested arrays in the parts
				parts.forEach(function( part ) {
					if ( CSSCompressor.isArray( part ) ) {
						newparts.push.apply( newparts, part );
					}
					else {
						newparts.push( part );
					}
				});

				// Override first property
				first.property = 'font';
				first.parts = newparts;
				used.shift();
				CSSCompressor.removeItems( branch.rules, used );
			}
		});
	}

});
