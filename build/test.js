// Globalize munit and Stroke objects
global.munit = require( 'munit' );
global.CSSCompressor = require( '../' );
global.CSSTree = CSSCompressor.CSSTree;

// Get long stacktraces of errors
require( 'longjohn' );

// Defaults
munit.defaults.settings.stopOnFail = true;

// Render tests
munit.render( __dirname + '/../test/', { junit: __dirname + '/results/' } );
