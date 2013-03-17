var fs = require( 'fs' ),
	libs = require( './libs.js' ),
	CSSTree = require( 'csstree' ),
	ROOT = __dirname + '/../',
	LIB_DIR = ROOT + 'lib/',
	DIST_DIR = ROOT + 'dist/',
	DEMO_DIR = ROOT + 'demo/js/',
	BUILD_STR = fs.readFileSync( __dirname + '/headers.txt', 'utf8' ) + CSSTree.exportScript();

// Anonymous wrapper for Compressor
BUILD_STR += "\n\n(function( global, undefined ) {\n";
BUILD_STR += fs.readFileSync( LIB_DIR + 'CSSCompressor.js', 'utf8' );
BUILD_STR += "\n})( this );";

// Cycle through each lib and wrap them
libs.forEach(function( path ) {
	BUILD_STR += "\n\n(function( global, undefined ) {\n";
	BUILD_STR += fs.readFileSync( LIB_DIR + path, 'utf8' );
	BUILD_STR += "\n})( this );";
});

// Write out uncompressed file
fs.writeFileSync( DIST_DIR + 'CSSCompressor.js', BUILD_STR, 'utf8' );
fs.writeFileSync( DEMO_DIR + 'CSSCompressor.js', BUILD_STR, 'utf8' );


// Printout Results
console.log( "\n" );
console.log( "Compressor Output: " + DIST_DIR + 'CSSCompressor.js' );
console.log( "Compressor Demo Output: " + DEMO_DIR + 'CSSCompressor.js' );
console.log( "\n" );


// Trigger Demo builds
require( './demo.js' );
