# CSSCompressor

Plugin based CSS Compressor.

* Full Featured [Demo](http://cssc.codenothing.com/) and [Rule Documentation](http://cssc.codenothing.com/rules/)
* Extensive logging of each compression, including position/selection of text in the stylesheet
* Entirely customizable, can turn individual compressions on/off with no dependencies.
* Writing custom compressions are relatively easy.
  
[![Build Status](https://travis-ci.org/codenothing/CSSCompressor.png)](https://travis-ci.org/codenothing/CSSCompressor)  
  
----
### Installation

```bash
$ npm install csscompressor 
```

CSSCompressor may also be run in a browser environment.

```html
<script type='text/javascript' src='CSSCompressor.js'></script>
```


----
### Usage

```js
var CSSCompressor = require( 'csscompressor' );

// Compression with default options
CSSCompressor.compress( css );
```


----
### Options & Modes

Modes are a way to use a predefined set of rule compressions. Each compressor starts off
in the 'default' mode, and compressions can be turned off/on through the options object
of the compress function, or updating the settings object.


```js
var compressor = new CSSCompressor( CSSCompressor.MODE_DEFAULT );
compressor.compress( css );

// Pass an object of compression options to update the default set
compressor.compress( css, {
	'RGB to Hex': true,
	'Hex to Color': false
});

// Or update the settings object directly.
compressor.settings.update({
	'RGB to Hex': true,
	'Hex to Color': false
});
```

Take a look at the [rules section](http://cssc.codenothing.com/rules)
of the [demo](http://cssc.codenothing.com/) to get a list of all the possible
options.


----
### Cli

To install the build script, add the global flag when installing through npm

```bash
$ npm install -g csscompressor
$ cssc styles.css > styles.min.css

// Or you can pipe your sheet
$ cat styles.css | cssc > styles.min.css
```

By default, the script reads the files in order they are passed, concatenates them,
compresses them, then sends it to stdout. For the most part, CSSCompressor is meant
to belong in build scripts, but there are a few options that can be applied to the
cli script

* **--mode=name**: Assigns a mode to the compressor object
* **--on=rule-name**: Turns rule compression on
* **--off=rule-name**: Turns rule compression off
* **--format=none**: Level of output format, defaulted to none
* **--output=/path/to/output.min.css**: Specifies output path of compression result. If left undefined, output is sent to stdout.


---

Contributing
============

Adding new compression rules is fairly straightforward, to get started clone the repo and run initialization.

```bash
git clone https://github.com/codenothing/CSSCompressor.git
cd CSSCompressor/
make init
```

This will setup all third party modules and generated files. Once setup, just follow the checklist below before completion.

1. Only add 1 compression rule per commit.
2. Create a test file (tests/test-[name of rule].js) with a few expected tests. [Example](test/test-Shrink%20Hex.js)
3. Create a new rule file (lib/rules/[name of rule].js) with exactly one rule. Follow the comment notation of other rules. [Example](lib/rules/Shrink%20Hex.js)
4. Run `make test`. All tests must pass.


### Adding Compression Rules

CSSCompressor is built on modular based compressions. Each compression option has it's own function
that finds the exact parts it wants to alter, and makes changes. With that, there are 4 types of
custom rules that may be applied: addRule, addRuleBlock, addRuleSheet, and addValue. If you haven't yet,
please go look at the [CSSTree](https://github.com/codenothing/csstree) document before reading further
to get an idea of what a branch looks like.


---
### addRule

addRule is used for individual property/value compressions. For example, converting the color value
'black' to it's shorter hex code alternative '#000':

```js
CSSCompressor.addRule( 'Special Black to Hex Converter', function( rule, branch, compressor ) {
	if ( rule.property == 'color' && rule.parts[ 0 ] == 'black' ) {
		rule.parts[ 0 ] = '#000';
	}
});
```


---
### addRuleBlock

addRuleBlock is used for rule set compressions. A full branch is passed to the callback to be rendered for
combination style compressions. For example, removing all color properties in a div block

```js
CSSCompressor.addRuleBlock( 'Remove All Color Properties in Divs', function( branch, compressor ) {
	if ( ! branch.selector || ! branch.selector.exec( /div$/i ) || ! branch.rules ) {
		return;
	}

	for ( var i = 0, rule; i < branch.rules.length; i++ ) {
		rule = branch.rules[ i ];

		if ( rule.property == 'color' ) {
			branch.rules.splice( i, 1 );
			i--;
		}
	}
});
```


---
### addRuleSheet

addRuleSheet is used for full stylesheet compressions. The callback is passed the entire stylesheet AST in
the branches array for inspection and compression. For example, to remove all comments:

```js
CSSCompressor.addRuleSheet( 'Remove Comments', function( branches, compressor ) {
	for ( var i = 0, branch; ++i < branches.length; i++ ) {
		branch = branches[ i ];

		if ( branch.comment ) {
			branches.splice( i, 1 );
			i--;
		}
	}
});
```


---
### addValue

addValue is used for specific string value compressions. It works a little different in that
there are no rules or blocks attached to the string, only a possible position. An example
would be compressing color strings inside gradient values. This is the only compression that
requires a return value

```js
CSSCompressor.addValue( 'Removing Leading Zeros on Numerics', function( value, position, compressor ) {
	var m = /^0+(\d+[a-z]{2})$/.exec( value );

	if ( m ) {
		return m[ 1 ];
	}
});
```


---
### Logging

Every branch and rule in a [CSSTree](http://csstree.codenothing.com) comes with a position object that contains
a ton of useful information about it's parent object. In CSSCompressor's [demo site](http://cssc.codenothing.com),
the logging function is used to mark the original position in the stylesheet for that compression.

```js
compressor.log( [ key, ] msg, position );
```

The log method takes 3 parameters, an optional string name of the compression function used, a string message describing what
was changed, and the position object of the affected rule/branch. The last parameter may optionally be an array of position
objects if multiple branches/rules are affected. Taking the color example from above and adding a log line to it:

```js
CSSCompressor.addRule( 'Special Black to Hex Converter', function( rule, branch, compressor ) {
	if ( rule.property == 'color' && rule.parts[ 0 ] == 'black' ) {
		rule.parts[ 0 ] = '#000';
		compressor.log( "Converting black to it's hex alternative", rule.position );
	}
});
```


---
### Build Process

This compressor can also be used as part of a build process to force a cache bump on resources.
The following example shows to to look for all url's and attaches the current unix timestamp to
the query string of the url.

```js
var now = Date.now(), rurl = /^url\(.*?\)$/;

CSSCompressor.addValue( 'Resource Refresh', function( value, position, compressor ) {
	if ( rurl.exec( value ) ) {
		var query = value.indexOf( '?' ) > -1 ? '&d=' + now : '&d=' + now;

		// "url(img/phone.png)" -> "url(img/phone.png?d=1366303414438)"
		return value.substr( 0, value.length - 2 ) + query + ')';
	}
});
```


----
### License

```
The MIT License

Copyright (c) 2013 Corey Hart

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
