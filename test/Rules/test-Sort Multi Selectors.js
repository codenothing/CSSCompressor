munit( 'Rule Compression.Sort Multi Selectors', function( assert ) {
	testRule( assert, 'Sort Multi Selectors', [

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				parts: [
					'span',
					',',
					'a'
				]
			},
			expected: {
				selector: 'blah',
				parts: [
					'a',
					',',
					'span'
				]
			}
		},

		{
			name: 'Multi',
			actual: {
				selector: 'blah',
				parts: [
					'span',
					'div',
					',',
					'a',
					'b',
					',',
					'center',
					'span',
					',',
					'center',
					'a'
				]
			},
			expected: {
				selector: 'blah',
				parts: [
					'a',
					'b',
					',',
					'center',
					'a',
					',',
					'center',
					'span',
					',',
					'span',
					'div'
				]
			}
		},

		{
			name: 'Nested',
			actual: {
				selector: 'blah',
				parts: [
					'span',
					'div',
					',',
					[
						'a',
						'.zclassname'
					],
					',',
					'a',
					'b',
					',',
					[
						'a',
						'.classname'
					],
					',',
					'center',
					'span',
					',',
					'center',
					'a'
				]
			},
			expected: {
				selector: 'blah',
				parts: [
					'a',
					'b',
					',',
					[
						'a',
						'.classname'
					],
					',',
					[
						'a',
						'.zclassname'
					],
					',',
					'center',
					'a',
					',',
					'center',
					'span',
					',',
					'span',
					'div'
				]
			}
		},

		{
			name: 'Do Nothing',
			actual: {
				selector: 'blah',
				parts: [
					'a',
					',',
					'span'
				]
			},
			expected: {
				selector: 'blah',
				parts: [
					'a',
					',',
					'span'
				]
			}
		}

	]);
});
