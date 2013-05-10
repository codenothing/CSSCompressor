munit( 'Rule Compression.Strip Empty Branches', function( assert ) {
	testRule( assert, 'Strip Empty Branches', [

		{
			name: 'Basic',
			actual: [
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: []
				}
			],
			expected: [
			]
		},

		{
			name: 'Basic With Comment',
			actual: [
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: []
				},
				{
					comment: '/*! some comment */'
				}
			],
			expected: [
				{
					comment: '/*! some comment */'
				}
			]
		},

		{
			name: 'Nested Full Removal',
			actual: [
				{
					atrule: '@media all',
					parts: [
						'@media',
						'all'
					],
					branches: [
						{
							selector: "span",
							parts: [
								"span"
							],
							rules: []
						}
					]
				},
				{
					comment: '/*! some comment */'
				}
			],
			expected: [
				{
					comment: '/*! some comment */'
				}
			]
		},

		{
			name: 'Nested Removal Only',
			actual: [
				{
					atrule: '@media all',
					parts: [
						'@media',
						'all'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					],
					branches: [
						{
							selector: "span",
							parts: [
								"span"
							],
							rules: []
						}
					]
				},
				{
					comment: '/*! some comment */'
				}
			],
			expected: [
				{
					atrule: '@media all',
					parts: [
						'@media',
						'all'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					comment: '/*! some comment */'
				}
			]
		},

		{
			name: 'Do Nothing',
			actual: [
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				}
			],
			expected: [
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				}
			]
		}

	]);
});
