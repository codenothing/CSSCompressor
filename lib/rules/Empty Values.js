/**
 * 
 * Empty Values
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes properties that don't have values
 * 
 * @before:
 *     .example {
 *         color: red;
 *         font-size:;
 *     }
 *
 * 
 * @after:
 *     .example {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleBlock({

	name: 'Empty Values',
	group: 'Trim',
	description: "Removes properties that don't have values.",
	priority: CSSCompressor.PRIORITY_LOWEST,

	callback: function( branch, compressor ) {
		if ( ! branch.rules || ! branch.rules.length ) {
			return;
		}

		for ( var i = -1, rule; ++i < branch.rules.length; ) {
			rule = branch.rules[ i ];

			if ( ! rule.parts.length || rule.parts.join( '' ).trim().length < 1 ) {
				compressor.log(
					"Removing empty value with property key '" + rule.property + "'",
					[ rule.position ]
				);
				CSSCompressor.removeItem( branch.rules, rule );
				i--;
			}
		}
	}

});
