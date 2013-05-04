var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Organize.Order Atrules', function( assert ) {
	var rule = CSSCompressor.rule[ 'Order Atrules' ].callback;

	[

		{
			name: 'Basic',
			actual: [
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				}
			],
			expected: [
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				}
			]
		},

		{
			name: 'Multi',
			actual: [
				{
					atrule: '@charset "utf16"',
					parts: [
						'@charset',
						'"utf16"'
					]
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				}
			],
			expected: [
				{
					atrule: '@charset "utf16"',
					parts: [
						'@charset',
						'"utf16"'
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				}
			]
		},

		{
			name: 'Multi Imports',
			actual: [
				{
					atrule: '@charset "utf16"',
					parts: [
						'@charset',
						'"utf16"'
					]
				},
				{
					atrule: '@import "styles2.css"',
					parts: [
						'@import',
						'"styles2.css"'
					]
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				},
				{
					atrule: '@import "styles3.css"',
					parts: [
						'@import',
						'"styles3.css"'
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				}
			],
			expected: [
				{
					atrule: '@charset "utf16"',
					parts: [
						'@charset',
						'"utf16"'
					]
				},
				{
					atrule: '@import "styles2.css"',
					parts: [
						'@import',
						'"styles2.css"'
					]
				},
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				},
				{
					atrule: '@import "styles3.css"',
					parts: [
						'@import',
						'"styles3.css"'
					]
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				}
			]
		},

		{
			name: 'Nothing',
			actual: [
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				}
			],
			expected: [
				{
					atrule: '@charset "utf8"',
					parts: [
						'@charset',
						'"utf8"'
					]
				},
				{
					selector: 'span div',
					parts: [
						'span',
						'div'
					],
					rules: [
						{
							property: 'color',
							parts: [ 'red' ]
						}
					]
				}
			]
		}

	].forEach(function( object ) {
		compressor.branches = object.actual;
		rule( compressor.branches, compressor );

		assert.deepEqual( object.name, compressor.branches, object.expected );
	});
});
