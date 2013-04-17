munit( 'CSSCompressor', { priority: 1.0 } );

// Add basic existance tests to ensure api stays consistent through versions
// THESE TESTS CANNOT CHANGE (without heavy consideration)
munit( 'CSSCompressor.init', function( assert ) {
	var compressor = new CSSCompressor();

	assert.isObject( 'settings', compressor.settings );
	assert.isObject( 'stats', compressor.stats );
	assert.isFunction( 'log', compressor.log );
	assert.isFunction( 'compress', compressor.compress );
	assert.isFunction( 'value', compressor.value );
});

// Same concept, make sure sub objects stay consistent through versions
// THESE TESTS CANNOT CHANGE (without heavy consideration)
munit( 'CSSCompressor.static', function( assert ) {
	assert.isFunction( 'compress', CSSCompressor.compress );
	assert.isFunction( 'Settings', CSSCompressor.Settings );
	assert.isFunction( 'Stats', CSSCompressor.Stats );

	// Tables
	assert.isObject( 'Tables', CSSCompressor.tables );
	assert.isObject( 'Tables - Color to Hex', CSSCompressor.tables.color2hex );
	assert.isObject( 'Tables - Hex to short color', CSSCompressor.tables.hex2shortcolor );
	assert.isObject( 'Tables - Hex to short safe', CSSCompressor.tables.hex2shortsafe );

	// Priority Levels
	assert.isNumber( 'Priority Highest', CSSCompressor.PRIORITY_HIGHEST );
	assert.isNumber( 'Priority Higher', CSSCompressor.PRIORITY_HIGHER );
	assert.isNumber( 'Priority High', CSSCompressor.PRIORITY_HIGH );
	assert.isNumber( 'Priority Default', CSSCompressor.PRIORITY_DEFAULT );
	assert.isNumber( 'Priority Low', CSSCompressor.PRIORITY_LOW );
	assert.isNumber( 'Priority Lower', CSSCompressor.PRIORITY_LOWER );
	assert.isNumber( 'Priority Lowest', CSSCompressor.PRIORITY_LOWEST );

	// Formatters
	assert.isFunction( 'Format Addition', CSSCompressor.addFormat );
	assert.isString( 'Format Max', CSSCompressor.FORMAT_MAX );
	assert.isString( 'Format Med', CSSCompressor.FORMAT_MED );
	assert.isString( 'Format Min', CSSCompressor.FORMAT_MIN );
	assert.isString( 'Format None', CSSCompressor.FORMAT_NONE );

	// Modes
	assert.isFunction( 'Mode Addition', CSSCompressor.addMode );
	assert.isString( 'Mode None', CSSCompressor.MODE_NONE );
	assert.isString( 'Mode Default', CSSCompressor.MODE_DEFAULT );
	assert.isString( 'Mode Max', CSSCompressor.MODE_MAX );

	// Rules
	assert.isFunction( 'Add Value Compression', CSSCompressor.addValue );
	assert.isFunction( 'Add Rule Compression', CSSCompressor.addRule );
	assert.isFunction( 'Add Rule Block Compression', CSSCompressor.addRuleBlock );
	assert.isFunction( 'Add Rule Sheet Compression', CSSCompressor.addRuleSheet );
	assert.isFunction( 'Add Rule Callback', CSSCompressor.addRuleCallback );
});
