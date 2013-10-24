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
	StringIterator = CSSCompressor.StringIterator,
	rwhitespace = /\r\n|\r|\n|\t|\s/,
	rgradient = /^(([\-a-z]*)gradient)\((.*?)\)$/i;

CSSCompressor.rule({

	name: 'Gradient Compression',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Color',
	description: "Breaks down gradient properties and runs compressions on individual parts",

	callback: function( value, position, compressor ) {
		var m = rgradient.exec( value ),
			before = value,
			prefix = ( m || [] )[ 1 ] || '',
			iter = new StringIterator( ( m || [] )[ 3 ] || '' ),
			parts = [],
			string = '';

		if ( iter.length ) {
			iter.each(function( c ) {
				if ( c == "\\" ) {
					string += c + iter.skip();
				}
				else if ( c == ',' ) {
					parts.push( string.trim() );
					string = '';
				}
				else if ( c == "'" || c == '"' || c == '(' ) {
					string += c + iter.seek( c == '(' ? ')' : c );
				}
				else {
					string += c;
				}
			});

			parts.push( string.trim() );
			parts.forEach(function( part, index ) {
				var iter = new StringIterator( part ),
					subparts = [],
					string = '';

				iter.each(function( c ) {
					if ( c == "\\" ) {
						string += c + iter.skip();
					}
					else if ( rwhitespace.exec( c ) ) {
						subparts.push( string.trim() );
						string = '';
					}
					else if ( c == "'" || c == '"' || c == '(' ) {
						string += c + iter.seek( c == '(' ? ')' : c );
					}
					else {
						string += c;
					}
				});

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

			// Only mark if change occured
			string = prefix + '(' + parts.join( ',' ) + ')';
			if ( string !== value ) {
				compressor.log(
					"Trimming gradient value '" + before + "' => '" + string + "'",
					position
				);

				return string;
			}
		}
	}

});
