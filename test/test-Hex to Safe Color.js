var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.Hex to Safe Color', function( assert ) {
	assert.exists( "Table", CSSCompressor.tables[ 'Hex to Safe Color' ] );

	var rule = CSSCompressor.rule[ 'Hex to Safe Color' ].callback;
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
			name: 'Unsafe Color',
			actual: '#f0ffff',
			expected: undefined
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
