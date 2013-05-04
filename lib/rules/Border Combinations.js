/**
 * 
 * Border Combinations
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Combines border directionals into single border property
 * 
 * @before:
 *     .example {
 *         border-top: 1px solid red;
 *         border-left: 1px solid red;
 *         border-right: 1px solid red;
 *         border-bottom: 1px solid red;
 *     }
 * 
 * @after:
 *     .example {
 *         border: 1px solid red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.rule({

	name: 'Border Combinations',
	type: CSSCompressor.RULE_TYPE_BLOCK,
	group: 'Border',
	description: "Combines border directionals into single border property",

	callback: function( branch, compressor ) {
		if ( ! branch.rules || ! branch.rules.length ) {
			return;
		}

		var hash = {}, i, l, rule,
			used = [],
			parts = [],
			first = null,
			matchKeys = [
				'border-top',
				'border-right',
				'border-bottom',
				'border-left'
			];

		// Build hash table of directionals
		branch.rules.forEach(function( rule ) {
			if ( rule.property == 'border' || matchKeys.indexOf( rule.property ) > -1 ) {
				used.push( rule );
				hash[ rule.property ] = rule;
			}
		});

		// Either all four directionals have to exist, or the shorthand property has to exist
		if ( ( hash.border && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
			first = used[ 0 ];

			// All property values have to match for combination to work
			for ( i = -1, l = used.length; ++i < l; ) {
				rule = used[ i ];

				if ( ! CSSCompressor.objectsMatch( first.parts, rule.parts ) ) {
					return;
				}
			}

			// Log the compression of each rule
			used.forEach(function( rule ) {
				if ( rule !== first && rule.position && first.position ) {
					compressor.log(
						"Combining '" + rule.property + "' on line " + rule.position.start.line +
						" with '" + first.property + "' on line " + first.position.start.line,
						[ rule.position, first.position ]
					);
				}
			});

			// Override the first property
			first.property = 'border';
			used.shift();
			CSSCompressor.removeItems( branch.rules, used );
		}
	}

});
