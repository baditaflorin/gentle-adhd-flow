# Deploy

Live site: https://baditaflorin.github.io/gentle-adhd-flow/

Repository: https://github.com/baditaflorin/gentle-adhd-flow

## Publishing

GitHub Pages serves `main` branch `/docs`.

```bash
make build
git add docs public/build.json
git commit -m "chore: publish pages"
git push
```

## Rollback

Revert the commit that changed `docs/`, then push `main`.

```bash
git revert <commit>
git push
```

## Custom Domain

No custom domain is configured in v1. To add one, create `docs/CNAME`, configure DNS with the provider, and update ADR 0010.

## Pages Gotchas

GitHub Pages does not support `_headers` or `_redirects`. The app uses a copied `404.html` as an SPA fallback. The service worker scope must remain under `/gentle-adhd-flow/`.
