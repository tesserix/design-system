---
"@tesserix/otto-widget": minor
---

Add real-time reassurance UX while the SLM is composing, plus per-
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
