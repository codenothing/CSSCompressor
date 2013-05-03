var LIB_DIR = require( 'path' ).normalize( __dirname + '/../lib' ) + '/';

module.exports = [

	// Core members
	"Util.js",
	"Settings.js",
	"Rules.js",
	"Format.js",
	"Stats.js",

	// Formatters
	"formats/Max.js",
	"formats/Medium.js",
	"formats/Minimum.js",
	"formats/None.js",


	// Numeric Rules
	"rules/Calc Units.js",
	"rules/Trailing Zeroes.js",
	"rules/Leading Zeroes.js",
	"rules/Unit Suffix.js",
	"rules/Rect Shape.js",


	// Color Rules
	"rules/Gradient Compression.js",
	"rules/RGBA to RGB.js",
	"rules/HSLA to HSL.js",
	"rules/RGB to Hex.js",
	"rules/HSL to Hex.js",
	"rules/Color to Hex.js",
	"rules/Hex to Color.js",
	"rules/Hex to Safe Color.js",
	"rules/Shrink Hex.js",
	"rules/Lowercase Hex.js",


	// Selector Rules
	"rules/Lowercase Selectors.js",
	"rules/Trim Selector Attribute Quotes.js",
	"rules/ID Attribute to Selector.js",
	"rules/Class Attribute to Selector.js",
	"rules/Strict ID.js",
	"rules/Comma Repeats.js",


	// Font Rules
	"rules/Font Weight Conversion.js",
	"rules/Font Family Quotes.js",
	"rules/Font Combinations.js",


	// Misc
	"rules/Function Units.js",
	"rules/None Conversions.js",
	"rules/URL Trim.js",
	"rules/Atrule URL Trim.js",


	// Margin, Padding
	"rules/Margin, Padding Shorthand.js",
	"rules/Margin, Padding Combinations.js",


	// Border Radius
	"rules/Border Radius Shorthand.js",
	"rules/Border Radius Combinations.js",


	// Border Combinations
	"rules/Border, Outline Style Combinations.js",
	"rules/Border Combinations.js",


	// List Combinations
	"rules/List Style Combinations.js",


	// Organize
	"rules/Lowercase Properties.js",
	"rules/Sort Properties.js",
	"rules/Sort Multi Selectors.js",
	"rules/Order Atrules.js",


	// Common Groupings
	"rules/Common Selectors.js",
	"rules/Common Rules.js",


	// Trim Rules
	"rules/Duplicate Properties.js",
	"rules/Empty Values.js",
	"rules/Strip Comments.js",
	"rules/Strip Empty Branches.js",


	// Apply modes after all rules are added
	"Modes.js"

].map(function( lib ) {
	return LIB_DIR + lib;
});
