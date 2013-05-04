var LIB_DIR = require( 'path' ).normalize( __dirname + '/../lib' ) + '/';

module.exports = [

	// Core members
	"Util.js",
	"Settings.js",
	"Rules.js",
	"Format.js",
	"Stats.js",

	// Formatters
	"formats/",

	// Trigger loading of all rule paths
	"rules/",

	// Apply modes after all rules are added
	"Modes.js"

].map(function( lib ) {
	return LIB_DIR + lib;
});
