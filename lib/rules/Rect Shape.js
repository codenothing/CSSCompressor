/**
 * 
 * Rect Shape
 * 
 * @author: Corey Hart <http://www.codenothing.com>
 * @description: Compressing rect shape declarations
 * 
 * @before:
 *     .example {
 *         clip: rect( 1.0px, 2.0px, 3.0px, 4.0px );
 *     }
 * 
 * @after:
 *     .example {
 *         clip: rect(1px,2px,3px,4px);
 *     }
 * 
 */

var CSSCompressor = global.CSSCompressor,
	rrect = /^rect\(([^\)]+)\)$/i,
	rcomma = /,/g;

CSSCompressor.rule({

	name: 'Rect Shape',
	type: CSSCompressor.RULE_TYPE_VALUE,
	group: 'Numeric',
	description: "Compressing rect shape declarations",

	callback: function( value, position, compressor ) {
		var m = rrect.exec( value ) || [],
			content = m[ 1 ] || '',
			before = value,
			parts;

		if ( content.length ) {
			parts = content.split( rcomma );
			parts.forEach(function( value, index ) {
				parts[ index ] = compressor.value( value.trim(), position );
			});
			value = "rect(" + parts.join( ',' ) + ")";

			if ( value != before && position ) {
				compressor.log(
					"Removing whitespace and compressing numerics in rect shape. '" + before + "' => '" + value + "'",
					position
				);
			}

			return value;
		}
	}

});
