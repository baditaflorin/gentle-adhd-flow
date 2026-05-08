# 0004: Static Data Contract

## Status

Accepted

## Context

Mode A has no scheduled data generation pipeline. The app still needs a small static contract for build and release metadata.

## Decision

Publish `build.json` at the Pages root with this schema:

```json
{
  "version": "0.1.0",
  "commit": "short-git-sha",
  "builtAt": "ISO-8601 timestamp"
}
```

The frontend fetches it from `import.meta.env.BASE_URL + "build.json"` and shows version and commit in the UI.

## Consequences

Visitors can identify the deployed build. No user data is ever part of static data.

## Alternatives Considered

Inlining metadata into JavaScript was rejected because a standalone JSON file is easier to inspect on the live site.
