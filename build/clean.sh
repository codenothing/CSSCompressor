cd `dirname $0`
cd ../

# Cleans out test results
if [ -d build/results/ ]; then
	rm -rf build/results/
fi

# Compiled compressor
if [ -d dist/ ]; then
	rm -r dist/
fi

# Compiled compressor for demo page
if [ -f demo/js/CSSCompressor.js ]; then
	rm demo/js/CSSCompressor.js
fi

# Compiled rules JSON for demo popups
if [ -f demo/js/rules.js ]; then
	rm demo/js/rules.js
fi

# Compiled rules index
if [ -f demo/rules/index.html ]; then
	rm demo/rules/index.html
fi
