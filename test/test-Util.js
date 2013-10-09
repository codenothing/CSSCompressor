munit( 'Util', { priority: munit.PRIORITY_HIGHER }, {

	// Deep object matching
	objectsMatch: function( assert ) {
		assert.isTrue( "Type Match", CSSCompressor.objectsMatch( 1, 1 ) );
		assert.isFalse( "Type MisMatch", CSSCompressor.objectsMatch( 1, '1' ) );

		assert.isTrue( "Empty Array", CSSCompressor.objectsMatch( [], [] ) );
		assert.isTrue( "Array Type Match", CSSCompressor.objectsMatch( [ 1 ], [ 1 ] ) );
		assert.isFalse( "Array Type MisMatch", CSSCompressor.objectsMatch( [ 1 ], [ '1' ] ) );
		assert.isTrue( "Nested Arrays", CSSCompressor.objectsMatch( [ [ 1, 2 ], [ 2, 1 ] ], [ [ 1, 2 ], [ 2, 1 ] ] ) );
		assert.isTrue( "Nested Array Objects", CSSCompressor.objectsMatch( [ { a: 1 } ], [ { a: 1 } ] ) );
		assert.isFalse( "Nested Array Objects MisMatch", CSSCompressor.objectsMatch( [ { a: 1 } ], [ { a: '1' } ] ) );

		assert.isTrue( "Empty Object", CSSCompressor.objectsMatch( {}, {} ) );
		assert.isTrue( "Object Type Match", CSSCompressor.objectsMatch( { a: 1 }, { a: 1 } ) );
		assert.isFalse( "Object Type MisMatch", CSSCompressor.objectsMatch( { a: 1 }, { a: '1' } ) );
		assert.isTrue( "Nested Objects", CSSCompressor.objectsMatch( { a: { b: 1 } }, { a: { b: 1 } } ) );
		assert.isTrue( "Nested Object Arrays", CSSCompressor.objectsMatch( { a: [ 1 ] }, { a: [ 1 ] } ) );
		assert.isFalse( "Nested Object Array MisMatch", CSSCompressor.objectsMatch( { a: [ 1 ] }, { a: [ '1' ] } ) );
	},

	// Removing item from array without knowing index
	removeItem: function( assert ) {
		var a = [], b = {}, c = [ 1 ], d = { a: 2 };

		assert.deepEqual( "Pos 1", CSSCompressor.removeItem( [ a, b, c ], a ), [ b, c ] );
		assert.deepEqual( "Pos 2", CSSCompressor.removeItem( [ a, b, c ], b ), [ a, c ] );
		assert.deepEqual( "Pos 3", CSSCompressor.removeItem( [ a, b, c ], c ), [ a, b ] );
		assert.deepEqual( "No Removal", CSSCompressor.removeItem( [ a, b, c ], d ), [ a, b, c ] );
	},

	// Removing list of items from array without knowing indexes
	removeItems: function( assert ) {
		var a = [], b = {}, c = [ 1 ], d = { a: 2 };

		assert.deepEqual( "Pos 1, 2", CSSCompressor.removeItems( [ a, b, c ], [ a, b ] ), [ c ] );
		assert.deepEqual( "Pos 2, 3", CSSCompressor.removeItems( [ a, b, c ], [ a, c ] ), [ b ] );
		assert.deepEqual( "Pos 1, 3", CSSCompressor.removeItems( [ a, b, c ], [ c, b ] ), [ a ] );
		assert.deepEqual( "All", CSSCompressor.removeItems( [ a, b, c ], [ c, a, b ] ), [] );
		assert.deepEqual( "None", CSSCompressor.removeItems( [ a, b, c ], [ d ] ), [ a, b, c ] );
	},

	// keysInHash checks that array of keys exist in hash
	keysInHash: function( assert ) {
		assert.isTrue( "Basic", CSSCompressor.keysInHash( [ 'a', 'b' ], { a: undefined, b: null } ) );
		assert.isFalse( "Basic Failure", CSSCompressor.keysInHash( [ 'a', 'b' ], { b: undefined, c: null } ) );
		assert.isFalse( "No Keys Passed", CSSCompressor.keysInHash( [], { b: true } ) );
	},

	// Static compression access
	compress: function( assert ) {
		assert.equal(
			'Basic Compression',
			CSSCompressor.compress( "#a{color:black}" ),
			"#a{color:black}"
		);

		// Mode Compression
		assert.equal(
			'Passing Mode',
			CSSCompressor.compress( "#a{color:black}", CSSCompressor.MODE_MAX ),
			"#a{color:#000}"
		);

		// Options
		assert.equal(
			'Passing Options',
			CSSCompressor.compress( "#a{color:black}", { 'Color to Hex': false, format: CSSCompressor.FORMAT_MAX }),
			"#a {\n\tcolor: black\n}"
		);
	},

});
