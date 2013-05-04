var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Selector.Comma Repeats', function( assert ) {
	var rule = CSSCompressor.rule[ 'Comma Repeats' ].callback;

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
