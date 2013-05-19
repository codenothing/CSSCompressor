var fs = require( 'fs' ),
	ROOT = __dirname + '/../';


// Add basic existance tests to ensure api stays consistent through versions
// THESE TESTS CANNOT CHANGE (without heavy consideration)
munit( 'Rule.static', { priority: munit.PRIORITY_HIGHEST }, function( assert ) {
	assert.isFunction( 'Add Rule Existance', CSSCompressor.rule );
	assert.isFunction( 'addRuleCallback Existance', CSSCompressor.addRuleCallback );
	assert.exists( 'Rule Type Value', CSSCompressor.RULE_TYPE_VALUE );
	assert.exists( 'Rule Type Rule', CSSCompressor.RULE_TYPE_RULE );
	assert.exists( 'Rule Type Block', CSSCompressor.RULE_TYPE_BLOCK );
	assert.exists( 'Rule Type Sheet', CSSCompressor.RULE_TYPE_SHEET );
});


// Wait for most tests to run since these will be adding rules
munit( 'Rule.add', { priority: munit.PRIORITY_LOWEST }, function( assert ) {
	var rule;

	// Base testing
	console.log(CSSCompressor.rule());
	assert.equal( 'Rule count', CSSCompressor.rule().length, fs.readdirSync( ROOT + 'lib/rules' ).length );

	// Test rule type matching
	CSSCompressor.each([
		CSSCompressor.RULE_TYPE_VALUE,
		CSSCompressor.RULE_TYPE_RULE,
		CSSCompressor.RULE_TYPE_BLOCK,
		CSSCompressor.RULE_TYPE_SHEET,
		"NO MATCH TYPE"
	], function( type ) {
		var actual = CSSCompressor.rule( type ),
			expected = CSSCompressor.rule().filter(function( rule ) {
				return rule.type === type;
			});

		assert.deepEqual( "Rule Type Stack - " + type, actual, expected );
	});

	// Testing basic addition
	rule = {
		name: 'My Basic Test Rule',
		type: CSSCompressor.RULE_TYPE_VALUE,
		callback: CSSCompressor.noop
	};
	assert.doesNotThrow( 'Basic Rule Addition', function(){
		CSSCompressor.rule( rule.name, rule.type, rule.callback );
	});
	assert.equal( "Basic Rule Addition - Name", CSSCompressor.rule[ rule.name ].name, rule.name );
	assert.equal( "Basic Rule Addition - Type", CSSCompressor.rule[ rule.name ].type, rule.type );
	assert.equal( "Basic Rule Addition - Callback", CSSCompressor.rule[ rule.name ].callback, rule.callback );

	// Testing basic array of rule additions
	assert.doesNotThrow( 'Basic Multiple Rule Addition', function(){
		CSSCompressor.rule([
			{ name: 'Test Multiple Addition 1', type: CSSCompressor.RULE_TYPE_VALUE, callback: CSSCompressor.noop },
			{ name: 'Test Multiple Addition 2', type: CSSCompressor.RULE_TYPE_VALUE, callback: CSSCompressor.noop }
		]);
	});
	assert.exists( 'Basic Multiple Rule Addition - 1 Exists', CSSCompressor.rule[ 'Test Multiple Addition 1' ] );
	assert.exists( 'Basic Multiple Rule Addition - 2 Exists', CSSCompressor.rule[ 'Test Multiple Addition 2' ] );

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


// Testing that new rule triggers true on all modes except none
munit( 'Rule.addRuleCallback.default', { priority: munit.PRIORITY_LOWEST }, function( assert ) {
	CSSCompressor.rule( "New addRuleCallback Test", CSSCompressor.RULE_TYPE_VALUE, CSSCompressor.noop );
	CSSCompressor.each( CSSCompressor.mode, function( settings, name ) {
		if ( name !== CSSCompressor.MODE_NONE ) {
			assert.isTrue( "True New Rule Test - " + name, settings[ 'New addRuleCallback Test' ] );
		}
	});
});


// Tests for actual callback being triggered
munit( 'Rule.addRuleCallback.callback', { priority: munit.PRIORITY_LOWEST, expect: 2 }, function( assert ) {
	// For the purpose of this test, ensure that the callback stack exists
	assert.exists( 'Callback Stack Exists', CSSCompressor._addRuleStack );

	// Watch for new rule
	CSSCompressor._addRuleStack = [];
	CSSCompressor.addRuleCallback(function( options ) {
		assert.equal( 'Add Rule Addition', options.name, "New addRuleCallback Test Rule" );
	});
	CSSCompressor.rule( "New addRuleCallback Test Rule", CSSCompressor.RULE_TYPE_VALUE, CSSCompressor.noop );
});
