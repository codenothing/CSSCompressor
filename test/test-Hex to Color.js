var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.Hex to Color', function( assert ) {
	assert.exists( "Table", CSSCompressor.tables[ 'Hex to Color' ] );

	var rule = CSSCompressor.rule[ 'Hex to Color' ].callback;
	[

		{
			name: 'Basic',
			actual: '#fffff0',
			expected: 'ivory'
		},

		{
			name: 'Basic Uppercase',
			actual: '#FFFFF0',
			expected: 'ivory'
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
