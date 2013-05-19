/**
 * 
 * ID Attribute to Selector
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Converts id attributes to id selectors
 * 
 * @before:
 *     [id='example'] {
 *         color: red;
 *     }
 * 
 * @after:
 *     #example {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	ridattr = /^\[id=('|")?([a-z0-9_\-]+)('|")?\]$/i;

CSSCompressor.rule({

	name: 'ID Attribute to Selector',
	type: CSSCompressor.RULE_TYPE_BLOCK,
	group: 'Selector',
	description: "Converts id attributes to id selectors",

	callback: function( branch, compressor ) {
		if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
			return;
		}

		branch.parts.forEach(function( part, index ) {
			var newsubs = [], m;

			if ( CSSCompressor.isArray( part ) ) {
				part.forEach(function( subpart ) {
					if ( ( m = ridattr.exec( subpart ) ) ) {
						compressor.log(
							"Converting id attribute to selector '" + subpart + "' => '#" + m[ 2 ] + "'",
							branch.position
						);

						subpart = '#' + m[ 2 ];
					}

					newsubs.push( subpart );
				});

				branch.parts[ index ] = newsubs;
			}
			else {
				if ( ( m = ridattr.exec( part ) ) ) {
					compressor.log(
						"Converting id attribute to selector '" + part + "' => '#" + m[ 2 ] + "'",
						branch.position
					);

					branch.parts[ index ] = '#' + m[ 2 ];
				}
			}
		});
	}

});
