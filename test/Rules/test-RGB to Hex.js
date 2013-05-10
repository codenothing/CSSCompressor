munit( 'Rule Compression.RGB to Hex', function( assert ) {
	testRule( assert, 'RGB to Hex', [

		{
			name: 'Basic',
			actual: 'rgb(214,123,214)',
			expected: '#d67bd6'
		},

		{
			name: 'Basic Spacing',
			actual: 'rgb( 214 , 123 , 214 )',
			expected: '#d67bd6'
		},

		{
			name: 'Basic Percentage',
			actual: 'rgb( 50%, 50%, 50% )',
			expected: '#7f7f7f'
		},

		{
			name: 'Basic Single',
			actual: 'rgb(145)',
			expected: '#919191'
		},

		{
			name: 'Basic Single Percentage',
			actual: 'rgb(50%)',
			expected: '#7f7f7f'
		}

	]);
});
