var fs = require( 'fs' ),
	compressor = new CSSCompressor( CSSCompressor.MODE_MAX );


munit( 'Format.Sheets', { priority: munit.PRIORITY_LOW }, function( assert ) {
	fs.readdirSync( __dirname + '/' ).forEach(function( dir ) {
		if ( ! fs.statSync( __dirname + '/' + dir ).isDirectory() ) {
			return;
		}

		// Setup
		var PATH = __dirname + '/' + dir + '/',
			original = fs.readFileSync( PATH + 'original.css', 'utf8' ),
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
		
		// Check formatting across all format types
		[

			{
				name: 'max',
				format: CSSCompressor.FORMAT_MAX,
				contents: fs.readFileSync( PATH + 'format_max.css', 'utf8' ).trim()
			},

			{
				name: 'med',
				format: CSSCompressor.FORMAT_MED,
				contents: fs.readFileSync( PATH + 'format_med.css', 'utf8' ).trim()
			},

			{
				name: 'min',
				format: CSSCompressor.FORMAT_MIN,
				contents: fs.readFileSync( PATH + 'format_min.css', 'utf8' ).trim()
			},

			{
				name: 'none',
				format: CSSCompressor.FORMAT_NONE,
				contents: fs.readFileSync( PATH + 'format_none.css', 'utf8' ).trim()
			}

		].forEach(function( test ) {
			assert.equal(
				dir + '-' + test.name,
				compressor.compress( original, { format: test.format } ),
				test.contents
			);
		});
	});
});
