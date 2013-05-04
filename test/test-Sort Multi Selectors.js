var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Organize.Sort Multi Selectors', function( assert ) {
	var rule = CSSCompressor.rule[ 'Sort Multi Selectors' ].callback;

	[

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

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
