# @tesserix/otto-widget

## 0.5.1

### Patch Changes

- ec9eaa2: Fix WS-upgrade-403 retry loop that left customers stuck on
  "Connecting to support…" indefinitely.

  Discovered live: a fanzone customer had a conversation id cached in
  the widget after Otto's inactivity sweeper had closed the
  conversation server-side. The widget kept hitting `/ws-ticket`
  (200 OK — session is fine, ticket minted) and then `/ws`
  (403 — ticket session_token no longer owns the conversation) on a
  ~10s exponential-backoff loop, forever, with no path back to a
  working state.

  `useOttoChannel` now handles two failure modes properly:

  1. **Ticket POST returns 401/403** — auth-level rejection, won't
     transient-recover. Stops retrying and fires `onUnauthorized`.
  2. **WS upgrade closes without ever opening, 3 times in a row** —
     the browser WebSocket API doesn't expose HTTP status codes on
     failed upgrades (always close code 1006), so we count
     consecutive close-without-open events as the only signal we
     have. Three in a row (≈14 s with backoff) is enough to
     conclude the conversation rejection is permanent.

  `OttoWidget` wires `onUnauthorized` to reset to the empty/collect
  phase, dropping the stale conversation id, messages, reactions,
  and error state. The customer lands on the welcome screen and can
  start a new chat — no refresh needed.

  No API change. Backwards-compatible — host callers that don't
  supply `onUnauthorized` just get the original retry behaviour for
  sites without a sweeper.

## 0.5.0

### Minor Changes

- 2097ad5: Add real-time reassurance UX while the SLM is composing, plus per-
  response feedback and on-demand human handoff.

  **Typing indicator.** When the latest message is from the customer
  and the conversation is open, a three-dot bubble appears under the
  thread with a context-aware label:

  - During the pending queue: "Otto is checking your details…"
  - When a staffer is assigned: "{Name} is typing…"
  - Otherwise: "Otto is thinking…"

  Replaces the dead-air gap between the customer hitting send and
  the reply landing (~1s with the queue-poll tightened in 0.4.4).
  The indicator disappears the moment a non-customer message arrives.

  **Per-message reactions.** Every AI/staff reply now shows a small
  strip with thumbs-up / thumbs-down. Tapping a thumb optimistically
  updates local state and POSTs to a new `reactToMessage` API method
  — failures are swallowed so a not-yet-wired backend can't break
  the chat. Reactions persist across mounts via the message ids
  already in the local thread.

  **Connect-to-human escalation.** A "Connect me to a human" button
  appears on the LATEST AI/staff reply once the customer has sent
  ≥3 messages. The threshold gives the SLM a real shot at the first
  few rounds before surfacing an escalation. Tapping sends a clear
  "I'd like to speak with a human" message which the slm-router
  escalation policy picks up — no new backend endpoint needed for
  the routing side.

  `OttoApi` gains `reactToMessage(conversationId, messageId,
reaction)`. The endpoint at
  `POST /conversations/{id}/messages/{messageId}/reaction` should
  return `{ ok: true }` when implemented; until then the widget is
  fine with a 404.

  No breaking changes — existing consumers see the new UX
  automatically; the API additions are additive.

## 0.4.4

### Patch Changes

- 36492aa: Make the AI's first reply feel real-time by polling messages every 1 s
  while the case is pending (was every 5 s, and only refetched
  conversation — not messages — on status transition).

  Previously, on a slow WS handshake (Istio direct routing + ticket
  round-trip = 500-700 ms minimum), the customer could see "Connecting
  to support…" for 1-5 s before the AI reply appeared, even though the
  server had already broadcast it. The reply was sitting in the DB but
  the WS hadn't subscribed yet, and the queue-poll only triggered a
  backfill on status transition.

  Now: every queue-poll tick (1 s cadence) runs a full backfill in
  parallel with the queueStatus call. The message merge is id-keyed so
  the WS event that lands moments later is deduped against the polled
  copy — no double-render, no out-of-order messages.

  Polling still stops the instant status flips out of pending, so the
  extra REST traffic is bounded to the first few seconds of every
  conversation.

## 0.4.3

### Patch Changes

- 1c628d9: Persist the widget's open/closed state across page refreshes.

  Before: an accidental F5 mid-conversation collapsed the widget back
  to the launcher pill, forcing the customer to click it again to
  re-expand the (still-resumable) chat. After: the open/closed state
  is saved to `sessionStorage` under a tenant-scoped key, so refresh
  keeps the panel in the same state the customer left it.

  Deliberately uses `sessionStorage` rather than `localStorage` — the
  intent is "survive a refresh in this tab," not "remember a preference
  forever." A fresh browser session the next day still starts with the
  widget collapsed, which is the expected default.

  No prop or API change. SSR-safe (lazy reads behind `typeof window`).
  Failures from private-browsing / quota errors are swallowed silently;
  worst case the widget reverts to its previous behaviour for that
  session.

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
