/**
 * 
 * Gradient Compression
 * 
 * @author: Corey Hart
 * @authorLink: http://www.codenothing.com
 * @description: Breaks down gradient properties and runs compressions on individual parts
 * 
 * @before:
 *     .example {
 *         background: linear-gradient( top, black 0%, #dddddd 100% );
 *     }
 * 
 * @after:
 *     .example {
 *         background: linear-gradient(top,#000 0%,#ddd 100%);
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rwhitespace = /\r\n|\r|\n|\t|\s/,
	rgradient = /^(([\-a-z]*)gradient)\((.*?)\)$/i;

CSSCompressor.addValue({

	name: 'Gradient Compression',
	group: 'Color',
	description: "Breaks down gradient properties and runs compressions on individual parts",

	callback: function( value, position, compressor ) {
		var m = rgradient.exec( value ),
			before = value,
			prefix = ( m || [] )[ 1 ] || '',
			match = ( m || [] )[ 3 ] || '',
			parts = [],
			i = -1, l = match.length, k, ki,
			string = '', c;

		if ( m ) {
			for ( ; ++i < l; ) {
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

			parts.push( string.trim() );
			parts.forEach(function( part, index ) {
				var subparts = [], i = -1, l = part.length, string = '', c;

				for ( ; ++i < l; ) {
					c = part[ i ];

					if ( c == "\\" ) {
						string += c + match[ ++i ];
					}
					else if ( rwhitespace.exec( c ) ) {
						subparts.push( string.trim() );
						string = '';
					}
					else if ( c == "'" || c == '"' || c == '(' ) {
						seek = c == '(' ? ')' : c;
						string += c;

						// Seek
						for ( k = i, kl = part.length; ++k < kl; ) {
							c = part[ k ];

							if ( c == "\\" ) {
								string += c + part[ ++k ];
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

				subparts.push( string.trim() );
				string = '';
				subparts.forEach(function( s ) {
					if ( string.length ) {
						string += ' ';
					}

					string += compressor.value( s, position );
				});

				parts[ index ] = string;
			});

			value = prefix + '(' + parts.join( ',' ) + ')';
			compressor.log(
				"Trimming gradient value '" + before + "' => '" + value + "'",
				position
			);

			return value;
		}
	}

});
