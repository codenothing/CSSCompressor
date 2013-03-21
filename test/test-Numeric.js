var compressor = new CSSCompressor( CSSCompressor.MODE_MAX );

// Prevent logging
compressor.log = CSSCompressor.noop;


// Trailing Zeroes tests
MUnit( 'Numeric.Trailing Zeroes', function( assert ) {
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
			expected: '12.059px'
		},

		{
			name: 'No Trim Negative',
			actual: '-12.059px',
			expected: '-12.059px'
		},

		{
			name: 'No Suffix',
			actual: '.750',
			expected: '.750'
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
MUnit( 'Numeric.Leading Zeroes', function( assert ) {
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
			name: 'No Change',
			actual: '-10.5px',
			expected: '-10.5px'
		},

		{
			name: 'No Change Percentage',
			actual: '10.5%',
			expected: '10.5%'
		},

		{
			name: 'No Suffix',
			actual: '0.75',
			expected: '.75'
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
MUnit( 'Numeric.Unit Suffix', function( assert ) {
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
			expected: '50px'
		},

		{
			name: 'Non Zero Decimal',
			actual: '50.0px',
			expected: '50.0px'
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
MUnit( 'Numeric.Rect Shape', function( assert ) {
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
		}

	].forEach(function( object ) {
		assert.equal(
			object.name,
			rule( object.actual, null, compressor ),
			object.expected
		);
	});
});
