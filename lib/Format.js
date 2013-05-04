var CSSCompressor = global.CSSCompressor;

CSSCompressor.extend({

	// Reference
	_formats: {},

	// Allow for custom formatters
	addFormat: function( options, callback ) {
		if ( CSSCompressor.isString( options ) ) {
			options = { name: options };
		}

		// Apply callback to options
		if ( CSSCompressor.isFunction( callback ) ) {
			options.callback = callback;
		}

		// Only allow formats that have actual callbacks
		if ( ! CSSCompressor.isFunction( options.callback ) ) {
			throw new Error( "Format Callback not Defined" );
		}

		// Unless explicitely stated, don't overwrite
		if ( CSSCompressor._formats[ options.name ] && options.overwrite !== true ) {
			throw new Error( "'" + options.name + "' format already exists." );
		}

		// Save off format for use
		CSSCompressor._formats[ options.name ] = options;
	}

});
