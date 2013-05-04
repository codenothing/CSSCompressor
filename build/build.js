var fs = require( 'fs' ),
	libs = require( './libs.js' ),
	CSSTree = require( 'csstree' ),
	version = require( '../package.json' ).version,
	ROOT = __dirname + '/../',
	LIB_DIR = ROOT + 'lib/',
	DIST_DIR = ROOT + 'dist/',
	DEMO_DIR = ROOT + 'demo/js/',
	BUILD_STR = fs.readFileSync( __dirname + '/headers.txt', 'utf8' ).replace( '[VERSION]', version ) + CSSTree.exportScript(),
	stat;

// Anonymous wrapper for Compressor
BUILD_STR += "\n\n(function( global, undefined ) {\n";
BUILD_STR += fs.readFileSync( LIB_DIR + 'CSSCompressor.js', 'utf8' ).replace( '[VERSION]', version );
BUILD_STR += "\n})( this );";

// Cycle through each lib and wrap them
libs.forEach(function( path ) {
	if ( path[ path.length - 1 ] == '/' ) {
		fs.readdirSync( path ).forEach(function( file ) {
			BUILD_STR += "\n\n(function( global, undefined ) {\n";
			BUILD_STR += fs.readFileSync( path + file, 'utf8' );
			BUILD_STR += "\n})( this );";
		});
	}
	else {
		BUILD_STR += "\n\n(function( global, undefined ) {\n";
		BUILD_STR += fs.readFileSync( path, 'utf8' );
		BUILD_STR += "\n})( this );";
	}
});

// Make dist dir if not already there
try {
	if ( ! fs.statSync( DIST_DIR ).isDirectory() ) {
		throw new Error( 'DIST NOT DIR' );
	}
}
catch ( e ) {
	fs.mkdirSync( DIST_DIR );
}

// Write out uncompressed file
fs.writeFileSync( DIST_DIR + 'CSSCompressor.js', BUILD_STR, 'utf8' );
fs.writeFileSync( DEMO_DIR + 'CSSCompressor.js', BUILD_STR, 'utf8' );


// Printout Results
console.log( "\n" );
console.log( "Compressor Output: " + DIST_DIR + 'CSSCompressor.js' );
console.log( "Compressor Demo Output: " + DEMO_DIR + 'CSSCompressor.js' );
console.log( "\n" );
