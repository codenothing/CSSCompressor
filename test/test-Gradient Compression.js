var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Color.Gradient Compression', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Gradient Compression' ].callback;

	[

		{
			name: 'Basic',
			actual: '-webkit-linear-gradient( 45deg, #777 2%, #555 50%, #333 100% )',
			expected: '-webkit-linear-gradient(45deg,#777 2%,#555 50%,#333 100%)'
		},

		{
			name: 'Color and Number Compressions',
			actual: '-webkit-linear-gradient( 45deg, #777777 0%, #555 50.0%, #333333 100% )',
			expected: '-webkit-linear-gradient(45deg,#777 0,#555 50%,#333 100%)'
		},

		{
			name: 'RGB Conversion',
			actual: '-webkit-linear-gradient(45deg, rgb( 0, 0, 0 ) 2%, #555 50%, #333 100%)',
			expected: '-webkit-linear-gradient(45deg,#000 2%,#555 50%,#333 100%)'
		},

		{
			name: 'Do Nothing Bad Match',
			actual: '-webkit-linear( 45deg, #777 2%, #555 50%, #333 100% )',
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
