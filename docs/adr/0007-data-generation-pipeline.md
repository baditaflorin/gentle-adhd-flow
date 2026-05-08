# 0007: Data Generation Pipeline

## Status

Accepted

## Context

This ADR is mandatory for Mode B. Gentle ADHD Flow is Mode A.

## Decision

Do not implement a data generation pipeline in v1.

## Consequences

`make data` is intentionally absent. All user data is created and stored locally in the browser.

## Alternatives Considered

Pre-built ADHD content packs were considered but rejected for v1 because the product value is the user's own brain-dump to action flow.
