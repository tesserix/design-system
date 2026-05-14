# @tesserix/otto-widget

## 0.4.2

### Patch Changes

- 081d2d1: Fix release: drop the hardcoded `publishConfig.registry` so the package
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

## 0.4.1

### Patch Changes

- 90147a3: Backfill conversation + messages on every WebSocket (re)connect.

  The Otto WS server has no replay-on-subscribe, so any envelope the
  service broadcasts between conversation creation and the socket
  actually opening (typically the first AI/MCP reply plus the
  `pending` -> `active` status flip) was dropped on the floor. The
  customer was left staring at "Connecting to support…" until a full
  page refresh re-hydrated state from `/resume`.

  Fix:

  - `useOttoChannel` now exposes an `onOpen` callback fired on every
    `ws.onopen` (initial connect and every reconnect).
  - `OttoWidget` wires `onOpen` to a `backfill` helper that runs
    `getConversation` + `listMessages` in parallel and reconciles local
    state via a new id-keyed `mergeMessages` merge.
  - The queue poll now calls the same `backfill` on every status
    transition out of `pending` (not just `getConversation`), so the
    customer recovers within 5s even if the WebSocket is completely
    dead.

  No API or prop changes. Applies to every product consuming the widget
  (fanzone, mark8ly, homechef, stockpilot, gameverse, horoscope,
  scrapper) — once they bump the dependency.

## 0.4.0

### Minor Changes

- ca32691: Relocate @tesserix/otto-widget into the design-system monorepo so it
  shares the existing changesets + NPM_TOKEN publish pipeline with
  @tesserix/web. Behaviour is unchanged for consumers — package name,
  version, exports and peer dependencies all stay the same.

  Previously the widget lived at slm-support-platform/packages/otto-widget
  with its own publish-otto-widget.yml workflow gated on a different
  secret. Folding it into design-system means:

  - one place to bump shared-UI packages
  - one publish pipeline (changesets -> GitHub Packages, optional manual
    npm publish for public mirror)
  - changesets is the source of truth for version bumps so the next
    consumer (tesserix-home) can finally `npm install @tesserix/otto-widget`
    the same way it installs @tesserix/web
