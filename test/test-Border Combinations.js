var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Border.Border Combinations', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Border Combinations' ].callback;

	[

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top',
						parts: [ '1px', 'solid', 'red' ]
					},
					{
						property: 'border-right',
						parts: [ '1px', 'solid', 'red' ]
					},
					{
						property: 'border-bottom',
						parts: [ '1px', 'solid', 'red' ]
					},
					{
						property: 'border-left',
						parts: [ '1px', 'solid', 'red' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border',
						parts: [ '1px', 'solid', 'red' ]
					}
				]
			}
		},

		{
			name: 'Border Override',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border',
						parts: [ '1px', 'solid', 'red' ]
					},
					{
						property: 'border-right',
						parts: [ '1px', 'solid', 'red' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border',
						parts: [ '1px', 'solid', 'red' ]
					}
				]
			}
		},

		{
			name: 'Missing Border Direction',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top',
						parts: [ '1px', 'solid', 'green' ]
					},
					{
						property: 'border-right',
						parts: [ '1px', 'solid', 'green' ]
					},
					{
						property: 'border-left',
						parts: [ '1px', 'solid', 'green' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top',
						parts: [ '1px', 'solid', 'green' ]
					},
					{
						property: 'border-right',
						parts: [ '1px', 'solid', 'green' ]
					},
					{
						property: 'border-left',
						parts: [ '1px', 'solid', 'green' ]
					}
				]
			}
		},

		{
			name: 'Do Nothing',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border',
						parts: [ '1px', 'solid', 'red' ]
					},
					{
						property: 'border-right',
						parts: [ '1px', 'solid', 'green' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border',
						parts: [ '1px', 'solid', 'red' ]
					},
					{
						property: 'border-right',
						parts: [ '1px', 'solid', 'green' ]
					}
				]
			}
		}

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
