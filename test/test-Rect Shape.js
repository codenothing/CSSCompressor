var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Numeric.Rect Shape', function( assert ) {
	var rule = CSSCompressor.rule[ 'Rect Shape' ].callback;

	[

		{
			name: 'Basic',
			actual: 'rect( 1px, 2px, 3px, 4px )',
			expected: 'rect(1px,2px,3px,4px)'
		},

		{
			name: 'Inner Numeric',
			actual: 'rect( 1.0px, 20px, 1.5px, 20.0px )',
			expected: 'rect(1px,20px,1.5px,20px)'
		},

		{
			name: 'Case Insensitive',
			actual: 'RECT(   1px,2px,   3px,4px   )',
			expected: 'rect(1px,2px,3px,4px)'
		},

		{
			name: 'No Match',
			actual: 'reet( 1px, 2px, 3px, 4px )',
			expected: undefined
		}

	].forEach(function( object ) {
		assert.equal(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});
