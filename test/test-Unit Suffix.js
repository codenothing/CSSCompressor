var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Numeric.Unit Suffix', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Unit Suffix' ].callback;

	[

		{
			name: 'Basic',
			actual: '0px',
			expected: '0'
		},

		{
			name: 'Basic Percentage',
			actual: '0%',
			expected: '0'
		},

		{
			name: 'Basic Negative',
			actual: '-0px',
			expected: '0'
		},

		{
			name: 'Non Zero',
			actual: '50px',
			expected: undefined
		},

		{
			name: 'Non Zero Decimal',
			actual: '50.0px',
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
