var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// RGBA to RGB conversions
munit( 'Misc.Paren Whitespace', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Paren Whitespace' ].callback;

	[

		{
			name: 'Basic',
			actual: 'new-rule( top, 10px, left, 15.5, archaic )',
			expected: 'new-rule(top,10px,left,15.5,archaic)'
		},

		{
			name: 'Basic Vender Prefix',
			actual: '-webkit-new-rule( top, 10px, left, 15.5, archaic )',
			expected: '-webkit-new-rule(top,10px,left,15.5,archaic)'
		},

		{
			name: 'Quotes',
			actual: 'new-rule( top, "10px)", left, \')15.5\', archaic )',
			expected: 'new-rule(top,"10px)",left,\')15.5\',archaic)'
		},

		{
			name: 'Escapes',
			actual: 'new-rule( top, "10\\"px)", le\\)ft, 15.5, archaic )',
			expected: 'new-rule(top,"10\\"px)",le\\)ft,15.5,archaic)'
		},

		{
			name: 'Empty Entry',
			actual: 'new-rule( top, 10px, left, 15.5, )',
			expected: 'new-rule(top,10px,left,15.5,)'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// None Conversions
munit( 'Misc.None Conversions', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'None Conversions' ].callback;

	[

		{
			name: 'Border',
			actual: { property: 'border', parts: [ 'none' ], line: 0 },
			expected: { property: 'border', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Background',
			actual: { property: 'background', parts: [ 'none' ], line: 0 },
			expected: { property: 'background', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Border Top',
			actual: { property: 'border-top', parts: [ 'none' ], line: 0 },
			expected: { property: 'border-top', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Border Right',
			actual: { property: 'border-right', parts: [ 'NONE' ], line: 0 },
			expected: { property: 'border-right', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Border Bottom',
			actual: { property: 'border-bottom', parts: [ 'noNe' ], line: 0 },
			expected: { property: 'border-bottom', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Border Left',
			actual: { property: 'border-left', parts: [ 'None' ], line: 0 },
			expected: { property: 'border-left', parts: [ '0' ], line: 0 }
		},

		{
			name: 'Nothing',
			actual: { property: 'color', parts: [ 'none' ], line: 0 },
			expected: { property: 'color', parts: [ 'none' ], line: 0 }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// URL Trimming in properties
munit( 'Misc.URL Trim', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'URL Trim' ].callback;

	[

		{
			name: 'Basic',
			actual: { property: 'background', parts: [ 'url("http://www.google.com")' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(http://www.google.com)' ], line: 0 }
		},

		{
			name: 'Basic Single',
			actual: { property: 'background', parts: [ 'url(\'http://www.google.com\')' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(http://www.google.com)' ], line: 0 }
		},

		{
			name: 'Inner double Quote',
			actual: { property: 'background', parts: [ 'url(\'http://www.goo"gle.com\')' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(http://www.goo"gle.com)' ], line: 0 }
		},

		{
			name: 'Inner Single Quote',
			actual: { property: 'background', parts: [ 'url(\'http://www.goo\'gle.com\')' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(http://www.goo\'gle.com)' ], line: 0 }
		},

		{
			name: 'Do Nothing',
			actual: { property: 'background', parts: [ 'url(\'http://www.google.com)' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(\'http://www.google.com)' ], line: 0 }
		},

		{
			name: 'Do Nothing Double',
			actual: { property: 'background', parts: [ 'url("http://www.google.com)' ], line: 0 },
			expected: { property: 'background', parts: [ 'url("http://www.google.com)' ], line: 0 }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Gradient value trimming
munit( 'Misc.Gradient Compression', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Gradient Compression' ].callback;

	[

		{
			name: 'Basic String Trim',
			actual: { property: 'background', parts: [ '-webkit-linear-gradient( 45deg, #777 2%, #555 50%, #333 100% )' ], line: 0 },
			expected: { property: 'background', parts: [ '-webkit-linear-gradient(45deg,#777 2%,#555 50%,#333 100%)' ], line: 0 }
		},

		{
			name: 'Color and Number Compressions',
			actual: { property: 'background', parts: [ '-webkit-linear-gradient( 45deg, #777777 0%, #555 50.0%, #333333 100% )' ], line: 0 },
			expected: { property: 'background', parts: [ '-webkit-linear-gradient(45deg,#777 0,#555 50%,#333 100%)' ], line: 0 }
		},

		{
			name: 'Do Nothing RGB',
			actual: { property: 'background', parts: [ '-webkit-linear-gradient(45deg, rgb( 0, 0, 0 ) 2%, #555 50%, #333 100%)' ], line: 0 },
			expected: { property: 'background', parts: [ '-webkit-linear-gradient(45deg,rgb( 0, 0, 0 ) 2%,#555 50%,#333 100%)' ], line: 0 }
		},

		{
			name: 'Do Nothing Bad Match',
			actual: { property: 'background', parts: [ '-webkit-linear( 45deg, #777 2%, #555 50%, #333 100% )' ], line: 0 },
			expected: { property: 'background', parts: [ '-webkit-linear( 45deg, #777 2%, #555 50%, #333 100% )' ], line: 0 }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});


// Font Combinations
munit( 'Misc.Atrule URL Trim', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Atrule URL Trim' ].callback;

	[

		{
			name: 'Basic',
			actual: {
				atrule: '@import url(http://www.google.com)',
				parts: [ '@import', 'url(http://www.google.com)' ],
				rules: []
			},
			expected: {
				atrule: '@import url(http://www.google.com)',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			}
		},

		{
			name: 'Single Quotes',
			actual: {
				atrule: '@import url(\'http://www.google.com\')',
				parts: [ '@import', 'url(\'http://www.google.com\')' ],
				rules: []
			},
			expected: {
				atrule: '@import url(\'http://www.google.com\')',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			}
		},

		{
			name: 'Double Quotes',
			actual: {
				atrule: '@import url("http://www.google.com")',
				parts: [ '@import', 'url("http://www.google.com")' ],
				rules: []
			},
			expected: {
				atrule: '@import url("http://www.google.com")',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			}
		},

		{
			name: 'Query String',
			actual: {
				atrule: '@import url("crazyurl.css?semi=yes;&email=corey@codenothing.com")',
				parts: [ '@import', 'url("crazyurl.css?semi=yes;&email=corey@codenothing.com")' ],
				rules: []
			},
			expected: {
				atrule: '@import url("crazyurl.css?semi=yes;&email=corey@codenothing.com")',
				parts: [ '@import', '"crazyurl.css?semi=yes;&email=corey@codenothing.com"' ],
				rules: []
			}
		},

		{
			name: 'Do Nothing',
			actual: {
				atrule: '@import "http://www.google.com"',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			},
			expected: {
				atrule: '@import "http://www.google.com"',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			}
		}

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
