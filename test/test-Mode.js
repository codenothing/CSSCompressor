munit( 'Mode', { priority: munit.PRIORITY_LOW }, function( assert ) {
	assert.isFunction( 'Mode Existance', CSSCompressor.mode );
	assert.exists( 'Mode Type None Existance', CSSCompressor.MODE_NONE );
	assert.exists( 'Mode Type Default Existance', CSSCompressor.MODE_DEFAULT );
	assert.exists( 'Mode Type Max Existance', CSSCompressor.MODE_MAX );
	assert.exists( 'Mode Exists None', CSSCompressor.mode[ CSSCompressor.MODE_NONE ] );
	assert.exists( 'Mode Exists Default', CSSCompressor.mode[ CSSCompressor.MODE_DEFAULT ] );
	assert.exists( 'Mode Exists Max', CSSCompressor.mode[ CSSCompressor.MODE_MAX ] );
	assert.equal( 'Mode Count', Object.keys( CSSCompressor.mode ).length, 3 );

	// Custom Mode Matching
	var pass = true, match = {
		"Strict ID": false,
		"Font Combinations": false,
		"Border Radius Combinations": false,
		"List Style Combinations": false
	};
	CSSCompressor.mode( 'Custom Mode', match );
	assert.exists( 'Custom Mode', CSSCompressor.mode[ 'Custom Mode' ] );
	CSSCompressor.each( CSSCompressor.mode[ 'Custom Mode' ], function( value, name ) {
		if ( name !== 'format' ) {
			if ( match.hasOwnProperty( name ) && value !== false ) {
				return ( pass = false );
			}
			else if ( ! match.hasOwnProperty( name ) && value !== true ) {
				return ( pass = false );
			}
		}
	});
	assert.ok( 'Custom Mode Match', pass );
	console.log( CSSCompressor.mode[ 'Custom Mode' ] );

	// Overwrite Protection
	assert.doesNotThrow( 'No Overwrite', function(){
		CSSCompressor.mode( 'Mode Overwrite Test', { 'Shrink Hex': false } );
	});
	assert.throws( 'Overwrite Protection Thrown', /'Mode Overwrite Test' mode already exists/, function(){
		CSSCompressor.mode( 'Mode Overwrite Test', { 'Shrink Hex': true } );
	});
	assert.isFalse( 'Original Mode', CSSCompressor.mode[ 'Mode Overwrite Test' ][ 'Shrink Hex' ] );
});
