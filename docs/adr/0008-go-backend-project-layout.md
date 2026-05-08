# 0008: Go Backend Project Layout

## Status

Accepted

## Context

The bootstrap requires a Go layout for Modes B and C. ADR 0001 selects Mode A.

## Decision

Skip Go backend directories in v1.

## Consequences

There is no `cmd/`, `internal/`, Dockerfile, OpenAPI server, or Go runtime in the repository. Hooks and Make targets skip Go checks unless a future ADR introduces Go.

## Alternatives Considered

Adding empty Go directories was rejected because it would imply a backend surface that does not exist.
