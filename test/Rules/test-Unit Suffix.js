munit( 'Rule Compression.Unit Suffix', function( assert ) {
	testRule( assert, 'Unit Suffix', [

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

	]);
});
