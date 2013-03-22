cd `dirname $0`
cd ../

if [ -d dist/ ]; then
	rm -r dist/
fi

if [ -f demo/js/CSSCompressor.js ]; then
	rm demo/js/CSSCompressor.js
fi

if [ -f demo/js/rules.js ]; then
	rm demo/js/rules.js
fi

if [ -f demo/rules/index.html ]; then
	rm demo/rules/index.html
fi
