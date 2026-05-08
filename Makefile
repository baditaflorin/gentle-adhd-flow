SHELL := /bin/bash

.PHONY: help install-hooks dev build test test-integration smoke lint fmt pages-preview clean

help:
	@printf "%s\n" "Targets: install-hooks dev build test test-integration smoke lint fmt pages-preview clean"

install-hooks:
	git config core.hooksPath .githooks

dev:
	npm run dev

build:
	npm run build

test:
	npm test

test-integration:
	npm test

smoke:
	npm run smoke

lint:
	npm run lint
	npm run fmt:check

fmt:
	npm run fmt

pages-preview:
	npm run pages-preview

clean:
	rm -rf coverage tmp dist
