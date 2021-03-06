munit( 'Rule Compression.Common Rules', function( assert ) {
	testRule( assert, 'Common Rules', [

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
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: '#id p',
					parts: [
						'#id',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				}
			],
			expected: [
				{
					selector: 'span div',
					parts: [
						'span',
						'div',
						',',
						'#id',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				}
			]
		},

		{
			name: 'Multi',
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
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: '#other .class',
					parts: [
						'#other',
						'.class'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						},
						{
							property: 'font-size',
							parts: [ '8px' ]
						}
					]
				},
				{
					selector: '#id p',
					parts: [
						'#id',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: 'aside b',
					parts: [
						'aside',
						'b'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						},
						{
							property: 'font-size',
							parts: [ '8px' ]
						}
					]
				}
			],
			expected: [
				{
					selector: 'span div',
					parts: [
						'span',
						'div',
						',',
						'#id',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: '#other .class',
					parts: [
						'#other',
						'.class',
						',',
						'aside',
						'b'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						},
						{
							property: 'font-size',
							parts: [ '8px' ]
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
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: '#other .class',
					parts: [
						'#other',
						'.class'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'orange' ]
						},
						{
							property: 'font-size',
							parts: [ '8px' ]
						}
					]
				},
				{
					selector: '#id p',
					parts: [
						'#id',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: 'aside b',
					parts: [
						'aside',
						'b'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						},
						{
							property: 'font-size',
							parts: [ '8px' ]
						}
					]
				}
			],
			expected: [
				{
					selector: 'span div',
					parts: [
						'span',
						'div',
						',',
						'#id',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: '#other .class',
					parts: [
						'#other',
						'.class'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'orange' ]
						},
						{
							property: 'font-size',
							parts: [ '8px' ]
						}
					]
				},
				{
					selector: 'aside b',
					parts: [
						'aside',
						'b'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						},
						{
							property: 'font-size',
							parts: [ '8px' ]
						}
					]
				}
			]
		},

		{
			name: 'Nothing',
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
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: '#id p',
					parts: [
						'#id',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
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
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				},
				{
					selector: '#id p',
					parts: [
						'#id',
						'p'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'blue' ]
						},
						{
							property: 'font-size',
							parts: [ '10px' ]
						}
					]
				}
			]
		}

	]);
});
