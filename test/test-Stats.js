munit( 'Stats', function( assert ) {
	var compressor = new CSSCompressor( CSSCompressor.MODE_MAX ),
		stats = compressor.stats,
		original = "#a{color:black}#b{margin-top:1px;margin-right:1px;margin-bottom:1px;margin-left:1px}",
		expected = "#a{color:#000}#b{margin:1px}";

	compressor.compress( original );
	assert.equal( "Stat Compression Test", compressor.css, expected );

	// Time
	assert.ok( "Time Check", stats.time.length >= 0 );
	assert.ok( "Time End", stats.time.end >= stats.time.start );

	// Size
	assert.equal( "Before - Size", stats.before.size, original.length );
	assert.equal( "After - Size", stats.after.size, expected.length );

	// Selectors
	assert.equal( "Before - Selector Count", stats.before.selectors, 2 );
	assert.equal( "After - Selector Count", stats.after.selectors, 2 );

	// Properties
	assert.equal( "Before - Properties Count", stats.before.properties, 5 );
	assert.equal( "After - Properties Count", stats.after.properties, 2 );
});
