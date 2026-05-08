# 0003: Frontend Framework And Build Tooling

## Status

Accepted

## Context

The UI is interactive, offline-friendly, and stateful. The bootstrap asks for TypeScript strict and Vite unless there is a reason otherwise.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, lucide-react icons, zod schemas, and TanStack Query for cacheable fetches such as build metadata.

## Consequences

The app has mature tooling and fast local builds. Heavy runtime engines are split into lazy chunks to protect the initial payload budget.

## Alternatives Considered

Vanilla TypeScript was considered but rejected because the interaction surface benefits from React component composition. Next.js was rejected because the app does not need a server framework.
