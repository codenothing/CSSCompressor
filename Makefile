all: test

init:
	@./build/init.sh

lint:
	@node build/lint.js

build: lint
	@node build/build.js

test: lint
	@node build/test.js

test-all: lint all
	@node build/test.js --all
