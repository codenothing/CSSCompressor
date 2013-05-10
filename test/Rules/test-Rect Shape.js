munit( 'Rule Compression.Rect Shape', function( assert ) {
	testRule( assert, 'Rect Shape', [

		{
			name: 'Basic',
			actual: 'rect( 1px, 2px, 3px, 4px )',
			expected: 'rect(1px,2px,3px,4px)'
		},

		{
			name: 'Inner Numeric',
			actual: 'rect( 1.0px, 20px, 1.5px, 20.0px )',
			expected: 'rect(1px,20px,1.5px,20px)'
		},

		{
			name: 'Case Insensitive',
			actual: 'RECT(   1px,2px,   3px,4px   )',
			expected: 'rect(1px,2px,3px,4px)'
		},

		{
			name: 'No Match',
			actual: 'reet( 1px, 2px, 3px, 4px )',
			expected: undefined
		}

	]);
});
