/**
 * 
 * Function Units
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: General whitespace removal and unit compression of css functions
 * 
 * @before:
 *     .example {
 *         background: new-rule( top, 10px, 0.5px, 15.5, foo );
 *     }
 * 
 * @after:
 *     .example {
 *         background: new-rule(top,10px,.5px,15.5,foo);
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rfunction = /^([a-z\-_]+)\((.*?)\)$/i;

CSSCompressor.rule({

	name: 'Function Units',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Misc',
	description: "General whitespace removal and unit compression of css functions",

	callback: function( value, position, compressor ) {
		var m = rfunction.exec( value ),
			string = '', c = '',
			parts = [], match, seek,
			i = -1, l,
			k, kl;

		if ( m ) {
			for ( match = m[ 2 ] || '', l = match.length; ++i < l; ) {
				c = match[ i ];

				if ( c == "\\" ) {
					string += c + match[ ++i ];
				}
				else if ( c == ',' ) {
					parts.push( string.trim() );
					string = '';
				}
				else if ( c == "'" || c == '"' || c == '(' ) {
					seek = c == '(' ? ')' : c;
					string += c;

					// Seek
					for ( k = i, kl = match.length; ++k < kl; ) {
						c = match[ k ];

						if ( c == "\\" ) {
							string += c + match[ ++k ];
						}
						else {
							string += c;

							if ( c == seek ) {
								break;
							}
						}
					}

					i = k;
				}
				else {
					string += c;
				}
			}

			// Generate new value string
			parts.push( string.trim() );
			string = m[ 1 ] + '(';
			parts.forEach(function( part, index ) {
				if ( index > 0 ) {
					string += ',';
				}

				string += compressor.value( part, position );
			});
			string += ')';

			// Log it before updating the value
			if ( position ) {
				compressor.log(
					"Trimming whitespace in grouping '" + value + "' => '" + string + "'",
					position
				);
			}

			return string;
		}
	}

});
