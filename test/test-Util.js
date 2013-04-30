munit( 'Util.objectsMatch', function( assert ) {
	assert.isTrue( "Type Match", CSSCompressor.objectsMatch( 1, 1 ) );
	assert.isFalse( "Type MisMatch", CSSCompressor.objectsMatch( 1, '1' ) );

	assert.isTrue( "Empty Array", CSSCompressor.objectsMatch( [], [] ) );
	assert.isTrue( "Array Type Match", CSSCompressor.objectsMatch( [ 1 ], [ 1 ] ) );
	assert.isFalse( "Array Type MisMatch", CSSCompressor.objectsMatch( [ 1 ], [ '1' ] ) );
	assert.isTrue( "Nested Arrays", CSSCompressor.objectsMatch( [ [ 1, 2 ], [ 2, 1 ] ], [ [ 1, 2 ], [ 2, 1 ] ] ) );
	assert.isTrue( "Nested Array Objects", CSSCompressor.objectsMatch( [ { a: 1 } ], [ { a: 1 } ] ) );
	assert.isFalse( "Nested Array Objects MisMatch", CSSCompressor.objectsMatch( [ { a: 1 } ], [ { a: '1' } ] ) );

	assert.isTrue( "Empty Object", CSSCompressor.objectsMatch( {}, {} ) );
	assert.isTrue( "Object Type Match", CSSCompressor.objectsMatch( { a: 1 }, { a: 1 } ) );
	assert.isFalse( "Object Type MisMatch", CSSCompressor.objectsMatch( { a: 1 }, { a: '1' } ) );
	assert.isTrue( "Nested Objects", CSSCompressor.objectsMatch( { a: { b: 1 } }, { a: { b: 1 } } ) );
	assert.isTrue( "Nested Object Arrays", CSSCompressor.objectsMatch( { a: [ 1 ] }, { a: [ 1 ] } ) );
	assert.isFalse( "Nested Object Array MisMatch", CSSCompressor.objectsMatch( { a: [ 1 ] }, { a: [ '1' ] } ) );
});

// Static compression access
munit( 'Util.compress', function( assert ) {
	var compressor = new CSSCompressor( CSSCompressor.MODE_NONE );

	compressor.settings.update({ format: CSSCompressor.FORMAT_NONE });
	compressor.compress( "#a{color:black}" );
	assert.equal( 'No Compression', compressor.css, "#a{color:black}" );

	compressor.settings.update({ "Color to Hex": true, "Shrink Hex": true });
	compressor.compress();
	assert.equal( 'Compression Success', compressor.css, "#a{color:#000}" );
});


// Callback testing adds rules to the global cache, wait till all other tests are complete
munit( 'Util.addRuleCallback', { priority: munit.PRIORITY_LOWEST }, function( assert ) {
	var rule;

	// For the purpose of this test, ensure that the callback stack exists
	assert.exists( 'Callback Stack Exists', CSSCompressor._addRuleStack );

	// Testing that new rule triggers true on all modes except none
	CSSCompressor.addRule( "New Rule Test", CSSCompressor.noop );
	CSSCompressor.each( CSSCompressor.modes, function( settings, name ) {
		if ( name !== CSSCompressor.MODE_NONE ) {
			assert.isTrue( "True New Rule Test - " + name, settings[ 'New Rule Test' ] );
		}
	});


	// New Rules
	CSSCompressor._addRuleStack = [];
	CSSCompressor.addRuleCallback(function( options ) {
		assert.equal( 'Add Rule Addition', options.name, "New Rule" );
	});
	CSSCompressor.addRule( "New Rule", CSSCompressor.noop );

	// New Values
	CSSCompressor._addRuleStack = [];
	CSSCompressor.addRuleCallback(function( options ) {
		assert.equal( 'Add Value Addition', options.name, "New Value" );
	});
	CSSCompressor.addValue( "New Value", CSSCompressor.noop );

	// New Rule Blocks
	CSSCompressor._addRuleStack = [];
	CSSCompressor.addRuleCallback(function( options ) {
		assert.equal( 'Add Rule Block Addition', options.name, "New Rule Block" );
	});
	CSSCompressor.addRuleBlock( "New Rule Block", CSSCompressor.noop );

	// New Rule Sheets
	CSSCompressor._addRuleStack = [];
	CSSCompressor.addRuleCallback(function( options ) {
		assert.equal( 'Add Rule Sheet Addition', options.name, "New Rule Sheet" );
	});
	CSSCompressor.addRuleSheet( "New Rule Sheet", CSSCompressor.noop );
});
