---
"@tesserix/admin-conformance": patch
---

Fail a declared endpoint that answers 5xx instead of passing it on §4.4.

An endpoint that errored on every request produced one green §4.4 line and no
skips — reading cleaner than the working endpoint beside it — because a
well-formed error body satisfied the error-shape check. A 5xx is the endpoint
failing rather than a refusal the caller provoked: §4.1's envelope was never
demonstrated, so there is nothing to pass. 4xx still routes to §4.4, where the
error's shape genuinely is the whole contract.
