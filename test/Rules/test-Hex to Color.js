munit( 'Rule Compression.Hex to Color', function( assert ) {
	assert.exists( "Table", CSSCompressor.tables[ 'Hex to Color' ] );

	testRule( assert, 'Hex to Color', [

		{
			name: 'Basic',
			actual: '#fffff0',
			expected: 'ivory'
		},

		{
			name: 'Basic Uppercase',
			actual: '#FFFFF0',
			expected: 'ivory'
		},

		{
			name: 'No Conversion',
			actual: '#f02de5',
			expected: undefined
		}

	]);
});
