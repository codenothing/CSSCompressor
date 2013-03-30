var fs = require( 'fs' ),
	compressor = new CSSCompressor( CSSCompressor.MODE_DEFAULT );


munit( 'Sheets', { priority: munit.PRIORITY_LOW }, function( assert ) {
	fs.readdirSync( __dirname + '/' ).forEach(function( dir ) {
		if ( ! fs.statSync( __dirname + '/' + dir ).isDirectory() ) {
			return;
		}

		// Setup
		var PATH = __dirname + '/' + dir + '/',
			before = fs.readFileSync( PATH + 'before.css', 'utf8' ),
			after = fs.readFileSync( PATH + 'after.css', 'utf8' ).trim(),
			options = require( PATH + 'options.js' );

		// Assign mode
		if ( options.mode ) {
			compressor.settings.update( options.mode );
		}

		// Remove property sorting for now
		compressor.settings.update({ 'Sort Properties': false, 'Sort Multi Selectors': false });

		// Assign extra settings
		if ( options.settings ) {
			compressor.settings.update( options.settings );
		}

		// Run test
		assert.equal( dir, compressor.compress( before ), after );
	});
});
