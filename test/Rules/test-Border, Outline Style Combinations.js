munit( 'Rule Compression.Border, Outline Style Combinations', function( assert ) {
	testRule( assert, 'Border, Outline Style Combinations', [

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top-style',
						parts: [ 'solid' ]
					},
					{
						property: 'border-top-width',
						parts: [ '1px' ]
					},
					{
						property: 'border-top-color',
						parts: [ 'red' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top',
						parts: [ '1px', 'solid', 'red' ]
					}
				]
			}
		},

		{
			name: 'Shorthand',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border',
						parts: [ '1px', 'solid', 'green' ]
					},
					{
						property: 'border-width',
						parts: [ '2px' ]
					},
					{
						property: 'border-color',
						parts: [ 'red' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border',
						parts: [ '2px', 'solid', 'red' ]
					}
				]
			}
		},

		{
			name: 'Shorthand Positioned End',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-width',
						parts: [ '2px' ]
					},
					{
						property: 'border-color',
						parts: [ 'red' ]
					},
					{
						property: 'border',
						parts: [ '1px', 'solid', 'green' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border',
						parts: [ '1px', 'solid', 'green' ]
					}
				]
			}
		},

		{
			name: 'Multi',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-left-width',
						parts: [ '2px' ]
					},
					{
						property: 'border-left',
						parts: [ '5px', 'dashed', 'blue' ]
					},
					{
						property: 'border-top',
						parts: [ '9px', 'solid', 'navy' ]
					},
					{
						property: 'border-top-width',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-left',
						parts: [ '5px', 'dashed', 'blue' ]
					},
					{
						property: 'border-top',
						parts: [ '2px', 'solid', 'navy' ]
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
						property: 'border-left-width',
						parts: [ '2px' ]
					},
					{
						property: 'border-left-style',
						parts: [ 'dashed' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-left-width',
						parts: [ '2px' ]
					},
					{
						property: 'border-left-style',
						parts: [ 'dashed' ]
					}
				]
			}
		}

	]);
});
