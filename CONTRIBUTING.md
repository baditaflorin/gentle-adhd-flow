# Contributing

Thanks for helping make Gentle ADHD Flow calmer, sturdier, and more useful.

## Local Setup

```bash
npm install
make install-hooks
make dev
```

## Development Rules

- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ops:`, or `data:`.
- Keep v1 static and local-first unless an ADR explicitly changes that decision.
- Do not commit secrets, real `.env` files, model cache artifacts, or private personal data.
- Run `make lint`, `make test`, and `make build` before pushing.

## Accessibility

All interactive flows should be keyboard reachable, screen-reader sensible, and WCAG AA contrast compliant.
