var CSSCompressor = global.CSSCompressor;

function Settings( options ) {
	var self = this;

	if ( ! ( self instanceof Settings ) ) {
		return new Settings( options );
	}

	self.format = CSSCompressor.FORMAT_NONE;
	if ( options ) {
		self.update( options );
	}
}

Settings.prototype = {

	// Updates the settings
	update: function( object ) {
		var self = this;

		// Modes
		if ( CSSCompressor.isString( object ) ) {
			object = CSSCompressor.extend( true, {},
				CSSCompressor.modes[ object.toLowerCase() ] || CSSCompressor.modes[ CSSCompressor.MODE_DEFAULT ] || {}
			);
		}

		// Only attach settings that match compression rules
		CSSCompressor.each( object, function( value, name ) {
			if ( CSSCompressor.rule[ name ] && CSSCompressor.isBoolean( value ) ) {
				self[ name ] = value;
			}
		});

		// Readability
		if ( object.hasOwnProperty( 'format' ) ) {
			self.format = object.format;
		}
	}

};

CSSCompressor.Settings = Settings;
