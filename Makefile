.PHONY: all test

all: lint
	@node build/build

lint:
	@node build/lint

test: lint
	@node build/test.js

test-all: lint all
	@node build/test.js --all
