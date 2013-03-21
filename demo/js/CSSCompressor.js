/*
 * CSSCompressor 0.0.1
 * Corey Hart @ http://www.codenothing.com
 * MIT License http://www.codenothing.com/license
 */ 
/*
 * CSSTree 0.0.1
 * Corey Hart @ http://www.codenothing.com
 * MIT License http://www.codenothing.com/license
 */
(function( global, undefined ) {

var rnewlineseek = /(\r\n|\r|\n)/g,
	rwhitespace = /(\s|\t|\r\n|\r|\n)/;


function CSSTree( css ) {
	var self = this, m;

	// Force instance of CSSTree
	if ( ! ( self instanceof CSSTree ) ) {
		return new CSSTree( css );
	}

	// Internals
	self.css = css || '';
	self.i = -1;
	self.length = self.css.length;
	self.branches = [];

	// Positional setup
	self._newlines = [];
	while ( ( m = rnewlineseek.exec( self.css ) ) ) {
		self._newlines.push( rnewlineseek.lastIndex - 1 );
	}

	// Begin rendering
	self.render();
	self._positions( self.branches );
}

// Methods
CSSTree.prototype = {

	// Starts process of reading the stylesheet
	render: function(){
		var self = this, peek = '';

		for ( ; ++self.i < self.length; ) {
			self.c = self.css[ self.i ];
			peek = self.css[ self.i + 1 ];

			// Comment
			if ( self.c == '/' && peek == '*' ) {
				self.i--;
				self.comment();
			}
			// Skip over all whitespace
			else if ( rwhitespace.exec( self.c ) ) {
				continue;
			}
			// Assume anything else is a selector/atrule
			else {
				self.i--;
				self.selector();
			}
		}
	},

	// Ignore comment blocks
	comment: function( nested ) {
		var self = this,
			position = new CSSTree.Position( self.i + 1 ),
			comment = '',
			peek = '';

		nested = nested || false;
		for ( ; ++self.i < self.length; ) {
			self.c = self.css[ self.i ];
			peek = self.css[ self.i + 1 ];

			// End of comment
			if ( self.c == '*' && peek == '/' ) {
				return self.branches.push(
					new CSSTree.Comment( comment + '*/', nested, position.markEnd( ++self.i + 1 ) )
				);
			}
			else {
				comment += self.c;
			}
		}
	},

	// Selctor looks for opening rule set or closing semicolon for oneliners
	selector: function(){
		var self = this,
			position = new CSSTree.Position( self.i + 1 ),
			selector = '',
			parts = [], nested = null, part = '',
			peek, branch;

		for ( ; ++self.i < self.length; ) {
			self.c = self.css[ self.i ];
			peek = self.css[ self.i + 1 ];

			// Comment block
			if ( self.c == '/' && peek == '*' ) {
				position.markChunkEnd( self.i-- );
				self.comment();
				position.markChunkStart( self.i + 1 );
			}
			// Atrule
			else if ( self.c == ';' ) {
				return self.branches.push(
					new CSSTree.AtRule( selector, position.markEnd( self.i ) )
				);
			}
			// Media atrule
			else if ( self.c == '{' && selector.trim()[ 0 ] == '@' ) {
				branch = self.nested( selector.trim(), position );
				branch.position = position.markEnd( self.i );
				return self.branches.push( branch );
			}
			// Selector for ruleset
			else if ( self.c == '{' ) {
				branch = new CSSTree.Selector( selector, self.rules( position ), position );
				position.markEnd( self.i + 1 );
				return self.branches.push( branch );
			}
			// Escape string
			else if ( self.c == '\\' ) {
				selector += self.c + self.css[ ++self.i ];
			}
			// Seek
			else if ( self.c == "'" || self.c == '"' ) {
				character = self.c;
				selector += character + self.find( character ) + character;
			}
			// Seek
			else if ( self.c == '(' ) {
				selector += '(' + self.find( ')' ) + ')';
			}
			// Add to selector string
			else {
				selector += self.c;
			}
		}

		// Catch end of file queries without semi-colon
		if ( ( selector = selector.trim() ).length ) {
			return self.branches.push(
				new CSSTree.AtRule( selector, position.markEnd( self.i ) )
			);
		}
	},

	// Rule Sets
	rules: function( parentPos ) {
		var self = this, rules = [], peek, prop, position;

		for ( ; ++self.i < self.length; ) {
			self.c = self.css[ self.i ];
			peek = self.css[ self.i + 1 ];

			// Comment
			if ( self.c == '/' && peek == '*' ) {
				parentPos.markChunkEnd( self.i-- );
				self.comment( true );
				parentPos.markChunkStart( self.i + 1 );
			}
			// End of rules
			else if ( self.c == '}' ) {
				return rules;
			}
			// New rule
			else if ( ! rwhitespace.exec( self.c ) ) {
				position = new CSSTree.Position( self.i, parentPos );
				self.i--;
				prop = new CSSTree.PropertyValue(
					self.property( position ).trim(),
					self.value( position ).trim(),
					position
				);

				// Break down the parts of the value, and push it
				position.markEnd( self.i, false );

				// Only add if there is an actual property
				if ( prop.property.length ) {
					rules.push( prop );
				}
			}
		}

		return rules;
	},

	// Property Names
	property: function( position ) {
		var self = this, property = '', peek;

		for ( ; ++self.i < self.length; ) {
			self.c = self.css[ self.i ];
			peek = self.css[ self.i + 1 ];

			// Nested Comment
			if ( self.c == '/' && peek == '*' ) {
				position.markChunkEnd( self.i-- );
				self.comment( true );
				position.markChunkStart( self.i + 1 );
			}
			// End of property
			else if ( self.c == ':' ) {
				return property;
			}
			// Invalid CSS, but still end of property
			else if ( self.c == ';' || self.c == '}' ) {
				self.i--;
				return property;
			}
			else {
				property += self.c;
			}
		}

		return property;
	},

	// Values
	value: function( position ) {
		var self = this, value = '', character, peek;

		for ( ; ++self.i < self.length; ) {
			self.c = self.css[ self.i ];
			peek = self.css[ self.i + 1 ];

			// Comment
			if ( self.c == '/' && peek == '*' ) {
				position.markChunkEnd( self.i-- );
				self.comment( true );
				position.markChunkStart( self.i + 1 );
			}
			// End of value
			else if ( self.c == ';' ) {
				return value;
			}
			// Watch for no semi-colon at end of set
			else if ( self.c == '}' ) {
				self.i--;
				return value;
			}
			// Seek strings
			else if ( self.c == "'" || self.c == '"' ) {
				character = self.c;
				value += character + self.find( character ) + character;
			}
			// Seek groupings
			else if ( self.c == '(' ) {
				value += '(' + self.find( ')' ) + ')';
			}
			// Append
			else {
				value += self.c;
			}
		}

		return value;
	},

	// Parsing through escapable content
	find: function( endstring ) {
		var self = this, string = '';

		for ( ; ++self.i < self.length; ) {
			self.c = self.css[ self.i ];

			// Escaped character
			if ( self.c == "\\" ) {
				string += self.c + self.css[ ++self.i ];
			}
			// Seek charactor hit
			else if ( self.c == endstring ) {
				return string;
			}
			// Append
			else {
				string += self.c;
			}
		}

		return string;
	},

	// Nested atrules
	nested: function( atrule, position ) {
		var self = this,
			string = '',
			peek, index, prop, subPosition,
			block = atrule.trim()[ 0 ] == '@' ?
				new CSSTree.AtRule( atrule, position ) :
				new CSSTree.Selector( atrule, null, position );

		for ( ; ++self.i < self.length; ) {
			self.c = self.css[ self.i ];
			peek = self.css[ self.i + 1 ];

			// Escaped string
			if ( self.c == '\\' ) {
				string += self.c + self.css[ ++self.i ];
			}
			// Comment
			if ( self.c == '/' && peek == '*' ) {
				position.markChunkEnd( self.i-- );
				self.comment( true );
				position.markChunkStart( self.i + 1 );
			}
			// End of property:value
			else if ( self.c == ';' ) {
				subPosition = new CSSTree.Position( self.i - string.length );
				subPosition.markEnd( self.i );

				// String trimming & positioning
				string = string.trim();
				index = string.indexOf( ':' );

				// Build up rule property
				prop = new CSSTree.PropertyValue(
					string.substr( 0, index ).trim(),
					string.substr( index + 1 ).trim(),
					subPosition
				);

				// Atrules don't startoff with rules
				if ( ! block.rules ) {
					block.rules = [];
				}

				// Parse out parts and add to branches rules
				block.rules.push( prop );
				string = '';
			}
			// Nested Block
			else if ( self.c == '{' ) {
				if ( ! block.branches ) {
					block.branches = [];
				}

				subPosition = new CSSTree.Position( self.i - string.length, position );
				block.branches.push( self.nested( string.trim(), subPosition ) );
				string = '';
			}
			// Seek
			else if ( self.c == "'" || self.c == '"' ) {
				character = self.c;
				string += character + self.find( character ) + character;
			}
			// Seek
			else if ( self.c == '(' ) {
				string += '(' + self.find( ')' ) + ')';
			}
			// End of block
			else if ( self.c == '}' ) {
				subPosition = new CSSTree.Position( self.i - string.length );

				// Assume any string left is a property:value definition
				if ( ( string = string.trim() ).length ) {
					index = string.indexOf( ':' );
					prop = new CSSTree.PropertyValue(
						string.substr( 0, index ).trim(),
						string.substr( index + 1 ).trim(),
						subPosition.markEnd( self.i )
					);

					// Atrules don't startoff with rules
					if ( ! block.rules ) {
						block.rules = [];
					}

					// Parse out value parts and add to rules
					block.rules.push( prop );
				}

				return block;
			}
			// Append
			else {
				string += self.c;
			}
		}

		return block;
	},

	// Crawl the tree to finish position markup
	_positions: function( branches ) {
		var self = this;

		// Cycle through each branch for markings
		branches.forEach(function( branch ) {
			self._markPosition( branch.position );

			// Markup each rule positions
			if ( branch.rules ) {
				branch.rules.forEach(function( rule ) {
					if ( rule.position ) {
						self._markPosition( rule.position );
					}
				});
			}

			// Crawl nested branches
			if ( branch.branches ) {
				self._positions( branch.branches );
			}
		});
	},

	// Marks up position
	_markPosition: function( position ) {
		var self = this;

		// Mark branch positions
		position.start = self._charPosition( position.range.start );
		position.end = self._charPosition( position.range.end );
	},

	// Marks the line & character for the character position passed
	_charPosition: function( pos ) {
		var self = this, line = self._newlines.length, chracter = 0;

		while ( line-- ) {
			if ( pos > self._newlines[ line ] ) {
				chracter = self._newlines[ line ] + 1;
				break;
			}
		}
		
		return {
			line: line + 2,
			character: ( pos + 1 ) - chracter
		};
	}

};


// Expose to NodeJS/Window
if ( typeof module == 'object' && typeof module.exports == 'object' ) {
	module.exports = CSSTree;
}
else {
	global.CSSTree = CSSTree;
}


})( this );

(function( global, undefined ) {

function Position( start, _parent ) {
	var self = this;

	if ( ! ( self instanceof Position ) ) {
		return new Position( start, _parent );
	}

	if ( _parent && _parent instanceof Position ) {
		self._parent = _parent;
	}

	if ( start === undefined ) {
		start = 0;
	}

	self.range = { start: start, end: start, length: 0 };
	self.start = { line: 0, character: 0 };
	self.end = { line: 0, character: 0 };
	self.chunks = [];
	self.markChunkStart( start, false );
}

Position.prototype = {

	markEnd: function( pos, propogate ) {
		var self = this;

		self.markChunkEnd( pos, propogate );
		self.range.end = pos;
		self.range.length = pos - self.range.start;

		if ( self._parent ) {
			delete self._parent;
		}

		return self;
	},

	markChunkEnd: function( pos, propogate ) {
		var self = this;

		if ( self._chunk ) {
			self._chunk.end = pos;
			self._chunk.length = pos - self._chunk.start;
			delete self._chunk;
		}

		if ( self._parent && propogate !== false ) {
			self._parent.markChunkEnd( pos, propogate );
		}

		return self;
	},

	markChunkStart: function( pos, propogate ) {
		var self = this;

		self._chunk = { start: pos, end: pos, length: 0 };
		self.chunks.push( self._chunk );

		if ( self._parent && propogate !== false ) {
			self._parent.markChunkStart( pos, propogate );
		}
	}

};

CSSTree.Position = Position;


})( this );

(function( global, undefined ) {

function Comment( comment, nested, position ) {
	var self = this;

	if ( ! ( self instanceof Comment ) ) {
		return new Comment( comment, nested, position );
	}

	self.comment = ( comment || '' ).trim();
	self.nested = !!nested;
	self.position = position;
}

CSSTree.Comment = Comment;


})( this );

(function( global, undefined ) {

var ratruleseek = /"|'|\(/,
	ratrulepart = /[\, ]/;


function AtRule( atrule, position ) {
	var self = this;

	if ( ! ( self instanceof AtRule ) ) {
		return new AtRule( atrule, position );
	}

	self.atrule = ( atrule || '' ).trim();
	self.position = position;
	self.parts = [];
	self.generateParts();
}

AtRule.prototype = {
	
	generateParts: function(){
		var self = this, atrule = self.atrule,
			parts = [], part = '',
			i = -1, l = atrule.length, c = '';

		for ( ; ++i < l; ) {
			c = atrule[ i ];

			// Part separator
			if ( ratrulepart.exec( c ) ) {
				part = part.trim();

				if ( part.length ) {
					parts.push( part );
				}

				if ( c != ' ' ) {
					parts.push( c );
				}

				part = '';
			}
			// Read all characters in a seek sequence ((...), "...", '...', etc)
			else if ( ratruleseek.exec( c ) ) {
				part += c;
				seek = c == '(' ? ')' : c;

				// Find end char
				for ( ; ++i < l; ) {
					c = atrule[ i ];
					part += c;

					// End char found, break off and attach part
					if ( c == seek ) {
						break;
					}
					// Skip over escaped values
					else if ( c == "\\" && atrule[ i + 1 ] ) {
						part += atrule[ ++i ];
					}
				}
			}
			// Add to the current part
			else {
				part += c;
			}
		}

		// Catch the last part and add it
		if ( ( part = part.trim() ).length ) {
			parts.push( part );
		}

		self.parts = parts;
	},

	generateAtrule: function(){
		var self = this;
	}

};

CSSTree.AtRule = AtRule;


})( this );

(function( global, undefined ) {

var rwhitespace = /(\s|\t|\r\n|\r|\n)/,
	rvalueseparator = /\/|,/,
	rvalueseek = /"|'|\(/;


function PropertyValue( property, value, position ) {
	var self = this;

	if ( ! ( self instanceof PropertyValue ) ) {
		return new PropertyValue( property, value, position );
	}

	self.property = ( property || '' ).trim();
	self.value = ( value || '' ).trim();
	self.position = position;
	self.parts = [];
	self.generateParts();
}

PropertyValue.prototype = {

	generateParts: function(){
		var self = this, value = self.value,
			parts = [], i = -1, l = value.length, part = '', c, seek;

		for ( ; ++i < l; ) {
			c = value[ i ];

			// Whitespace is a value separator
			if ( rwhitespace.exec( c ) ) {
				if ( ( part = part.trim() ).length ) {
					parts.push( part );
				}

				part = '';
			}
			// Value separator
			else if ( rvalueseparator.exec( c ) ) {
				if ( ( part = part.trim() ).length ) {
					parts.push( part );
				}

				parts.push( c );
				part = '';
			}
			// Read all characters in a seek sequence (url(...), "...", '...', etc)
			else if ( rvalueseek.exec( c ) ) {
				part += c;
				seek = c == '(' ? ')' : c;

				// Find end char
				for ( ; ++i < l; ) {
					c = value[ i ];
					part += c;

					// End char found, break off and attach part
					if ( c == seek ) {
						break;
					}
					// Skip over escaped values
					else if ( c == "\\" && value[ i + 1 ] ) {
						part += value[ ++i ];
					}
				}

				parts.push( part );
				part = '';
			}
			else {
				part += c;
			}
		}

		// Attach final leftover part
		if ( part.length ) {
			parts.push( part );
		}

		self.parts = parts;
	},

	generateValue: function(){
	}

};

CSSTree.PropertyValue = PropertyValue;


})( this );

(function( global, undefined ) {

var rselectornested = /[:#\[\.]/,
	rselectorpart = /[>~\+\*\,]/,
	rwhitespace = /(\s|\t|\r\n|\r|\n)/;


function Selector( selector, rules, position ) {
	var self = this;

	if ( ! ( self instanceof Selector ) ) {
		return new Selector( selector, rules, position );
	}

	self.selector = ( selector || '' ).trim();
	self.position = position;
	self.parts = [];
	self.rules = rules || [];
	self.generateParts();
}

Selector.prototype = {

	generateParts: function(){
		var self = this, selector = self.selector,
			parts = [], nested = null, part = '',
			i = -1, l = selector.length, c = '',
			innerSeek = null;

		for ( ; ++i < l; ) {
			c = selector[ i ];

			// Selector breaker (whitespace, comma, etc...)
			if ( rselectorpart.exec( c ) || rwhitespace.exec( c ) ) {
				part = part.trim();

				if ( nested !== null ) {
					if ( part.length ) {
						nested.push( part );
					}

					parts.push( nested );
				}
				else if ( part.length ) {
					parts.push( part );
				}

				if ( ! rwhitespace.exec( c ) ) {
					parts.push( c );
				}

				nested = null;
				part = '';
			}
			// Inside selector, but still need to break apart ('span.class')
			else if ( part.length && rselectornested.exec( c ) ) {
				part = part.trim();

				// Catch whitespace parts and just continue on
				if ( ! part.length ) {
					part = c;
					continue;
				}

				// Add part to nested array
				if ( nested === null ) {
					nested = [ part ];
				}
				else {
					nested.push( part );
				}

				// Create new part
				part = c;

				// Seek to closing brace
				if ( c == '[' ) {
					for ( ; ++i < l; ) {
						c = selector[ i ];
						part += c;

						if ( c == "\\" ) {
							part += selector[ ++i ];
						}
						else if ( innerSeek !== null ) {
							if ( c == innerSeek ) {
								innerSeek = null;
							}
						}
						else if ( c == '"' || c == "'" ) {
							innerSeek = c;
						}
						else if ( c == ']' ) {
							nested.push( part );
							part = '';
							break;
						}
					}
				}
			}
			else {
				part += c;
			}
		}

		// Catch the last part if it exists
		if ( ( part = part.trim() ).length ) {
			if ( nested !== null ) {
				if ( part.length ) {
					nested.push( part );
				}

				parts.push( nested );
			}
			else {
				parts.push( part );
			}
		}

		// Apply parts back to object
		self.parts = parts;
	},

	generateSelector: function(){
		var self = this;
	}

};

CSSTree.Selector = Selector;


})( this );

(function( global, undefined ) {
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
		var self = this;

		CSSCompressor.each( CSSCompressor._rules.values, function( object ) {
			if ( self.settings[ object.name ] ) {
				self._keys.unshift( object.name );
				value = object.callback( value, position, self );
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

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	toString = Object.prototype.toString,
	Slice = Array.prototype.slice;

// Type tests
"Boolean Number String Function Array Date RegExp Object Error".split(' ').forEach(function( method ) {
	if ( method == 'Array' && Array.isArray ) {
		return ( CSSCompressor.isArray = Array.isArray );
	}
	else if ( method == 'Error' ) {
		CSSCompressor.isError = function( object ) {
			return object && ( object instanceof Error );
		};

		return;
	}

	var match = '[object ' + method + ']';
	CSSCompressor[ 'is' + method ] = function( object ) {
		return object !== undefined && object !== null && toString.call( object ) == match;
	};
});

// Object extension utility
CSSCompressor.extend = function(){
	var args = Slice.call( arguments ), i = -1, l = args.length, deep = false, target = this, name, copy;

	// Check for deep copy
	if ( CSSCompressor.isBoolean( args[ 0 ] ) ) {
		deep = args.shift();
		l = args.length;
	}

	// Check for multi object extension
	if ( l > 1 ) {
		target = args.shift();
		l = args.length;
	}

	for ( ; ++i < l; ) {
		copy = args[ i ];
		for ( name in copy ) {
			if ( deep && copy[ name ] && CSSCompressor.isArray( copy[ name ] ) ) {
				target[ name ] = CSSCompressor.extend( deep, target[ name ] || [], copy[ name ] );
			}
			else if ( deep && CSSCompressor.isObject( copy[ name ] ) ) {
				target[ name ] = CSSCompressor.extend( deep, target[ name ] || {}, copy[ name ] );
			}
			else {
				target[ name ] = copy[ name ];
			}
		}
	}

	return target;
};


// Utilities
CSSCompressor.extend({

	// Empty fn
	noop: function(){},

	// Helper tables
	tables: {},

	// Priority Defaults
	PRIORITY_HIGHEST: 0.8,
	PRIORITY_HIGHER: 0.7,
	PRIORITY_HIGH: 0.6,
	PRIORITY_DEFAULT: 0.5,
	PRIORITY_LOW: 0.4,
	PRIORITY_LOWER: 0.3,
	PRIORITY_LOWEST: 0.2,

	// Iteration utility
	each: function( items, fn ) {
		var i = -1, l = items.length;

		if ( CSSCompressor.isArray( items ) ) {
			for ( ; ++i < l; ) {
				if ( fn( items[ i ], i, items ) === false ) {
					break;
				}
			}
		}
		else {
			for ( i in items ) {
				if ( fn( items[ i ], i, items ) === false ) {
					break;
				}
			}
		}

		return items;
	},

	// Iterating array of arguments
	eachArgs: function( items, fn ) {
		var i = -1, l = items.length;

		if ( CSSCompressor.isArray( items ) ) {
			for ( ; ++i < l; ) {
				if ( CSSCompressor.isArray( items[ i ] ) && fn.apply( items[ i ], items[ i ] ) === false ) {
					break;
				}
				else if ( fn( items[ i ] ) === false ) {
					break;
				}
			}
		}
		else {
			return CSSCompressor.each( items, fn );
		}
	},

	// Object matching
	objectsMatch: function( a, b ) {
		var isArray = CSSCompressor.isArray,
			isObject = CSSCompressor.isObject,
			i;

		if ( isArray( a ) ) {
			if ( ! isArray( b ) || a.length !== b.length ) {
				return false;
			}

			i = a.length;
			while ( i-- ) {
				if ( isArray( a[ i ] ) || isObject( a[ i ] ) ) {
					if ( ! CSSCompressor.objectsMatch( a[ i ], b[ i ] ) ) {
						return false;
					}
				}
				else if ( a[ i ] !== b[ i ] ) {
					return false;
				}
			}
		}
		else if ( isObject( a ) ) {
			if ( ! isObject( b ) ) {
				return false;
			}

			for ( i in a ) {
				if ( a[ i ] !== b[ i ] ) {
					return false;
				}
			}
		}
		else if ( a !== b ) {
			return false;
		}

		return true;
	},

	// Removes item from array
	removeItem: function( array, item ) {
		if ( ! CSSCompressor.isArray( array ) ) {
			return array;
		}

		var index = array.indexOf( item );
		if ( index !== -1 ) {
			array.splice( index, 1 );
		}

		return array;
	},

	// Removes list of items from array
	removeItems: function( array, items ) {
		items.forEach(function( item ) {
			CSSCompressor.removeItem( array, item );
		});

		return array;
	},

	// Takes an array of keys and ensures they exist in the object
	keysInHash: function( array, object ) {
		var exists = true;

		CSSCompressor.each( array, function( key ) {
			if ( ! object.hasOwnProperty( key ) ) {
				return ( exists = false );
			}
		});

		return exists;
	},

	// Utility function to shortcut creating compressor object
	compress: function( css, options ) {
		return ( new CSSCompressor( options ) ).compress( css );
	}

});

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor;

function Settings( options ) {
	var self = this;

	if ( ! ( self instanceof Settings ) ) {
		return new Settings( options );
	}

	self.format = CSSCompressor.FORMAT_NONE;
	self.update( options );
}

Settings.prototype = {

	// Updates the settings
	update: function( object ) {
		var self = this;

		// Modes
		if ( CSSCompressor.isString( object ) ) {
			self._lastMode = object;
			object = CSSCompressor.extend( true, {},
				CSSCompressor.modes[ object.toLowerCase() ] || CSSCompressor.modes[ CSSCompressor.MODE_DEFAULT ] || {}
			);
		}

		// Only attach settings that match compression rules
		CSSCompressor.each( object, function( value, name ) {
			if ( CSSCompressor._rulesHash[ name ] && CSSCompressor.isBoolean( value ) ) {
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

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor;


CSSCompressor.extend({

	// Direct cache
	_rulesHash: {},
	_ruleGroupings: {},

	// Compression caches
	_rules: {
		values: [],
		sets: [],
		blocks: [],
		sheets: []
	}

});


CSSCompressor.eachArgs([

	[ 'addValue', 'values' ],
	[ 'addRule', 'sets' ],
	[ 'addRuleBlock', 'blocks' ],
	[ 'addRuleSheet', 'sheets' ]

], function( Method, CacheName ) {
	CSSCompressor[ Method ] = function( options, callback ) {
		var cache = CSSCompressor._rules[ CacheName ];

		// Allow array of options
		if ( CSSCompressor.isArray( options ) ) {
			return CSSCompressor.each( options, CSSCompressor[ Method ] );
		}
		// Allow just name, callback
		else if ( CSSCompressor.isString( options ) ) {
			options = { name: options };
		}

		// Apply callback to options
		if ( CSSCompressor.isFunction( callback ) ) {
			options.callback = callback;
		}

		// Only allow compressions that have actual callbacks
		if ( ! CSSCompressor.isFunction( options.callback ) ) {
			throw new Error( "Rule Callback not Defined" );
		}

		// Unless explicitely stated, don't overwrite
		if ( CSSCompressor._rulesHash[ options.name ] && options.overwrite !== true ) {
			throw new Error( "'" + options.name + "' compression already exists." );
		}

		// Defaults
		options.priority = CSSCompressor.isNumber( options.priority ) ? options.priority : CSSCompressor.PRIORITY_DEFAULT;
		options.added = cache.length;
		options.group = options.group || 'custom';

		// Groupings
		if ( ! CSSCompressor._ruleGroupings[ options.group ] ) {
			CSSCompressor._ruleGroupings[ options.group ] = [];
		}
		CSSCompressor._ruleGroupings[ options.group ].push( options );

		// Attach reference
		CSSCompressor._rulesHash[ options.name ] = options;
		cache.push( options );

		// Sort cache with new rule
		cache.sort(function( a, b ) {
			if ( a.priority === b.priority ) {
				return a.added === b.added ? 0 :
					a.added > b.added ? 1 :
					-1;
			}
			else {
				return a.priority > b.priority ? -1 : 1;
			}
		});
	};
});

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor;

CSSCompressor.extend({

	// Shipped formatters
	FORMAT_MAX: 'max',
	FORMAT_MED: 'medium',
	FORMAT_MIN: 'minimum',
	FORMAT_NONE: 'none',

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

})( this );

(function( global, undefined ) {
global.CSSCompressor.tables.color2hex = {
	"aliceblue":"#f0f8ff",
	"antiquewhite":"#faebd7",
	"aquamarine":"#7fffd4",
	"bisque":"#ffe4c4",
	"black":"#000000",
	"blanchedalmond":"#ffebcd",
	"blueviolet":"#8a2be2",
	"burlywood":"#deb887",
	"cadetblue":"#5f9ea0",
	"chartreuse":"#7fff00",
	"chocolate":"#d2691e",
	"coral":"#ff7f50",
	"cornflowerblue":"#6495ed",
	"cornsilk":"#fff8dc",
	"crimson":"#dc143c",
	"cyan":"#00ffff",
	"darkblue":"#00008b",
	"darkcyan":"#008b8b",
	"darkgoldenrod":"#b8860b",
	"darkgray":"#a9a9a9",
	"darkgreen":"#006400",
	"darkkhaki":"#bdb76b",
	"darkmagenta":"#8b008b",
	"darkolivegreen":"#556b2f",
	"darkorange":"#ff8c00",
	"darkorchid":"#9932cc",
	"darkred":"#8b0000",
	"darksalmon":"#e9967a",
	"darkseagreen":"#8fbc8f",
	"darkslateblue":"#483d8b",
	"darkslategray":"#2f4f4f",
	"darkturquoise":"#00ced1",
	"darkviolet":"#9400d3",
	"deeppink":"#ff1493",
	"deepskyblue":"#00bfff",
	"dimgray":"#696969",
	"dodgerblue":"#1e90ff",
	"firebrick":"#b22222",
	"floralwhite":"#fffaf0",
	"forestgreen":"#228b22",
	"fuchsia":"#ff00ff",
	"gainsboro":"#dcdcdc",
	"ghostwhite":"#f8f8ff",
	"goldenrod":"#daa520",
	"greenyellow":"#adff2f",
	"honeydew":"#f0fff0",
	"hotpink":"#ff69b4",
	"indianred ":"#cd5c5c",
	"indigo  ":"#4b0082",
	"lavender":"#e6e6fa",
	"lavenderblush":"#fff0f5",
	"lawngreen":"#7cfc00",
	"lemonchiffon":"#fffacd",
	"lightblue":"#add8e6",
	"lightcoral":"#f08080",
	"lightcyan":"#e0ffff",
	"lightgoldenrodyellow":"#fafad2",
	"lightgrey":"#d3d3d3",
	"lightgreen":"#90ee90",
	"lightpink":"#ffb6c1",
	"lightsalmon":"#ffa07a",
	"lightseagreen":"#20b2aa",
	"lightskyblue":"#87cefa",
	"lightslategray":"#778899",
	"lightsteelblue":"#b0c4de",
	"lightyellow":"#ffffe0",
	"lime":"#00ff00",
	"limegreen":"#32cd32",
	"magenta":"#ff00ff",
	"maroon":"#800000",
	"mediumaquamarine":"#66cdaa",
	"mediumblue":"#0000cd",
	"mediumorchid":"#ba55d3",
	"mediumpurple":"#9370d8",
	"mediumseagreen":"#3cb371",
	"mediumslateblue":"#7b68ee",
	"mediumspringgreen":"#00fa9a",
	"mediumturquoise":"#48d1cc",
	"mediumvioletred":"#c71585",
	"midnightblue":"#191970",
	"mintcream":"#f5fffa",
	"mistyrose":"#ffe4e1",
	"moccasin":"#ffe4b5",
	"navajowhite":"#ffdead",
	"oldlace":"#fdf5e6",
	"olivedrab":"#6b8e23",
	"orange":"#ffa500",
	"orangered":"#ff4500",
	"orchid":"#da70d6",
	"palegoldenrod":"#eee8aa",
	"palegreen":"#98fb98",
	"paleturquoise":"#afeeee",
	"palevioletred":"#d87093",
	"papayawhip":"#ffefd5",
	"peachpuff":"#ffdab9",
	"powderblue":"#b0e0e6",
	"purple":"#800080",
	"rosybrown":"#bc8f8f",
	"royalblue":"#4169e1",
	"saddlebrown":"#8b4513",
	"salmon":"#fa8072",
	"sandybrown":"#f4a460",
	"seagreen":"#2e8b57",
	"seashell":"#fff5ee",
	"sienna":"#a0522d",
	"silver":"#c0c0c0",
	"skyblue":"#87ceeb",
	"slateblue":"#6a5acd",
	"slategray":"#708090",
	"springgreen":"#00ff7f",
	"steelblue":"#4682b4",
	"thistle":"#d8bfd8",
	"tomato":"#ff6347",
	"turquoise":"#40e0d0",
	"violet":"#ee82ee",
	"white":"#ffffff",
	"whitesmoke":"#f5f5f5",
	"yellow":"#ffff00",
	"yellowgreen":"#9acd32"
};

})( this );

(function( global, undefined ) {
global.CSSCompressor.tables.hex2shortcolor = {
	"#f0ffff":"azure",
	"#f5f5dc":"beige",
	"#ffe4c4":"bisque",
	"#a52a2a":"brown",
	"#ff7f50":"coral",
	"#ffd700":"gold",
	"#808080":"gray",
	"#008000":"green",
	"#4b0082":"indigo",
	"#fffff0":"ivory",
	"#f0e68c":"khaki",
	"#faf0e6":"linen",
	"#800000":"maroon",
	"#000080":"navy",
	"#808000":"olive",
	"#ffa500":"orange",
	"#da70d6":"orchid",
	"#cd853f":"peru",
	"#ffc0cb":"pink",
	"#dda0dd":"plum",
	"#800080":"purple",
	"#ff0000":"red",
	"#fa8072":"salmon",
	"#a0522d":"sienna",
	"#c0c0c0":"silver",
	"#fffafa":"snow",
	"#d2b48c":"tan",
	"#008080":"teal",
	"#ff6347":"tomato",
	"#ee82ee":"violet",
	"#f5deb3":"wheat",
	"#f00":"red"
};

})( this );

(function( global, undefined ) {
global.CSSCompressor.tables.hex2shortsafe = {
	"#808080":"gray",
	"#008000":"green",
	"#800000":"maroon",
	"#000080":"navy",
	"#808000":"olive",
	"#ff0000":"red",
	"#c0c0c0":"silver",
	"#008080":"teal",
	"#f00":"red"
};

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rnewlinespace = /\n\s/,
	rnewline = /\r\n|\r|\n/,
	rvalueseparator = /^\/|,$/;

function render( css, branches, indent ) {
	if ( indent === undefined ) {
		indent = '';
	}

	branches.forEach(function( branch, branchIndex ) {
		var section = [], sections = [ section ], newparts = [], nextBranch = branches[ branchIndex + 1 ], selector = '';

		// Comments
		if ( branch.comment ) {
			css += indent + branch.comment.replace( rnewline, "\n" + indent ) + "\n";
		}
		// Ruleset
		else if ( branch.selector ) {
			branch.parts.forEach(function( part, i ) {
				if ( part === ',' ) {
					sections.push( section = [] );
					return;
				}
				else if ( CSSCompressor.isArray( part ) ) {
					part = part.join( '' );
				}

				section.push( part );
			});

			sections.forEach(function( s ) {
				newparts.push( s.join( ' ' ) );
			});

			// Add selector
			css += indent +
				newparts.join( ",\n" + indent ).replace( rnewlinespace, "\n" ).replace( rnewline, "\n" + indent ) +
				" {";

			// Add rules
			branch.rules.forEach(function( rule, i ) {
				var value = '', prev, spacing;
				rule.parts.forEach(function( part, ri ) {
					prev = rule.parts[ ri - 1 ];
					spacing = value.length &&
						! rvalueseparator.exec( part ) &&
						( ! rvalueseparator.exec( prev ) || prev == ',' );

					if ( spacing  ) {
						value += ' ';
					}

					value += part;
				});

				// Prop:val
				css += "\n\t" + indent + rule.property + ": " + value;

				// Skip last semi colon
				if ( i < branch.rules.length - 1 ) {
					css += ';';
				}
			});

			// Closing brace
			css += "\n" + indent + "}";

			// Add two lines after each ruleset
			if ( branchIndex < branches.length - 1 ) {
				css += "\n\n";
			}
		}
		// Atrules
		else if ( branch.atrule ) {
			selector = '';
			branch.parts.forEach(function( part, i ) {
				var prev = branch.parts[ i - 1 ];

				if ( selector.length && part != ',' ) {
					selector += ' ';
				}

				selector += part;
			});

			// Actual rule block
			if ( branch.branches || branch.rules ) {

				// Add selector
				css += indent + selector + " {";

				// Add rules
				branch.rules.forEach(function( rule, i ) {
					var value = '', prev, spacing;
					rule.parts.forEach(function( part, ri ) {
						prev = rule.parts[ ri - 1 ];
						spacing = value.length &&
							! rvalueseparator.exec( part ) &&
							( ! rvalueseparator.exec( prev ) || prev == ',' );

						if ( spacing  ) {
							value += ' ';
						}

						value += part;
					});

					// Prop:val
					css += "\n\t" + indent + rule.property + ": " + value;

					// Skip last semi colon
					if ( i < branch.rules.length - 1 ) {
						css += ';';
					}
				});

				// Handle nested selectors
				if ( branch.branches ) {
					css += branch.rules.length ? ";\n\n" : "\n";
					css = render( css, branch.branches, indent + "\t" );
				}

				// Closing brace
				css += "\n" + indent + "}";

				// Add two lines after each ruleset
				if ( branchIndex < branches.length - 1 && indent.length === 0 ) {
					css += "\n\n";
				}
			}
			// One-liners, @imports
			else {
				css += indent + selector + ";\n";

				// Add extra spacing if one-liners are complete
				if ( ! nextBranch.atrule || nextBranch.branches || nextBranch.rules ) {
					css += "\n";
				}
			}
		}
	});

	return css;
}

CSSCompressor.addFormat( CSSCompressor.FORMAT_MAX, function( compressor ) {
	return render( '', compressor.branches );
});

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rnewline = /\r\n|\r|\n/,
	rvalueseparator = /^\/|,$/;

function render( css, branches, indent ) {
	if ( indent === undefined ) {
		indent = '';
	}

	branches.forEach(function( branch, branchIndex ) {
		var section = [], sections = [ section ], newparts = [], nextBranch = branches[ branchIndex + 1 ], selector = '';

		// Comments
		if ( branch.comment ) {
			css += indent + branch.comment.replace( rnewline, "\n" + indent ) + "\n";
		}
		// Ruleset
		else if ( branch.selector ) {
			// Combine selector sections based on comma's
			branch.parts.forEach(function( part, i ) {
				if ( part === ',' ) {
					sections.push( section = [] );
					return;
				}
				else if ( CSSCompressor.isArray( part ) ) {
					part = part.join( '' );
				}

				section.push( part );
			});

			// Join sections
			sections.forEach(function( s ) {
				newparts.push( s.join( ' ' ) );
			});

			// Add selector
			css += indent + newparts.join( ', ' ) + " {" + ( branch.rules.length ? "\n\t" + indent : '' );

			// Add rules
			branch.rules.forEach(function( rule, i ) {
				if ( i > 0 ) {
					css += " ";
				}

				var value = '', prev, spacing;
				rule.parts.forEach(function( part, ri ) {
					prev = rule.parts[ ri - 1 ];
					spacing = value.length &&
						! rvalueseparator.exec( part ) &&
						( ! rvalueseparator.exec( prev ) || prev == ',' );

					if ( spacing  ) {
						value += ' ';
					}

					value += part;
				});

				// Prop:val
				css += rule.property + ":" + value;

				// Skip last semi colon
				if ( i < branch.rules.length - 1 ) {
					css += ';';
				}
			});

			// Closing brace
			css += "\n" + indent + "}";

			// Add two lines after each ruleset
			if ( branchIndex < branches.length - 1 ) {
				css += "\n\n";
			}
		}
		// Atrules
		else if ( branch.atrule ) {
			selector = '';
			branch.parts.forEach(function( part, i ) {
				var prev = branch.parts[ i - 1 ];

				if ( selector.length && part != ',' ) {
					selector += ' ';
				}

				selector += part;
			});

			// Actual rule block
			if ( branch.branches || branch.rules ) {
				css += indent + selector + " {" + ( branch.rules.length ? "\n\t" + indent : '' );

				// Add rules
				branch.rules.forEach(function( rule, i ) {
					if ( i > 0 ) {
						css += " ";
					}

					var value = '', prev, spacing;
					rule.parts.forEach(function( part, ri ) {
						prev = rule.parts[ ri - 1 ];
						spacing = value.length &&
							! rvalueseparator.exec( part ) &&
							( ! rvalueseparator.exec( prev ) || prev == ',' );

						if ( spacing  ) {
							value += ' ';
						}

						value += part;
					});

					// Prop:val
					css += rule.property + ":" + value;

					// Skip last semi colon
					if ( i < branch.rules.length - 1 ) {
						css += ';';
					}
				});

				// Handle nested selectors
				if ( branch.branches ) {
					css += branch.rules.length ? ";\n\n" : "\n";
					css = render( css, branch.branches, indent + "\t" );
				}

				// Closing brace
				css += "\n" + indent + "}";

				// Add two lines after each ruleset
				if ( branchIndex < branches.length - 1 && indent.length === 0 ) {
					css += "\n\n";
				}
			}
			// One-liners, @imports
			else {
				css += indent + selector + ";\n";

				// Add extra spacing if one-liners are complete
				if ( ! nextBranch.atrule || nextBranch.branches || nextBranch.rules ) {
					css += "\n";
				}
			}
		}
	});

	return css;
}

CSSCompressor.addFormat( CSSCompressor.FORMAT_MED, function( compressor ) {
	return render( '', compressor.branches );
});

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rnewline = /\r\n|\r|\n/,
	rvalueseparator = /^\/|,$/;

function render( css, branches, indent ) {
	if ( indent === undefined ) {
		indent = '';
	}

	branches.forEach(function( branch, branchIndex ) {
		var section = [], sections = [ section ], newparts = [], nextBranch = branches[ branchIndex + 1 ], selector = '';

		// Comments
		if ( branch.comment ) {
			css += indent + branch.comment.replace( rnewline, "\n" + indent ) + "\n";
		}
		// Ruleset
		else if ( branch.selector ) {
			// Combine selector sections based on comma's
			branch.parts.forEach(function( part, i ) {
				if ( part === ',' ) {
					sections.push( section = [] );
					return;
				}
				else if ( CSSCompressor.isArray( part ) ) {
					part = part.join( '' );
				}

				section.push( part );
			});

			// Join sections
			sections.forEach(function( s ) {
				newparts.push( s.join( ' ' ) );
			});

			// Add selector
			css += indent + newparts.join( ', ' ) + " { ";

			// Add rules
			branch.rules.forEach(function( rule, i ) {
				if ( i > 0 ) {
					css += " ";
				}

				// Value combination
				var value = '', prev, spacing;
				rule.parts.forEach(function( part, ri ) {
					prev = rule.parts[ ri - 1 ];
					spacing = value.length &&
						! rvalueseparator.exec( part ) &&
						( ! rvalueseparator.exec( prev ) || prev == ',' );

					if ( spacing  ) {
						value += ' ';
					}

					value += part;
				});

				// Prop:val
				css += rule.property + ":" + value;

				// Skip last semi colon
				if ( i < branch.rules.length - 1 ) {
					css += ';';
				}
			});

			// Closing brace
			css += " }";

			// Add two lines after each ruleset
			if ( branchIndex < branches.length - 1 ) {
				css += "\n";
			}
		}
		// Atrules
		else if ( branch.atrule ) {
			selector = '';
			branch.parts.forEach(function( part, i ) {
				var prev = branch.parts[ i - 1 ];

				if ( selector.length && part != ',' ) {
					selector += ' ';
				}

				selector += part;
			});

			// Actual rule block
			if ( branch.branches || branch.rules ) {
				css += indent + selector + " {" + ( branch.rules && branch.branches ? "\n\t" + indent : '' );

				// Add rules
				branch.rules.forEach(function( rule, i ) {
					if ( i > 0 ) {
						css += " ";
					}

					// Value combination
					var value = '', prev, spacing;
					rule.parts.forEach(function( part, ri ) {
						prev = rule.parts[ ri - 1 ];
						spacing = value.length &&
							! rvalueseparator.exec( part ) &&
							( ! rvalueseparator.exec( prev ) || prev == ',' );

						if ( spacing  ) {
							value += ' ';
						}

						value += part;
					});

					// Prop:val
					css += rule.property + ":" + value;

					// Skip last semi colon
					if ( i < branch.rules.length - 1 ) {
						css += ';';
					}
				});

				// Handle nested selectors
				if ( branch.branches ) {
					css += branch.rules.length ? ";\n" : "\n";
					css = render( css, branch.branches, indent + "\t" );
					css += "\n";
				}

				// Closing brace
				css += "}";

				// Add two lines after each ruleset
				if ( branchIndex < branches.length - 1 && indent.length === 0 ) {
					css += "\n";
				}
			}
			// One-liners, @imports
			else {
				css += indent + selector + ";\n";
			}
		}
	});

	return css;
}

CSSCompressor.addFormat( CSSCompressor.FORMAT_MIN, function( compressor ) {
	return render( '', compressor.branches );
});

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rvalueseparator = /^\/|,$/,
	rselectorbreak = /^[\~\+\*\,>]$/;

function render( css, branches ) {
	branches.forEach(function( branch, branchIndex ) {
		var newparts = [], nextBranch = branches[ branchIndex + 1 ], selector = '';

		// Comments
		if ( branch.comment ) {
			css += branch.comment;
		}
		// Ruleset
		else if ( branch.selector ) {
			branch.parts.forEach(function( part, i ) {
				var prev = branch.parts[ i - 1 ];

				if ( selector.length && ! rselectorbreak.exec( part ) && ! rselectorbreak.exec( prev ) ) {
					selector += ' ';
				}

				selector += CSSCompressor.isArray( part ) ? part.join( '' ) : part;
			});

			// Add selector
			css += selector + "{";

			// Add rules
			branch.rules.forEach(function( rule, i ) {
				var value = '';
				rule.parts.forEach(function( part, ri ) {
					var prev = rule.parts[ ri - 1 ];
					if ( value.length && part != '!important' && ! rvalueseparator.exec( part ) && ! rvalueseparator.exec( prev ) ) {
						value += ' ';
					}

					value += part;
				});

				// Prop:val
				css += rule.property + ":" + value;

				// Skip last semi-colon
				if ( i < branch.rules.length - 1 ) {
					css += ';';
				}
			});

			// Closing brace
			css += "}";
		}
		// At rules
		else if ( branch.atrule ) {
			selector = '';
			branch.parts.forEach(function( part, i ) {
				var prev = branch.parts[ i - 1 ];

				if ( selector.length && part != ',' && prev != ',' ) {
					selector += ' ';
				}

				selector += part;
			});

			// Nested selectors
			if ( branch.branches || branch.rules ) {
				// TODO: Handle atrule selector parts
				css += selector + "{";

				// Add rules
				( branch.rules || [] ).forEach(function( rule, i ) {
					var value = '';
					rule.parts.forEach(function( part, ri ) {
						var prev = rule.parts[ ri - 1 ];
						if ( value.length && ! rvalueseparator.exec( part ) && ! rvalueseparator.exec( prev ) ) {
							value += ' ';
						}

						value += part;
					});

					// Prop:val
					css += rule.property + ":" + value;

					// Skip last semi-colon
					if ( i < branch.rules.length - 1 ) {
						css += ';';
					}
				});

				// Add nested selectors
				if ( branch.branches ) {
					css += branch.rules && branch.rules.length ? ';' : '';
					css = render( css, branch.branches );
				}

				// Closing brace
				css += "}";
			}
			// One-liners, @imports
			else {
				css += selector + ";";
			}
		}
	});

	return css;
}

CSSCompressor.addFormat( CSSCompressor.FORMAT_NONE, function( compressor ) {
	return render( '', compressor.branches );
});

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rdecimal = /^(\+|\-)?(\d*\.[1-9]*0*)(\%|[a-z]{2})$/i,
	rzero = /^(\+|\-)?0(\.\d+)(\%|[a-z]{2})?$/i,
	runit = /^(\+|\-)?0(\%|[a-z]{2})$/i,
	rrect = /^rect\(([^\)]+)\)$/i,
	rcomma = /,/g;


CSSCompressor.addValue([

	{
		name: 'Trailing Zeroes',
		group: 'Numeric',
		description: "Removes unecessary trailing zeroes from values.",
		callback: function( value, position, compressor ) {
			var m = rdecimal.exec( value ),
				before = value;

			if ( m ) {
				value = ( m[ 1 ] ? m[ 1 ] : '' ) + parseFloat( m[ 2 ] ) + ( m[ 3 ] ? m[ 3 ] : '' );

				if ( position ) {
					compressor.log(
						"Removing unecesary trailing zeroes '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Leading Zeroes',
		group: 'Numeric',
		description: "Removes unecessary leading zeroes from values.",
		callback: function( value, position, compressor ) {
			var m = rzero.exec( value ),
				before = value;

			if ( m ) {
				value = ( m[ 1 ] ? m[ 1 ] : '' ) + m[ 2 ] + ( m[ 3 ] ? m[ 3 ] : '' );

				if ( position ) {
					compressor.log(
						"Removes unecessary leading zeroes '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Unit Suffix',
		group: 'Numeric',
		description: "Removes unecessary suffix from zero unit values.",
		callback: function( value, position, compressor ) {
			var m = runit.exec( value ),
				before = value;

			if ( m ) {
				value = '0';

				if ( position ) {
					compressor.log(
						"Removing unecesary trailing zeroes '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Rect Shape',
		group: 'Numeric',
		description: "Compressing rect shape declarations",
		callback: function( value, position, compressor ) {
			var m = rrect.exec( value ) || [],
				content = m[ 1 ] || '',
				before = value,
				parts;

			if ( content.length ) {
				parts = content.split( rcomma );
				parts.forEach(function( value, index ) {
					parts[ index ] = compressor.value( value.trim(), position );
				});
				value = "rect(" + parts.join( ',' ) + ")";

				if ( value != before && position ) {
					compressor.log(
						"Removing whitespace and compressing numerics in rect shape. '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rrgb = /^rgb\(\s*(\d{1,3}\%?(\s*,\s*\d{1,3}\%?\s*,\s*\d{1,3}\%?)?)\s*\)$/i,
	rfullhex = /^#([0-9a-f]{6})$/i,
	rshorthex = /^#([0-9a-f]{3})$/i,
	ruppercase = /[A-Z]/,
	HEX = '0123456789abcdef';


CSSCompressor.addValue([

	{
		name: 'RGB to Hex',
		group: 'Color',
		description: "Converts RGB to Hex code.",
		callback: function( value, position, compressor ) {
			var m = rrgb.exec( value ),
				before = value,
				str = '#', values;

			if ( m ) {
				// Create array of r,g,b values
				if ( m[ 1 ].indexOf( ',' ) > -1 ) {
					values = m[ 1 ].split( ',' );
				}
				else {
					values = [ m[ 1 ], m[ 1 ], m[ 1 ] ];
				}

				// Convert each value to it's hex form
				CSSCompressor.each( values, function( v ) {
					v = v.trim();

					// Convert entry to integer
					if ( v.indexOf( '%' ) > -1 ) {
						v = parseInt( v.substr( 0, v.length - 1 ), 10 );
						v = parseInt( ( v / 100 ) * 255, 10 );
					}
					else {
						v = parseInt( v, 10 );
					}

					// Enforce Max/Min
					if ( v > 255 ) {
						v = 255;
					}
					else if ( v < 0 ) {
						v = 0;
					}

					str += HEX[ ( v - ( v % 16 ) ) / 16 ];
					str += HEX[ v % 16 ];
				});


				value = str;
				if ( position ) {
					compressor.log(
						"Converting RGB to Hex code '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Color to Hex',
		group: 'Color',
		description: "Converts colors to shorter hex representation.",
		callback: function( value, position, compressor ) {
			var match = CSSCompressor.tables.color2hex[ value.toLowerCase() ],
				before = value;

			if ( match ) {
				value = match;

				if ( position ) {
					compressor.log(
						"Converting color to short hex '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Hex to Color',
		group: 'Color',
		description: "Converts hex codes to short color names.",
		callback: function( value, position, compressor ) {
			var match = CSSCompressor.tables.hex2shortcolor[ value.toLowerCase() ],
				before = value;

			if ( match ) {
				value = match;

				if ( position ) {
					compressor.log(
						"Converting hex code to short color name '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Hex to Safe Color',
		group: 'Color',
		description: "Converts hex codes to short safe color names.",
		callback: function( value, position, compressor ) {
			var match = CSSCompressor.tables.hex2shortsafe[ value.toLowerCase() ],
				before = value;

			if ( match ) {
				value = match;

				if ( position ) {
					compressor.log(
						"Converting hex code to short safe color name '" + before + "' => '" + value + "'",
						position
					);
				}
			}

			return value;
		}
	},

	{
		name: 'Shrink Hex',
		group: 'Color',
		description: "Converts long hex to short hex.",
		callback: function( value, position, compressor ) {
			var m = rfullhex.exec( value ),
				before = value,
				hex;

			if ( m ) {
				hex = m[ 1 ];

				// All alternating positions must match
				if ( hex[ 0 ] === hex[ 1 ] && hex[ 2 ] === hex[ 3 ] && hex[ 4 ] === hex[ 5 ] ) {
					value = '#' + hex[ 0 ] + hex[ 2 ] + hex[ 4 ];

					if ( position ) {
						compressor.log(
							"Converting long hex to short hex code '" + before + "' => '" + value + "'",
							position
						);
					}
				}
			}

			return value;
		}
	},

	{
		name: 'Lowercase Hex',
		group: 'Color',
		description: "Lowercases hex color values for better gzip compression.",
		callback: function( value, position, compressor ) {
			if ( ( rfullhex.exec( value ) || rshorthex.exec( value ) ) && ruppercase.exec( value ) ) {
				if ( position ) {
					compressor.log(
						"Lowercasing hex code '" + value + "' => '" + value.toLowerCase() + "'",
						position
					);
				}

				value = value.toLowerCase();
			}

			return value;
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	ralpha = /^[a-z]+$/i,
	ruppercase = /[A-Z]/,
	rattr = /^\[([a-z]+[^=]?)=('|")([a-z0-9_]+)('|")\]$/i,
	ridattr = /^\[id=('|")?([a-z0-9_\-]+)('|")?\]$/i,
	rclassattr = /^\[class=('|")?([a-z0-9_\- ]+)('|")?\]$/i;


CSSCompressor.addRuleBlock([

	{
		name: 'Lowercase Selectors',
		group: 'Selector',
		description: "Converts element selectors to lowercase.",
		callback: function( branch, compressor ) {
			if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
				return;
			}

			var newparts = [];
			branch.parts.forEach(function( part ) {
				var newsubs = [];

				if ( CSSCompressor.isArray( part ) ) {
					part.forEach(function( subpart ) {
						if ( ralpha.exec( subpart ) && ruppercase.exec( subpart ) ) {
							compressor.log(
								"Lowercasing selector '" + subpart + "' => '" + subpart.toLowerCase() + "'",
								branch.position
							);

							subpart = subpart.toLowerCase();
						}

						newsubs.push( subpart );
					});

					newparts.push( newsubs );
				}
				else {
					if ( ralpha.exec( part ) && ruppercase.exec( part ) ) {
						compressor.log(
							"Lowercasing selector '" + part + "' => '" + part.toLowerCase() + "'",
							branch.position
						);

						part = part.toLowerCase();
					}

					newparts.push( part );
				}
			});

			// Update branch
			branch.parts = newparts;
		}
	},

	{
		name: 'Trim Selector Attribute Quotes',
		group: 'Selector',
		description: "Remove attribute quotes when they are not needed.",
		callback: function( branch, compressor ) {
			if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
				return;
			}

			var newparts = [];
			branch.parts.forEach(function( part ) {
				var newsubs = [], old = part, m;

				if ( CSSCompressor.isArray( part ) ) {
					part.forEach(function( subpart ) {
						if ( ( m = rattr.exec( subpart ) ) && m[ 2 ] == m[ 4 ] ) {
							old = subpart;
							subpart = "[" + m[ 1 ] + "=" + m[ 3 ] + "]";

							if ( branch.position ) {
								compressor.log(
									"Removing quotes around attribute '" + old + "' => '" + subpart + "'",
									branch.position
								);
							}
						}

						newsubs.push( subpart );
					});

					newparts.push( newsubs );
				}
				else {
					if ( ( m = rattr.exec( part ) ) && m[ 2 ] == m[ 4 ] ) {
						part = "[" + m[ 1 ] + "=" + m[ 3 ] + "]";

						if ( branch.position ) {
							compressor.log(
								"Removing quotes around attribute '" + old + "' => '" + part + "'",
								branch.position
							);
						}
					}

					newparts.push( part );
				}
			});

			// Update branch
			branch.parts = newparts;
		}
	},

	{
		name: 'ID Attribute to Selector',
		group: 'Selector',
		description: "Converts id attributes to id selectors.",
		callback: function( branch, compressor ) {
			if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
				return;
			}

			var newparts = [];
			branch.parts.forEach(function( part ) {
				var newsubs = [], m;

				if ( CSSCompressor.isArray( part ) ) {
					part.forEach(function( subpart ) {
						if ( ( m = ridattr.exec( subpart ) ) ) {
							compressor.log(
								"Converting id attribute to selector '" + subpart + "' => '#" + m[ 2 ] + "'",
								branch.position
							);

							subpart = '#' + m[ 2 ];
						}

						newsubs.push( subpart );
					});

					newparts.push( newsubs );
				}
				else {
					if ( ( m = ridattr.exec( part ) ) ) {
						compressor.log(
							"Converting id attribute to selector '" + part + "' => '#" + m[ 2 ] + "'",
							branch.position
						);

						part = '#' + m[ 2 ];
					}

					newparts.push( part );
				}
			});

			// Update branch
			branch.parts = newparts;
		}
	},

	{
		name: 'Class Attribute to Selector',
		group: 'Selector',
		description: "Converts class attributes to class selectors.",
		callback: function( branch, compressor ) {
			if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
				return;
			}

			var newparts = [];
			branch.parts.forEach(function( part ) {
				var newsubs = [], m, old, compare;

				if ( CSSCompressor.isArray( part ) ) {
					part.forEach(function( subpart ) {
						if ( ( m = rclassattr.exec( subpart ) ) ) {
							old = subpart;

							// Handle multiple classes defined
							if ( m[ 2 ].indexOf( ' ' ) > -1 ) {
								subpart = [];
								m[ 2 ].split( ' ' ).forEach(function( name ) {
									subpart.push( '.' + name );
								});
							}
							else {
								subpart = '.' + m[ 2 ];
							}

							// Logging
							compare = CSSCompressor.isArray( subpart ) ? subpart.join( '' ) : subpart;
							compressor.log(
								"Converting class attribute to selector '" + old + "' => '" + compare + "'",
								branch.position
							);
						}

						if ( CSSCompressor.isArray( subpart ) ) {
							newsubs = newsubs.concat( subpart );
						}
						else {
							newsubs.push( subpart );
						}
					});

					newparts.push( newsubs );
				}
				else {
					if ( ( m = rclassattr.exec( part ) ) ) {
						old = part;

						// Handle multiple classes defined
						if ( m[ 2 ].indexOf( ' ' ) > -1 ) {
							part = [];
							m[ 2 ].split( ' ' ).forEach(function( name ) {
								part.push( '.' + name );
							});
						}
						else {
							part = '.' + m[ 2 ];
						}

						// Logging
						compare = CSSCompressor.isArray( part ) ? part.join( '' ) : part;
						compressor.log(
							"Converting class attribute to selector '" + old + "' => '" + compare + "'",
							branch.position
						);
					}

					newparts.push( part );
				}
			});

			// Update branch
			branch.parts = newparts;
		}
	},

	{
		name: 'Strict ID',
		group: 'Selector',
		description: "Removes entire selector before last ID selector.",
		callback: function( branch, compressor ) {
			if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
				return;
			}

			var commaParts = [],
				current = [],
				newCommaParts = [],
				parts = [];

			// Break selectors across commas
			branch.parts.forEach(function( part ) {
				if ( part === ',' ) {
					commaParts.push( current );
					current = [];
				}
				else {
					current.push( part );
				}
			});

			// Catch last comma
			if ( current.length ) {
				commaParts.push( current );
			}

			// Promote ID's on each selector
			commaParts.forEach(function( parts ) {
				var newparts = [], subparts = [],
					i = parts.length,
					found = false,
					part, subpart, j;

				while ( i-- ) {
					part = parts[ i ];

					if ( CSSCompressor.isArray( part ) ) {
						j = part.length;
						subparts = [];

						while ( j-- ) {
							subpart = part[ j ];
							subparts.unshift( subpart );

							if ( subpart[ 0 ] === '#' ) {
								if ( j !== 0 && i !== 0 ) {
									compressor.log(
										"Promoting nested ID to selector front",
										branch.position
									);
								}

								found = true;
								break;
							}
						}

						newparts.unshift( subparts );
						if ( found ) {
							break;
						}
					}
					else {
						newparts.unshift( part );

						if ( part[ 0 ] === '#' ) {
							if ( i !== 0 ) {
								compressor.log(
									"Promoting nested ID to selector front",
									branch.position
								);
							}

							break;
						}
					}
				}

				newCommaParts.push( newparts );
			});

			// Join the parts back together, and inject commas back in
			newCommaParts.forEach(function( a, i ) {
				parts.push.apply( parts, a );

				if ( i < newCommaParts.length - 1 ) {
					parts.push( ',' );
				}
			});

			// Update branch
			branch.parts = parts;
		}
	},

	{
		name: 'Comma Repeats',
		group: 'Selector',
		description: "Removes repeated selectors separated by commas.",
		callback: function( branch, compressor ) {
			if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
				return;
			}

			// Break selectors across commas
			var parts = [], current = [], newparts = [], i = -1, l, j;
			branch.parts.forEach(function( part ) {
				if ( part === ',' ) {
					parts.push( current );
					current = [];
				}
				else {
					current.push( part );
				}
			});

			// Catch last comma
			if ( current.length ) {
				parts.push( current );
			}

			// Skip over matching selector queries
			for ( l = parts.length; ++i < l; ) {
				for ( j = i; ++j < l; ) {
					if ( CSSCompressor.objectsMatch( parts[ i ], parts[ j ] ) ) {
						parts.splice( j, 1 );
						l = parts.length;
						j--;
					}
				}
			}


			// Join the parts back together, and inject commas back in
			parts.forEach(function( a, i ) {
				newparts.push.apply( newparts, a );

				if ( i < parts.length - 1 ) {
					newparts.push( ',' );
				}
			});

			// Update branch
			branch.parts = newparts;
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rfontweightprop = /^font-weight|font$/,
	rfontfamilyprop = /^font-family|font$/,
	weights = {
		normal: '400',
		bold: '700'
	};


CSSCompressor.addRule([

	{
		name: 'Font Weight Conversion',
		group: 'Font',
		description: "Converts font weight strings to their numeric counterparts.",
		callback: function( rule, branch, compressor ) {
			if ( ! rfontweightprop.exec( rule.property ) || ! rule.parts || ! rule.parts.length ) {
				return;
			}

			rule.parts.forEach(function( part, i ) {
				if ( weights[ part.toLowerCase() ] ) {
					rule.parts[ i ] = weights[ part.toLowerCase() ];

					compressor.log(
						"Compressing font weight property '" + part + "' => '" + rule.parts[ i ] + "'",
						rule.position
					);
				}
			});
		}
	},

	{
		name: 'Font Family Quotes',
		group: 'Font',
		description: "Removes quotes around font family names.",
		callback: function( rule, branch, compressor ) {
			if ( ! rfontfamilyprop.exec( rule.property ) || ! rule.parts || ! rule.parts.length ) {
				return;
			}

			rule.parts.forEach(function( part, i ) {
				if ( ( part[ 0 ] == '"' || part[ 0 ] == "'" ) && part[ 0 ] == part[ part.length - 1 ] ) {
					rule.parts[ i ] = part.substr( 1, part.length - 2 );

					compressor.log(
						"Removing font family quotes '" + part + "' => '" + rule.parts[ i ] + "'",
						rule.position
					);
				}
			});
		}
	}

]);

CSSCompressor.addRuleBlock([

	{
		name: 'Font Combinations',
		group: 'Font',
		description: "Combines font declarations into single property.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			[

				[ 'font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family' ],
				[ 'font-style', 'font-variant', 'font-weight', 'font-size', 'font-family' ],
				[ 'font-style', 'font-variant', 'font-size', 'line-height', 'font-family' ],
				[ 'font-style', 'font-variant', 'font-size', 'font-family' ],
				[ 'font-style', 'font-weight', 'font-size', 'line-height', 'font-family' ],
				[ 'font-style', 'font-weight', 'font-size', 'font-family' ],
				[ 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family' ],
				[ 'font-variant', 'font-weight', 'font-size', 'font-family' ],
				[ 'font-weight', 'font-size', 'line-height', 'font-family' ],
				[ 'font-weight', 'font-size', 'font-family' ],
				[ 'font-variant', 'font-size', 'line-height', 'font-family' ],
				[ 'font-variant', 'font-size', 'font-family' ],
				[ 'font-style', 'font-size', 'line-height', 'font-family' ],
				[ 'font-style', 'font-size', 'font-family' ],
				[ 'font-size', 'line-height', 'font-family' ],
				[ 'font-size', 'font-family' ]

			].forEach(function( graph ) {
				var used = [],
					hash = {},
					first = null,
					parts = [],
					newparts = [],
					fsi = -1,
					lhi = -1;

				branch.rules.forEach(function( rule ) {
					if ( graph.indexOf( rule.property ) !== -1 ) {
						used.push( rule );
						hash[ rule.property ] = rule;
					}
					else if ( rule.property == 'font' ) {
						hash[ rule.property ] = true;
					}
				});

				if ( ! hash.font && CSSCompressor.keysInHash( graph, hash ) ) {
					parts = new Array( graph.length );
					first = used[ 0 ];

					used.forEach(function( rule ) {
						parts[ graph.indexOf( rule.property ) ] = rule.parts.length > 1 ? rule.parts : rule.parts[ 0 ];

						// Log the compression
						if ( rule !== first && rule.position && first.position ) {
							compressor.log(
								"Combining '" + rule.property + "' on line " + rule.position.start.line +
								" with '" + first.property + "' on line " + first.position.start.line,
								[ rule.position, first.position ]
							);
						}
					});

					// Handle font-size/line-height combination
					fsi = graph.indexOf( 'font-size' );
					lhi = graph.indexOf( 'line-height' );
					if ( fsi > -1 && lhi == fsi + 1 ) {
						parts[ fsi ] = [ parts[ fsi ], '/', parts[ lhi ] ];
						parts.splice( lhi, 1 );
					}

					// Expand out any nested arrays in the parts
					parts.forEach(function( part ) {
						if ( CSSCompressor.isArray( part ) ) {
							newparts.push.apply( newparts, part );
						}
						else {
							newparts.push( part );
						}
					});

					// Override first property
					first.property = 'font';
					first.parts = newparts;
					used.shift();
					CSSCompressor.removeItems( branch.rules, used );
				}
			});
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rnoneprop = /^(border|background|border-(top|right|bottom|left))$/i,
	rurl = /^url\((.*?)\)$/i,
	rurls = /^url\('(.*?)'\)$/i,
	rurld = /^url\("(.*?)"\)$/i,
	rgradient = /^([\-a-z]*)gradient(\s*)\(/i;


CSSCompressor.addRule([

	{
		name: 'None Conversions',
		group: 'Misc',
		description: "Converts none values to zeroes for allowed properties.",
		callback: function( rule, block, compressor ) {
			if ( rnoneprop.exec( rule.property ) && rule.parts.length === 1 && rule.parts[ 0 ].toLowerCase() == 'none' ) {
				compressor.log(
					"Converting color to short hex '" + rule.parts[ 0 ] + "' => '0'",
					rule.position
				);

				rule.parts = [ '0' ];
			}
		}
	},

	{
		name: 'URL Trim',
		group: 'Misc',
		description: "Removes quotes around url wrappers.",
		callback: function( rule, block, compressor ) {
			var newparts = [], m;
			rule.parts.forEach(function( part ) {
				if ( ( m = rurls.exec( part ) ) || ( m = rurld.exec( part ) ) ) {
					newparts.push( "url(" + m[ 1 ] + ")" );
					compressor.log(
						"Trimming url '" + part + "' => 'url(" + m[ 1 ] + ")'",
						rule.position
					);
				}
				else {
					newparts.push( part );
				}
			});

			rule.parts = newparts;
		}
	},

	{
		name: 'Gradient Compression',
		group: 'Misc',
		description: "Breaks down gradient properties and runs compressions on individual parts",
		callback: function( rule, block, compressor ) {
			var newparts = [];

			rule.parts.forEach(function( part ) {
				var m = rgradient.exec( part ),
					subparts = [], str = '', seek = null, sparts;

				if ( m ) {
					part.split( '' ).forEach(function( c ) {
						if ( ! subparts.length ) {
							str += c;

							if ( c == '(' ) {
								subparts.push( str );
								str = '';
							}
						}
						else if ( seek !== null ) {
							str += c;

							if ( c == seek ) {
								seek = null;
							}
						}
						else if ( c == '(' || c == '"' || c == "'" ) {
							str += c;
							seek = c == '(' ? ')' : c;
						}
						else if ( c == ')' || c == ',' ) {
							if ( str.indexOf( '(' ) > -1 ) {
								subparts.push( str.trim() );
							}
							else if ( str.indexOf( ' ' ) > -1 ) {
								sparts = [];
								str.split( ' ' ).forEach(function( spart ) {
									sparts.push( compressor.value( spart.trim(), rule.position ) );
								});

								subparts.push( sparts.join( ' ' ).trim() );
							}
							else {
								subparts.push( compressor.value( str.trim(), rule.position ) );
							}

							subparts.push( c );
							str = '';
						}
						else {
							str += c;
						}
					});

					newparts.push( subparts.join( '' ).trim() );
					compressor.log(
						"Trimming gradient value",
						rule.position
					);
				}
				else {
					newparts.push( part );
				}
			});

			rule.parts = newparts;
		}
	}

]);


CSSCompressor.addRuleBlock([

	{
		name: 'Atrule URL Trim',
		group: 'Misc',
		description: "Converts at-rule one liner url's to strings.",
		callback: function( branch, compressor ) {
			if ( ! branch.atrule || ! branch.parts.length || ( branch.rules && branch.rules.length > 0 ) ) {
				return;
			}

			var parts = [ branch.parts[ 0 ] ];
			branch.parts.slice( 1 ).forEach(function( part ) {
				var m = rurld.exec( part ) || rurls.exec( part ) || rurl.exec( part );

				if ( m ) {
					parts.push( '"' + m[ 1 ] + '"' );
					compressor.log(
						"Converting @import url '" + part + "' => '\"" + m[ 1 ] + "\"'",
						branch.position
					);
				}
				else {
					parts.push( part );
				}
			});
			branch.parts = parts;
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRule([
	
	{
		name: 'Margin, Padding Shorthand',
		group: 'Directionals',
		description: "Combines Margin/Padding shorthand directionals.",
		callback: function( rule, branch, compressor ) {
			if ( rule.property == 'margin' || rule.property == 'padding' ) {
				// Local copies
				var before = rule.parts.slice( 0 ),
					parts = rule.parts.slice( 0 );

				// 4 Direction
				if ( parts.length === 4 ) {
					// '3px 3px 3px 3px' => '3px'
					if ( parts[ 0 ] === parts[ 1 ] && parts[ 1 ] === parts[ 2 ] && parts[ 2 ] === parts[ 3 ] ) {
						parts = [ parts[ 0 ] ];
					}
					// '3px 2px 3px 2px' => '3px 2px'
					else if ( parts [ 0 ] === parts[ 2 ] && parts[ 1 ] === parts[ 3 ] ) {
						parts = [ parts[ 0 ], parts[ 1 ] ];
					}
					// '3px 2px 1px 2px' => '3px 2px 1px'
					else if ( parts[ 1 ] === parts[ 3 ] ) {
						parts = [ parts[ 0 ], parts[ 1 ], parts[ 2 ] ];
					}
				}
				// 3 Direction
				else if ( parts.length === 3 ) {
					// '3px 3px 3px' => '3px'
					if ( parts[ 0 ] === parts[ 1 ] && parts[ 1 ] === parts[ 2 ] ) {
						parts = [ parts[ 0 ] ];
					}
					// '3px 2px 3px' => '3px 2px'
					else if ( parts[ 0 ] === parts[ 2 ] ) {
						parts = [ parts[ 0 ], parts[ 1 ] ];
					}
				}
				// 2 Direction
				// '3px 3px' => '3px'
				else if ( parts.length === 2 && parts[ 0 ] === parts[ 1 ] ) {
					parts = [ parts[ 0 ] ];
				}

				// Log combination
				if ( before.length !== parts.length ) {
					rule.parts = parts;
					compressor.log(
						"Combining directionals for '" + rule.property + "'" + 
						" '" + before.join( ' ' ) + "' => '" + parts.join( ' ' ) + "'",
						rule.position
					);
				}
			}
		}
	}

]);

CSSCompressor.addRuleBlock([

	{
		name: 'Margin, Padding Combinations',
		group: 'Directionals',
		description: "Combines margin and padding directionals into their shorter alternative.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			// Both margin and padding work the same way
			[ 'margin', 'padding' ].forEach(function( prop ) {
				var hash = {},
					used = [],
					parts = [],
					first = null,
					ptop = prop + '-top',
					pright = prop + '-right',
					pbottom = prop + '-bottom',
					pleft = prop + '-left',
					matchKeys = [
						ptop,
						pright,
						pbottom,
						pleft
					];

				// Build hash table of directionals
				branch.rules.forEach(function( rule ) {
					if ( rule.property.indexOf( prop ) === 0 ) {
						used.push( rule );
						hash[ rule.property ] = rule;
					}
				});

				// Either all four directionals have to exist, or the shorthand property has to exist
				if ( ( hash[ prop ] && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
					parts = [ '0', '0', '0', '0' ];
					first = used[ 0 ];

					// Override directionals in order that they are used
					used.forEach(function( rule ) {
						if ( rule.property == prop ) {
							parts = rule.parts;

							// Handle shorted parts
							if ( parts.length === 1 ) {
								parts.push( parts[ 0 ] );
								parts.push( parts[ 0 ] );
								parts.push( parts[ 0 ] );
							}
							else if ( parts.length === 2 ) {
								parts.push( parts[ 0 ] );
								parts.push( parts[ 1 ] );
							}
							else if ( parts.length === 3 ) {
								parts.push( parts[ 1 ] );
							}
						}
						else if ( rule.property == ptop ) {
							parts[ 0 ] = rule.parts[ 0 ];
						}
						else if ( rule.property == pright ) {
							parts[ 1 ] = rule.parts[ 0 ];
						}
						else if ( rule.property == pbottom ) {
							parts[ 2 ] = rule.parts[ 0 ];
						}
						else if ( rule.property == pleft ) {
							parts[ 3 ] = rule.parts[ 0 ];
						}

						// Log the compression
						if ( rule !== first && rule.position && first.position ) {
							compressor.log(
								"Combining '" + rule.property + "' on line " + rule.position.start.line +
								" with '" + first.property + "' on line " + first.position.start.line,
								[ rule.position, first.position ]
							);
						}
					});

					// See if we can shortcut the shorthand property
					// '3px 3px 3px 3px' => '3px'
					if ( parts[ 0 ] === parts[ 1 ] && parts[ 1 ] === parts[ 2 ] && parts[ 2 ] === parts[ 3 ] ) {
						parts = [ parts[ 0 ] ];
					}
					// '3px 2px 3px 2px' => '3px 2px'
					else if ( parts [ 0 ] === parts[ 2 ] && parts[ 1 ] === parts[ 3 ] ) {
						parts = [ parts[ 0 ], parts[ 1 ] ];
					}
					// '3px 2px 1px 2px' => '3px 2px 1px'
					else if ( parts[ 1 ] === parts[ 3 ] ) {
						parts.pop();
					}

					// Override the first property
					first.property = prop;
					first.parts = parts;
					used.shift();
					CSSCompressor.removeItems( branch.rules, used );
				}
			});
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rshortradiusprop = /^(-webkit-|-moz-)?border-radius$/;


CSSCompressor.addRule([

	{
		name: 'Border Radius Shorthand',
		group: 'Border Radius',
		description: "Converts shorthand border radius properties.",
		callback: function( rule, branch, compressor ) {
			if ( ! rshortradiusprop.exec( rule.property ) || ! rule.parts || ! rule.parts.length ) {
				return;
			}

			// Locals
			var section = [], sections = [ section ];

			// Build up sections for compression
			rule.parts.forEach(function( part ) {
				if ( part == '/' ) {
					sections.push( section = [] );
				}
				else {
					section.push( part );
				}
			});

			// Compress both sections if possible
			sections.forEach(function( section, index ) {
				if ( ! section.length ) {
					return;
				}

				// Keep record
				var before = section.slice( 0 );

				// 4 Direction
				if ( section.length === 4 ) {
					// '3px 3px 3px 3px' => '3px'
					if ( section[ 0 ] === section[ 1 ] && section[ 1 ] === section[ 2 ] && section[ 2 ] === section[ 3 ] ) {
						section = [ section[ 0 ] ];
					}
					// '3px 2px 3px 2px' => '3px 2px'
					else if ( section [ 0 ] === section[ 2 ] && section[ 1 ] === section[ 3 ] ) {
						section = [ section[ 0 ], section[ 1 ] ];
					}
					// '3px 2px 1px 2px' => '3px 2px 1px'
					else if ( section[ 1 ] === section[ 3 ] ) {
						section = [ section[ 0 ], section[ 1 ], section[ 2 ] ];
					}
				}
				// 3 Direction
				else if ( section.length === 3 ) {
					// '3px 3px 3px' => '3px'
					if ( section[ 0 ] === section[ 1 ] && section[ 1 ] === section[ 2 ] ) {
						section = [ section[ 0 ] ];
					}
					// '3px 2px 3px' => '3px 2px'
					else if ( section[ 0 ] === section[ 2 ] ) {
						section = [ section[ 0 ], section[ 1 ] ];
					}
				}
				// 2 Direction
				// '3px 3px' => '3px'
				else if ( section.length === 2 && section[ 0 ] === section[ 1 ] ) {
					section = [ section[ 0 ] ];
				}

				// Log combination
				if ( before.length != section.length ) {
					sections[ index ] = section;
					compressor.log(
						"Combining " + rule.property + " directionals " + 
						" '" + before.join( ' ' ) + "' => '" + section.join( ' ' ) + "'",
						rule.position
					);
				}
			});

			// Apply compression back to rule block
			if ( sections.length == 2 ) {
				rule.parts = [];
				rule.parts.push.apply( rule.parts, sections[ 0 ] );
				rule.parts.push( '/' );
				rule.parts.push.apply( rule.parts, sections[ 1 ] );
			}
			else if ( sections.length == 1 ) {
				rule.parts = sections[ 0 ];
			}
		}
	}

]);


CSSCompressor.addRuleBlock([

	{
		name: 'Border Radius Combinations',
		group: 'Border Radius',
		description: "Combines border radius directionals into their shorter alternative.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			[

				// CSS3
				{
					topleft: 'border-top-left-radius',
					topright: 'border-top-right-radius',
					bottomleft: 'border-bottom-left-radius',
					bottomright: 'border-bottom-right-radius',
					shorthand: 'border-radius'
				},

				// Mozilla
				{
					topleft: '-moz-border-radius-topleft',
					topright: '-moz-border-radius-topright',
					bottomleft: '-moz-border-radius-bottomleft',
					bottomright: '-moz-border-radius-bottomright',
					shorthand: '-moz-border-radius'
				},

				// Webkit
				{
					topleft: '-webkit-border-top-left-radius',
					topright: '-webkit-border-top-right-radius',
					bottomleft: '-webkit-border-bottom-left-radius',
					bottomright: '-webkit-border-bottom-right-radius',
					shorthand: '-webkit-border-radius'
				}

			].forEach(function( graph ) {
				var used = [],
					hash = {},
					sections = [ [ '0', '0', '0', '0' ], [ '0', '0', '0', '0' ] ],
					first = null,
					separator = false,
					matchKeys = [
						'topleft',
						'topright',
						'bottomright',
						'bottomleft'
					];

				// Build up the hash table for comparison
				branch.rules.forEach(function( rule ) {
					CSSCompressor.each( graph, function( property, name ) {
						if ( rule.property == property ) {
							hash[ name ] = rule;
							used.push( rule );
						}
					});
				});

				// If shorthand is used, go with it, otherwise all 4 directionals have to exist
				if ( ( hash.shorthand && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
					first = used[ 0 ];

					used.forEach(function( rule ) {
						var inner = [[]], si = false;

						// Shorthand
						if ( rule.property == graph.shorthand ) {
							rule.parts.forEach(function( part, i ) {
								if ( part == '/' ) {
									separator = si = true;
									inner.push([]);
								}
								else {
									inner[ si ? 1 : 0 ].push( part );
								}
							});

							// Expand shorthand properties so they can be used
							inner.forEach(function( parts, i ) {
								if ( parts.length === 1 ) {
									parts.push( parts[ 0 ] );
									parts.push( parts[ 0 ] );
									parts.push( parts[ 0 ] );
								}
								else if ( parts.length === 2 ) {
									parts.push( parts[ 0 ] );
									parts.push( parts[ 1 ] );
								}
								else if ( parts.length === 1 ) {
									parts.push( parts[ 1 ] );
								}

								sections[ i ] = parts;
							});
						}
						// top-left
						else if ( rule.property == graph.topleft ) {
							if ( rule.parts.length == 2 ) {
								separator = true;
								sections[ 0 ][ 0 ] = rule.parts[ 0 ];
								sections[ 1 ][ 0 ] = rule.parts[ 1 ];
							}
							else {
								sections[ 0 ][ 0 ] = rule.parts[ 0 ];
							}
						}
						// top-right
						else if ( rule.property == graph.topright ) {
							if ( rule.parts.length == 2 ) {
								separator = true;
								sections[ 0 ][ 1 ] = rule.parts[ 0 ];
								sections[ 1 ][ 1 ] = rule.parts[ 1 ];
							}
							else {
								sections[ 0 ][ 1 ] = rule.parts[ 0 ];
							}
						}
						// bottom-right
						else if ( rule.property == graph.bottomright ) {
							if ( rule.parts.length == 2 ) {
								separator = true;
								sections[ 0 ][ 2 ] = rule.parts[ 0 ];
								sections[ 1 ][ 2 ] = rule.parts[ 1 ];
							}
							else {
								sections[ 0 ][ 2 ] = rule.parts[ 0 ];
							}
						}
						// bottom-left
						else if ( rule.property == graph.bottomleft ) {
							if ( rule.parts.length == 2 ) {
								separator = true;
								sections[ 0 ][ 3 ] = rule.parts[ 0 ];
								sections[ 1 ][ 3 ] = rule.parts[ 1 ];
							}
							else {
								sections[ 0 ][ 3 ] = rule.parts[ 0 ];
							}
						}

						// Log result
						if ( rule !== first && rule.position && first.position ) {
							compressor.log(
								"Combining '" + rule.property + "' on line " + rule.position.start.line +
								" with '" + graph.shorthand + "' on line " + first.position.start.line,
								[ rule.position, first.position ]
							);
						}
					});

					// See if we can compress the directionals
					sections.forEach(function( section, i ) {
						// '3px 3px 3px 3px' => '3px'
						if ( section[ 0 ] === section[ 1 ] && section[ 1 ] === section[ 2 ] && section[ 2 ] === section[ 3 ] ) {
							section = [ section[ 0 ] ];
						}
						// '3px 2px 3px 2px' => '3px 2px'
						else if ( section [ 0 ] === section[ 2 ] && section[ 1 ] === section[ 3 ] ) {
							section = [ section[ 0 ], section[ 1 ] ];
						}
						// '3px 2px 1px 2px' => '3px 2px 1px'
						else if ( section[ 1 ] === section[ 3 ] ) {
							section.pop();
						}

						// Override section
						sections[ i ] = section;
					});

					// Override parts
					first.property = graph.shorthand;
					first.parts = sections[ 0 ];
					if ( separator ) {
						first.parts.push( '/' );
						first.parts.push.apply( first.parts, sections[ 1 ] );
					}

					// Remove all used rules
					used.shift();
					CSSCompressor.removeItems( branch.rules, used );
				}
			});
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor;

CSSCompressor.addRuleBlock([

	{
		name: 'Border, Outline Style Combinations',
		group: 'Border',
		description: "Combine border & outline expanded properties into shorthand.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			// Both margin and padding work the same way
			[ 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'outline' ].forEach(function( prop ) {
				var hash = {},
					used = [],
					parts = [],
					first = null,
					pwidth = prop + '-width',
					pstyle = prop + '-style',
					pcolor = prop + '-color',
					matchKeys = [
						pwidth,
						pstyle,
						pcolor
					];

				// Build hash table of directionals
				branch.rules.forEach(function( rule ) {
					if ( rule.property == prop || matchKeys.indexOf( rule.property ) > -1 ) {
						used.push( rule );
						hash[ rule.property ] = rule;
					}
				});

				// Either all four directionals have to exist, or the shorthand property has to exist
				if ( ( hash[ prop ] && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
					parts = [ '', '', '' ];
					first = used[ 0 ];

					// Override directionals in order that they are used
					used.forEach(function( rule ) {
						if ( rule.property == prop ) {
							parts = rule.parts;
						}
						else if ( rule.property == pwidth ) {
							parts[ 0 ] = rule.parts[ 0 ];
						}
						else if ( rule.property == pstyle ) {
							parts[ 1 ] = rule.parts[ 0 ];
						}
						else if ( rule.property == pcolor ) {
							parts[ 2 ] = rule.parts[ 0 ];
						}

						// Log the compression
						if ( rule !== first && rule.position && first.position ) {
							compressor.log(
								"Combining '" + rule.property + "' on line " + rule.position.start.line +
								" with '" + first.property + "' on line " + first.position.start.line,
								[ rule.position, first.position ]
							);
						}
					});

					// Override the first property
					first.property = prop;
					first.parts = parts;
					used.shift();
					CSSCompressor.removeItems( branch.rules, used );
				}
			});
		}
	},

	{
		name: 'Border Combinations',
		group: 'Border',
		description: "Combines border directionals into single border property.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			var hash = {}, i, l, rule,
				used = [],
				parts = [],
				first = null,
				matchKeys = [
					'border-top',
					'border-right',
					'border-bottom',
					'border-left'
				];

			// Build hash table of directionals
			branch.rules.forEach(function( rule ) {
				if ( rule.property == 'border' || matchKeys.indexOf( rule.property ) > -1 ) {
					used.push( rule );
					hash[ rule.property ] = rule;
				}
			});

			// Either all four directionals have to exist, or the shorthand property has to exist
			if ( ( hash.border && used.length > 1 ) || CSSCompressor.keysInHash( matchKeys, hash ) ) {
				first = used[ 0 ];

				// All property values have to match for combination to work
				for ( i = -1, l = used.length; ++i < l; ) {
					rule = used[ i ];

					if ( ! CSSCompressor.objectsMatch( first.parts, rule.parts ) ) {
						return;
					}
				}

				// Log the compression of each rule
				used.forEach(function( rule ) {
					if ( rule !== first && rule.position && first.position ) {
						compressor.log(
							"Combining '" + rule.property + "' on line " + rule.position.start.line +
							" with '" + first.property + "' on line " + first.position.start.line,
							[ rule.position, first.position ]
						);
					}
				});

				// Override the first property
				first.property = 'border';
				used.shift();
				CSSCompressor.removeItems( branch.rules, used );
			}
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor;


CSSCompressor.addRuleBlock([

	{
		name: 'List Style Combinations',
		group: 'List',
		description: "Combines list-style properties into their shorter alternative.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			// Locals
			var used = [],
				hash = {},
				parts = [],
				matchKeys = [
					'list-style-type',
					'list-style-position',
					'list-style-image'
				];

			// Build up used properties
			branch.rules.forEach(function( rule ) {
				if ( ( rule.property == 'list-style' || matchKeys.indexOf( rule.property ) > -1 ) && rule.parts.length ) {
					hash[ rule.property ] = rule;
					used.push( rule );
				}
			});

			// Can-not safely combine into list-style, need sane ordering logic
			if ( ! hash[ 'list-style' ] && CSSCompressor.keysInHash( matchKeys, hash ) ) {
				parts = [ 'none', '', '' ];
				first = used[ 0 ];

				used.forEach(function( rule ) {
					if ( rule.property == 'list-style' ) {
						if ( rule.parts.length === 3 ) {
							parts = rule.parts;
						}
						else if ( rule.parts.length === 1 && rule.parts[ 0 ].toLowerCase() == 'none' ) {
							parts = [ 'none', '', '' ];
						}
					}
					else if ( rule.property == 'list-style-type' ) {
						parts[ 0 ] = rule.parts[ 0 ];
					}
					else if ( rule.property == 'list-style-position' ) {
						parts[ 1 ] = rule.parts[ 0 ];
					}
					else if ( rule.property == 'list-style-image' ) {
						parts[ 2 ] = rule.parts[ 0 ];
					}

					// Log each conversion
					if ( rule !== first && rule.position && first.position ) {
						compressor.log(
							"Combining '" + rule.property + "' on line " + rule.position.start.line +
							" with '" + first.property + "' on line " + first.position.start.line,
							[ rule.position, first.position ]
						);
					}
				});

				// Override the first property
				first.property = 'list-style';
				first.parts = parts;
				used.shift();
				CSSCompressor.removeItems( branch.rules, used );
			}
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	ruppercase = /[A-Z]/,
	rcharset = /^@charset$/i,
	rimport = /^@import$/i;


CSSCompressor.addRule([

	{
		name: 'Lowercase Properties',
		group: 'Organize',
		description: "Lowercases property names for better chance at compression during gzip",
		callback: function( rule, branch, compressor ) {
			if ( rule.property && ruppercase.exec( rule.property ) ) {
				compressor.log(
					"Lowercasing property '" + rule.property + "' => '" + rule.property.toLowerCase() + "'",
					rule.position
				);

				rule.property = rule.property.toLowerCase();
			}
		}
	}

]);

CSSCompressor.addRuleBlock([

	{
		name: 'Sort Properties',
		group: 'Organize',
		description: "Sorts property-values for a better chance at compression during gzip",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			var copy = branch.rules.slice( 0 );
			branch.rules.sort(function( a, b ) {
				if ( a.property && a.property.length && b.property && b.property.length ) {
					if ( a.property == b.property ) {
						if ( a.parts && a.parts.length && b.parts && b.parts.length ) {
							return a.parts.join( '' ) > b.parts.join( '' ) ? 1 : -1;
						}
						else {
							return 0;
						}
					}
					else {
						return a.property > b.property ? 1 : -1;
					}
				}
				else {
					return a.property && a.property.length ? 1 : -1;
				}
			});

			if ( ! CSSCompressor.objectsMatch( copy, branch.rules ) ) {
				compressor.rerun = true;
				compressor.log( 'Sorted rule block properties', branch.position );
			}
		}
	},

	{
		name: 'Sort Multi Selectors',
		group: 'Organize',
		description: "Sorts comma separated selectors for a better chance at compression during gzip",
		callback: function( branch, compressor ) {
			if ( ! branch.selector || ! branch.parts || ! branch.parts.length ) {
				return;
			}

			var section = { selector: '', parts: [] },
				sections = [ section ],
				parts = [], compare;

			// Build out each section for reference
			branch.parts.forEach(function( part ) {
				if ( part == ',' ) {
					sections.push( section = { selector: '', parts: [] } );
				}
				else {
					if ( section.selector.length ) {
						section.selector += ' ';
					}

					section.selector += CSSCompressor.isArray( part ) ? part.join( '' ) : part;
					section.parts.push( part );
				}
			});

			// Generate a sorted comparison array to see if order has changed
			compare = sections.slice( 0 ).sort(function( a, b ) {
				if ( a.selector.length && b.selector.length ) {
					return a.selector == b.selector ? 0 :
						a.selector > b.selector ? 1 : -1;
				}
				else {
					return a.selector.length ? 1 : -1;
				}
			});

			// Order changed, apply and log
			if ( ! CSSCompressor.objectsMatch( compare, sections ) ) {
				compare.forEach(function( section, i ) {
					parts = parts.concat( section.parts );
					if ( i + 1 !== compare.length ) {
						parts.push( ',' );
					}
				});
				branch.parts = parts;
				compressor.log( 'Sorted comma separated selectors', branch.position );
			}
		}
	}

]);


CSSCompressor.addRuleSheet([

	{
		name: 'Order Atrules',
		group: 'Organize',
		description: "Moves charset and import declarations to the top of the stylesheet (to help with concatenation).",
		callback: function( branches, compressor ) {
			var imports = [], charsets = [], pos = -1;

			// Find all import and charset declarations (after the first rule filled branch)
			branches.forEach(function( branch, i ) {
				if ( pos === -1 ) {
					if ( ( branch.rules && branch.rules.length ) || ( branch.branches && branch.branches.length ) ) {
						pos = i;
					}
				}
				else if ( branch.atrule && branch.parts && branch.parts.length ) {
					if ( rcharset.exec( branch.parts[ 0 ] || '' ) ) {
						charsets.push( branch );
					}
					else if ( rimport.exec( branch.parts[ 0 ] || '' ) ) {
						imports.push( branch );
					}
				}
			});

			// Shift imports to the top
			if ( imports.length ) {
				imports.forEach(function( branch ) {
					CSSCompressor.removeItem( branches, branch );
					branches.splice( pos, 0, branch );
					compressor.log( 'Moving import to the top', branch.position );
				});
			}

			// Shift charset to the top after imports
			if ( charsets.length ) {
				charsets.forEach(function( branch ) {
					CSSCompressor.removeItem( branches, branch );
					branches.splice( pos, 0, branch );
					compressor.log( 'Moving charset to the top', branch.position );
				});
			}
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rulesMatch = function( a, b ) {
		if ( ! a || ! b || a.length !== b.length ) {
			return false;
		}

		for ( var i = -1, l = a.length; ++i < l; ) {
			if ( a[ i ].property !== b[ i ].property || ! CSSCompressor.objectsMatch( a[ i ].parts, b[ i ].parts ) ) {
				return false;
			}
		}

		return true;
	};


CSSCompressor.addRuleSheet([

	{
		name: 'Common Selectors',
		group: 'Common Groupings',
		description: "Combines rule sets with matching selectors",
		callback: function( branches, compressor ) {
			var index = -1, subindex = -1, branch, next;

			for ( ; ++index < branches.length; ) {
				branch = branches[ index ];
				if ( ! branch.selector ) {
					continue;
				}

				for ( subindex = index; ++subindex < branches.length; ) {
					next = branches[ subindex ];
					if ( ! next.selector ) {
						continue;
					}

					if ( CSSCompressor.objectsMatch( branch.parts, next.parts ) ) {
						compressor.rerun = true;
						branch.rules.push.apply( branch.rules, next.rules );
						CSSCompressor.removeItem( branches, next );

						if ( next.position && branch.position ) {
							compressor.log(
								"Combining rule set on line " + next.position.start.line +
								" with ruleset on line " + branch.position.start.line +
								" as they share the same selector.",
								[ next.position, branch.position ]
							);
						}
					}
				}
			}
		}
	},

	{
		name: 'Common Rules',
		group: 'Common Groupings',
		description: "Combines rule sets with matching rules",
		callback: function( branches, compressor ) {
			var index = -1, subindex = -1, branch, next;

			for ( ; ++index < branches.length; ) {
				branch = branches[ index ];
				if ( ! branch.selector ) {
					continue;
				}

				for ( subindex = index; ++subindex < branches.length; ) {
					next = branches[ subindex ];
					if ( ! next.selector ) {
						continue;
					}

					if ( rulesMatch( branch.rules, next.rules ) ) {
						compressor.rerun = true;
						branch.parts.push( ',' );
						branch.parts.push.apply( branch.parts, next.parts );
						CSSCompressor.removeItem( branches, next );

						if ( next.position && branch.position ) {
							compressor.log(
								"Combining rule set on line " + next.position.start.line +
								" with ruleset on line " + branch.position.start.line +
								" as they share the same rules.",
								[ next.position, branch.position ]
							);
						}
					}
				}
			}
		}
	}

]);

})( this );

(function( global, undefined ) {
var CSSCompressor = global.CSSCompressor,
	rcompreserve = /^\/\*\!/;

CSSCompressor.addRuleBlock([

	{
		name: 'Duplicate Properties',
		group: 'Trim',
		description: "Removes multiply defined properties.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			for ( var i = -1, j, rule, next; ++i < branch.rules.length; ) {
				rule = branch.rules[ i ];

				for ( j = i; ++j < branch.rules.length; ) {
					next = branch.rules[ j ];

					if ( rule.property === next.property ) {
						compressor.log(
							"Removing duplicate property '" + rule.property + "'",
							[ rule.position, next.position ]
						);
						CSSCompressor.removeItem( branch.rules, rule );
						i--;
						break;
					}
				}
			}
		}
	},

	{
		name: 'Empty Values',
		group: 'Trim',
		description: "Removes properties that don't have values.",
		callback: function( branch, compressor ) {
			if ( ! branch.rules || ! branch.rules.length ) {
				return;
			}

			for ( var i = -1, rule; ++i < branch.rules.length; ) {
				rule = branch.rules[ i ];

				if ( ! rule.parts.length || rule.parts.join( '' ).trim().length < 1 ) {
					compressor.log(
						"Removing empty value with property key '" + rule.property + "'",
						[ rule.position ]
					);
					CSSCompressor.removeItem( branch.rules, rule );
					i--;
				}
			}
		}
	}

]);

CSSCompressor.addRuleSheet([

	{
		name: 'Strip Comments',
		group: 'Trim',
		description: "Removes all comments from style sheet, with the exception of comments that are prefixed with a bang '/*!'",
		callback: function( branches, compressor ) {
			function strip( array ) {
				for ( var i = -1, branch; ++i < array.length; ) {
					branch = array[ i ];

					if ( branch.comment && ! rcompreserve.exec( branch.comment ) ) {
						compressor.log( "Removing Comment", branch.position );
						CSSCompressor.removeItem( array, branch );
						i--;
					}
					else if ( CSSCompressor.isArray( branch.branches ) ) {
						strip( branch.branches );
					}
				}
			}
			
			// Start with root branches
			strip( branches );
		}
	},

	{
		name: 'Strip Empty Branches',
		group: 'Trim',
		description: "Removes all branches with no rules",
		callback: function( branches, compressor ) {
			function strip( array ) {
				for ( var i = -1, branch; ++i < array.length; ) {
					branch = array[ i ];

					if ( branch.branches ) {
						strip( branch.branches );

						if ( ! branch.branches.length ) {
							delete branch.branches;

							if ( ! branch.rules || ! branch.rules.length ) {
								compressor.log( "Removing Empty Atrule", branch.position );
								CSSCompressor.removeItem( array, branch );
								i--;
							}
						}
					}
					else if ( branch.selector && ( ! branch.rules || ! branch.rules.length ) ) {
						compressor.log( "Removing Empty Rule Set", branch.position );
						CSSCompressor.removeItem( array, branch );
						i--;
					}
				}
			}

			// Start with root branches
			strip( branches );
		}
	}

]);

})( this );

(function( global, undefined ) {
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

})( this );