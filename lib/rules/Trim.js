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
