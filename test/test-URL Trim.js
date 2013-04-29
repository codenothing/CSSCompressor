var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Misc.URL Trim', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'URL Trim' ].callback;

	[

		{
			name: 'Basic',
			actual: { property: 'background', parts: [ 'url("http://www.google.com")' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(http://www.google.com)' ], line: 0 }
		},

		{
			name: 'Basic Single',
			actual: { property: 'background', parts: [ 'url(\'http://www.google.com\')' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(http://www.google.com)' ], line: 0 }
		},

		{
			name: 'Inner double Quote',
			actual: { property: 'background', parts: [ 'url(\'http://www.goo"gle.com\')' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(http://www.goo"gle.com)' ], line: 0 }
		},

		{
			name: 'Inner Single Quote',
			actual: { property: 'background', parts: [ 'url(\'http://www.goo\'gle.com\')' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(http://www.goo\'gle.com)' ], line: 0 }
		},

		{
			name: 'Do Nothing',
			actual: { property: 'background', parts: [ 'url(\'http://www.google.com)' ], line: 0 },
			expected: { property: 'background', parts: [ 'url(\'http://www.google.com)' ], line: 0 }
		},

		{
			name: 'Do Nothing Double',
			actual: { property: 'background', parts: [ 'url("http://www.google.com)' ], line: 0 },
			expected: { property: 'background', parts: [ 'url("http://www.google.com)' ], line: 0 }
		}

	].forEach(function( object ) {
		object.actual.value = object.actual.parts.join( ' ' );
		object.expected.value = object.actual.value;
		rule( object.actual, { selector: 'p', rules: [ object.actual ] }, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
