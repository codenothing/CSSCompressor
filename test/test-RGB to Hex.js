var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.RGB to Hex', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'RGB to Hex' ].callback;

	[

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

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});
