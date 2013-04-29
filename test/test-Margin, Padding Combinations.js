var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'MarginPadding.Margin, Padding Combinations', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Margin, Padding Combinations' ].callback;

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
						property: 'margin-right',
						parts: [ '2px' ]
					},
					{
						property: 'margin-bottom',
						parts: [ '3px' ]
					},
					{
						property: 'margin-left',
						parts: [ '4px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin',
						parts: [ '1px', '2px', '3px', '4px' ]
					}
				]
			}
		},

		{
			name: 'Padding Override',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'padding',
						parts: [ '2px' ]
					},
					{
						property: 'padding-right',
						parts: [ '3px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'padding',
						parts: [ '2px', '3px', '2px', '2px' ]
					}
				]
			}
		},

		{
			name: 'Margin 2 Override',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'margin',
						parts: [ '2px', '3px' ]
					},
					{
						property: 'margin-right',
						parts: [ '10px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin',
						parts: [ '2px', '10px', '2px', '3px' ]
					}
				]
			}
		},

		{
			name: 'Padding 3 Override',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'padding',
						parts: [ '2px', '3px', '4px' ]
					},
					{
						property: 'padding-left',
						parts: [ '10px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'padding',
						parts: [ '2px', '3px', '4px', '10px' ]
					}
				]
			}
		},

		{
			name: 'Margin 3 Shorting',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '2px' ]
					},
					{
						property: 'margin-right',
						parts: [ '3px' ]
					},
					{
						property: 'margin-bottom',
						parts: [ '4px' ]
					},
					{
						property: 'margin-left',
						parts: [ '3px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin',
						parts: [ '2px', '3px', '4px' ]
					}
				]
			}
		},

		{
			name: 'Padding 2 Shorting',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'padding-top',
						parts: [ '2px' ]
					},
					{
						property: 'padding-right',
						parts: [ '3px' ]
					},
					{
						property: 'padding-bottom',
						parts: [ '2px' ]
					},
					{
						property: 'padding-left',
						parts: [ '3px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'padding',
						parts: [ '2px', '3px' ]
					}
				]
			}
		},

		{
			name: 'Margin All Shorting',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '2px' ]
					},
					{
						property: 'margin-right',
						parts: [ '2px' ]
					},
					{
						property: 'margin-bottom',
						parts: [ '2px' ]
					},
					{
						property: 'margin-left',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin',
						parts: [ '2px' ]
					}
				]
			}
		},

		{
			name: 'Margin Inbetween',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '2px' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'margin-right',
						parts: [ '2px' ]
					},
					{
						property: 'font-size',
						parts: [ '10px' ]
					},
					{
						property: 'margin-bottom',
						parts: [ '2px' ]
					},
					{
						property: 'width',
						parts: [ '12px' ]
					},
					{
						property: 'margin-left',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'margin',
						parts: [ '2px' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-size',
						parts: [ '10px' ]
					},
					{
						property: 'width',
						parts: [ '12px' ]
					}
				]
			}
		},

		{
			name: 'Margin & Padding',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'margin-left',
						parts: [ '4px' ]
					},
					{
						property: 'font-size',
						parts: [ '10px' ]
					},
					{
						property: 'margin-top',
						parts: [ '1px' ]
					},
					{
						property: 'padding-left',
						parts: [ '2px' ]
					},
					{
						property: 'padding-top',
						parts: [ '1px' ]
					},
					{
						property: 'margin-right',
						parts: [ '2px' ]
					},
					{
						property: 'padding-right',
						parts: [ '2px' ]
					},
					{
						property: 'margin-bottom',
						parts: [ '3px' ]
					},
					{
						property: 'padding-bottom',
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
						property: 'margin',
						parts: [ '1px', '2px', '3px', '4px' ]
					},
					{
						property: 'font-size',
						parts: [ '10px' ]
					},
					{
						property: 'padding',
						parts: [ '1px', '2px' ]
					}
				]
			}
		},

		{
			name: 'Margin Nothing',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'margin-top',
						parts: [ '2px' ]
					},
					{
						property: 'margin-right',
						parts: [ '2px' ]
					},
					{
						property: 'margin-bottom',
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
					},
					{
						property: 'margin-right',
						parts: [ '2px' ]
					},
					{
						property: 'margin-bottom',
						parts: [ '2px' ]
					}
				]
			}
		},

		{
			name: 'Padding Nothing',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'padding-top',
						parts: [ '2px' ]
					},
					{
						property: 'padding-right',
						parts: [ '2px' ]
					},
					{
						property: 'padding-bottom',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'padding-top',
						parts: [ '2px' ]
					},
					{
						property: 'padding-right',
						parts: [ '2px' ]
					},
					{
						property: 'padding-bottom',
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
