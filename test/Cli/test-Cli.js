var fs = require( 'fs' ),
	compressor = new CSSCompressor( CSSCompressor.MODE_MAX ),
	exec = require( 'child_process' ).exec,
	CSSC_DEV = '"' + __dirname + '/../../bin/cssc-dev"',
	DIST_FILE = fs.readFileSync( __dirname + '/../../dist/CSSCompressor.js', 'utf8' ).trim(),
	TEST_FILE_PATH = __dirname + '/test.css',
	TEST_FILE_PATH_ESCAPED = '"' + TEST_FILE_PATH + '"';
	EXPECTED_FILE_PATH = __dirname + '/expected.css',
	TMP_FILE_PATH = __dirname + '/tmp.css',
	TEST_FILE = fs.readFileSync( TEST_FILE_PATH, 'utf8' ).trim(),
	EXPECTED_FILE = fs.readFileSync( EXPECTED_FILE_PATH, 'utf8' ).trim(),
	EXPECTED_FILE_OPTION_OFF = fs.readFileSync( __dirname + '/option-off.css', 'utf8' ).trim();


// Prevent logging
compressor.log = CSSCompressor.noop;

// Lower CLI testing for focused test priority
MUnit( 'Cli', { priority: MUnit.PRIORITY_LOW } );


// Streaming
MUnit( 'Cli.Pipe', 2, function( assert ) {
	var child = exec( CSSC_DEV + " --mode=max", function( e, stdout ) {
		if ( e ) {
			console.error( e );
			assert.fail( 'Child Write' );
		}
		else {
			assert.equal( 'Child Write', stdout.trim(), EXPECTED_FILE );
		}
	});
	child.stdin.setEncoding = 'utf8';
	child.stdin.end( TEST_FILE );

	// Cat
	exec( "cat " + TEST_FILE_PATH_ESCAPED + " | " + CSSC_DEV + " --mode=max", function( e, stdout ) {
		if ( e ) {
			console.error( e );
			assert.fail( 'Cat' );
		}
		else {
			assert.equal( 'Cat', stdout.trim(), EXPECTED_FILE );
		}
	});
});

// Testing Parameters
MUnit( 'Cli.Options', 5, function( assert ) {
	exec( CSSC_DEV + " --mode=max " + TEST_FILE_PATH_ESCAPED, function( e, stdout ) {
		if ( e ) {
			console.error( e );
			assert.fail( 'Console Log' );
		}
		else {
			assert.equal( 'Console Log', stdout.trim(), EXPECTED_FILE );
		}
	});

	// File Output
	exec( CSSC_DEV + " --mode=max --output=\"" + TMP_FILE_PATH + "\" " + TEST_FILE_PATH_ESCAPED, function( e ) {
		if ( e ) {
			console.error( e );
			assert.fail( 'Option Output' );
		}
		else {
			var result = fs.readFileSync( TMP_FILE_PATH, 'utf8' );
			fs.unlinkSync( TMP_FILE_PATH );
			assert.equal( 'Option Output', result, EXPECTED_FILE );
		}
	});

	// Format
	exec( CSSC_DEV + " --mode=none --format=none " + TEST_FILE_PATH_ESCAPED, function( e, stdout ) {
		if ( e ) {
			console.error( e );
			assert.fail( 'Option Format' );
		}
		else {
			assert.equal( 'Option Format', stdout.trim(), EXPECTED_FILE_OPTION_OFF );
		}
	});

	// Option Off
	exec( CSSC_DEV + " --mode=max --off='Color to Hex' " + TEST_FILE_PATH_ESCAPED, function( e, stdout ) {
		if ( e ) {
			console.error( e );
			assert.fail( 'Option Off' );
		}
		else {
			assert.equal( 'Option Off', stdout.trim(), EXPECTED_FILE_OPTION_OFF );
		}
	});

	// Option On
	exec( CSSC_DEV + " --mode=none --format=none --on='Color to Hex','Shrink Hex' " + TEST_FILE_PATH_ESCAPED, function( e, stdout ) {
		if ( e ) {
			console.error( e );
			assert.fail( 'Option On' );
		}
		else {
			assert.equal( 'Option On', stdout.trim(), EXPECTED_FILE );
		}
	});
});


// Testing Export
MUnit( 'Cli.Export Script', 2, function( assert ) {
	assert.equal( 'Sync', CSSCompressor.exportScript().trim(), DIST_FILE );

	CSSCompressor.exportScript(function( e, script ) {
		if ( e ) {
			console.error( e );
			assert.fail( 'Unable to read Export Script' );
		}
		else {
			assert.equal( 'Async', script.trim(), DIST_FILE );
		}
	});
});
