munit( 'Rule Compression.Shrink Hex', function( assert ) {
	testRule( assert, 'Shrink Hex', [

		{
			name: 'Basic',
			actual: '#000000',
			expected: '#000'
		},

		{
			name: 'Basic Separation',
			actual: '#aa6600',
			expected: '#a60'
		},

		{
			name: 'No Conversion',
			actual: '#772213',
			expected: undefined
		},

		{
			name: 'Invalid Hex',
			actual: '#aa660',
			expected: undefined
		}

	]);
});
