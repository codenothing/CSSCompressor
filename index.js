var _CSSCompressor = global.CSSCompressor,
	_CSSTree = global.CSSTree,
	fs = require( 'fs' ),
	DIST_PATH = __dirname + '/dist/CSSCompressor.js';

// Manage CSSTree
global.CSSTree = require( 'csstree' );

// Globalize CSSCompressor for lib inclusion only
module.exports = global.CSSCompressor = require( './lib/CSSCompressor.js' );

// Attach each lib
require( './build/libs.js' ).forEach(function( file ) {
	require( file );
});

// Only npm package contains Cli script
require( './lib/Cli.js' );

// Attach an exporter for third parties to include
CSSCompressor.exportScript = function( callback ) {
	if ( callback ) {
		fs.readFile( DIST_PATH, 'utf8', callback );
	}
	else {
		return fs.readFileSync( DIST_PATH, 'utf8' );
	}
};

// Transfer current version
CSSCompressor.version = require( './package.json' ).version;

// Reattach the global compressor object
global.CSSCompressor = _CSSCompressor;
global.CSSTree = _CSSTree;
