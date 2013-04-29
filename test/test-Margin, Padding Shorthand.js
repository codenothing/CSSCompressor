var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'MarginPadding.Margin, Padding Shorthand', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Margin, Padding Shorthand' ].callback;

	[

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

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
