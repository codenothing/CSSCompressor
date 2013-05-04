var CSSCompressor = global.CSSCompressor,
	rules = [];

CSSCompressor.extend({

	// Rule Types
	RULE_TYPE_VALUE: 'value',
	RULE_TYPE_RULE: 'rule',
	RULE_TYPE_BLOCK: 'block',
	RULE_TYPE_SHEET: 'sheet',

	// Access to all rules
	rule: function( options, type, callback ) {
		// Passing no arguments returns the entire list
		if ( options === undefined ) {
			return rules.slice( 0 );
		}
		// Allow array of options
		else if ( CSSCompressor.isArray( options ) ) {
			return CSSCompressor.each( options, CSSCompressor.rule );
		}
		// Allow just name, callback
		else if ( CSSCompressor.isString( options ) ) {
			if ( type === undefined ) {
				return rules.filter(function( rule ) {
					return rule.type === options;
				});
			}

			options = {
				name: options,
				type: type,
				callback: callback
			};
		}

		// Only allow compressions that have actual callbacks
		if ( ! CSSCompressor.isFunction( options.callback ) ) {
			throw new Error( "Rule callback not defined" );
		}
		// There must also be a type
		else if ( ! options.type ) {
			throw new Error( "No compression type found" );
		}
		// Unless explicitely stated, don't overwrite
		else if ( CSSCompressor.rule[ options.name ] && options.overwrite !== true ) {
			throw new Error( "'" + options.name + "' compression already exists." );
		}

		// Defaults
		options.priority = CSSCompressor.isNumber( options.priority ) ? options.priority : CSSCompressor.PRIORITY_DEFAULT;
		options.added = rules.length;
		options.group = options.group || 'custom';

		// Attach reference
		CSSCompressor.rule[ options.name ] = options;
		rules.push( options );
		rules.sort(function( a, b ) {
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

	},

	// Watch for when new rules are added
	_addRuleStack: [],
	addRuleCallback: function( callback ) {
		if ( CSSCompressor.isFunction( callback ) ) {
			CSSCompressor._addRuleStack.push( callback );
		}
	}

});
