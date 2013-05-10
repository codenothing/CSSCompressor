munit( 'Rule Compression.Lowercase Hex', function( assert ) {
	testRule( assert, 'Lowercase Hex', [

		{
			name: 'Basic',
			actual: '#ABCDEF',
			expected: '#abcdef'
		},

		{
			name: 'Basic Short',
			actual: '#ABC',
			expected: '#abc'
		},

		{
			name: 'Mixed',
			actual: '#A72B3C',
			expected: '#a72b3c'
		},

		{
			name: 'Mixed Short',
			actual: '#A72',
			expected: '#a72'
		},

		{
			name: 'No Match',
			actual: '#A72B3',
			expected: undefined
		}

	]);
});
