munit( 'Settings', function( assert ) {
	var settings = new CSSCompressor.Settings(), test = true, mode = {};
	
	// Base Init is none format
	assert.equal( 'Base Non Format', settings.format, CSSCompressor.FORMAT_NONE );

	// Init false
	CSSCompressor.each( CSSCompressor.rule, function( fn, name ) {
		if ( settings[ name ] ) {
			return ( test = false );
		}
	});
	assert.ok( 'Base All False', test );


	// Ensure all nodes work with settings.update
	CSSCompressor.each( CSSCompressor.modes, function( match, mode ) {
		var key = 'Mode - ' + mode;

		test = true;
		settings.update( mode );
		CSSCompressor.each( CSSCompressor.rule, function( fn, name ) {
			if ( settings[ name ] !== match[ name ] ) {
				assert.log( key, "'" + name + "' Doesn't Match", settings[ name ], match[ name ] );
				return ( test = false );
			}
		});
		assert.ok( key, test );
	});

	// Format and Individuals
	settings.update( CSSCompressor.MODE_NONE );
	settings.update( { format: CSSCompressor.FORMAT_MED, 'Shrink Hex': true, 'Invalid Rule': true } );
	assert.equal( 'Focus - Format', settings.format, CSSCompressor.FORMAT_MED );
	assert.isTrue( 'Focus - Rule', settings[ 'Shrink Hex' ] );
	assert.empty( 'Focus - Invalid Rule', settings[ 'Invalid Rule' ] );
});
