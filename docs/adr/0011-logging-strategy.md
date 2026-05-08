# 0011: Logging Strategy

## Status

Accepted

## Context

Mode A has no server logs. Production browser console output should stay quiet.

## Decision

Use explicit UI status messages for recoverable failures. Development-only diagnostics may use console output behind `import.meta.env.DEV`. Production code should not log routine user data.

## Consequences

No private brain-dump text is logged by default. Debugging relies on reproducible local steps and user-initiated export.

## Alternatives Considered

Client log beacons were rejected because v1 defaults to no analytics and no server.
