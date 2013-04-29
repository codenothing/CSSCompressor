/**
 * 
 * Border Radius Shorthand
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts shorthand border radius properties
 * 
 * @before:
 *     .example {
 *         border-radius: 10px 10px 10px 10px;
 *     }
 * 
 * @after:
 *     .example {
 *         border-radius: 10px;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rshortradiusprop = /^(-webkit-|-moz-)?border-radius$/;

CSSCompressor.addRule({

	name: 'Border Radius Shorthand',
	group: 'Border Radius',
	description: "Converts shorthand border radius properties",

	callback: function( rule, branch, compressor ) {
		if ( ! rshortradiusprop.exec( rule.property ) || ! rule.parts || ! rule.parts.length ) {
			return;
		}

		// Locals
		var section = [], sections = [ section ];

		// Build up sections for compression
		rule.parts.forEach(function( part ) {
			if ( part == '/' ) {
				sections.push( section = [] );
			}
			else {
				section.push( part );
			}
		});

		// Compress both sections if possible
		sections.forEach(function( section, index ) {
			if ( ! section.length ) {
				return;
			}

			// Keep record
			var before = section.slice( 0 );

			// 4 Direction
			if ( section.length === 4 ) {
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
					section = [ section[ 0 ], section[ 1 ], section[ 2 ] ];
				}
			}
			// 3 Direction
			else if ( section.length === 3 ) {
				// '3px 3px 3px' => '3px'
				if ( section[ 0 ] === section[ 1 ] && section[ 1 ] === section[ 2 ] ) {
					section = [ section[ 0 ] ];
				}
				// '3px 2px 3px' => '3px 2px'
				else if ( section[ 0 ] === section[ 2 ] ) {
					section = [ section[ 0 ], section[ 1 ] ];
				}
			}
			// 2 Direction
			// '3px 3px' => '3px'
			else if ( section.length === 2 && section[ 0 ] === section[ 1 ] ) {
				section = [ section[ 0 ] ];
			}

			// Log combination
			if ( before.length != section.length ) {
				sections[ index ] = section;
				compressor.log(
					"Combining " + rule.property + " directionals " + 
					" '" + before.join( ' ' ) + "' => '" + section.join( ' ' ) + "'",
					rule.position
				);
			}
		});

		// Apply compression back to rule block
		if ( sections.length == 2 ) {
			rule.parts = [];
			rule.parts.push.apply( rule.parts, sections[ 0 ] );
			rule.parts.push( '/' );
			rule.parts.push.apply( rule.parts, sections[ 1 ] );
		}
		else if ( sections.length == 1 ) {
			rule.parts = sections[ 0 ];
		}
	}

});
