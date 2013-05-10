munit( 'Rule Compression.Function Units', function( assert ) {
	testRule( assert, 'Function Units', [

		{
			name: 'Basic',
			actual: 'new-rule( top, 10px, 0.5px, 15.5, foo )',
			expected: 'new-rule(top,10px,.5px,15.5,foo)'
		},

		{
			name: 'Basic Vender Prefix',
			actual: '-webkit-new-rule( top, 10px, left, 15.5, foo )',
			expected: '-webkit-new-rule(top,10px,left,15.5,foo)'
		},

		{
			name: 'Quotes',
			actual: 'new-rule( top, "10px)", left, \')15.5\', foo )',
			expected: 'new-rule(top,"10px)",left,\')15.5\',foo)'
		},

		{
			name: 'Escapes',
			actual: 'new-rule( top, "10\\"px)", le\\)ft, 15.5, foo )',
			expected: 'new-rule(top,"10\\"px)",le\\)ft,15.5,foo)'
		},

		{
			name: 'Empty Entry',
			actual: 'new-rule( top, 10px, left, 15.5, )',
			expected: 'new-rule(top,10px,left,15.5,)'
		},

		{
			name: 'RGB Test',
			actual: 'new-rule( top, 10px, left, 15.5, rgb( 0, 0, 0 ) )',
			expected: 'new-rule(top,10px,left,15.5,#000)'
		},

		{
			name: 'No Match',
			actual: '0.5px',
			expected: undefined
		}

	]);
});
