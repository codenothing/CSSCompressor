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

CSSCompressor.addRuleSheet({

	name: 'Strip Empty Branches',
	group: 'Trim',
	description: "Removes all branches with no rules",

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
			}
		}

		// Start with root branches
		strip( branches );
	}

});
