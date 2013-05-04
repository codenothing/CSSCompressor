var fs = require( 'fs' ),
	ROOT = __dirname + '/../';


// Wait for most tests to run since these will be adding rules
munit( 'Rule', { priority: munit.PRIORITY_LOWEST } );


// Base rule additions
munit( 'Rule.rule', function( assert ) {
	var rule;

	// Base testing
	assert.isFunction( 'Rule Existance', CSSCompressor.rule );
	assert.equal( 'Rule count', CSSCompressor.rule().length, fs.readdirSync( ROOT + 'lib/rules' ).length );

	// Test rule type matching
	CSSCompressor.each([
		CSSCompressor.RULE_TYPE_VALUE,
		CSSCompressor.RULE_TYPE_RULE,
		CSSCompressor.RULE_TYPE_BLOCK,
		CSSCompressor.RULE_TYPE_SHEET
	], function( type ) {
		var actual = CSSCompressor.rule( type ),
			expected = CSSCompressor.rule().filter(function( rule ) {
				return rule.type === type;
			});

		assert.deepEqual( "Rule Type Stack - " + type, actual, expected );
	});

	// Rules must have callbacks
	assert.throws( 'Callback Empty', /Rule callback not defined/, function(){
		CSSCompressor.rule({ name: 'test' });
	});

	// Rules must have a compression type
	assert.throws( 'Type Empty', /No compression type found/, function(){
		CSSCompressor.rule({ name: 'test', callback: CSSCompressor.noop });
	});

	// Rules cannot be overwritten without setting overwrite flag
	assert.throws( 'Rule Overwrite Blocking', /'URL Trim' compression already exists/, function(){
		CSSCompressor.rule({ name: 'URL Trim', type: CSSCompressor.RULE_TYPE_VALUE, callback: CSSCompressor.noop });
	});

	// Testing overwrite
	rule = {
		name: 'My Test Rule',
		type: CSSCompressor.RULE_TYPE_VALUE,
		overwrite: true,
		callback: CSSCompressor.noop
	};
	assert.doesNotThrow( 'Rule Overwritten Successfully', function(){
		CSSCompressor.rule({ name: rule.name, type: CSSCompressor.RULE_TYPE_VALUE, callback: CSSCompressor.noop });
		CSSCompressor.rule( rule );
	});
	assert.equal( "Rule Overwrite Matches", CSSCompressor.rule[ rule.name ], rule );
});


// Callback testing adds rules to the global cache, wait till all other tests are complete
munit( 'Rule.addRuleCallback', function( assert ) {
	// For the purpose of this test, ensure that the callback stack exists
	assert.exists( 'Callback Stack Exists', CSSCompressor._addRuleStack );

	// Testing that new rule triggers true on all modes except none
	CSSCompressor.rule( "New Rule Test", CSSCompressor.RULE_TYPE_VALUE, CSSCompressor.noop );
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
	CSSCompressor.rule( "New Rule", CSSCompressor.RULE_TYPE_VALUE, CSSCompressor.noop );
});
