/**
 * 
 * Sort Multi Selectors
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Sorts property-values for a better chance at compression during gzip
 * 
 * @before:
 *     span, b, div, a {
 *         color: red;
 *     }
 * 
 * @after:
 *     a, b, div, span {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleBlock({

	name: 'Sort Multi Selectors',
	group: 'Organize',
	description: "Sorts comma separated selectors for a better chance at compression during gzip",

	callback: function( branch, compressor ) {
		if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
			return;
		}

		var section = { selector: '', parts: [] },
			sections = [ section ],
			parts = [], compare;

		// Build out each section for reference
		branch.parts.forEach(function( part ) {
			if ( part == ',' ) {
				sections.push( section = { selector: '', parts: [] } );
			}
			else {
				if ( section.selector.length ) {
					section.selector += ' ';
				}

				section.selector += CSSCompressor.isArray( part ) ? part.join( '' ) : part;
				section.parts.push( part );
			}
		});

		// Generate a sorted comparison array to see if order has changed
		compare = sections.slice( 0 ).sort(function( a, b ) {
			if ( a.selector.length && b.selector.length ) {
				return a.selector == b.selector ? 0 :
					a.selector > b.selector ? 1 : -1;
			}
			else {
				return a.selector.length ? 1 : -1;
			}
		});

		// Order changed, apply and log
		if ( ! CSSCompressor.objectsMatch( compare, sections ) ) {
			compare.forEach(function( section, i ) {
				parts = parts.concat( section.parts );
				if ( i + 1 !== compare.length ) {
					parts.push( ',' );
				}
			});
			branch.parts = parts;
			compressor.log( 'Sorted comma separated selectors', branch.position );
		}
	}

});
