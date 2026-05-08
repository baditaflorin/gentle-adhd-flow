SHELL := /bin/bash

.PHONY: help install-hooks dev build test test-integration smoke lint fmt pages-preview hooks-pre-commit hooks-commit-msg hooks-pre-push clean

help:
	@printf "%s\n" "Targets: install-hooks dev build test test-integration smoke lint fmt pages-preview hooks-pre-commit hooks-commit-msg hooks-pre-push clean"

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

clean:
	rm -rf coverage tmp dist
