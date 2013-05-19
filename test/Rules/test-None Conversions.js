munit( 'Rule Compression.None Conversions', function( assert ) {
	testRule( assert, 'None Conversions', [

		{
			name: 'Border',
			actual: { property: 'border', parts: [ 'none' ], line: 0 },
			expected: { property: 'border', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Background',
			actual: { property: 'background', parts: [ 'none' ], line: 0 },
			expected: { property: 'background', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Border Top',
			actual: { property: 'border-top', parts: [ 'none' ], line: 0 },
			expected: { property: 'border-top', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Border Right',
			actual: { property: 'border-right', parts: [ 'NONE' ], line: 0 },
			expected: { property: 'border-right', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Border Bottom',
			actual: { property: 'border-bottom', parts: [ 'noNe' ], line: 0 },
			expected: { property: 'border-bottom', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Border Left',
			actual: { property: 'border-left', parts: [ 'None' ], line: 0 },
			expected: { property: 'border-left', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Do Nothing',
			actual: { property: 'color', parts: [ 'none' ], line: 0 },
			expected: { property: 'color', parts: [ 'none' ], line: 0 }
		}

	]);
});
