// Globalize munit and Compressor objects
global.munit = require( 'munit' );
global.CSSCompressor = require( '../' );
global.CSSTree = CSSCompressor.CSSTree;


// Give rule compression tests a higher priority so they run before
// we start messing with the static model for tests
munit( 'Rule Compression', { priority: munit.PRIORITY_HIGHER } );


/*
	Global handle for testing rule compressions. The type of test that will be
	ran is determined by the type of rule compression is used. Selector testing
	can be done by just applying arrays to actual and expected to test selector parts.

	@param assert: Assert module passed back from munit( name, callback( assert ) )
	@param name: Name of rule compression to run tests against
	@param tests: Array of object tests to run. Each test should be of the format:
			{
				name: 'Test Name',
				actual: {} or [],
				expected: {} or []
			}
*/
global.testRule = function( assert, name, tests ) {
	var compressor = new CSSCompressor( CSSCompressor.MODE_MAX ),
		rule = CSSCompressor.rule[ name ],
		branch;

	tests.forEach(function( test ) {
		// Value Testing
		if ( rule.type === CSSCompressor.RULE_TYPE_VALUE ) {
			assert.equal(
				test.name,
				rule.callback( test.actual, null, compressor ),
				test.expected
			);
		}
		// Rule Testing
		else if ( rule.type === CSSCompressor.RULE_TYPE_RULE ) {
			rule.callback( test.actual, { selector: 'p', rules: [ test.actual ] }, compressor );
			assert.deepEqual( test.name, test.actual, test.expected );
		}
		// Block Testing
		else if ( rule.type === CSSCompressor.RULE_TYPE_BLOCK ) {
			// Selector Testing
			if ( munit.isArray( test.actual ) ) {
				branch = { selector: 'Body', parts: test.actual, rules: [] };
				rule.callback( branch, compressor );
				assert.deepEqual( test.name, branch.parts, test.expected );
			}
			// Full Block Testing
			else {
				rule.callback( test.actual, compressor );
				assert.deepEqual( test.name, test.actual, test.expected );
			}
		}
		// Full Sheet Testing
		else if ( rule.type === CSSCompressor.RULE_TYPE_SHEET ) {
			rule.callback( ( compressor.branches = test.actual ), compressor );
			assert.deepEqual( test.name, compressor.branches, test.expected );
		}
	});
};
