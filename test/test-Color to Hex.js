var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.Color to Hex', function( assert ) {
	assert.exists( "Table", CSSCompressor.tables[ 'Color to Hex' ] );

	var rule = CSSCompressor._rulesHash[ 'Color to Hex' ].callback;
	[

		{
			name: 'Basic',
			actual: 'aliceblue',
			expected: '#f0f8ff'
		},

		{
			name: 'Basic Uppercase',
			actual: 'ALICEBLUE',
			expected: '#f0f8ff'
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
