var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

munit( 'Organize.Sort Properties', function( assert ) {
	var rule = CSSCompressor.rule[ 'Sort Properties' ].callback;

	[

		{
			name: 'Basic',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'font-size',
						parts: [ '1px' ]
					},
					{
						property: 'background',
						parts: [ 'green' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'background',
						parts: [ 'green' ]
					},
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					}
				]
			}
		},

		{
			name: 'Sort Parts',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'color',
						parts: [ 'red', 'top' ]
					},
					{
						property: 'color',
						parts: [ 'green', 'left' ]
					},
					{
						property: 'color',
						parts: [ 'gray', 'center' ]
					},
					{
						property: 'color',
						parts: [ 'green', 'bottom' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'color',
						parts: [ 'gray', 'center' ]
					},
					{
						property: 'color',
						parts: [ 'green', 'bottom' ]
					},
					{
						property: 'color',
						parts: [ 'green', 'left' ]
					},
					{
						property: 'color',
						parts: [ 'red', 'top' ]
					}
				]
			}
		},

		{
			name: 'Do Nothing',
			actual: {
				selector: 'blah',
				rules: [
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					}
				]
			},
			expected: {
				selector: 'blah',
				rules: [
					{
						property: 'color',
						parts: [ 'red' ]
					},
					{
						property: 'font-size',
						parts: [ '1px' ]
					}
				]
			}
		}

	].forEach(function( object ) {
		rule( object.actual, compressor );

		assert.deepEqual( object.name, object.actual, object.expected );
	});
});
