var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Font.Font Family Quotes', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Font Family Quotes' ].callback;

	[

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

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
