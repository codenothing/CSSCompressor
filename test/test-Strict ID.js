var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Selector.Strict ID', function( assert ) {
	var rule = CSSCompressor.rule[ 'Strict ID' ].callback;

	[

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

	].forEach(function( object ) {
		var branch = { selector: 'Body', parts: object.actual, rules: [] };

		rule( branch, compressor );
		assert.deepEqual( object.name, branch.parts, object.expected );
	});
});
