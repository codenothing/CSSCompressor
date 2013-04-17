var CSSCompressor = global.CSSCompressor;

function Stats( compressor ) {
	var self = this, now = Date.now();

	if ( ! ( self instanceof Stats ) ) {
		return new Stats( compressor );
	}

	// Setup
	self.compressor = compressor;
	self.time = {
		start: now,
		end: now,
		length: 0
	};
	self.before = {
		size: 0,
		selectors: 0,
		properties: 0
	};
	self.after = {
		size: 0,
		selectors: 0,
		properties: 0
	};
}

Stats.prototype = {

	// Start of compression
	start: function( time ) {
		var self = this, compressor = self.compressor;

		self.time.start = time;
		CSSCompressor.extend( self.before, {
			size: compressor.original.length,
			selectors: self._selectorCount( compressor.branches ),
			properties: self._propertyCount( compressor.branches )
		});
	},

	// End of compression
	end: function(){
		var self = this,
			now = Date.now(),
			compressor = self.compressor;

		self.time.end = now;
		self.time.length = self.time.end - self.time.start;
		CSSCompressor.extend( self.after, {
			size: compressor.css.length,
			selectors: self._selectorCount( compressor.branches ),
			properties: self._propertyCount( compressor.branches )
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


CSSCompressor.Stats = Stats;
