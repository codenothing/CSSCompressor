/*
 * WARNING! This control file is a giant clusterfuck. Read at your own risk.
 * TODO: clean this mess up.
 */
function prettySettingsJSON( settings ) {
	var str = "{\n\t\"format\": \"" + settings.format + "\"";
	delete settings.format;

	jQuery.each( settings, function( name, value ) {
		var option = CSSCompressor._rulesHash[ name ];
		str += ",\n\n\t// " + option.description + "\n";
		str += "\t\"" + name + "\": " + ( value ? 'true' : 'false' );
	});

	return str += "\n}";
}

// Quick jQuery function to select a portion of a textbox,
// and scroll the textbox to the selected position
jQuery.fn.textSelection = function( start, end ) {
	return this.each(function( i, element ) {
		var textarea = jQuery( element ),
			height = textarea.height(),
			current, caret, ypos, range;

		// Cross browser selection
		if ( start >= end ) {
			alert( 'Start Must Be Less Than End' );
			return;
		}
		else if ( element.createTextRange ) {
			range = element.createTextRange();
			range.collapse( true );
			range.moveStart( 'character', start );
			range.moveEnd( 'character', end );
			range.select();
		}
		else if ( element.setSelectionRange ) {
			element.setSelectionRange( start, end );
		}
		else if ( element.selectionStart ) {
			element.selectionStart = start;
			element.selectionEnd = end;
		}

		// Scroll textarea to bring the selection block into view
		current = textarea.scrollTop();
		caret = textarea.textareaHelper( 'caretPos' ).top;
		ypos = current + caret - parseInt( height / 2, 10 );
		if ( ypos < 0 ) {
			ypos = 0;
		}
		textarea.scrollTop( ypos );
	});
};

jQuery(function( jQuery ) {
	var optionWrapper = jQuery( 'section.options' ),
		resultWrapper = jQuery( 'section.results' ),
		modeWrapper = jQuery( '.widget-mode' ),
		modeContent = modeWrapper.find( 'textarea' ),
		rulesWrapper = jQuery( '.widget-rules' ),
		rulesDoc = jQuery( '.widget-rules-doc' ),
		options = optionWrapper.find( 'ul' ),
		modes = optionWrapper.find( 'select[name=modes]' ),
		format = optionWrapper.find( 'select[name=format]' ),
		fileInput = resultWrapper.find( 'input[type=file]' ),
		input = resultWrapper.find( 'textarea.input' ),
		result = resultWrapper.find( 'textarea.output' ),
		logs = resultWrapper.find( 'ul.logs' ),
		runButton = resultWrapper.find( 'button' ),
		statsTab = resultWrapper.find( '.stats-tab' ),
		statsTable = resultWrapper.find( '.stats-results table' ),
		statsTime = resultWrapper.find( '.stats-results .stats-time' ),
		html = '';
	
	// Attach current version number to header
	jQuery( 'h1' ).html( 'CSS Compressor ' + CSSCompressor.version );

	// List Items
	CSSCompressor.each( CSSCompressor._ruleGroupings, function( group, name ) {
		if ( group.length ) {
			html += [ "<li class='group'>" + name + "</li>" ];
			group.forEach(function( rule ) {
				html += [
					"<li data-key='" + rule.name + "'>",
						"<label>",
							"<input type='checkbox' name='" + rule.name + "' />",
							"<div class='input-content'>",
								"<div class='name'>" + rule.name + "</div>",
								"<div class='description'>" + rule.description + "</div>",
							"</div>",
						"</label>",
					"</li>"
				].join( '' );
			});
		}
	});
	html += "<li class='rules'><a href='rules/' target='_blank'>All Rules</a></li>";
	options.html( html );

	// Mode selections
	html = "<option value='custom'>Custom</option>";
	CSSCompressor.each( CSSCompressor.modes, function( mode, name ) {
		var display = name[ 0 ].toUpperCase() + name.substr( 1 );
		html += [
			"<option value='" + name + "'>" + display + "</option>"
		].join( '' );
	});
	modes.html( html );

	// Readability
	html = "";
	CSSCompressor.each( CSSCompressor._formats, function( format, name ) {
		var display = name[ 0 ].toUpperCase() + name.substr( 1 );
		html += [
			"<option value='" + name + "'>" + display + "</option>"
		].join( '' );
	});
	format.html( html ).val( CSSCompressor.FORMAT_NONE );

	// Add handles to work with mode view overlay
	optionWrapper.find( 'span.mode-view' ).on( 'click', function( event ) {
		modeWrapper.removeClass( 'hide' );
		modeContent.val( prettySettingsJSON( getOptions() ) );
	});
	modeWrapper.find( '.close-button' ).on( 'click', function(){
		modeWrapper.addClass( 'hide' );
	});

	// Show rules when tapping logs rule
	logs.on( 'click', 'strong > span', function(){
		var key = jQuery( this ).attr( 'data-key' );

		if ( key.length && CSSCOMPRESSOR_RULE_DOCS[ key ] ) {
			rulesWrapper.removeClass( 'hide' );
			rulesDoc.html( CSSCOMPRESSOR_RULE_DOCS[ key ] );
			Rainbow.color();
		}
	});

	// Show rules when clicking on options name
	options.on( 'click', '.name', function(){
		var key = jQuery( this ).parents( 'li' ).attr( 'data-key' );

		if ( key.length && CSSCOMPRESSOR_RULE_DOCS[ key ] ) {
			rulesWrapper.removeClass( 'hide' );
			rulesDoc.html( CSSCOMPRESSOR_RULE_DOCS[ key ] );
			Rainbow.color();
			return false;
		}
	});

	// Hide rules on close button click
	rulesWrapper.find( '.close-button' ).on( 'click', function(){
		rulesWrapper.addClass( 'hide' );
	});

	// Close modals on escape
	jQuery( document ).on( 'keyup', function( event ) {
		if ( event.keyCode == 27 ) {
			modeWrapper.addClass( 'hide' );
			rulesWrapper.addClass( 'hide' );
		}
	});


	// Toggle run button based on content
	function runButtonToggle(){
		if ( ( input.val() || '' ).length || fileInput[ 0 ].files.length ) {
			runButton.addClass( 'enabled' );
		}
		else {
			runButton.removeClass( 'enabled' );
		}
	}

	// Enable run button once there is input
	input.on( 'keyup', runButtonToggle );
	fileInput.on( 'change', runButtonToggle );

	// Mode Change
	modes.on( 'change', function(){
		var mode = CSSCompressor.modes[ modes.val() || '' ];

		if ( mode ) {
			options.children( 'li:not(.group)' ).each(function( i, elem ) {
				var li = jQuery( elem ),
					checkbox = li.find( 'input[type=checkbox]' )[ 0 ];

				if ( checkbox ) {
					checkbox.checked = !!mode[ li.attr( 'data-key' ) || '' ];
				}
			});
		}
	})
	.val( CSSCompressor.MODE_DEFAULT )
	.trigger( 'change' );

	// Switching to custom compression level when changes are made
	options.delegate( 'input[type=checkbox]', 'change', function(){
		modes.val( 'custom' );
	});

	// Log tapping
	logs.delegate( 'a', 'click', function( event ) {
		var element = jQuery( this ),
			logIndex = parseInt( element.attr( 'data-logid' ) || '', 10 ),
			index = parseInt( element.attr( 'data-index' ) || '', 10 ),
			log = CSSCompressor._lastRun._logs[ logIndex ] || {},
			position = ( log.positions || [] )[ index ];

		if ( position && ( position.range.end - position.range.start ) < ( input.val() || '' ).length ) {
			input.textSelection( position.range.start, position.range.end );
		}
	});

	// Display string for size
	function sizeDisplay( size ) {
		var suffixs = [ 'B', 'K', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ], i = 0;

		for ( ; size > 1024; i++ ) {
			size /= 1024;
		}

		return ( Math.floor( size * 100 ) / 100 ) + suffixs[ i ];
	}

	// Grabs options
	function getOptions(){
		var settings = {
			format: format.val()
		};

		options.children( 'li' ).each(function( i, elem ) {
			var li = jQuery( elem ),
				key = li.attr( 'data-key' ),
				checkbox = li.find( 'input[type=checkbox]' )[ 0 ];

			if ( CSSCompressor._rulesHash[ key ] ) {
				settings[ key ] = checkbox && checkbox.checked;
			}
		});

		return settings;
	}

	// Showing/Hiding stats
	statsTab.on( 'click', function(){
		resultWrapper.toggleClass( 'show-stats' );
	});

	// Reading individual files
	function readFile( file, callback ) {
		var reader = new FileReader();

		CSSCompressor.extend( reader, {

			onload: function( event ) {
				callback( null, event.target.result );
				callback = CSSCompressor.noop;
			},

			onerror: function( event ) {
				callback( event.target.error );
				callback = CSSCompressor.noop;
			}

		});

		reader.readAsText( file );
	}

	// Reading files from input
	function getFileString( callback ) {
		var files = fileInput[ 0 ].files || [], result = [], state = files.length;
		if ( ! files.length ) {
			return callback( null, '' );
		}

		CSSCompressor.each( files, function( file, i ) {
			result[ i ] = null;
			readFile( file, function( error, string ) {
				result[ i ] = string;
				state--;

				if ( error || state < 1 ) {
					callback( error, result.join( '' ) );
					callback = CSSCompressor.noop;
				}
			});
		});
	}

	// Run button
	runButton.on( 'click', function(){
		if ( ! runButton.hasClass( 'enabled' ) ) {
			return;
		}

		// Concat all css files
		getFileString(function( error, css ) {
			if ( error ) {
				alert( error );
				return;
			}

			// Generate options object to bind with compressor
			var compressor = new CSSCompressor( getOptions() ), html = '', stats = compressor.stats;
			css += input.val() || '';
			input.val( css );
			fileInput[ 0 ].value = '';

			// Output results
			result.val( compressor.compress( css ) );

			// Print out the logs
			html = "<li class='title-row'><div class='lines'>Lines</div><div class='message'>Log</div></li>";
			compressor._logs.forEach(function( log, index ) {
				var lines = '', key = log.key ? "<strong>[<span data-key='" + log.key + "'>" + log.key + "</span>]</strong> " : '';

				if ( log.positions.length ) {
					log.positions.forEach(function( position, i ) {
						lines += "<a data-logid='" + index + "' data-index='" + i + "'>" + position.start.line + "</a>";
						if ( i != log.positions.length - 1 ) {
							lines += ',';
						}
					});
				}

				html += "<li data-id='" + index + "'>" +
					"<div class='lines'>" + lines + "</div>" +
					"<div class='message'>" + key + log.message + "</div>" +
					"</li>";
			});
			logs.html( html );

			// Stats
			statsTime.html( "Time: " + stats.time.length + "ms" );
			statsTab.html(
				"Size: " +
				sizeDisplay( stats.after.size ) + ', Saved: ' +
				sizeDisplay( stats.before.size - stats.after.size ) +
				" (" + parseInt( ( ( stats.before.size - stats.after.size ) / stats.before.size ) * 100, 10 ) + "%)"
			);
			statsTable.html([
				"<tr><th></th><th>Before</th><th>Savings</th><th>Result</th></tr>",
				"<tr align='center'>",
					"<th>Properties</th>",
					"<td>" + stats.before.properties + "</td>",
					"<td>" + ( stats.before.properties - stats.after.properties ) + "</td>",
					"<td>" + stats.after.properties + "</td>",
				"</tr>",
				"<tr align='center'>",
					"<th>Selectors</th>",
					"<td>" + stats.before.selectors + "</td>",
					"<td>" + ( stats.before.selectors - stats.after.selectors ) + "</td>",
					"<td>" + stats.after.selectors + "</td>",
				"</tr>",
				"<tr align='center'>",
					"<th>Size</th>",
					"<td>" + sizeDisplay( stats.before.size ) + "</td>",
					"<td>" + sizeDisplay( stats.before.size - stats.after.size ) + "</td>",
					"<td>" + sizeDisplay( stats.after.size ) + "</td>",
				"</tr>"
			].join( '' ));

			// Show results and shrink up the input box
			resultWrapper.addClass( 'ran' );
		});
	});
});
