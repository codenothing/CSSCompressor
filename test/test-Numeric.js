var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// Calc Units tests
munit( 'Numeric.Calc Units', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Calc Units' ].callback;

	[

		{
			name: 'Basic',
			actual: 'calc( 100% - 10px )',
			expected: 'calc(100% - 10px)'
		},

		{
			name: 'Basic Webkit',
			actual: '-webkit-calc( 100% - 10px )',
			expected: '-webkit-calc(100% - 10px)'
		},

		{
			name: 'Basic Firefox',
			actual: '-moz-calc( 100% - 10px )',
			expected: '-moz-calc(100% - 10px)'
		},

		{
			name: 'Plus',
			actual: 'calc( 100% + 10px )',
			expected: 'calc(100% + 10px)'
		},

		{
			name: 'Plus Negative',
			actual: 'calc( 100% + -10px )',
			expected: 'calc(100% + -10px)'
		},

		{
			name: 'Multiply',
			actual: 'calc( 100% * 10px )',
			expected: 'calc(100%*10px)'
		},

		{
			name: 'Multiply Negative',
			actual: 'calc( 100% * -10px )',
			expected: 'calc(100%*-10px)'
		},

		{
			name: 'Divide',
			actual: 'calc( 100% / 10px )',
			expected: 'calc(100%/10px)'
		},

		{
			name: 'Divide Negative',
			actual: 'calc( 100% / -10px )',
			expected: 'calc(100%/-10px)'
		},

		{
			name: 'First Negative',
			actual: 'calc( -100% / -10px )',
			expected: 'calc(-100%/-10px)'
		},

		{
			name: 'Unit Compression',
			actual: 'calc( 100.0% + -0.10px )',
			expected: 'calc(100% + -.1px)'
		},

		{
			name: 'No Match',
			actual: 'clac( 100% + -10px )',
			expected: undefined
		}

	].forEach(function( object ) {
		assert.equal(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Trailing Zeroes tests
munit( 'Numeric.Trailing Zeroes', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Trailing Zeroes' ].callback;

	[

		{
			name: 'Basic',
			actual: '12.0px',
			expected: '12px'
		},

		{
			name: 'Negative Basic',
			actual: '-12.0px',
			expected: '-12px'
		},

		{
			name: 'Positive Basic',
			actual: '+12.0px',
			expected: '+12px'
		},

		{
			name: 'Multi Zeroes',
			actual: '12.000000000px',
			expected: '12px'
		},

		{
			name: 'Negative Multi Zeroes',
			actual: '-12.000000000px',
			expected: '-12px'
		},

		{
			name: 'Positive Multi Zeroes',
			actual: '+12.000000000px',
			expected: '+12px'
		},

		{
			name: 'Trailing Decimal',
			actual: '12.1000000000px',
			expected: '12.1px'
		},

		{
			name: 'Negative Trailing Decimal',
			actual: '-12.1000000000px',
			expected: '-12.1px'
		},

		{
			name: 'No Trim',
			actual: '12.059px',
			expected: undefined
		},

		{
			name: 'No Trim Negative',
			actual: '-12.059px',
			expected: undefined
		},

		{
			name: 'No Suffix',
			actual: '.750',
			expected: undefined
		}

	].forEach(function( object ) {
		assert.equal(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Leading Zeroes tests
munit( 'Numeric.Leading Zeroes', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Leading Zeroes' ].callback;

	[

		{
			name: 'Basic',
			actual: '0.2px',
			expected: '.2px'
		},

		{
			name: 'Negative Basic',
			actual: '-0.2px',
			expected: '-.2px'
		},

		{
			name: 'Percentage',
			actual: '0.2%',
			expected: '.2%'
		},

		{
			name: 'Negative Percentage',
			actual: '-0.2%',
			expected: '-.2%'
		},

		{
			name: 'No Suffix',
			actual: '0.75',
			expected: '.75'
		},

		{
			name: 'No Change',
			actual: '-10.5px',
			expected: undefined
		},

		{
			name: 'No Change Percentage',
			actual: '10.5%',
			expected: undefined
		},

		{
			name: 'No Change No Suffix',
			actual: '1.05',
			expected: undefined
		}

	].forEach(function( object ) {
		assert.equal(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Unit Suffix tests
munit( 'Numeric.Unit Suffix', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Unit Suffix' ].callback;

	[

		{
			name: 'Basic',
			actual: '0px',
			expected: '0'
		},

		{
			name: 'Basic Percentage',
			actual: '0%',
			expected: '0'
		},

		{
			name: 'Basic Negative',
			actual: '-0px',
			expected: '0'
		},

		{
			name: 'Non Zero',
			actual: '50px',
			expected: undefined
		},

		{
			name: 'Non Zero Decimal',
			actual: '50.0px',
			expected: undefined
		}

	].forEach(function( object ) {
		assert.equal(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});


// Rect Shape
munit( 'Numeric.Rect Shape', function( assert ) {
	var rule = CSSCompressor._rulesHash[ 'Rect Shape' ].callback;

	[

		{
			name: 'Basic',
			actual: 'rect( 1px, 2px, 3px, 4px )',
			expected: 'rect(1px,2px,3px,4px)'
		},

		{
			name: 'Inner Numeric',
			actual: 'rect( 1.0px, 20px, 1.5px, 20.0px )',
			expected: 'rect(1px,20px,1.5px,20px)'
		},

		{
			name: 'Case Insensitive',
			actual: 'RECT(   1px,2px,   3px,4px   )',
			expected: 'rect(1px,2px,3px,4px)'
		},

		{
			name: 'No Match',
			actual: 'reet( 1px, 2px, 3px, 4px )',
			expected: undefined
		}

	].forEach(function( object ) {
		assert.equal(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});
