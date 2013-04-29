/**
 * 
 * Margin, Padding Shorthand
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Combines Margin/Padding shorthand directionals
 * 
 * @before:
 *     .example {
 *         margin: 3px 3px 3px 3px;
 *     }
 * 
 * @after:
 *     .example {
 *         margin: 3px;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRule({

	name: 'Margin, Padding Shorthand',
	group: 'Directionals',
	description: "Combines Margin/Padding shorthand directionals",

	callback: function( rule, branch, compressor ) {
		if ( rule.property == 'margin' || rule.property == 'padding' ) {
			// Local copies
			var before = rule.parts.slice( 0 ),
				parts = rule.parts.slice( 0 );

			// 4 Direction
			if ( parts.length === 4 ) {
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
					parts = [ parts[ 0 ], parts[ 1 ], parts[ 2 ] ];
				}
			}
			// 3 Direction
			else if ( parts.length === 3 ) {
				// '3px 3px 3px' => '3px'
				if ( parts[ 0 ] === parts[ 1 ] && parts[ 1 ] === parts[ 2 ] ) {
					parts = [ parts[ 0 ] ];
				}
				// '3px 2px 3px' => '3px 2px'
				else if ( parts[ 0 ] === parts[ 2 ] ) {
					parts = [ parts[ 0 ], parts[ 1 ] ];
				}
			}
			// 2 Direction
			// '3px 3px' => '3px'
			else if ( parts.length === 2 && parts[ 0 ] === parts[ 1 ] ) {
				parts = [ parts[ 0 ] ];
			}

			// Log combination
			if ( before.length !== parts.length ) {
				rule.parts = parts;
				compressor.log(
					"Combining directionals for '" + rule.property + "'" + 
					" '" + before.join( ' ' ) + "' => '" + parts.join( ' ' ) + "'",
					rule.position
				);
			}
		}
	}

});
