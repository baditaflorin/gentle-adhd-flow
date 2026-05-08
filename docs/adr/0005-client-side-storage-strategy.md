# 0005: Client-Side Storage Strategy

## Status

Accepted

## Context

Tasks, habits, reflections, and focus sessions are personal. v1 avoids accounts and servers.

## Decision

Use Yjs as the canonical local document and persist it with `y-indexeddb`. Keep all user state in IndexedDB. Export/import JSON is the v1 portability path.

## Consequences

State survives reloads and works offline. The data model can later support collaboration or sync without rewriting every feature. Users must manage browser profile data carefully.

## Alternatives Considered

`localStorage` was rejected because structured history and larger documents fit IndexedDB better. A server database was rejected for v1 privacy and deployment simplicity.
