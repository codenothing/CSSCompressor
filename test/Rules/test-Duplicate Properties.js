munit( 'Rule Compression.Duplicate Properties', function( assert ) {
	testRule( assert, 'Duplicate Properties', [

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
						property: 'margin-top',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '2px' ]
					}
				]
			}
		},

		{
			name: 'Inbetween & After',
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
						property: 'margin-top',
						parts: [ '2px' ]
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
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'margin-top',
						parts: [ '2px' ]
					},
					{
						property: 'font-size',
						parts: [ '2px' ]
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
