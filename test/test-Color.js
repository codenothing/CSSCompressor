var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// RGB to Hex conversions
MUnit( 'Color.RGB to Hex', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'RGB to Hex' ].callback;

	[

		{
			name: 'Basic',
			actual: 'rgb(214,123,214)',
			expected: '#d67bd6'
		},

		{
			name: 'Basic Spacing',
			actual: 'rgb( 214 , 123 , 214 )',
			expected: '#d67bd6'
		},

		{
			name: 'Basic Percentage',
			actual: 'rgb( 50%, 50%, 50% )',
			expected: '#7f7f7f'
		},

		{
			name: 'Basic Single',
			actual: 'rgb(145)',
			expected: '#919191'
		},

		{
			name: 'Basic Single Percentage',
			actual: 'rgb(50%)',
			expected: '#7f7f7f'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Color to Hex conversions
MUnit( 'Color.Color to Hex', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Color to Hex' ].callback;

	[

		{
			name: 'Basic',
			actual: 'aliceblue',
			expected: '#f0f8ff'
		},

		{
			name: 'Basic Uppercase',
			actual: 'ALICEBLUE',
			expected: '#f0f8ff'
		},

		{
			name: 'No Conversion',
			actual: 'foobar',
			expected: 'foobar'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Color to Hex conversions
MUnit( 'Color.Hex to Color', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Hex to Color' ].callback;

	[

		{
			name: 'Basic',
			actual: '#fffff0',
			expected: 'ivory'
		},

		{
			name: 'Basic Uppercase',
			actual: '#FFFFF0',
			expected: 'ivory'
		},

		{
			name: 'No Conversion',
			actual: 'foobar',
			expected: 'foobar'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Hex to Safe Color conversions
MUnit( 'Color.Hex to Safe Color', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Hex to Color' ].callback;

	[

		{
			name: 'Basic',
			actual: '#000080',
			expected: 'navy'
		},

		{
			name: 'Basic Uppercase',
			actual: '#c0c0c0',
			expected: 'silver'
		},

		{
			name: 'No Conversion',
			actual: 'foobar',
			expected: 'foobar'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Shrink Hex conversions
MUnit( 'Color.Shrink Hex', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Shrink Hex' ].callback;

	[

		{
			name: 'Basic',
			actual: '#000000',
			expected: '#000'
		},

		{
			name: 'Basic Separation',
			actual: '#aa6600',
			expected: '#a60'
		},

		{
			name: 'No Conversion',
			actual: '#772213',
			expected: '#772213'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Shrink Hex conversions
MUnit( 'Color.Lowercase Hex', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Lowercase Hex' ].callback;

	[

		{
			name: 'Basic',
			actual: '#ABCDEF',
			expected: '#abcdef'
		},

		{
			name: 'Basic Short',
			actual: '#ABC',
			expected: '#abc'
		},

		{
			name: 'Mixed',
			actual: '#A72B3C',
			expected: '#a72b3c'
		},

		{
			name: 'Mixed Short',
			actual: '#A72',
			expected: '#a72'
		},

		{
			name: 'No Match',
			actual: '#A72B3',
			expected: '#A72B3'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});
