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
	},

	// Watch for when new rules are added
	_addRuleStack: [],
	addRuleCallback: function( callback ) {
		if ( CSSCompressor.isFunction( callback ) ) {
			CSSCompressor._addRuleStack.push( callback );
		}
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

		// Trigger listeners when new compressions are added
		CSSCompressor._addRuleStack.forEach(function( callback ) {
			callback( options );
		});
	};
});
