var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Numeric.Trailing Zeroes', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Trailing Zeroes' ].callback;

	[

		{
			name: 'Basic',
			actual: '12.0px',
			expected: '12px'
		},

		{
			name: 'Negative Basic',
			actual: '-12.0px',
			expected: '-12px'
		},

		{
			name: 'Positive Basic',
			actual: '+12.0px',
			expected: '+12px'
		},

		{
			name: 'Multi Zeroes',
			actual: '12.000000000px',
			expected: '12px'
		},

		{
			name: 'Negative Multi Zeroes',
			actual: '-12.000000000px',
			expected: '-12px'
		},

		{
			name: 'Positive Multi Zeroes',
			actual: '+12.000000000px',
			expected: '+12px'
		},

		{
			name: 'Trailing Decimal',
			actual: '12.1000000000px',
			expected: '12.1px'
		},

		{
			name: 'Negative Trailing Decimal',
			actual: '-12.1000000000px',
			expected: '-12.1px'
		},

		{
			name: 'No Trim',
			actual: '12.059px',
			expected: undefined
		},

		{
			name: 'No Trim Negative',
			actual: '-12.059px',
			expected: undefined
		},

		{
			name: 'No Suffix',
			actual: '.750',
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
