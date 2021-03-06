/**
 * 
 * Strip Empty Branches
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes all branches with no rules
 * 
 * @before:
 *     .example {
 *         color: red;
 *     }
 *
 *     .example {}
 * 
 *     body {
 *         font: Helvetica;
 *     }
 * 
 * @after:
 *     .example {
 *         color: red;
 *     }
 * 
 *     body {
 *         font: Helvetica;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.rule({

	name: 'Strip Empty Branches',
	type: CSSCompressor.RULE_TYPE_SHEET,
	group: 'Trim',
	description: "Removes all branches with no rules",
	priority: CSSCompressor.PRIORITY_LOWEST,

	callback: function( branches, compressor ) {
		function strip( array ) {
			for ( var i = -1, branch; ++i < array.length; ) {
				branch = array[ i ];

				if ( branch.branches ) {
					strip( branch.branches );

					if ( ! branch.branches.length ) {
						delete branch.branches;

						if ( ! branch.rules || ! branch.rules.length ) {
							compressor.log( "Removing Empty Atrule", branch.position );
							CSSCompressor.removeItem( array, branch );
							i--;
						}
					}
				}
				else if ( branch.selector && ( ! branch.rules || ! branch.rules.length ) ) {
					compressor.log( "Removing Empty Rule Set", branch.position );
					CSSCompressor.removeItem( array, branch );
					i--;
				}
				else if ( branch.atrule && CSSCompressor.isArray( branch.rules ) && branch.rules.length === 0 ) {
					compressor.log( "Removing Empty At Rule", branch.position );
					CSSCompressor.removeItem( array, branch );
					i--;
				}
			}
		}

		// Start with root branches
		strip( branches );
	}

});
