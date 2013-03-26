.PHONY: all test clean

all: test

init:
	@./build/init.sh

lint:
	@node build/lint.js

clean:
	@./build/clean.sh

build: clean lint
	@node build/build.js

test: build
	@node build/test.js
