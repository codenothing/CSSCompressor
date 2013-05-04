var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Organize.Lowercase Properties', function( assert ) {
	var rule = CSSCompressor.rule[ 'Lowercase Properties' ].callback;

	[

		{
			name: 'Basic',
			actual: { property: 'COLOR', parts: [ 'red' ], line: 0 },
			expected: { property: 'color', parts: [ 'red' ], line: 0 }
		},

		{
			name: 'Hyphen',
			actual: { property: 'Font-Size', parts: [ '10px' ], line: 0 },
			expected: { property: 'font-size', parts: [ '10px' ], line: 0 }
		},

		{
			name: 'Do Nothing',
			actual: { property: 'font-size', parts: [ '10px' ], line: 0 },
			expected: { property: 'font-size', parts: [ '10px' ], line: 0 }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
