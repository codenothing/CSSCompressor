var fs = require( 'fs' ),
	RULES_TEMPLATE = fs.readFileSync( __dirname + '/temp-rules.html', 'utf8' ),
	rnewline = /\r\n|\r|\n/,
	ralpha = /[a-z]/i,
	rcomstart = /^ \*[^\/]/,
	rcomkey = /^@([a-z]+)\:/,
	rlink = /<([^\>]+)>/,
	rexamplestart = /^\s{4}/,
	rexampletab = /\s{4}/g,
	ramp = /\&/g,
	rgt = />/g,
	rlt = /</g,
	rquote = /"/g,
	rsquote = /'/g,
	encode = function( string ) {
		return ( string || '' ).replace( ramp, "&amp;" )
			.replace( rgt, "&gt;" )
			.replace( rlt, "&lt;" )
			.replace( rquote, "&quot;" )
			.replace( rsquote, "&apos;" );
	};


module.exports = function( content ) {
	var html = '', m, i,
		seek = null,
		comexit = false,
		props = {
			name: '',
			author: '',
			author_link: '',
			source: '',
			description: '',
			before: '',
			after: ''
		};
	
	content.split( rnewline ).slice( 1 ).forEach(function( line ) {
		line = line.replace( rcomstart, '' );

		if ( comexit ) {
			return;
		}
		else if ( ! props.name.length ) {
			if ( ralpha.exec( line ) ) {
				props.name = line.trim();
			}
		}
		else if ( seek ) {
			if ( m = rcomkey.exec( line ) || line.trim().indexOf( '*/' ) === 0 ) {
				props[ seek ] = encode( html.trim() );
				html = '';

				if ( m ) {
					seek = m[ 1 ];

					if ( ralpha.exec( line = line.replace( rcomkey, '' ) ) ) {
						html += line;
					}
				}
				else if ( line.trim().indexOf( '*/' ) === 0 ) {
					comexit = true;
				}
			}
			else {
				if ( line == ' *' ) {
					line = "";
				}

				if ( seek == 'before' || seek == 'after' ) {
					line = line.replace( rexamplestart, '' ).replace( rexampletab, "\t" );
				}

				if ( html.length ) {
					html += "\n";
				}

				line = line.replace( /\*\\\//, "*/" );
				html += line;
			}
		}
		else if ( line.indexOf( '@author:' ) === 0 ) {
			line = line.substr( 8 ).trim();
			props.author = encode( line.replace( rlink, '' ).trim() );

			if ( m = rlink.exec( line ) ) {
				props.author_link = m[ 1 ];
			}
		}
		else if ( line.indexOf( '@source:' ) === 0 ) {
			line = line.substr( 8 ).trim();

			if ( m = rlink.exec( line ) ) {
				props.source = "<div class='source'>Source: <a href='" + m[ 1 ] + "'>" + 
					encode( line.replace( rlink, '' ).trim() ) +
					"</a></div>";
			}
		}
		else if ( m = rcomkey.exec( line ) ) {
			seek = m[ 1 ];
			html = '';

			if ( ralpha.exec( line = line.replace( rcomkey, '' ) ) ) {
				html += line;
			}
		}
		else if ( line.trim().indexOf( '*/' ) === 0 ) {
			comexit = true;
		}
	});

	// Build out template with props
	content = RULES_TEMPLATE + '';
	for ( i in props ) {
		content = content.replace(
			new RegExp( "#\\{" + i + "\\}", "g" ),
			props[ i ]
		);
	}

	return content;
};
