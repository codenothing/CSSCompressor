munit( 'Rule Compression.Trim Selector Attribute Quotes', function( assert ) {
	testRule( assert, 'Trim Selector Attribute Quotes', [

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

	]);
});
