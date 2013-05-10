munit( 'Rule Compression.Border Combinations', function( assert ) {
	testRule( assert, 'Border Combinations', [

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

	]);
});
