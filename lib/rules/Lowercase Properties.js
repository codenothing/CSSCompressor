/**
 * 
 * Lowercase Properties
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Lowercases property names for better chance at compression during gzip
 * 
 * @before:
 *     .example {
 *         COLOR: red;
 *     }
 * 
 * @after:
 *     .example {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	ruppercase = /[A-Z]/;

CSSCompressor.rule({

	name: 'Lowercase Properties',
	type: CSSCompressor.RULE_TYPE_RULE,
	group: 'Organize',
	description: "Lowercases property names for better chance at compression during gzip",

	callback: function( rule, branch, compressor ) {
		if ( rule.property && ruppercase.exec( rule.property ) ) {
			compressor.log(
				"Lowercasing property '" + rule.property + "' => '" + rule.property.toLowerCase() + "'",
				rule.position
			);

			rule.property = rule.property.toLowerCase();
		}
	}

});
