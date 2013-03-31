// Globalize munit and Stroke objects
global.munit = require( 'munit' );
global.CSSCompressor = require( '../' );
global.CSSTree = CSSCompressor.CSSTree;

// Get long stacktraces of errors
require( 'longjohn' );

// Only stop test suite when running make test
if ( ! process.env.NODE_TEST_NO_SKIP ) {
	munit.defaults.settings.stopOnFail = true;
}

// Render tests
munit.render( __dirname + '/../test/', {
	junit: __dirname + '/results/',
	junitPrefix: process.version.replace( /\./g, '_' )
});
