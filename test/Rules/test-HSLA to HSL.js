munit( 'Rule Compression.HSLA to HSL', function( assert ) {
	var rule = CSSCompressor.rule[ 'HSLA to HSL' ].callback;

	testRule( assert, 'HSLA to HSL', [

		{
			name: 'Basic',
			actual: 'hsla(214,10%,10%,1)',
			expected: 'hsl(214,10%,10%)'
		},

		{
			name: 'Basic Spacing',
			actual: 'hsla( 214, 10%, 10%, 1 )',
			expected: 'hsl(214,10%,10%)'
		},

		{
			name: 'Basic Suffix',
			actual: 'hsla( 214, 10%, 10%, 1.0 )',
			expected: 'hsl(214,10%,10%)'
		},

		{
			name: 'Not 100%',
			actual: 'hsla( 214, 10%, 10%, 0.5 )',
			expected: undefined
		},

		{
			name: 'Not HSLA',
			actual: 'hsl( 214, 10%, 10%, 1 )',
			expected: undefined
		}

	]);
});
