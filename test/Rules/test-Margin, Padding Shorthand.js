munit( 'Rule Compression.Margin, Padding Shorthand', function( assert ) {
	testRule( assert, 'Margin, Padding Shorthand', [

		{
			name: '4 to 1',
			actual: { property: 'margin', parts: [ '10px', '10px', '10px', '10px' ], line: 0 },
			expected: { property: 'margin', parts: [ '10px' ], line: 0 }
		},

		{
			name: '4 to 2',
			actual: { property: 'padding', parts: [ '10px', '5px', '10px', '5px' ], line: 0 },
			expected: { property: 'padding', parts: [ '10px', '5px' ], line: 0 }
		},

		{
			name: '4 to 3',
			actual: { property: 'margin', parts: [ '10px', '5px', '7px', '5px' ], line: 0 },
			expected: { property: 'margin', parts: [ '10px', '5px', '7px' ], line: 0 }
		},

		{
			name: '3 to 1',
			actual: { property: 'padding', parts: [ '10px', '10px', '10px' ], line: 0 },
			expected: { property: 'padding', parts: [ '10px' ], line: 0 }
		},

		{
			name: '3 to 2',
			actual: { property: 'margin', parts: [ '10px', '9px', '10px' ], line: 0 },
			expected: { property: 'margin', parts: [ '10px', '9px' ], line: 0 }
		},

		{
			name: '2 to 1',
			actual: { property: 'padding', parts: [ '10px', '10px' ], line: 0 },
			expected: { property: 'padding', parts: [ '10px' ], line: 0 }
		},

		{
			name: '4 to 4 - Nothing',
			actual: { property: 'margin', parts: [ '10px', '9px', '8px', '7px' ], line: 0 },
			expected: { property: 'margin', parts: [ '10px', '9px', '8px', '7px' ], line: 0 }
		},

		{
			name: '3 to 3 - Nothing',
			actual: { property: 'padding', parts: [ '10px', '9px', '8px' ], line: 0 },
			expected: { property: 'padding', parts: [ '10px', '9px', '8px' ], line: 0 }
		},

		{
			name: '2 to 2 - Nothing',
			actual: { property: 'margin', parts: [ '10px', '9px' ], line: 0 },
			expected: { property: 'margin', parts: [ '10px', '9px' ], line: 0 }
		},

		{
			name: '1 to 1 - Nothing',
			actual: { property: 'padding', parts: [ '10px' ], line: 0 },
			expected: { property: 'padding', parts: [ '10px' ], line: 0 }
		}

	]);
});
