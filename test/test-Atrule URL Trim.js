var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Misc.Atrule URL Trim', function( assert ) {
	var rule = CSSCompressor.rule[ 'Atrule URL Trim' ].callback;

	[

		{
			name: 'Basic',
			actual: {
				atrule: '@import url(http://www.google.com)',
				parts: [ '@import', 'url(http://www.google.com)' ],
				rules: []
			},
			expected: {
				atrule: '@import url(http://www.google.com)',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			}
		},

		{
			name: 'Single Quotes',
			actual: {
				atrule: '@import url(\'http://www.google.com\')',
				parts: [ '@import', 'url(\'http://www.google.com\')' ],
				rules: []
			},
			expected: {
				atrule: '@import url(\'http://www.google.com\')',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			}
		},

		{
			name: 'Double Quotes',
			actual: {
				atrule: '@import url("http://www.google.com")',
				parts: [ '@import', 'url("http://www.google.com")' ],
				rules: []
			},
			expected: {
				atrule: '@import url("http://www.google.com")',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			}
		},

		{
			name: 'Query String',
			actual: {
				atrule: '@import url("crazyurl.css?semi=yes;&email=corey@codenothing.com")',
				parts: [ '@import', 'url("crazyurl.css?semi=yes;&email=corey@codenothing.com")' ],
				rules: []
			},
			expected: {
				atrule: '@import url("crazyurl.css?semi=yes;&email=corey@codenothing.com")',
				parts: [ '@import', '"crazyurl.css?semi=yes;&email=corey@codenothing.com"' ],
				rules: []
			}
		},

		{
			name: 'Do Nothing',
			actual: {
				atrule: '@import "http://www.google.com"',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			},
			expected: {
				atrule: '@import "http://www.google.com"',
				parts: [ '@import', '"http://www.google.com"' ],
				rules: []
			}
		}

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
