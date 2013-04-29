var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.Hex to Safe Color', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Hex to Color' ].callback;

	[

		{
			name: 'Basic',
			actual: '#000080',
			expected: 'navy'
		},

		{
			name: 'Basic Uppercase',
			actual: '#c0c0c0',
			expected: 'silver'
		},

		{
			name: 'No Conversion',
			actual: 'foobar',
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
