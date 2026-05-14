---
"@tesserix/otto-widget": patch
---

Fix WS-upgrade-403 retry loop that left customers stuck on
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
