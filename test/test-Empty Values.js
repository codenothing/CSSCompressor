var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Trim.Empty Values', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Empty Values' ].callback;

	[

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '1px' ]
					},
					{
						property: 'margin-left',
						parts: []
					},
					{
						property: 'margin-right',
						parts: [ '1px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '1px' ]
					},
					{
						property: 'margin-right',
						parts: [ '1px' ]
					}
				]
			}
		},

		{
			name: 'Spacing',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '1px' ]
					},
					{
						property: 'margin-left',
						parts: [ '   ', "\t", "\n\n\t" ]
					},
					{
						property: 'margin-right',
						parts: [ '1px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '1px' ]
					},
					{
						property: 'margin-right',
						parts: [ '1px' ]
					}
				]
			}
		},

		{
			name: 'Nothing',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '1px' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-size',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '1px' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-size',
						parts: [ '2px' ]
					}
				]
			}
		}

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
