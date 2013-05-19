/**
 * 
 * URL Trim
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes quotes around url wrappers
 * 
 * @before:
 *     .example {
 *         background-image: url("http://www.google.com/image.png");
 *     }
 * 
 * @after:
 *     .example {
 *         background-image: url(http://www.google.com/image.png);
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rurls = /^url\('(.*?)'\)$/i,
	rurld = /^url\("(.*?)"\)$/i;

CSSCompressor.rule({

	name: 'URL Trim',
	type: CSSCompressor.RULE_TYPE_RULE,
	group: 'Misc',
	description: "Removes quotes around url wrappers",

	callback: function( rule, block, compressor ) {
		rule.parts.forEach(function( part, index ) {
			var m = rurls.exec( part ) || rurld.exec( part );
			if ( m ) {
				compressor.log(
					"Trimming url '" + part + "' => 'url(" + m[ 1 ] + ")'",
					rule.position
				);

				rule.parts[ index ] = "url(" + m[ 1 ] + ")";
			}
		});
	}

});
