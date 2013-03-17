var CSSCompressor = global.CSSCompressor,
	argv = require( 'argv' ),
	async = require( 'async' ),
	fs = require( 'fs' ),
	rhome = /^\~\//,
	rroot = /^\//,
	ARGVOptions = [

		{
			name: 'mode',
			type: 'string',
			description: 'Compression mode to use',
			example: "cssc --mode=max file.css"
		},

		{
			name: 'on',
			type: 'csv,string',
			description: 'List of compressions to turn on',
			example: "cssc --on='Shrink Hex' file.css"
		},

		{
			name: 'off',
			type: 'csv,string',
			description: 'List of compressions to turn off',
			example: "cssc --off='Shrink Hex' file.css"
		},

		{
			name: 'format',
			type: 'string',
			description: 'Level of output format',
			example: "cssc format=none file.css"
		},

		{
			name: 'output',
			type: 'path',
			description: 'Output File Path',
			example: "cssc --output='/path/to/output.css' file.css"
		}

	];


function Cli( ARGS ) {
	var args = argv.clear()
			.info( "Usage: cssc [options] file.css" )
			.version( 'v' + CSSCompressor.version )
			.option( ARGVOptions )
			.run( ARGS || process.argv.slice( 2 ) ),
		targets = args.targets || [],
		options = args.options || {},
		compressor = new CSSCompressor( CSSCompressor.MODE_DEFAULT ),
		settings = {},
		sheet = '';
	
	// Starting mode
	options.mode = ( options.mode || '' ).trim();
	if ( options.mode.length ) {
		compressor.settings.update( options.mode );
	}

	// Readability
	options.format = ( options.format || '' ).trim();
	if ( options.format.length ) {
		settings.format = options.format;
	}

	// Compressions to turn on
	CSSCompressor.each( options.on || [], function( key ) {
		if ( ( key = key.trim() ).length ) {
			settings[ key ] = true;
		}
	});

	// Compressions to turn off
	CSSCompressor.each( options.off || [], function( key ) {
		if ( ( key = key.trim() ).length ) {
			settings[ key ] = false;
		}
	});

	// Read in each file passed
	async.map( targets || [],
		function( path, callback ) {
			fs.readFile( argv.types.path( path ), 'utf8', callback );
		},
		function( e, results ) {
			if ( e ) {
				throw e;
			}

			sheet = results.join( "\n" );
			if ( sheet.length ) {
				sheet = compressor.compress( sheet, settings );

				// Allow output file to be defined
				if ( options.output ) {
					fs.writeFileSync( options.output, sheet, 'utf8' );
				}
				else {
					console.log( sheet );
				}
			}
			// If no files are provided, assume stdin contains the sheet
			else {
				CSSCompressor.each({

					data: function( data ) {
						sheet += data;
					},

					error: function( e ) {
						throw e;
					},

					end: function(){
						sheet = sheet.trim();
						if ( ! sheet.length ) {
							throw new Error( "No Target Files Given" );
						}

						// Compress stream
						sheet = compressor.compress( sheet, settings );

						// Allow output file to be defined
						if ( options.output ) {
							fs.writeFileSync( options.output, sheet, 'utf8' );
						}
						else {
							console.log( sheet );
						}
					}

				}, function( fn, name ) {
					process.stdin.on( name, fn );
				});

				// Read stream
				process.stdin.setEncoding( 'utf8' );
				process.stdin.resume();
			}
		}
	);
}

CSSCompressor.Cli = Cli;
