// Globalize MUnit and Stroke objects
global.MUnit = require( 'munit' );
global.CSSCompressor = require( '../' );
global.CSSTree = CSSCompressor.CSSTree;

// Get long stacktraces of errors
require( 'longjohn' );

// Defaults
MUnit.Defaults.Settings.stopOnFail = true;

// Render tests
MUnit.render( __dirname + '/../test/' );
