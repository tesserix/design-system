---
"@tesserix/otto-widget": patch
---

Make the AI's first reply feel real-time by polling messages every 1 s
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
