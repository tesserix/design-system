---
"@tesserix/otto-widget": patch
---

Otto chat reliability + readability:

- **Readable replies** — Otto AI / staff messages now render as a proper bubble (`--staff`) instead of the muted italic `--system` style; only true system notices stay muted.
- **Sequential turns** — the customer can keep typing but can't Send the next message until Otto has replied (Send is disabled while awaiting a response).
- **No raw errors / no stuck threads** — a `not_found` (or any 4xx) on send/escalate is no longer surfaced as a bare code: errors are humanized, and a 404 (the conversation has ended/expired) resets the widget to a fresh chat so a refresh can't loop the same error.
