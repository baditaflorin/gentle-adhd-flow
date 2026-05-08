# 0014: Error Handling Conventions

## Status

Accepted

## Context

The app should feel gentle when capabilities fail, especially for users already managing executive load.

## Decision

Use typed results for recoverable feature adapters. Show clear, non-blaming UI messages and preserve user input. AI, Whisper, Piper, DuckDB, and Tone.js failures fall back to deterministic local parsing, browser speech APIs, JavaScript summaries, or silent focus timers.

## Consequences

Users can keep working even when a browser lacks a feature. Error copy avoids shame and avoids medical advice.

## Alternatives Considered

Throwing modal errors was rejected because it interrupts the self-management flow.
