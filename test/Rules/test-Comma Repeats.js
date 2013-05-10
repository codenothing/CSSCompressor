munit( 'Rule Compression.Comma Repeats', function( assert ) {
	testRule( assert, 'Comma Repeats', [

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

	]);
});
