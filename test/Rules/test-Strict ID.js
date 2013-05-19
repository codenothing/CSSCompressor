munit( 'Rule Compression.Strict ID', function( assert ) {
	testRule( assert, 'Strict ID', [

		{
			name: 'Basic',
			actual: [
				'html',
				'body',
				'#myid',
				'div'
			],
			expected: [
				'#myid',
				'div'
			]
		},

		{
			name: 'Nested Basic',
			actual: [
				'html',
				'body',
				[
					'#myid',
					'.class'
				],
				'div'
			],
			expected: [
				[
					'#myid',
					'.class'
				],
				'div'
			]
		},

		{
			name: 'Secondary ID',
			actual: [
				'div',
				'.class',
				',',
				'html',
				'body',
				'#myid',
				'div'
			],
			expected: [
				'div',
				'.class',
				',',
				'#myid',
				'div'
			]
		},

		{
			name: 'Double ID',
			actual: [
				'div',
				'.class',
				'#first',
				',',
				'html',
				'body',
				'#myid',
				'div'
			],
			expected: [
				'#first',
				',',
				'#myid',
				'div'
			]
		},

		{
			name: 'First Position',
			actual: [
				'#div',
				'.class',
				'div'
			],
			expected: [
				'#div',
				'.class',
				'div'
			]
		},

		{
			name: 'Hash in Attribute Nothing',
			actual: [
				'div',
				[
					'p',
					"[data-test='#hash']"
				]
			],
			expected: [
				'div',
				[
					'p',
					"[data-test='#hash']"
				]
			]
		},

		{
			name: 'Nothing',
			actual: [
				'div',
				'.class',
				'.first',
				',',
				'html',
				'body',
				'.myid',
				'div'
			],
			expected: [
				'div',
				'.class',
				'.first',
				',',
				'html',
				'body',
				'.myid',
				'div'
			]
		}

	]);
});
