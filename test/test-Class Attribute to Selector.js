var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Selector.Class Attribute to Selector', function( assert ) {
	var rule = CSSCompressor.rule[ 'Class Attribute to Selector' ].callback;

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
