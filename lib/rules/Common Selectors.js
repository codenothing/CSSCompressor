/**
 * 
 * Common Selectors
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Combines rule sets with matching selectors
 * 
 * @before:
 *     .example {
 *         border: 1px dashed green;
 *     }
 *
 *     .example {
 *         cursor: pointer;
 *     }
 *
 * 
 * @after:
 *     .example {
 *         border: 1px dashed green;
 *         cursor: pointer;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleSheet({

	name: 'Common Selectors',
	group: 'Common Groupings',
	description: "Combines rule sets with matching selectors",

	callback: function( branches, compressor ) {
		var index = -1, subindex = -1, branch, next;

		for ( ; ++index < branches.length; ) {
			branch = branches[ index ];
			if ( ! branch.selector ) {
				continue;
			}

			for ( subindex = index; ++subindex < branches.length; ) {
				next = branches[ subindex ];
				if ( ! next.selector ) {
					continue;
				}

				if ( CSSCompressor.objectsMatch( branch.parts, next.parts ) ) {
					compressor.rerun = true;
					branch.rules.push.apply( branch.rules, next.rules );
					CSSCompressor.removeItem( branches, next );

					if ( next.position && branch.position ) {
						compressor.log(
							"Combining rule set on line " + next.position.start.line +
							" with ruleset on line " + branch.position.start.line +
							" as they share the same selector.",
							[ next.position, branch.position ]
						);
					}
				}
			}
		}
	}

});
