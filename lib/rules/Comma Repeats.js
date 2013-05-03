/**
 * 
 * Comma Repeats
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes repeated selectors separated by commas
 * 
 * @before:
 *     html body, html body {
 *         color: red;
 *     }
 * 
 * @after:
 *     html body {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleBlock({

	name: 'Comma Repeats',
	group: 'Selector',
	description: "Removes repeated selectors separated by commas",

	callback: function( branch, compressor ) {
		if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
			return;
		}

		// Break selectors across commas
		var parts = [], current = [], newparts = [], i = -1, l, j;
		branch.parts.forEach(function( part ) {
			if ( part === ',' ) {
				parts.push( current );
				current = [];
			}
			else {
				current.push( part );
			}
		});

		// Catch last comma
		if ( current.length ) {
			parts.push( current );
		}

		// Skip over matching selector queries
		for ( l = parts.length; ++i < l; ) {
			for ( j = i; ++j < l; ) {
				if ( CSSCompressor.objectsMatch( parts[ i ], parts[ j ] ) ) {
					parts.splice( j, 1 );
					l = parts.length;
					j--;
				}
			}
		}


		// Join the parts back together, and inject commas back in
		parts.forEach(function( a, i ) {
			newparts.push.apply( newparts, a );

			if ( i < parts.length - 1 ) {
				newparts.push( ',' );
			}
		});

		// Update branch
		branch.parts = newparts;
	}

});