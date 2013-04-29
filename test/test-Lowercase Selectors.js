var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

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
