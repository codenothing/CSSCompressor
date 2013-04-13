var CSSCompressor = global.CSSCompressor,
	none = { format: CSSCompressor.FORMAT_MAX };

// Static methods
CSSCompressor.extend({

	MODE_NONE: 'none',
	MODE_DEFAULT: 'default',
	MODE_MAX: 'max',

	modes: {},

	addMode: function( name, options ) {
		var settings = {
			format: CSSCompressor.FORMAT_NONE
		};

		// Setup a settings object that turns everything to true
		CSSCompressor.each( CSSCompressor._rulesHash, function( rule, name ) {
			settings[ name ] = true;
		});

		// Attach mode
		CSSCompressor.modes[ name.toLowerCase() ] = CSSCompressor.extend( true, settings, options || {} );
	}

});


// None compression mode turns all settings off
CSSCompressor.each( CSSCompressor._rulesHash, function( rule, name ) {
	none[ name ] = false;
});
CSSCompressor.addMode( CSSCompressor.MODE_NONE, none );


// Default compression mode is almost fully cross browser, and won't mess up your sheet order
CSSCompressor.addMode( CSSCompressor.MODE_DEFAULT, {
	"Hex to Color": false,
	"Strict ID": false,
	"Font Combinations": false,
	"Border Radius Combinations": false,
	"List Style Combinations": false,
	"Sort Properties": false,
	"Common Selectors": false,
	"Common Rules": false,
	"Duplicate Properties": false
});

// Full compression mode turns all options on
CSSCompressor.addMode( CSSCompressor.MODE_MAX );


// Assume all new options added after default rules are compiled should be turned on
CSSCompressor.addRuleCallback(function( rule ) {
	CSSCompressor.each( CSSCompressor.modes, function( mode, name ) {
		if ( name !== CSSCompressor.MODE_NONE ) {
			mode[ rule.name ] = true;
		}
	});
});
