munit( 'Rule Compression.Empty Values', function( assert ) {
	testRule( assert, 'Empty Values', [

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

	]);
});
