munit( 'Rule Compression.Leading Zeroes', function( assert ) {
	testRule( assert, 'Leading Zeroes', [

		{
			name: 'Basic',
			actual: '0.2px',
			expected: '.2px'
		},

		{
			name: 'Negative Basic',
			actual: '-0.2px',
			expected: '-.2px'
		},

		{
			name: 'Percentage',
			actual: '0.2%',
			expected: '.2%'
		},

		{
			name: 'Negative Percentage',
			actual: '-0.2%',
			expected: '-.2%'
		},

		{
			name: 'No Suffix',
			actual: '0.75',
			expected: '.75'
		},

		{
			name: 'No Change',
			actual: '-10.5px',
			expected: undefined
		},

		{
			name: 'No Change Percentage',
			actual: '10.5%',
			expected: undefined
		},

		{
			name: 'No Change No Suffix',
			actual: '1.05',
			expected: undefined
		}

	]);
});
