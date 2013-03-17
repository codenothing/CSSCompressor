var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// Empty Values tests
MUnit( 'Trim.Empty Values', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Empty Values' ].callback;

	[

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

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Duplicate Properties tests
MUnit( 'Trim.Duplicate Properties', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Duplicate Properties' ].callback;

	[

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

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Strip Comments tests
MUnit( 'Trim.Strip Comments', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Strip Comments' ].callback;

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
					comment: '/* some comment */'
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
		},

		{
			name: 'Inbetween',
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
					comment: '/* some comment */'
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
							parts: [ 'red' ]
						}
					]
				}
			]
		},

		{
			name: 'Basic Preserve',
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
					comment: '/*! some comment */'
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
				},
				{
					comment: '/*! some comment */'
				}
			]
		},

		{
			name: 'Inbetween Preserve',
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
					comment: '/*! some comment */'
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
					comment: '/*! some comment */'
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

// Strip Comments tests
MUnit( 'Trim.Strip Empty Branches', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Strip Empty Branches' ].callback;

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
