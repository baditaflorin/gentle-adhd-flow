SHELL := /bin/bash
VERSION := $(shell node -p "JSON.parse(require('fs').readFileSync('package.json')).version")

.PHONY: help install-hooks dev build test test-integration smoke lint fmt pages-preview hooks-pre-commit hooks-commit-msg hooks-pre-push release clean

help:
	@printf "%s\n" "Targets: install-hooks dev build test test-integration smoke lint fmt pages-preview hooks-pre-commit hooks-commit-msg hooks-pre-push release clean"

install-hooks:
	git config core.hooksPath .githooks

dev:
	npm run dev

build:
	npm run build

test:
	npm test

test-integration:
	npm run test:integration

smoke:
	npm run smoke

lint:
	npm run lint
	npm run typecheck
	npm run fmt:check

fmt:
	npm run fmt

pages-preview:
	npm run pages-preview

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	.githooks/commit-msg .git/COMMIT_EDITMSG

hooks-pre-push:
	.githooks/pre-push

release:
	npm run build
	git tag -a "v$(VERSION)" -m "v$(VERSION)"

clean:
	rm -rf coverage tmp dist
