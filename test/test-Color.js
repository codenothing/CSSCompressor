var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// RGBA to RGB conversions
munit( 'Color.RGBA to RGB', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'RGBA to RGB' ].callback;

	[

		{
			name: 'Basic',
			actual: 'rgba(10%,10%,10%,1)',
			expected: 'rgb(10%,10%,10%)'
		},

		{
			name: 'Basic Spacing',
			actual: 'rgba( 214, 112, 87, 1 )',
			expected: 'rgb(214,112,87)'
		},

		{
			name: 'Basic Suffix',
			actual: 'rgba( 10%, 10%, 10%, 1.0 )',
			expected: 'rgb(10%,10%,10%)'
		},

		{
			name: 'Not 100%',
			actual: 'rgba( 10%, 10%, 10%, 0.5 )',
			expected: 'rgba( 10%, 10%, 10%, 0.5 )'
		},

		{
			name: 'Not RGBA',
			actual: 'rgb( 10%, 10%, 10%, 1 )',
			expected: 'rgb( 10%, 10%, 10%, 1 )'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// HSLA to HSL conversions
munit( 'Color.HSLA to HSL', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'HSLA to HSL' ].callback;

	[

		{
			name: 'Basic',
			actual: 'hsla(214,10%,10%,1)',
			expected: 'hsl(214,10%,10%)'
		},

		{
			name: 'Basic Spacing',
			actual: 'hsla( 214, 10%, 10%, 1 )',
			expected: 'hsl(214,10%,10%)'
		},

		{
			name: 'Basic Suffix',
			actual: 'hsla( 214, 10%, 10%, 1.0 )',
			expected: 'hsl(214,10%,10%)'
		},

		{
			name: 'Not 100%',
			actual: 'hsla( 214, 10%, 10%, 0.5 )',
			expected: 'hsla( 214, 10%, 10%, 0.5 )'
		},

		{
			name: 'Not HSLA',
			actual: 'hsl( 214, 10%, 10%, 1 )',
			expected: 'hsl( 214, 10%, 10%, 1 )'
		}

	].forEach(function( object ) {
		assert.deepEqual(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// RGB to Hex conversions
munit( 'Color.RGB to Hex', function( assert ) {
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


// HSL to Hex conversions
munit( 'Color.HSL to Hex', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'HSL to Hex' ].callback;

	[

		{
			name: 'Basic',
			actual: 'hsl(312,54%,68%)',
			expected: '#d981c8'
		},

		{
			name: 'Basic Spacing',
			actual: 'hsl( 116, 34%, 43% )',
			expected: '#4d9348'
		},

		{
			name: 'No Saturation',
			actual: 'hsl( 116, 0%, 43% )',
			expected: '#6e6e6e'
		},

		{
			name: 'Invalid Hue',
			actual: 'hsl( 416, 15%, 43% )',
			expected: 'hsl( 416, 15%, 43% )'
		},

		{
			name: 'Invalid Saturation',
			actual: 'hsl( 116, 105%, 43% )',
			expected: 'hsl( 116, 105%, 43% )'
		},

		{
			name: 'Invalid Lightness',
			actual: 'hsl( 116, 10%, 435% )',
			expected: 'hsl( 116, 10%, 435% )'
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
munit( 'Color.Color to Hex', function( assert ) {
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
munit( 'Color.Hex to Color', function( assert ) {
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
munit( 'Color.Hex to Safe Color', function( assert ) {
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
munit( 'Color.Shrink Hex', function( assert ) {
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
munit( 'Color.Lowercase Hex', function( assert ) {
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
