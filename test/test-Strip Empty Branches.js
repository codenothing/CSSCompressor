var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Trim.Strip Empty Branches', function( assert ) {
	var rule = CSSCompressor.rule[ 'Strip Empty Branches' ].callback;

	[

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

	].forEach(function( object ) {
		compressor.branches = object.actual;
		rule( compressor.branches, compressor );

		assert.deepEqual( object.name, compressor.branches, object.expected );
	});
});
