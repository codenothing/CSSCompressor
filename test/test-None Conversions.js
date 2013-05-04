var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Misc.None Conversions', function( assert ) {
	var rule = CSSCompressor.rule[ 'None Conversions' ].callback;

	[

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
			name: 'Nothing',
			actual: { property: 'color', parts: [ 'none' ], line: 0 },
			expected: { property: 'color', parts: [ 'none' ], line: 0 }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
