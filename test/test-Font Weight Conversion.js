var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Font.Font Weight Conversion', function( assert ) {
	assert.exists( "Table", CSSCompressor.tables[ 'Font Weight Conversion' ] );

	var rule = CSSCompressor._rulesHash[ 'Font Weight Conversion' ].callback;
	[

		{
			name: 'Basic',
			actual: { property: 'font-weight', parts: [ 'normal' ] },
			expected: { property: 'font-weight', parts: [ '400' ] }
		},

		{
			name: 'Bold',
			actual: { property: 'font-weight', parts: [ 'bold' ] },
			expected: { property: 'font-weight', parts: [ '700' ] }
		},

		{
			name: 'Nested Normal',
			actual: { property: 'font', parts: [ '10px', 'normal', 'Arabic' ] },
			expected: { property: 'font', parts: [ '10px', '400', 'Arabic' ] }
		},

		{
			name: 'Nested Bold',
			actual: { property: 'font', parts: [ '10px', 'bold', 'Arabic' ] },
			expected: { property: 'font', parts: [ '10px', '700', 'Arabic' ] }
		},

		{
			name: 'Direct Nothing',
			actual: { property: 'font-weight', parts: [ 'lighter' ] },
			expected: { property: 'font-weight', parts: [ 'lighter' ] }
		},

		{
			name: 'Nested Nothing',
			actual: { property: 'font', parts: [ '10px', 'lighter', 'Arabic' ] },
			expected: { property: 'font', parts: [ '10px', 'lighter', 'Arabic' ] }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
