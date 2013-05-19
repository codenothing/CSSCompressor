// Same concept, make sure sub objects stay consistent through versions
// THESE TESTS CANNOT CHANGE (without heavy consideration)
munit( 'Format.static', { priority: munit.PRIORITY_HIGHEST }, function( assert ) {
	assert.isFunction( 'Format Base', CSSCompressor.format );
	assert.isString( 'Format Max', CSSCompressor.FORMAT_MAX );
	assert.isString( 'Format Med', CSSCompressor.FORMAT_MED );
	assert.isString( 'Format Min', CSSCompressor.FORMAT_MIN );
	assert.isString( 'Format None', CSSCompressor.FORMAT_NONE );
});

munit( 'Format.add', { priority: munit.PRIORITY_LOW }, function( assert ) {
	// Protect against bad parameter
	assert.throws( 'Callback Protection', /Format Callback not Defined/, function(){
		CSSCompressor.format( 'No Callback Format' );
	});

	// Allow good addition first
	assert.doesNotThrow( 'Basic Addition', function(){
		CSSCompressor.format( 'Test Format', CSSCompressor.noop );
	});
	assert.exists( 'Test Format Exists', CSSCompressor.format[ 'Test Format' ] );

	// Protection against duplicates
	assert.throws( 'Duplicate Protection', /'Test Format' format already exists/, function(){
		CSSCompressor.format( 'Test Format', CSSCompressor.noop );
	});

	var custom = function(){};
	assert.notEqual( 'Overwrite Pretest', CSSCompressor.format[ 'Test Format' ], custom );
	assert.doesNotThrow( 'Overwrite Allowed', function(){
		CSSCompressor.format({ name: 'Test Format', overwrite: true, callback: custom });
	});
	assert.equal( 'Overwrite Matches', CSSCompressor.format[ 'Test Format' ].callback, custom );
});
