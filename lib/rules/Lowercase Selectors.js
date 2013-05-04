/**
 * 
 * Lowercase Selectors
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts element selectors to lowercase
 * 
 * @before:
 *     BODY {
 *         color: red;
 *     }
 * 
 * @after:
 *     body {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	ralpha = /^[a-z]+$/i,
	ruppercase = /[A-Z]/;

CSSCompressor.rule({

	name: 'Lowercase Selectors',
	type: CSSCompressor.RULE_TYPE_BLOCK,
	group: 'Selector',
	description: "Converts element selectors to lowercase",

	callback: function( branch, compressor ) {
		if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
			return;
		}

		var newparts = [];
		branch.parts.forEach(function( part ) {
			var newsubs = [];

			if ( CSSCompressor.isArray( part ) ) {
				part.forEach(function( subpart ) {
					if ( ralpha.exec( subpart ) && ruppercase.exec( subpart ) ) {
						compressor.log(
							"Lowercasing selector '" + subpart + "' => '" + subpart.toLowerCase() + "'",
							branch.position
						);

						subpart = subpart.toLowerCase();
					}

					newsubs.push( subpart );
				});

				newparts.push( newsubs );
			}
			else {
				if ( ralpha.exec( part ) && ruppercase.exec( part ) ) {
					compressor.log(
						"Lowercasing selector '" + part + "' => '" + part.toLowerCase() + "'",
						branch.position
					);

					part = part.toLowerCase();
				}

				newparts.push( part );
			}
		});

		// Update branch
		branch.parts = newparts;
	}

});
