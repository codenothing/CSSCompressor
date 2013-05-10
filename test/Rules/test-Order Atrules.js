munit( 'Rule Compression.Order Atrules', function( assert ) {
	testRule( assert, 'Order Atrules', [

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

	]);
});
