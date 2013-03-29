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