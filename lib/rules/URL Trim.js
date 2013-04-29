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

CSSCompressor.addRule({

	name: 'URL Trim',
	group: 'Misc',
	description: "Removes quotes around url wrappers",

	callback: function( rule, block, compressor ) {
		var newparts = [], m;
		rule.parts.forEach(function( part ) {
			if ( ( m = rurls.exec( part ) ) || ( m = rurld.exec( part ) ) ) {
				newparts.push( "url(" + m[ 1 ] + ")" );
				compressor.log(
					"Trimming url '" + part + "' => 'url(" + m[ 1 ] + ")'",
					rule.position
				);
			}
			else {
				newparts.push( part );
			}
		});

		rule.parts = newparts;
	}

});
