munit( 'Rule Compression.List Style Combinations', function( assert ) {
	testRule( assert, 'List Style Combinations', [

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'list-style-type',
						parts: [ 'none' ]
					},
					{
						property: 'list-style-position',
						parts: [ 'inline' ]
					},
					{
						property: 'list-style-image',
						parts: [ 'url(images/img.gif)' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'list-style',
						parts: [ 'none', 'inline', 'url(images/img.gif)' ]
					}
				]
			}
		},

		{
			name: 'Inbetween',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'list-style-position',
						parts: [ 'inline' ]
					},
					{
						property: 'color',
						parts: [ 'white' ]
					},
					{
						property: 'list-style-image',
						parts: [ 'url(images/img.gif)' ]
					},
					{
						property: 'font-size',
						parts: [ '8px' ]
					},
					{
						property: 'list-style-type',
						parts: [ 'none' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'list-style',
						parts: [ 'none', 'inline', 'url(images/img.gif)' ]
					},
					{
						property: 'color',
						parts: [ 'white' ]
					},
					{
						property: 'font-size',
						parts: [ '8px' ]
					}
				]
			}
		},

		{
			name: 'Nothing',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'list-style-position',
						parts: [ 'inline' ]
					},
					{
						property: 'color',
						parts: [ 'white' ]
					},
					{
						property: 'list-style-image',
						parts: [ 'url(images/img.gif)' ]
					},
					{
						property: 'font-size',
						parts: [ '8px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'list-style-position',
						parts: [ 'inline' ]
					},
					{
						property: 'color',
						parts: [ 'white' ]
					},
					{
						property: 'list-style-image',
						parts: [ 'url(images/img.gif)' ]
					},
					{
						property: 'font-size',
						parts: [ '8px' ]
					}
				]
			}
		}

	]);
});
