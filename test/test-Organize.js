var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// Lowercasing property conversions
munit( 'Organize.Lowercase Properties', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Lowercase Properties' ].callback;

	[

		{
			name: 'Basic',
			actual: { property: 'COLOR', parts: [ 'red' ], line: 0 },
			expected: { property: 'color', parts: [ 'red' ], line: 0 }
		},

		{
			name: 'Hyphen',
			actual: { property: 'Font-Size', parts: [ '10px' ], line: 0 },
			expected: { property: 'font-size', parts: [ '10px' ], line: 0 }
		},

		{
			name: 'Do Nothing',
			actual: { property: 'font-size', parts: [ '10px' ], line: 0 },
			expected: { property: 'font-size', parts: [ '10px' ], line: 0 }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Sorting property conversions
munit( 'Organize.Sort Properties', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Sort Properties' ].callback;

	[

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'background',
						parts: [ 'green' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'background',
						parts: [ 'green' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					}
				]
			}
		},

		{
			name: 'Sort Parts',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'color',
						parts: [ 'red', 'top' ]
					},
					{
						property: 'color',
						parts: [ 'green', 'left' ]
					},
					{
						property: 'color',
						parts: [ 'gray', 'center' ]
					},
					{
						property: 'color',
						parts: [ 'green', 'bottom' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'color',
						parts: [ 'gray', 'center' ]
					},
					{
						property: 'color',
						parts: [ 'green', 'bottom' ]
					},
					{
						property: 'color',
						parts: [ 'green', 'left' ]
					},
					{
						property: 'color',
						parts: [ 'red', 'top' ]
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
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
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
						property: 'font-size',
						parts: [ '1px' ]
					}
				]
			}
		}

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Sorting selector conversions
munit( 'Organize.Sort Multi Selectors', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Sort Multi Selectors' ].callback;

	[

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				parts: [
					'span',
					',',
					'a'
				]
			},
			expected: {
				selector: 'blah',
				parts: [
					'a',
					',',
					'span'
				]
			}
		},

		{
			name: 'Multi',
			actual: {
				selector: 'blah',
				parts: [
					'span',
					'div',
					',',
					'a',
					'b',
					',',
					'center',
					'span',
					',',
					'center',
					'a'
				]
			},
			expected: {
				selector: 'blah',
				parts: [
					'a',
					'b',
					',',
					'center',
					'a',
					',',
					'center',
					'span',
					',',
					'span',
					'div'
				]
			}
		},

		{
			name: 'Nested',
			actual: {
				selector: 'blah',
				parts: [
					'span',
					'div',
					',',
					[
						'a',
						'.zclassname'
					],
					',',
					'a',
					'b',
					',',
					[
						'a',
						'.classname'
					],
					',',
					'center',
					'span',
					',',
					'center',
					'a'
				]
			},
			expected: {
				selector: 'blah',
				parts: [
					'a',
					'b',
					',',
					[
						'a',
						'.classname'
					],
					',',
					[
						'a',
						'.zclassname'
					],
					',',
					'center',
					'a',
					',',
					'center',
					'span',
					',',
					'span',
					'div'
				]
			}
		},

		{
			name: 'Do Nothing',
			actual: {
				selector: 'blah',
				parts: [
					'a',
					',',
					'span'
				]
			},
			expected: {
				selector: 'blah',
				parts: [
					'a',
					',',
					'span'
				]
			}
		}

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});

// Order Atrules compressions
munit( 'Organize.Order Atrules', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Order Atrules' ].callback;

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
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				}
			],
			expected: [
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
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
							parts: [ 'red' ]
						}
					]
				}
			]
		},

		{
			name: 'Multi',
			actual: [
				{
					atrule: '@charset "utf16"',
					parts: [
						'@charset',
						'"utf16"'
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
							parts: [ 'red' ]
						}
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				}
			],
			expected: [
				{
					atrule: '@charset "utf16"',
					parts: [
						'@charset',
						'"utf16"'
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
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
							parts: [ 'red' ]
						}
					]
				}
			]
		},

		{
			name: 'Multi Imports',
			actual: [
				{
					atrule: '@charset "utf16"',
					parts: [
						'@charset',
						'"utf16"'
					]
				},
				{
					atrule: '@import "styles2.css"',
					parts: [
						'@import',
						'"styles2.css"'
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
							parts: [ 'red' ]
						}
					]
				},
				{
					atrule: '@import "styles3.css"',
					parts: [
						'@import',
						'"styles3.css"'
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				}
			],
			expected: [
				{
					atrule: '@charset "utf16"',
					parts: [
						'@charset',
						'"utf16"'
					]
				},
				{
					atrule: '@import "styles2.css"',
					parts: [
						'@import',
						'"styles2.css"'
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				},
				{
					atrule: '@import "styles3.css"',
					parts: [
						'@import',
						'"styles3.css"'
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
							parts: [ 'red' ]
						}
					]
				}
			]
		},

		{
			name: 'Nothing',
			actual: [
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
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
							parts: [ 'red' ]
						}
					]
				}
			],
			expected: [
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
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
