.PHONY: all test clean

all: test

init:
	@./build/init.sh

lint:
	@node build/lint.js

clean:
	@./build/clean.sh

rules:
	@node build/rules.js

build: clean lint rules
	@node build/build.js

test: build
	@node build/test.js

test-all:
	@NODE_TEST_NO_SKIP=1 make test

test-full:
	@./build/full.sh
