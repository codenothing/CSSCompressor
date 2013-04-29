var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.Lowercase Hex', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Lowercase Hex' ].callback;

	[

		{
			name: 'Basic',
			actual: '#ABCDEF',
			expected: '#abcdef'
		},

		{
			name: 'Basic Short',
			actual: '#ABC',
			expected: '#abc'
		},

		{
			name: 'Mixed',
			actual: '#A72B3C',
			expected: '#a72b3c'
		},

		{
			name: 'Mixed Short',
			actual: '#A72',
			expected: '#a72'
		},

		{
			name: 'No Match',
			actual: '#A72B3',
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
