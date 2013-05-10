munit( 'Rule Compression.Border Radius Shorthand', function( assert ) {
	testRule( assert, 'Border Radius Shorthand', [

		{
			name: '4 to 1',
			actual: { property: 'border-radius', parts: [ '10px', '10px', '10px', '10px' ], line: 0 },
			expected: { property: 'border-radius', parts: [ '10px' ], line: 0 }
		},

		{
			name: '4 to 2',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '5px', '10px', '5px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '5px' ], line: 0 }
		},

		{
			name: '4 to 3',
			actual: { property: '-moz-border-radius', parts: [ '10px', '5px', '7px', '5px' ], line: 0 },
			expected: { property: '-moz-border-radius', parts: [ '10px', '5px', '7px' ], line: 0 }
		},

		{
			name: '3 to 1',
			actual: { property: 'border-radius', parts: [ '10px', '10px', '10px' ], line: 0 },
			expected: { property: 'border-radius', parts: [ '10px' ], line: 0 }
		},

		{
			name: '3 to 2',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '9px', '10px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '9px' ], line: 0 }
		},

		{
			name: '2 to 1',
			actual: { property: '-moz-border-radius', parts: [ '10px', '10px' ], line: 0 },
			expected: { property: '-moz-border-radius', parts: [ '10px' ], line: 0 }
		},

		{
			name: '3 to 2 / 4 to 1',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '9px', '10px', '/', '1px', '1px', '1px', '1px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '9px', '/', '1px' ], line: 0 }
		},

		{
			name: '2 to 2 / 2 to 1',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '9px', '/', '1px', '1px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '9px', '/', '1px' ], line: 0 }
		},

		{
			name: '4 to 4 - Nothing',
			actual: { property: 'border-radius', parts: [ '10px', '9px', '8px', '7px' ], line: 0 },
			expected: { property: 'border-radius', parts: [ '10px', '9px', '8px', '7px' ], line: 0 }
		},

		{
			name: '3 to 3 - Nothing',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '9px', '8px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '9px', '8px' ], line: 0 }
		},

		{
			name: '2 to 2 - Nothing',
			actual: { property: '-moz-border-radius', parts: [ '10px', '9px' ], line: 0 },
			expected: { property: '-moz-border-radius', parts: [ '10px', '9px' ], line: 0 }
		},

		{
			name: '1 to 1 - Nothing',
			actual: { property: 'border-radius', parts: [ '10px' ], line: 0 },
			expected: { property: 'border-radius', parts: [ '10px' ], line: 0 }
		},

		{
			name: '3 to 3 / 4 to 4 - Nothing',
			actual: { property: '-webkit-border-radius', parts: [ '7px', '8px', '9px', '/', '1px', '2px', '3px', '4px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '7px', '8px', '9px', '/', '1px', '2px', '3px', '4px' ], line: 0 }
		}

	]);
	/*
	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
	*/
});
