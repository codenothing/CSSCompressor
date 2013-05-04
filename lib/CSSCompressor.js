var CSSTree = global.CSSTree;

function CSSCompressor( options ) {
	var self = this;

	// Force instance of CSSCompressor
	if ( ! ( self instanceof CSSCompressor ) ) {
		return new CSSCompressor( options );
	}

	// Initial setings
	self.settings = new CSSCompressor.Settings( options || {} );
	self.isRerun = false;
	self.rerun = false;
	self.stats = new CSSCompressor.Stats( self );
	self._rerunCount = 0;
	self._logs = [];
	self._keys = [];
}

CSSCompressor.prototype = {

	// Simple logging tool for compressions made
	log: function( key, message, positions ) {
		var self = this;

		// Empty call to log function returns all logs
		if ( key === undefined ) {
			return self._logs;
		}
		// Allow for passing just message and position
		else if ( positions === undefined && ! CSSCompressor.isString( message ) ) {
			positions = message;
			message = key;
			key = null;
		}
		// Allow for only passing a message, no position object
		else if ( positions === undefined && message === undefined ) {
			message = key;
			key = null;
		}

		// Force array of positions
		if ( ! CSSCompressor.isArray( positions ) ) {
			positions = positions ? [ positions ] : [];
		}

		// If no key is passed, take the current compression being used
		if ( ! key ) {
			key = self._keys[ 0 ];
		}

		self._logs.push({ key: key, message: message, positions: positions });
	},

	// Runs compression on css script
	compress: function( css, options ) {
		var self = this, now = Date.now();

		// Clear result
		self.css = '';

		// Static Reference
		CSSCompressor._lastRun = self;

		// Update settings
		if ( options ) {
			self.settings.update( options );
		}

		// Allow running compress() function without css string/tree (already compiled compressor object)
		if ( css !== undefined ) {
			if ( css instanceof CSSTree ) {
				self.original = css.css;
				self.tree = css;
			}
			else {
				self.original = css || '';
				self.tree = new CSSTree( self.original );
			}

			self.branches = self.tree.branches;
			self.isRerun = false;
			self._logs = [];
		}

		// Stats setup
		self.stats.start( now );

		// Run compressions
		self._compress();
		return self.css;
	},

	// Individual value compressions
	value: function( value, position ) {
		var self = this,
			rules = CSSCompressor.rule( CSSCompressor.RULE_TYPE_VALUE ),
			next;

		CSSCompressor.each( rules, function( object ) {
			if ( self.settings[ object.name ] ) {
				self._keys.unshift( object.name );

				if ( next = object.callback( value, position, self ) ) {
					value = next;
				}

				self._keys.shift();
			}
		});

		return value;
	},

	// Cycles through compressions and triggers reruns if necessary
	_compress: function(){
		var self = this,
			sheets = CSSCompressor.rule( CSSCompressor.RULE_TYPE_SHEET );

		// Clear previous rerun setting for clean sweep
		self.rerun = false;

		// Rule sets and blocks
		self._blocks( self.branches );

		// Full sheet rendering
		CSSCompressor.each( sheets, function( object ) {
			if ( self.settings[ object.name ] ) {
				self._keys.unshift( object.name );
				object.callback( self.branches, self );
				self._keys.shift();
			}
		});

		// Block recursive loop of reruns
		if ( self.rerun && ++self._rerunCount > 10 ) {
			self.rerun = false;
			self.log( '--- Blocking Rerun, Aleady ran 10 times ---' );
		}

		// There are cases where a later compression will require
		// re-compression rules from earlier on
		if ( self.rerun ) {
			self.log( null, 'Combinations have been applied, re-running compressions to catch loose ends.' );
			self.isRerun = true;
			self._compress();
		}
		// Render the tree into a stylesheet and return it
		else {
			self._render();
		}
	},

	// Sheet Rendering
	_render: function(){
		var self = this,
			format = CSSCompressor._formats[ self.settings.format ];

		// Stylesheet generation
		if ( format ) {
			self.css = format.callback( self );
		}
		else {
			throw new Error( "Readability Option Not Found: '" + self.settings.format + "'" );
		}

		// Stats
		self.stats.end();
	},

	// Individual blocks
	_blocks: function( branches ) {
		var self = this,
			rules = CSSCompressor.rule( CSSCompressor.RULE_TYPE_RULE ),
			blocks = CSSCompressor.rule( CSSCompressor.RULE_TYPE_BLOCK );

		CSSCompressor.each( branches, function( branch ) {
			// Rule compressions
			if ( branch.rules && branch.rules.length ) {
				CSSCompressor.each( branch.rules, function( rule ) {
					// Part Compressionse
					CSSCompressor.each( rule.parts || [], function( value, i ) {
						rule.parts[ i ] = self.value( value, rule.position );
					});

					// Rule Compressions
					CSSCompressor.each( rules, function( object ) {
						if ( self.settings[ object.name ] ) {
							self._keys.unshift( object.name );
							object.callback( rule, branch, self );
							self._keys.shift();
						}
					});
				});
			}

			// Full rule blocks
			CSSCompressor.each( blocks, function( object ) {
				if ( self.settings[ object.name ] ) {
					self._keys.unshift( object.name );
					object.callback( branch, self );
					self._keys.shift();
				}
			});

			// Handle nested entries
			if ( branch.branches ) {
				self._blocks( branch.branches );
			}
		});
	}

};


// Expose the CSSTree version in use
CSSCompressor.CSSTree = CSSTree;

// Version
CSSCompressor.version = "[VERSION]";


// Expose to NodeJS/Window
if ( typeof module == 'object' && typeof module.exports == 'object' ) {
	module.exports = CSSCompressor;
}
else {
	global.CSSCompressor = CSSCompressor;
}
