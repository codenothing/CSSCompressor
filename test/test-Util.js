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