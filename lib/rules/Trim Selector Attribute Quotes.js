/**
 * 
 * Trim Selector Attribute Quotes
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Remove attribute quotes when they are not needed
 * 
 * @before:
 *     .example[attr='nospace'] {
 *         color: red;
 *     }
 * 
 * @after:
 *     .example[attr=nospace] {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rattr = /^\[([a-z]+[^=]?)=('|")([a-z0-9_]+)('|")\]$/i;

CSSCompressor.addRuleBlock({

	name: 'Trim Selector Attribute Quotes',
	group: 'Selector',
	description: "Remove attribute quotes when they are not needed",

	callback: function( branch, compressor ) {
		if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
			return;
		}

		var newparts = [];
		branch.parts.forEach(function( part ) {
			var newsubs = [], old = part, m;

			if ( CSSCompressor.isArray( part ) ) {
				part.forEach(function( subpart ) {
					if ( ( m = rattr.exec( subpart ) ) && m[ 2 ] == m[ 4 ] ) {
						old = subpart;
						subpart = "[" + m[ 1 ] + "=" + m[ 3 ] + "]";

						if ( branch.position ) {
							compressor.log(
								"Removing quotes around attribute '" + old + "' => '" + subpart + "'",
								branch.position
							);
						}
					}

					newsubs.push( subpart );
				});

				newparts.push( newsubs );
			}
			else {
				if ( ( m = rattr.exec( part ) ) && m[ 2 ] == m[ 4 ] ) {
					part = "[" + m[ 1 ] + "=" + m[ 3 ] + "]";

					if ( branch.position ) {
						compressor.log(
							"Removing quotes around attribute '" + old + "' => '" + part + "'",
							branch.position
						);
					}
				}

				newparts.push( part );
			}
		});

		// Update branch
		branch.parts = newparts;
	}

});
