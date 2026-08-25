---
"@tesserix/admin-conformance": minor
---

Add `@tesserix/admin-conformance`, the enforcement half of the Product Admin Integration Contract (§5). A product declares which endpoints it implements in `admin-conformance.json` and runs the CLI against its own admin API in CI; the suite skips the rest and fails on any declared endpoint that deviates. Includes a TypeScript port of the platform HMAC signing scheme, checked against the reference implementation's published golden vectors.
