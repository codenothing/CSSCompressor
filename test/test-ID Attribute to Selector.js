var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Selector.ID Attribute to Selector', function( assert ) {
	var rule = CSSCompressor.rule[ 'ID Attribute to Selector' ].callback;

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
