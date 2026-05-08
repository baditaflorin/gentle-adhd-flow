# 0016: Local Git Hooks

## Status

Accepted

## Context

The bootstrap forbids GitHub Actions and asks for local hooks.

## Decision

Use plain `.githooks/` wired by `make install-hooks`.

Hooks:

- `pre-commit`: lint, typecheck, format check, and `gitleaks protect --staged`.
- `commit-msg`: Conventional Commits validation.
- `pre-push`: `make test`, `make build`, and `make smoke`.

## Consequences

Checks run locally and remain transparent. Contributors must install `gitleaks` and Playwright browsers for the full hook experience.

## Alternatives Considered

Lefthook was considered but rejected to avoid another configuration layer.
