# 0009: Configuration And Secrets Management

## Status

Accepted

## Context

Mode A should not require secrets. The frontend must never embed API keys or private credentials.

## Decision

Use build-time public configuration only:

- `PAGES_BASE` controls the Vite base path.
- `.env.example` contains placeholders only.
- Real `.env*`, `*.pem`, and `*.key` files are gitignored.
- `gitleaks` runs in local hooks.

## Consequences

The static app is safe to publish. Any future secret-requiring integration needs a new ADR and cannot run directly in the frontend.

## Alternatives Considered

Encrypted frontend secrets were rejected because obfuscation is not security.
