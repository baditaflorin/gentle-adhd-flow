# 0012: Metrics And Observability

## Status

Accepted

## Context

Mode A has no server-side metrics. ADHD self-management data is sensitive.

## Decision

Do not add analytics in v1. Show local-only operational status in the UI: storage readiness, WebGPU availability, AI module load status, and build metadata.

## Consequences

There is no usage telemetry. Product learning comes from manual feedback, GitHub issues, and voluntary reports.

## Alternatives Considered

Plausible analytics was considered but rejected for v1 to keep privacy simple.
