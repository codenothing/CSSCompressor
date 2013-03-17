var fs = require( 'fs' ),
	ROOT = __dirname + '/../',
	DEMO_DIR = ROOT + 'demo/',
	RULES_DIR = DEMO_DIR + 'rules/',
	RULES_DOC_DIR = RULES_DIR + 'rules/',
	RULES_CONTENT_STR = '',
	RULES_MENU_STR = '',
	CONTENT = fs.readFileSync( RULES_DIR + 'temp.html', 'utf8' ),
	RULES_JSON = {};


// Build out the rules documentation file by file
fs.readdirSync( RULES_DOC_DIR ).forEach(function( file ) {
	var name = file.replace( /\.html$/, '' ),
		content = fs.readFileSync( RULES_DOC_DIR + file, 'utf8' );

	// Center Content
	RULES_CONTENT_STR += "<li data-section='" + name + "'>" + content + "</li>";
	
	// Side Menu
	RULES_MENU_STR += "<li><a href='#" + name + "'>" + name + "</a></li>";

	// JSON sheet output
	RULES_JSON[ name ] = content;
});


// Build out the contents into rules page
CONTENT = CONTENT.replace( /#\{CONTENT\}/, RULES_CONTENT_STR );
CONTENT = CONTENT.replace( /#\{MENU\}/, RULES_MENU_STR );
fs.writeFileSync( RULES_DIR + 'index.html', CONTENT, 'utf8' );

// Write out rules javascript object
fs.writeFileSync( DEMO_DIR + 'js/rules.js', 'var CSSCOMPRESSOR_RULE_DOCS = ' + JSON.stringify( RULES_JSON ) + ';', 'utf8' );

// Logging
console.log( "\n" );
console.log( "Compressor Rules: " + RULES_DIR + 'index.html' );
console.log( "Compressor Rules: " + DEMO_DIR + 'js/rules.js' );
console.log( "\n" );
