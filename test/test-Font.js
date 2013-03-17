var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// Font Weight Conversions
MUnit( 'Font.Font Weight Conversion', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Font Weight Conversion' ].callback;

	[

		{
			name: 'Basic',
			actual: { property: 'font-weight', parts: [ 'normal' ] },
			expected: { property: 'font-weight', parts: [ '400' ] }
		},

		{
			name: 'Bold',
			actual: { property: 'font-weight', parts: [ 'bold' ] },
			expected: { property: 'font-weight', parts: [ '700' ] }
		},

		{
			name: 'Nested Normal',
			actual: { property: 'font', parts: [ '10px', 'normal', 'Arabic' ] },
			expected: { property: 'font', parts: [ '10px', '400', 'Arabic' ] }
		},

		{
			name: 'Nested Bold',
			actual: { property: 'font', parts: [ '10px', 'bold', 'Arabic' ] },
			expected: { property: 'font', parts: [ '10px', '700', 'Arabic' ] }
		},

		{
			name: 'Direct Nothing',
			actual: { property: 'font-weight', parts: [ 'lighter' ] },
			expected: { property: 'font-weight', parts: [ 'lighter' ] }
		},

		{
			name: 'Nested Nothing',
			actual: { property: 'font', parts: [ '10px', 'lighter', 'Arabic' ] },
			expected: { property: 'font', parts: [ '10px', 'lighter', 'Arabic' ] }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Font Family Quote Conversions
MUnit( 'Font.Font Family Quotes', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Font Family Quotes' ].callback;

	[

		{
			name: 'Basic',
			actual: { property: 'font-family', parts: [ '"Arial Black"' ] },
			expected: { property: 'font-family', parts: [ 'Arial Black' ] }
		},

		{
			name: 'Multi Basic',
			actual: { property: 'font', parts: [ '12pt', '"Arial Black"' ] },
			expected: { property: 'font', parts: [ '12pt', 'Arial Black' ] }
		},

		{
			name: 'Do Nothing',
			actual: { property: 'font-family', parts: [ 'Arial' ] },
			expected: { property: 'font-family', parts: [ 'Arial' ] }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Font Combinations
MUnit( 'Font.Font Combinations', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Font Combinations' ].callback;

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
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ '1px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 2',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ '1px', '/', '3px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 3',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', '1px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 4',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', '1px', '/', '3px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 5',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'normal', '1px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 6',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'normal', '1px', '/', '3px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 7',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'bold', '1px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 8',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'bold', '1px', '/', '3px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 9',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'normal', 'bold', '1px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 10',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'normal', 'bold', '1px', '/', '3px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 11',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', 'bold', '1px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 12',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', 'bold', '1px', '/', '3px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 13',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', 'normal', '1px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 14',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', 'normal', '1px', '/', '3px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 15',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', 'normal', 'bold', '1px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Basic 16',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', 'normal', 'bold', '1px', '/', '3px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Properties Inbetween',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-style',
						parts: [ 'italic' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-variant',
						parts: [ 'normal' ]
					},
					{
						property: 'font-weight',
						parts: [ 'bold' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'margin',
						parts: [ '10px' ]
					},
					{
						property: 'line-height',
						parts: [ '3px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
					},
					{
						property: 'padding',
						parts: [ '5px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ 'italic', 'normal', 'bold', '1px', '/', '3px', 'Helvetica' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'margin',
						parts: [ '10px' ]
					},
					{
						property: 'padding',
						parts: [ '5px' ]
					}
				]
			}
		},

		{
			name: 'Duplicate Properties',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
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
						property: 'font',
						parts: [ '2px', 'Helvetica' ]
					}
				]
			}
		},

		{
			name: 'Font Declared Do Nothing',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font',
						parts: [ '1px', 'Sans-serif' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
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
						property: 'font',
						parts: [ '1px', 'Sans-serif' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'font-family',
						parts: [ 'Helvetica' ]
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
