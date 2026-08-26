---
"@tesserix/admin-conformance": minor
---

Detect an endpoint a product SERVES but does not declare.

"Contracts are declared, not discovered" governs what the suite CHECKS. It was never meant to make an implemented-but-undeclared endpoint invisible — and treating absence as proof of absence reproduced the exact failure the allowlist exists to prevent, one level up: an endpoint served in production, checked by nothing, reported as a clean skip.

The gap is not hypothetical. The estate runs this suite from a Kubernetes CronJob whose declaration lives in a Helm chart, while the contract requires the product to commit its own `admin-conformance.json` at its repo root. Two copies, nothing enforcing that they agree, and the drift is silent in exactly one direction: an endpoint present in the repo file and missing from the chart is never checked, and reports as a skip that reads as a pass.

So an undeclared endpoint is now probed. A **2xx is a failure**, symmetrical with the declared-but-404 case already reported — declaring something you do not serve and serving something you do not declare are the same mistake from opposite sides, and only one was caught before. Anything else (404, 501, a refusal, an unreachable host) stays the honest skip it always was.

Two endpoints are never probed blind, and each is named in the skip detail: `entities` has no URL without a `{type}` only the declaration supplies, and `tenant-lifecycle` is a write — asking whether it exists would perform it. A probe that could not be made reports a plain skip rather than a conclusion, because inventing one from a failed request is how a suite starts lying in the reassuring direction.

Verified against both live products: mark8ly and Kora both still exit 0 with zero failures, and dropping one endpoint from mark8ly's declaration — the exact shape of a stale chart copy — produces exit 1 with that endpoint failing.

Also adds `requiresSubtypes(id)`, the accessor sibling of `isProbed`, since the field exists on one member of the endpoint union and cannot be read directly.
