---
"@tesserix/otto-widget": patch
---

Fix release: drop the hardcoded `publishConfig.registry` so the package
publishes to both public npm and GitHub Packages (matching every other
`@tesserix/*` package in the monorepo).

The carry-over `registry: https://npm.pkg.github.com` from the old
slm-support-platform single-registry publish workflow caused the
design-system CI's "Publish to npm (public registry)" step to query
GHCR with the public-npm token (E401), failing the whole publish job.
As a result, 0.4.0 and 0.4.1 of `@tesserix/otto-widget` were never
actually published to either registry — consumers still resolve to
0.3.3. This release publishes the cumulative changes (intake form,
relocate, WebSocket backfill fix) under 0.4.2.

No source changes — purely a packaging metadata fix.
