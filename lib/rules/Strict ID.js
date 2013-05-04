/**
 * 
 * Strict ID
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Removes entire selector before last ID selector
 * 
 * @before:
 *     html body #myid div {
 *         color: red;
 *     }
 * 
 * @after:
 *     #myid div {
 *         color: red;
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor;

CSSCompressor.rule({

	name: 'Strict ID',
	type: CSSCompressor.RULE_TYPE_BLOCK,
	group: 'Selector',
	description: "Removes entire selector before last ID selector",

	callback: function( branch, compressor ) {
		if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
			return;
		}

		var commaParts = [],
			current = [],
			newCommaParts = [],
			parts = [];

		// Break selectors across commas
		branch.parts.forEach(function( part ) {
			if ( part === ',' ) {
				commaParts.push( current );
				current = [];
			}
			else {
				current.push( part );
			}
		});

		// Catch last comma
		if ( current.length ) {
			commaParts.push( current );
		}

		// Promote ID's on each selector
		commaParts.forEach(function( parts ) {
			var newparts = [], subparts = [],
				i = parts.length,
				found = false,
				part, subpart, j;

			while ( i-- ) {
				part = parts[ i ];

				if ( CSSCompressor.isArray( part ) ) {
					j = part.length;
					subparts = [];

					while ( j-- ) {
						subpart = part[ j ];
						subparts.unshift( subpart );

						if ( subpart[ 0 ] === '#' ) {
							if ( j !== 0 && i !== 0 ) {
								compressor.log(
									"Promoting nested ID to selector front",
									branch.position
								);
							}

							found = true;
							break;
						}
					}

					newparts.unshift( subparts );
					if ( found ) {
						break;
					}
				}
				else {
					newparts.unshift( part );

					if ( part[ 0 ] === '#' ) {
						if ( i !== 0 ) {
							compressor.log(
								"Promoting nested ID to selector front",
								branch.position
							);
						}

						break;
					}
				}
			}

			newCommaParts.push( newparts );
		});

		// Join the parts back together, and inject commas back in
		newCommaParts.forEach(function( a, i ) {
			parts.push.apply( parts, a );

			if ( i < newCommaParts.length - 1 ) {
				parts.push( ',' );
			}
		});

		// Update branch
		branch.parts = parts;
	}

});
