var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.HSLA to HSL', function( assert ) {
	var rule = CSSCompressor.rule[ 'HSLA to HSL' ].callback;

	[

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

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});
