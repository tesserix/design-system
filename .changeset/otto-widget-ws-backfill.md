---
"@tesserix/otto-widget": patch
---

Backfill conversation + messages on every WebSocket (re)connect.

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
