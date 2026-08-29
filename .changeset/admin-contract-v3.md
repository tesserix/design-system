---
"@tesserix/admin-conformance": minor
---

Contract v3: eight new endpoint ids

The vocabulary was closed at nine, and eight of mark8ly's mounted platform-admin surfaces — seven reads and one write — structurally could not be declared — an unknown key throws and fails the entire run. That was one documented fact, not a design. It is now eight new ids across seven surfaces:

`outbox`, `email-sends`, `notifications`, `break-glass`, `onboarding/funnel`, `onboarding/sessions` are probed reads. `conversions` and `tenant-purge` are declared with `probe: false` and deliberately never called — a run that purged a real tenant is unrecoverable, and one that looked a person up by email is a scheduled PII read.

Additive: no existing id changes shape, and a product that declares none of these is unaffected. An undeclared endpoint is "not implemented" and the suite skips it. `break-glass` requires the caller to pass `--capability rotate-credentials`; without it the endpoint answers 403, which is it working correctly, not a conformance failure.
