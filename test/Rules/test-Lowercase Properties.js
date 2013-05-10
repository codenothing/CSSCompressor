munit( 'Rule Compression.Lowercase Properties', function( assert ) {
	testRule( assert, 'Lowercase Properties', [

		{
			name: 'Basic',
			actual: { property: 'COLOR', parts: [ 'red' ], line: 0 },
			expected: { property: 'color', parts: [ 'red' ], line: 0 }
		},

		{
			name: 'Hyphen',
			actual: { property: 'Font-Size', parts: [ '10px' ], line: 0 },
			expected: { property: 'font-size', parts: [ '10px' ], line: 0 }
		},

		{
			name: 'Do Nothing',
			actual: { property: 'font-size', parts: [ '10px' ], line: 0 },
			expected: { property: 'font-size', parts: [ '10px' ], line: 0 }
		}

	]);
});
