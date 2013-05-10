munit( 'Rule Compression.Common Selectors', function( assert ) {
	testRule( assert, 'Common Selectors', [

		{
			name: 'Basic',
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
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
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
						},
						{
							property: 'color',
							parts: [ 'blue' ]
						}
					]
				}
			]
		},

		{
			name: 'Inbetween & After',
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
				},
				{
					selector: 'span div p',
					parts: [
						'span',
						'div',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						}
					]
				},
				{
					selector: 'span div #id',
					parts: [
						'span',
						'div',
						'#id'
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
						},
						{
							property: 'color',
							parts: [ 'blue' ]
						}
					]
				},
				{
					selector: 'span div p',
					parts: [
						'span',
						'div',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					selector: 'span div #id',
					parts: [
						'span',
						'div',
						'#id'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				}
			]
		},

		{
			name: 'Nested',
			actual: [
				{
					selector: 'span div.class p',
					parts: [
						'span',
						[ 'div', '.class' ],
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					selector: 'span div.class p',
					parts: [
						'span',
						[ 'div', '.class' ],
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						}
					]
				}
			],
			expected: [
				{
					selector: 'span div.class p',
					parts: [
						'span',
						[ 'div', '.class' ],
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						},
						{
							property: 'color',
							parts: [ 'blue' ]
						}
					]
				}
			]
		},

		{
			name: 'Nothing',
			actual: [
				{
					selector: 'span div.class p',
					parts: [
						'span',
						[ 'div', '.class' ],
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					selector: 'span div.no p',
					parts: [
						'span',
						[ 'div', '.no' ],
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						}
					]
				}
			],
			expected: [
				{
					selector: 'span div.class p',
					parts: [
						'span',
						[ 'div', '.class' ],
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					selector: 'span div.no p',
					parts: [
						'span',
						[ 'div', '.no' ],
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						}
					]
				}
			]
		}

	]);
});
