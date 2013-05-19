/**
 * 
 * Font Family Quotes
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes quotes around font family names
 * 
 * @before:
 *     .example {
 *         font-family: "Arial Black";
 *     }
 * 
 * @after:
 *     .example {
 *         font-family: Arial Black;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rfontfamilyprop = /^font-family|font$/;

CSSCompressor.rule({

	name: 'Font Family Quotes',
	type: CSSCompressor.RULE_TYPE_RULE,
	group: 'Font',
	description: "Removes quotes around font family names",

	callback: function( rule, branch, compressor ) {
		if ( ! rfontfamilyprop.exec( rule.property ) || ! rule.parts || ! rule.parts.length ) {
			return;
		}

		rule.parts.forEach(function( part, index ) {
			if ( ( part[ 0 ] == '"' || part[ 0 ] == "'" ) && part[ 0 ] == part[ part.length - 1 ] ) {
				rule.parts[ index ] = part.substr( 1, part.length - 2 );

				compressor.log(
					"Removing font family quotes '" + part + "' => '" + rule.parts[ index ] + "'",
					rule.position
				);
			}
		});
	}

});
