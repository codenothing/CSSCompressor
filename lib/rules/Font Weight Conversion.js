/**
 * 
 * Font Weight Conversion
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts font weight strings to their numeric counterparts
 * 
 * @before:
 *     .example {
 *         font-weight: normal;
 *     }
 * 
 * @after:
 *     .example {
 *         font-weight: 400;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rfontweightprop = /^font-weight|font$/,
	weights = {
		normal: '400',
		bold: '700'
	};

CSSCompressor.addRule({

	name: 'Font Weight Conversion',
	group: 'Font',
	description: "Converts font weight strings to their numeric counterparts",

	callback: function( rule, branch, compressor ) {
		if ( ! rfontweightprop.exec( rule.property ) || ! rule.parts || ! rule.parts.length ) {
			return;
		}

		rule.parts.forEach(function( part, i ) {
			if ( weights[ part.toLowerCase() ] ) {
				rule.parts[ i ] = weights[ part.toLowerCase() ];

				compressor.log(
					"Compressing font weight property '" + part + "' => '" + rule.parts[ i ] + "'",
					rule.position
				);
			}
		});
	}

});
