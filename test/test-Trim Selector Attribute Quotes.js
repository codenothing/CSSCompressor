var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

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
