munit( 'Rule Compression.Hex to Safe Color', function( assert ) {
	assert.exists( "Table", CSSCompressor.tables[ 'Hex to Safe Color' ] );

	testRule( assert, 'Hex to Safe Color', [

		{
			name: 'Basic',
			actual: '#000080',
			expected: 'navy'
		},

		{
			name: 'Basic Uppercase',
			actual: '#c0c0c0',
			expected: 'silver'
		},

		{
			name: 'Unsafe Color',
			actual: '#f0ffff',
			expected: undefined
		},

		{
			name: 'No Conversion',
			actual: '#f02de5',
			expected: undefined
		}

	]);
});
