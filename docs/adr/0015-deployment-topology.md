# 0015: Deployment Topology

## Status

Accepted

## Context

Mode C topology would require Docker Compose and nginx. ADR 0001 selects Mode A.

## Decision

Deploy only through GitHub Pages from `main` branch `/docs`.

## Consequences

There is no `deploy/` directory, no Docker image, no GHCR artifact, and no public host port. Rollback is a git revert of the publishing commit.

## Alternatives Considered

Docker backend deployment was rejected because no runtime API is needed.
