munit( 'Rule Compression.Calc Units', function( assert ) {
	testRule( assert, 'Calc Units', [

		{
			name: 'Basic',
			actual: 'calc( 100% - 10.0px )',
			expected: 'calc(100% - 10px)'
		},

		{
			name: 'Basic Webkit',
			actual: '-webkit-calc( 100% - 10px )',
			expected: '-webkit-calc(100% - 10px)'
		},

		{
			name: 'Basic Firefox',
			actual: '-moz-calc( 100% - 10px )',
			expected: '-moz-calc(100% - 10px)'
		},

		{
			name: 'Plus',
			actual: 'calc( 100% + 10px )',
			expected: 'calc(100% + 10px)'
		},

		{
			name: 'Plus Negative',
			actual: 'calc( 100% + -10px )',
			expected: 'calc(100% + -10px)'
		},

		{
			name: 'Multiply',
			actual: 'calc( 100% * 10px )',
			expected: 'calc(100%*10px)'
		},

		{
			name: 'Multiply Negative',
			actual: 'calc( 100% * -10px )',
			expected: 'calc(100%*-10px)'
		},

		{
			name: 'Divide',
			actual: 'calc( 100% / 10px )',
			expected: 'calc(100%/10px)'
		},

		{
			name: 'Divide Negative',
			actual: 'calc( 100% / -10px )',
			expected: 'calc(100%/-10px)'
		},

		{
			name: 'First Negative',
			actual: 'calc( -100% / -10px )',
			expected: 'calc(-100%/-10px)'
		},

		{
			name: 'Unit Compression',
			actual: 'calc( 100.0% + -0.10px )',
			expected: 'calc(100% + -.1px)'
		},

		{
			name: 'No Match',
			actual: 'clac( 100% + -10px )',
			expected: undefined
		}

	]);
});
