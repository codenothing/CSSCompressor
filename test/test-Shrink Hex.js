var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.Shrink Hex', function( assert ) {
	var rule = CSSCompressor.rule[ 'Shrink Hex' ].callback;

	[

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
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});
