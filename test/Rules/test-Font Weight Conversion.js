munit( 'Rule Compression.Font Weight Conversion', function( assert ) {
	assert.exists( "Table", CSSCompressor.tables[ 'Font Weight Conversion' ] );

	testRule( assert, 'Font Weight Conversion', [

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

	]);
});
