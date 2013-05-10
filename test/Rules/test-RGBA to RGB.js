munit( 'Rule Compression.RGBA to RGB', function( assert ) {
	testRule( assert, 'RGBA to RGB', [

		{
			name: 'Basic',
			actual: 'rgba(10%,10%,10%,1)',
			expected: 'rgb(10%,10%,10%)'
		},

		{
			name: 'Basic Spacing',
			actual: 'rgba( 214, 112, 87, 1 )',
			expected: 'rgb(214,112,87)'
		},

		{
			name: 'Basic Suffix',
			actual: 'rgba( 10%, 10%, 10%, 1.0 )',
			expected: 'rgb(10%,10%,10%)'
		},

		{
			name: 'Not 100%',
			actual: 'rgba( 10%, 10%, 10%, 0.5 )',
			expected: undefined
		},

		{
			name: 'Not RGBA',
			actual: 'rgb( 10%, 10%, 10%, 1 )',
			expected: undefined
		}

	]);
});
