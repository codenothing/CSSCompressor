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
	self._rerunCount = 0;
	self._logs = [];
	self._keys = [];

	// Stats object
	self.stats = {
		time: {
			start: Date.now(),
			end: Date.now(),
			length: 0
		},
		before: {
			size: 0,
			selectors: 0,
			properties: 0
		},
		after: {
			size: 0,
			selectors: 0,
			properties: 0
		}
	};
}

CSSCompressor.prototype = {

	// Simple logging tool for compressions made
	log: function( key, message, positions ) {
		var self = this;

		// Allow for passing just message and position
		if ( positions === undefined && ! CSSCompressor.isString( message ) ) {
			positions = message;
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
		var self = this;

		// Timer kickoff
		self.stats.time.start = Date.now();

		// Static Reference
		CSSCompressor._lastRun = self;

		// Update settings
		if ( options ) {
			self.settings.update( options );
		}

		// Setup
		if ( css instanceof CSSTree ) {
			self.original = css.css;
			self.tree = css;
		}
		else {
			self.original = css || '';
			self.tree = new CSSTree( self.original );
		}
		self.branches = self.tree.branches;
		self.css = '';
		self.isRerun = false;
		self._logs = [];

		// Stats setup
		CSSCompressor.extend( self.stats.before, {
			size: self.original.length,
			selectors: self._selectorCount( self.branches ),
			properties: self._propertyCount( self.branches )
		});

		// Run compressions
		self._compress();
		return self.css;
	},

	// Individual value compressions
	value: function( value, position ) {
		var self = this, next;

		CSSCompressor.each( CSSCompressor._rules.values, function( object ) {
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
		var self = this;

		// Clear previous rerun setting for clean sweep
		self.rerun = false;

		// Rule sets and blocks
		self._blocks( self.branches );

		// Full sheet rendering
		CSSCompressor.each( CSSCompressor._rules.sheets, function( object ) {
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
			after = self.stats.after,
			time = self.stats.time,
			format = CSSCompressor._formats[ self.settings.format ];

		// Stylesheet generation
		if ( format ) {
			self.css = format.callback( self );
		}
		else {
			throw new Error( "Readability Option Not Found: '" + self.settings.format + "'" );
		}

		// Stats
		time.end = Date.now();
		time.length = time.end - time.start;
		CSSCompressor.extend( self.stats.after, {
			size: self.css.length,
			selectors: self._selectorCount( self.branches ),
			properties: self._propertyCount( self.branches )
		});
	},

	// Individual blocks
	_blocks: function( branches ) {
		var self = this;

		CSSCompressor.each( branches, function( branch ) {
			// Rule compressions
			if ( branch.rules && branch.rules.length ) {
				CSSCompressor.each( branch.rules, function( rule ) {
					// Part Compressionse
					CSSCompressor.each( rule.parts || [], function( value, i ) {
						rule.parts[ i ] = self.value( value, rule.position );
					});

					// Rule Compressions
					CSSCompressor.each( CSSCompressor._rules.sets, function( object ) {
						if ( self.settings[ object.name ] ) {
							self._keys.unshift( object.name );
							object.callback( rule, branch, self );
							self._keys.shift();
						}
					});
				});
			}

			// Full rule blocks
			CSSCompressor.each( CSSCompressor._rules.blocks, function( object ) {
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
	},

	// Counting selectors for stats
	_selectorCount: function( branches ) {
		var self = this, count = branches.length;

		branches.forEach(function( branch ) {
			if ( branch.branches ) {
				count += self._selectorCount( branch.branches );
			}
		});

		return count;
	},

	// Counting properties
	_propertyCount: function( branches ) {
		var self = this, count = 0;

		branches.forEach(function( branch ) {
			if ( branch.rules ) {
				count += branch.rules.length;
			}

			if ( branch.branches ) {
				count += self._propertyCount( branch.branches );
			}
		});

		return count;
	}

};


// Expose the CSSTree version in use
CSSCompressor.CSSTree = CSSTree;

// Version
CSSCompressor.version = "0.0.1";


// Expose to NodeJS/Window
if ( typeof module == 'object' && typeof module.exports == 'object' ) {
	module.exports = CSSCompressor;
}
else {
	global.CSSCompressor = CSSCompressor;
}
