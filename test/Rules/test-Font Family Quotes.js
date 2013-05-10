munit( 'Rule Compression.Font Family Quotes', function( assert ) {
	testRule( assert, 'Font Family Quotes', [

		{
			name: 'Basic',
			actual: { property: 'font-family', parts: [ '"Arial Black"' ] },
			expected: { property: 'font-family', parts: [ 'Arial Black' ] }
		},

		{
			name: 'Multi Basic',
			actual: { property: 'font', parts: [ '12pt', '"Arial Black"' ] },
			expected: { property: 'font', parts: [ '12pt', 'Arial Black' ] }
		},

		{
			name: 'Do Nothing',
			actual: { property: 'font-family', parts: [ 'Arial' ] },
			expected: { property: 'font-family', parts: [ 'Arial' ] }
		}

	]);
});
