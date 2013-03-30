var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// Lowercase Selectors tests
munit( 'Selector.Lowercase Selectors', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Lowercase Selectors' ].callback;

	[

		{
			name: 'Basic',
			actual: [
				'Body'
			],
			expected: [
				'body'
			]
		},

		{
			name: 'Nested Basic',
			actual: [
				[
					'Body',
					'.Class'
				]
			],
			expected: [
				[
					'body',
					'.Class'
				]
			]
		}

	].forEach(function( object ) {
		var branch = { selector: 'Body', parts: object.actual, rules: [] };

		rule( branch, compressor );
		assert.deepEqual( object.name, branch.parts, object.expected );
	});
});

// Lowercase Selectors tests
munit( 'Selector.Trim Selector Attribute Quotes', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Trim Selector Attribute Quotes' ].callback;

	[

		{
			name: 'Basic',
			actual: [
				'[href="google"]'
			],
			expected: [
				'[href=google]'
			]
		},

		{
			name: 'Basic Single Quotes',
			actual: [
				"[href='google']"
			],
			expected: [
				"[href=google]"
			]
		},

		{
			name: 'Basic Nested',
			actual: [
				[
					"a",
					"[href='google']"
				]
			],
			expected: [
				[
					"a",
					"[href=google]"
				]
			]
		},

		{
			name: 'Basic Nested Double',
			actual: [
				[
					"a",
					"[href=\"google\"]"
				]
			],
			expected: [
				[
					"a",
					"[href=google]"
				]
			]
		},

		{
			name: 'Complex',
			actual: [
				"[href$=\"google\"]"
			],
			expected: [
				"[href$=google]"
			]
		},

		{
			name: 'No Trim',
			actual: [
				"[href=\"googl'e\"]"
			],
			expected: [
				"[href=\"googl'e\"]"
			]
		},

		{
			name: 'Nested No Trim',
			actual: [
				[
					"a",
					"[href=\"googl'e\"]"
				]
			],
			expected: [
				[
					"a",
					"[href=\"googl'e\"]"
				]
			]
		}

	].forEach(function( object ) {
		var branch = { selector: 'Body', parts: object.actual, rules: [] };

		rule( branch, compressor );
		assert.deepEqual( object.name, branch.parts, object.expected );
	});
});


// ID Attributes tests
munit( 'Selector.ID Attribute to Selector', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'ID Attribute to Selector' ].callback;

	[

		{
			name: 'Basic',
			actual: [
				"[id=blah]"
			],
			expected: [
				'#blah'
			]
		},

		{
			name: 'Nested Basic',
			actual: [
				[
					'a',
					"[id=blah]"
				]
			],
			expected: [
				[
					'a',
					'#blah'
				]
			]
		},

		{
			name: 'Quotes',
			actual: [
				"[id=\"blah\"]"
			],
			expected: [
				'#blah'
			]
		},

		{
			name: 'Single Quote',
			actual: [
				"[id='blah']"
			],
			expected: [
				'#blah'
			]
		},

		{
			name: 'Underscore',
			actual: [
				"[id=bl_ah]"
			],
			expected: [
				'#bl_ah'
			]
		},

		{
			name: 'Dash',
			actual: [
				"[id=bl-ah]"
			],
			expected: [
				'#bl-ah'
			]
		},

		{
			name: 'Spacing Nothing',
			actual: [
				"[id='bl ah']"
			],
			expected: [
				"[id='bl ah']"
			]
		},

		{
			name: 'Do Nothing',
			actual: [
				"[id='bl~ah']"
			],
			expected: [
				"[id='bl~ah']"
			]
		}

	].forEach(function( object ) {
		var branch = { selector: 'Body', parts: object.actual, rules: [] };

		rule( branch, compressor );
		assert.deepEqual( object.name, branch.parts, object.expected );
	});
});


// Class Attributes tests
munit( 'Selector.Class Attribute to Selector', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Class Attribute to Selector' ].callback;

	[

		{
			name: 'Basic',
			actual: [
				"[class=blah]"
			],
			expected: [
				'.blah'
			]
		},

		{
			name: 'Nested Basic',
			actual: [
				[
					'a',
					"[class=blah]"
				]
			],
			expected: [
				[
					'a',
					'.blah'
				]
			]
		},

		{
			name: 'Quotes',
			actual: [
				"[class=\"blah\"]"
			],
			expected: [
				'.blah'
			]
		},

		{
			name: 'Single Quote',
			actual: [
				"[class='blah']"
			],
			expected: [
				'.blah'
			]
		},

		{
			name: 'Underscore',
			actual: [
				"[class=bl_ah]"
			],
			expected: [
				'.bl_ah'
			]
		},

		{
			name: 'Dash',
			actual: [
				"[class=bl-ah]"
			],
			expected: [
				'.bl-ah'
			]
		},

		{
			name: 'Spacing',
			actual: [
				"[class='bl ah']"
			],
			expected: [
				[
					'.bl',
					'.ah'
				]
			]
		},

		{
			name: 'Nested Spacing',
			actual: [
				[
					"a",
					"[class='bl ah']"
				]
			],
			expected: [
				[
					"a",
					'.bl',
					'.ah'
				]
			]
		},

		{
			name: 'Do Nothing',
			actual: [
				"[class='bl~ah']"
			],
			expected: [
				"[class='bl~ah']"
			]
		}

	].forEach(function( object ) {
		var branch = { selector: 'Body', parts: object.actual, rules: [] };

		rule( branch, compressor );
		assert.deepEqual( object.name, branch.parts, object.expected );
	});
});


// Strict ID tests
munit( 'Selector.Strict ID', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Strict ID' ].callback;

	[

		{
			name: 'Basic',
			actual: [
				'html',
				'body',
				'#myid',
				'div'
			],
			expected: [
				'#myid',
				'div'
			]
		},

		{
			name: 'Nested Basic',
			actual: [
				'html',
				'body',
				[
					'#myid',
					'.class'
				],
				'div'
			],
			expected: [
				[
					'#myid',
					'.class'
				],
				'div'
			]
		},

		{
			name: 'Secondary ID',
			actual: [
				'div',
				'.class',
				',',
				'html',
				'body',
				'#myid',
				'div'
			],
			expected: [
				'div',
				'.class',
				',',
				'#myid',
				'div'
			]
		},

		{
			name: 'Double ID',
			actual: [
				'div',
				'.class',
				'#first',
				',',
				'html',
				'body',
				'#myid',
				'div'
			],
			expected: [
				'#first',
				',',
				'#myid',
				'div'
			]
		},

		{
			name: 'First Position',
			actual: [
				'#div',
				'.class',
				'div'
			],
			expected: [
				'#div',
				'.class',
				'div'
			]
		},

		{
			name: 'Nothing',
			actual: [
				'div',
				'.class',
				'.first',
				',',
				'html',
				'body',
				'.myid',
				'div'
			],
			expected: [
				'div',
				'.class',
				'.first',
				',',
				'html',
				'body',
				'.myid',
				'div'
			]
		}

	].forEach(function( object ) {
		var branch = { selector: 'Body', parts: object.actual, rules: [] };

		rule( branch, compressor );
		assert.deepEqual( object.name, branch.parts, object.expected );
	});
});


// Strict ID tests
munit( 'Selector.Comma Repeats', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Comma Repeats' ].callback;

	[

		{
			name: 'Basic',
			actual: [
				'html',
				'body',
				',',
				'html',
				'body'
			],
			expected: [
				'html',
				'body'
			]
		},

		{
			name: 'Multi Comma',
			actual: [
				'html',
				'body',
				',',
				'html',
				'div',
				'body',
				',',
				'html',
				'body'
			],
			expected: [
				'html',
				'body',
				',',
				'html',
				'div',
				'body'
			]
		},

		{
			name: 'Multi Repeats',
			actual: [
				'html',
				'body',
				',',
				'html',
				'div',
				'body',
				',',
				'html',
				'body',
				',',
				'html',
				'div',
				'body',
				',',
				'html',
				'body',
				',',
				'html',
				'div',
				'body'
			],
			expected: [
				'html',
				'body',
				',',
				'html',
				'div',
				'body'
			]
		},

		{
			name: 'Nothing',
			actual: [
				'#one',
				',',
				'#two',
				',',
				'#three',
				',',
				'#four'
			],
			expected: [
				'#one',
				',',
				'#two',
				',',
				'#three',
				',',
				'#four'
			]
		}

	].forEach(function( object ) {
		var branch = { selector: 'Body', parts: object.actual, rules: [] };

		rule( branch, compressor );
		assert.deepEqual( object.name, branch.parts, object.expected );
	});
});
