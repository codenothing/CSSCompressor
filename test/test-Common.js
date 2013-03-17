var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// Common Selectors Combinations
MUnit( 'Common.Common Selectors', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Common Selectors' ].callback;

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

	].forEach(function( object ) {
		compressor.branches = object.actual;
		rule( compressor.branches, compressor );

		assert.deepEqual( object.name, compressor.branches, object.expected );
	});
});


// Common Rules Combinations
MUnit( 'Common.Common Rules', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Common Rules' ].callback;

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

	].forEach(function( object ) {
		compressor.branches = object.actual;
		rule( compressor.branches, compressor );

		assert.deepEqual( object.name, compressor.branches, object.expected );
	});
});
