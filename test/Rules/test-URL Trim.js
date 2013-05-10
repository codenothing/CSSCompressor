munit( 'Rule Compression.URL Trim', function( assert ) {
	testRule( assert, 'URL Trim', [

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

	]);
});
