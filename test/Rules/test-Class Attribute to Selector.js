munit( 'Rule Compression.Class Attribute to Selector', function( assert ) {
	testRule( assert, 'Class Attribute to Selector', [

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

	]);
});
