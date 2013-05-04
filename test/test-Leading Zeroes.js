var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Numeric.Leading Zeroes', function( assert ) {
	var rule = CSSCompressor.rule[ 'Leading Zeroes' ].callback;

	[

		{
			name: 'Basic',
			actual: '0.2px',
			expected: '.2px'
		},

		{
			name: 'Negative Basic',
			actual: '-0.2px',
			expected: '-.2px'
		},

		{
			name: 'Percentage',
			actual: '0.2%',
			expected: '.2%'
		},

		{
			name: 'Negative Percentage',
			actual: '-0.2%',
			expected: '-.2%'
		},

		{
			name: 'No Suffix',
			actual: '0.75',
			expected: '.75'
		},

		{
			name: 'No Change',
			actual: '-10.5px',
			expected: undefined
		},

		{
			name: 'No Change Percentage',
			actual: '10.5%',
			expected: undefined
		},

		{
			name: 'No Change No Suffix',
			actual: '1.05',
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
