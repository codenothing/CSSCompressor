/**
 * 
 * Atrule URL Trim
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts at-rule one liner url's to strings
 * 
 * @before:
 *     @import url(other.css)
 * 
 * @after:
 *     @import "other.css"
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rurl = /^url\((.*?)\)$/i,
	rurls = /^url\('(.*?)'\)$/i,
	rurld = /^url\("(.*?)"\)$/i;

CSSCompressor.rule({

	name: 'Atrule URL Trim',
	type: CSSCompressor.RULE_TYPE_BLOCK,
	group: 'Misc',
	description: "Converts at-rule one liner url's to strings",

	callback: function( branch, compressor ) {
		if ( ! branch.atrule || ! branch.parts.length || ( branch.rules && branch.rules.length > 0 ) ) {
			return;
		}

		branch.parts.forEach(function( part, i ) {
			var m = rurld.exec( part ) || rurls.exec( part ) || rurl.exec( part );

			if ( m ) {
				branch.parts[ i ] = '"' + m[ 1 ] + '"';
				compressor.log(
					"Converting @import url '" + part + "' => '" + branch.parts[ i ] + "'",
					branch.position
				);
			}
		});
	}

});
