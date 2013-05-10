munit( 'Rule Compression.ID Attribute to Selector', function( assert ) {
	testRule( assert, 'ID Attribute to Selector', [

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

	]);
});
