var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// Margin/Padding Shorthand Directionals conversions
munit( 'BorderRadius.Border Radius Shorthand', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Border Radius Shorthand' ].callback;

	[

		{
			name: '4 to 1',
			actual: { property: 'border-radius', parts: [ '10px', '10px', '10px', '10px' ], line: 0 },
			expected: { property: 'border-radius', parts: [ '10px' ], line: 0 }
		},

		{
			name: '4 to 2',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '5px', '10px', '5px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '5px' ], line: 0 }
		},

		{
			name: '4 to 3',
			actual: { property: '-moz-border-radius', parts: [ '10px', '5px', '7px', '5px' ], line: 0 },
			expected: { property: '-moz-border-radius', parts: [ '10px', '5px', '7px' ], line: 0 }
		},

		{
			name: '3 to 1',
			actual: { property: 'border-radius', parts: [ '10px', '10px', '10px' ], line: 0 },
			expected: { property: 'border-radius', parts: [ '10px' ], line: 0 }
		},

		{
			name: '3 to 2',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '9px', '10px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '9px' ], line: 0 }
		},

		{
			name: '2 to 1',
			actual: { property: '-moz-border-radius', parts: [ '10px', '10px' ], line: 0 },
			expected: { property: '-moz-border-radius', parts: [ '10px' ], line: 0 }
		},

		{
			name: '3 to 2 / 4 to 1',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '9px', '10px', '/', '1px', '1px', '1px', '1px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '9px', '/', '1px' ], line: 0 }
		},

		{
			name: '2 to 2 / 2 to 1',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '9px', '/', '1px', '1px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '9px', '/', '1px' ], line: 0 }
		},

		{
			name: '4 to 4 - Nothing',
			actual: { property: 'border-radius', parts: [ '10px', '9px', '8px', '7px' ], line: 0 },
			expected: { property: 'border-radius', parts: [ '10px', '9px', '8px', '7px' ], line: 0 }
		},

		{
			name: '3 to 3 - Nothing',
			actual: { property: '-webkit-border-radius', parts: [ '10px', '9px', '8px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '10px', '9px', '8px' ], line: 0 }
		},

		{
			name: '2 to 2 - Nothing',
			actual: { property: '-moz-border-radius', parts: [ '10px', '9px' ], line: 0 },
			expected: { property: '-moz-border-radius', parts: [ '10px', '9px' ], line: 0 }
		},

		{
			name: '1 to 1 - Nothing',
			actual: { property: 'border-radius', parts: [ '10px' ], line: 0 },
			expected: { property: 'border-radius', parts: [ '10px' ], line: 0 }
		},

		{
			name: '3 to 3 / 4 to 4 - Nothing',
			actual: { property: '-webkit-border-radius', parts: [ '7px', '8px', '9px', '/', '1px', '2px', '3px', '4px' ], line: 0 },
			expected: { property: '-webkit-border-radius', parts: [ '7px', '8px', '9px', '/', '1px', '2px', '3px', '4px' ], line: 0 }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Margin/Padding Directionals conversions
munit( 'BorderRadius.Border Radius Combinations', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Border Radius Combinations' ].callback;

	[

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top-left-radius',
						parts: [ '1px' ]
					},
					{
						property: 'border-top-right-radius',
						parts: [ '2px' ]
					},
					{
						property: 'border-bottom-right-radius',
						parts: [ '3px' ]
					},
					{
						property: 'border-bottom-left-radius',
						parts: [ '4px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-radius',
						parts: [ '1px', '2px', '3px', '4px' ]
					}
				]
			}
		},

		{
			name: 'Basic Mozilla',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: '-moz-border-radius-topleft',
						parts: [ '1px' ]
					},
					{
						property: '-moz-border-radius-topright',
						parts: [ '2px' ]
					},
					{
						property: '-moz-border-radius-bottomright',
						parts: [ '3px' ]
					},
					{
						property: '-moz-border-radius-bottomleft',
						parts: [ '4px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: '-moz-border-radius',
						parts: [ '1px', '2px', '3px', '4px' ]
					}
				]
			}
		},

		{
			name: 'Basic Webkit',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: '-webkit-border-top-left-radius',
						parts: [ '1px' ]
					},
					{
						property: '-webkit-border-top-right-radius',
						parts: [ '2px' ]
					},
					{
						property: '-webkit-border-bottom-right-radius',
						parts: [ '3px' ]
					},
					{
						property: '-webkit-border-bottom-left-radius',
						parts: [ '4px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: '-webkit-border-radius',
						parts: [ '1px', '2px', '3px', '4px' ]
					}
				]
			}
		},

		{
			name: 'Radius Override',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: '-webkit-border-radius',
						parts: [ '5px' ]
					},
					{
						property: '-webkit-border-top-right-radius',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: '-webkit-border-radius',
						parts: [ '5px', '2px', '5px', '5px' ]
					}
				]
			}
		},

		{
			name: 'Radius Override 2',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: '-moz-border-radius',
						parts: [ '5px', '2px' ]
					},
					{
						property: '-moz-border-radius-topright',
						parts: [ '10px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: '-moz-border-radius',
						parts: [ '5px', '10px', '5px', '2px' ]
					}
				]
			}
		},

		{
			name: 'Radius Override 3',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-radius',
						parts: [ '5px', '3px', '2px' ]
					},
					{
						property: 'border-bottom-left-radius',
						parts: [ '10px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-radius',
						parts: [ '5px', '3px', '2px', '10px' ]
					}
				]
			}
		},

		{
			name: 'Radius 3 Shorting',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: '-webkit-border-top-left-radius',
						parts: [ '1px' ]
					},
					{
						property: '-webkit-border-top-right-radius',
						parts: [ '2px' ]
					},
					{
						property: '-webkit-border-bottom-right-radius',
						parts: [ '3px' ]
					},
					{
						property: '-webkit-border-bottom-left-radius',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: '-webkit-border-radius',
						parts: [ '1px', '2px', '3px' ]
					}
				]
			}
		},

		{
			name: 'Radius 2 Shorting',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: '-moz-border-radius-topleft',
						parts: [ '1px' ]
					},
					{
						property: '-moz-border-radius-topright',
						parts: [ '2px' ]
					},
					{
						property: '-moz-border-radius-bottomright',
						parts: [ '1px' ]
					},
					{
						property: '-moz-border-radius-bottomleft',
						parts: [ '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: '-moz-border-radius',
						parts: [ '1px', '2px' ]
					}
				]
			}
		},

		{
			name: 'Radius Inbetween',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'border-top-left-radius',
						parts: [ '1px' ]
					},
					{
						property: 'font-size',
						parts: [ '10px' ]
					},
					{
						property: 'border-top-right-radius',
						parts: [ '1px' ]
					},
					{
						property: 'width',
						parts: [ '12px' ]
					},
					{
						property: 'border-bottom-right-radius',
						parts: [ '1px' ]
					},
					{
						property: 'height',
						parts: [ '8px' ]
					},
					{
						property: 'border-bottom-left-radius',
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
						property: 'border-radius',
						parts: [ '1px' ]
					},
					{
						property: 'font-size',
						parts: [ '10px' ]
					},
					{
						property: 'width',
						parts: [ '12px' ]
					},
					{
						property: 'height',
						parts: [ '8px' ]
					}
				]
			}
		},

		{
			name: 'Radius Divided',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top-left-radius',
						parts: [ '1px', '2px' ]
					},
					{
						property: 'border-top-right-radius',
						parts: [ '1px', '2px' ]
					},
					{
						property: 'border-bottom-right-radius',
						parts: [ '1px', '2px' ]
					},
					{
						property: 'border-bottom-left-radius',
						parts: [ '1px', '2px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-radius',
						parts: [ '1px', '/', '2px' ]
					}
				]
			}
		},

		{
			name: 'Radius Divided, 4 to 3 / 4 to 2',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top-left-radius',
						parts: [ '1px', '2px' ]
					},
					{
						property: 'border-top-right-radius',
						parts: [ '2px', '3px' ]
					},
					{
						property: 'border-bottom-right-radius',
						parts: [ '3px', '2px' ]
					},
					{
						property: 'border-bottom-left-radius',
						parts: [ '2px', '3px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-radius',
						parts: [ '1px', '2px', '3px', '/', '2px', '3px' ]
					}
				]
			}
		},

		{
			name: 'Radius All Involved',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'border-top-left-radius',
						parts: [ '1px', '1px' ]
					},
					{
						property: 'border-top-right-radius',
						parts: [ '1px', '1px' ]
					},
					{
						property: 'border-bottom-right-radius',
						parts: [ '1px', '1px' ]
					},
					{
						property: 'border-bottom-left-radius',
						parts: [ '1px', '1px' ]
					},
					{
						property: '-webkit-border-top-left-radius',
						parts: [ '1px', '1px' ]
					},
					{
						property: '-webkit-border-top-right-radius',
						parts: [ '1px', '1px' ]
					},
					{
						property: '-webkit-border-bottom-right-radius',
						parts: [ '1px', '1px' ]
					},
					{
						property: '-webkit-border-bottom-left-radius',
						parts: [ '1px', '1px' ]
					},
					{
						property: '-moz-border-radius-topleft',
						parts: [ '1px', '1px' ]
					},
					{
						property: '-moz-border-radius-topright',
						parts: [ '1px', '1px' ]
					},
					{
						property: '-moz-border-radius-bottomleft',
						parts: [ '1px', '1px' ]
					},
					{
						property: '-moz-border-radius-bottomright',
						parts: [ '1px', '1px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'border-radius',
						parts: [ '1px', '/', '1px' ]
					},
					{
						property: '-webkit-border-radius',
						parts: [ '1px', '/', '1px' ]
					},
					{
						property: '-moz-border-radius',
						parts: [ '1px', '/', '1px' ]
					}
				]
			}
		}

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
