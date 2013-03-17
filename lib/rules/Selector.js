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
