/**
 * 
 * Strip Comments
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes all comments from style sheet, with the exception of comments that are prefixed with a bang '/*!'
 * 
 * @before:
 *     /*
 *         Multi Line Comment
 *     *\/
 *
 *     .example {
 *         color: red;
 *     }
 *
 * 
 * @after:
 *     .example {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rcompreserve = /^\/\*\!/;

CSSCompressor.rule({

	name: 'Strip Comments',
	type: CSSCompressor.RULE_TYPE_SHEET,
	group: 'Trim',
	description: "Removes all comments from style sheet, with the exception of comments that are prefixed with a bang '/*!'",
	priority: CSSCompressor.PRIORITY_LOWEST,

	callback: function( branches, compressor ) {
		function strip( array ) {
			for ( var i = -1, branch; ++i < array.length; ) {
				branch = array[ i ];

				if ( branch.comment && ! rcompreserve.exec( branch.comment ) ) {
					compressor.log( "Removing Comment", branch.position );
					CSSCompressor.removeItem( array, branch );
					i--;
				}
				else if ( CSSCompressor.isArray( branch.branches ) ) {
					strip( branch.branches );
				}
			}
		}
		
		// Start with root branches
		strip( branches );
	}

});
