munit( 'Rule Compression.Trailing Zeroes', function( assert ) {
	testRule( assert, 'Trailing Zeroes', [

		{
			name: 'Basic',
			actual: '12.0px',
			expected: '12px'
		},

		{
			name: 'Negative Basic',
			actual: '-12.0px',
			expected: '-12px'
		},

		{
			name: 'Positive Basic',
			actual: '+12.0px',
			expected: '+12px'
		},

		{
			name: 'Multi Zeroes',
			actual: '12.000000000px',
			expected: '12px'
		},

		{
			name: 'Negative Multi Zeroes',
			actual: '-12.000000000px',
			expected: '-12px'
		},

		{
			name: 'Positive Multi Zeroes',
			actual: '+12.000000000px',
			expected: '+12px'
		},

		{
			name: 'Trailing Decimal',
			actual: '12.1000000000px',
			expected: '12.1px'
		},

		{
			name: 'Negative Trailing Decimal',
			actual: '-12.1000000000px',
			expected: '-12.1px'
		},

		{
			name: 'No Trim',
			actual: '12.059px',
			expected: undefined
		},

		{
			name: 'No Trim Negative',
			actual: '-12.059px',
			expected: undefined
		},

		{
			name: 'Decimal',
			actual: '.750px',
			expected: '.75px'
		},

		{
			name: 'No Suffix',
			actual: '.750',
			expected: undefined
		}

	]);
});
