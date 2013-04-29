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

CSSCompressor.addRuleBlock({

	name: 'Atrule URL Trim',
	group: 'Misc',
	description: "Converts at-rule one liner url's to strings",

	callback: function( branch, compressor ) {
		if ( ! branch.atrule || ! branch.parts.length || ( branch.rules && branch.rules.length > 0 ) ) {
			return;
		}

		var parts = [ branch.parts[ 0 ] ];
		branch.parts.slice( 1 ).forEach(function( part ) {
			var m = rurld.exec( part ) || rurls.exec( part ) || rurl.exec( part );

			if ( m ) {
				parts.push( '"' + m[ 1 ] + '"' );
				compressor.log(
					"Converting @import url '" + part + "' => '\"" + m[ 1 ] + "\"'",
					branch.position
				);
			}
			else {
				parts.push( part );
			}
		});
		branch.parts = parts;
	}

});
