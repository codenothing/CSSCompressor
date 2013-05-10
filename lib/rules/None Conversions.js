/**
 * 
 * None Conversions
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts none values to zeroes for allowed properties
 * 
 * @before:
 *     .example {
 *         border: none;
 *     }
 * 
 * @after:
 *     .example {
 *         border: 0;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rnoneprop = /^(border|background|border-(top|right|bottom|left))$/i;

CSSCompressor.rule({

	name: 'None Conversions',
	type: CSSCompressor.RULE_TYPE_RULE,
	group: 'Misc',
	description: "Converts none values to zeroes for allowed properties",

	callback: function( rule, block, compressor ) {
		if ( rnoneprop.exec( rule.property ) && rule.parts.length === 1 && rule.parts[ 0 ].toLowerCase() == 'none' ) {
			compressor.log(
				"Converting color to short hex '" + rule.parts[ 0 ] + "' => '0'",
				rule.position
			);

			rule.parts = [ '0' ];
		}
	}

});
