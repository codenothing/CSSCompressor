/**
 * 
 * Order Atrules
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Moves charset and import declarations to the top of the stylesheet (to help with concatenation)
 * 
 * @before:
 *     .example {
 *         color: red;
 *     }
 *
 *     @charset 'utf-8';
 *     @import 'home.css';
 * 
 * @after:
 *     @charset 'utf-8';
 *     @import 'home.css';
 *
 *     .example {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rcharset = /^@charset$/i,
	rimport = /^@import$/i;

CSSCompressor.rule({

	name: 'Order Atrules',
	type: CSSCompressor.RULE_TYPE_SHEET,
	group: 'Selector',
	description: "Moves charset and import declarations to the top of the stylesheet (to help with concatenation)",

	callback: function( branches, compressor ) {
		var imports = [], charsets = [], pos = -1;

		// Find all import and charset declarations (after the first rule filled branch)
		branches.forEach(function( branch, i ) {
			if ( pos === -1 ) {
				if ( ( branch.rules && branch.rules.length ) || ( branch.branches && branch.branches.length ) ) {
					pos = i;
				}
			}
			else if ( branch.atrule && branch.parts && branch.parts.length ) {
				if ( rcharset.exec( branch.parts[ 0 ] || '' ) ) {
					charsets.push( branch );
				}
				else if ( rimport.exec( branch.parts[ 0 ] || '' ) ) {
					imports.push( branch );
				}
			}
		});

		// Shift imports to the top
		if ( imports.length ) {
			imports.forEach(function( branch ) {
				CSSCompressor.removeItem( branches, branch );
				branches.splice( pos, 0, branch );
				compressor.log( 'Moving import to the top', branch.position );
			});
		}

		// Shift charset to the top after imports
		if ( charsets.length ) {
			charsets.forEach(function( branch ) {
				CSSCompressor.removeItem( branches, branch );
				branches.splice( pos, 0, branch );
				compressor.log( 'Moving charset to the top', branch.position );
			});
		}
	}

});
