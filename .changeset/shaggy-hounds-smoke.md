---
"@tesserix/admin-conformance": patch
---

Report the error code a 503 actually carried, instead of blaming the signing
secret every time.

A 503 is not one condition. The platform surfaces distinguish `not_configured`
— no signing secret, where retrying never helps — from `upstream_unavailable`,
where the surface is fine, a dependency it proxies to is down, and retrying is
the entire remedy. The products comment that distinction as load-bearing, and
this suite collapsed it: every 503 was reported as "the surface is deployed but
has no signing secret".

On 2026-09-23 six checks failed that way during a 17-minute platform-api
outage. The secrets were present and correct in both namespaces the whole time,
so the report sent its reader to audit a subsystem that was never involved. A
diagnosis that names the wrong cause is worse than none, because it gets
followed.

`upstream_unavailable` now says so and points at the dependency. An error code
this suite does not model is printed verbatim rather than guessed at. A 503
carrying no usable code still falls back to the configuration message, which
remains the best guess for a bare 503 on this surface.
