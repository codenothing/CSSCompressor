/**
 * 
 * Duplicate Properties
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes multiply defined properties
 * 
 * @before:
 *     .example {
 *         color: red;
 *         margin: 10px;
 *         color: green;
 *     }
 *
 * 
 * @after:
 *     .example {
 *         margin: 10px;
 *         color: green;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.rule({

	name: 'Duplicate Properties',
	type: CSSCompressor.RULE_TYPE_BLOCK,
	group: 'Trim',
	description: "Removes multiply defined properties",
	priority: CSSCompressor.PRIORITY_LOWEST,

	callback: function( branch, compressor ) {
		if ( ! branch.rules || ! branch.rules.length ) {
			return;
		}

		for ( var i = -1, j, rule, next; ++i < branch.rules.length; ) {
			rule = branch.rules[ i ];

			for ( j = i; ++j < branch.rules.length; ) {
				next = branch.rules[ j ];

				if ( rule.property === next.property ) {
					compressor.log(
						"Removing duplicate property '" + rule.property + "'",
						[ rule.position, next.position ]
					);
					CSSCompressor.removeItem( branch.rules, rule );
					i--;
					break;
				}
			}
		}
	}

});
