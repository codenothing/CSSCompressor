munit( 'Rule Compression.Lowercase Selectors', function( assert ) {
	testRule( assert, 'Lowercase Selectors', [

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
		},

		{
			name: 'Do Nothing',
			actual: [
				'#ID',
				'[DATA-ID=true]',
				[
					'#NESTed',
					'[TEST=false]'
				]
			],
			expected: [
				'#ID',
				'[DATA-ID=true]',
				[
					'#NESTed',
					'[TEST=false]'
				]
			]
		}

	]);
});
