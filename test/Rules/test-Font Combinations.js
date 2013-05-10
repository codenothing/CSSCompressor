munit( 'Rule Compression.Font Combinations', function( assert ) {
	testRule( assert, 'Font Combinations', [

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

	]);
});
