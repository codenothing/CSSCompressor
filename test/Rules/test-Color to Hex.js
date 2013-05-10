munit( 'Rule Compression.Color to Hex', function( assert ) {
	assert.exists( "Table", CSSCompressor.tables[ 'Color to Hex' ] );

	testRule( assert, 'Color to Hex', [

		{
			name: 'Basic',
			actual: 'aliceblue',
			expected: '#f0f8ff'
		},

		{
			name: 'Basic Uppercase',
			actual: 'ALICEBLUE',
			expected: '#f0f8ff'
		},

		{
			name: 'No Conversion',
			actual: 'foobar',
			expected: undefined
		}

	]);
});
