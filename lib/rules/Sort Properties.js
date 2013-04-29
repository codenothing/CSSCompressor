/**
 * 
 * Sort Properties
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Sorts property-values for a better chance at compression during gzip
 * 
 * @before:
 *     .example {
 *         padding: 10px;
 *         background: green;
 *         margin: 10px;
 *         color: red;
 *     }
 * 
 * @after:
 *     .example {
 *         background: green;
 *         color: red;
 *         margin: 10px;
 *         padding: 10px;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleBlock({

	name: 'Sort Properties',
	group: 'Organize',
	description: "Sorts property-values for a better chance at compression during gzip",

	callback: function( branch, compressor ) {
		if ( ! branch.rules || ! branch.rules.length ) {
			return;
		}

		var copy = branch.rules.slice( 0 );
		branch.rules.sort(function( a, b ) {
			if ( a.property && a.property.length && b.property && b.property.length ) {
				if ( a.property == b.property ) {
					if ( a.parts && a.parts.length && b.parts && b.parts.length ) {
						return a.parts.join( '' ) > b.parts.join( '' ) ? 1 : -1;
					}
					else {
						return 0;
					}
				}
				else {
					return a.property > b.property ? 1 : -1;
				}
			}
			else {
				return a.property && a.property.length ? 1 : -1;
			}
		});

		if ( ! CSSCompressor.objectsMatch( copy, branch.rules ) ) {
			compressor.rerun = true;
			compressor.log( 'Sorted rule block properties', branch.position );
		}
	}

});
