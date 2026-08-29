# @tesserix/admin-conformance

## 0.8.1

### Patch Changes

- e50f0e7: Fix contract §9.6: `onboarding/funnel`'s envelope is `free`, not `data-flat-map`. 0.8.0 declared `data-flat-map` by inferring the shape from one line without reading `toFunnelRow`; the endpoint's real response nests `last_24h` (a grouped sub-window of counts) and `window` (a `{from,to}` pair), which is neither a page nor a flat map of scalars. mark8ly's handler was correct and unchanged — flattening those objects would lose the grouping the endpoint exists to provide. The nightly conformance run was reporting two false §4.1 failures on a contract defect, not a product one; this stops that false failure and reports a skip instead, same as `lifecycle/reason-codes`.

## 0.8.0

### Minor Changes

- 9e5fdfa: Contract v3: eight new endpoint ids

  The vocabulary was closed at nine, and eight of mark8ly's mounted platform-admin endpoints — seven reads and one write — structurally could not be declared — an unknown key throws and fails the entire run. That was one documented fact, not a design. It is now eight new ids across seven surfaces:

  `outbox`, `email-sends`, `notifications`, `break-glass`, `onboarding/funnel`, `onboarding/sessions` are probed reads. `conversions` and `tenant-purge` are declared with `probe: false` and deliberately never called — a run that purged a real tenant is unrecoverable, and one that looked a person up by email is a scheduled PII read.

  Additive: no existing id changes shape, and a product that declares none of these is unaffected. An undeclared endpoint is "not implemented" and the suite skips it. `break-glass` requires the caller to pass `--capability rotate-credentials`; without it the endpoint answers 403, which is it working correctly, not a conformance failure.

## 0.7.0

### Minor Changes

- 41be1f7: `inbox` accepts `slaKinds`, so a product with a mixed queue can be honest

  `slaDeclared` is one boolean per product, but SLA reality is per queue kind. mark8ly's `/admin/inbox` merges five kinds from independent providers and only `sea_manual_review` has a deadline — `erasure_request` deliberately has none, because deriving a statutory deadline in a read endpoint would be inventing policy in the wrong place. Neither boolean value was honest: `true` failed the suite unless mark8ly fabricated the value its code documents a refusal to fabricate, and `false` understated a subscription-clock-pausing commitment.

  ```jsonc
  "inbox": { "slaKinds": ["sea_manual_review"] }
  ```

  `due_at` is then required only of items whose `kind` is listed. A declared kind that does not appear on the sampled page is a **skip**, not a pass — it demonstrated nothing, and `pass` would claim coverage the run does not have.

  `slaDeclared` is unchanged and still right for a uniform queue. Declaring both is an error: two answers to one question.

  Closes tesserix/design-system#36.

## 0.6.0

### Minor Changes

- 33be4fc: Enforce §8.9's entity row against `/admin/entities/{type}`.

  §3.4 named the endpoint and its envelope but never named the row inside it, and two products filled that silence differently while this suite was already running against both — Kora sends a `sublabel`, mark8ly sends none, and platform-api dropped the field entirely in between without anything noticing. §8.9 settles the row; this makes it enforceable. The amendment shipped saying, in its own text, that it was not yet enforced. That was the state §8.8 exists to prevent.

  **What a product must do to stay conformant:**

  - Every row carries an `id` and a `label`, both **non-empty strings**. A numeric `id` fails: `String(row.id)` in a consumer makes it appear to work everywhere except where the id is compared against one that arrived as a string, so the mismatch surfaces as a row that will not open rather than as a type error anyone can find. A whitespace-only `label` fails for the same reason an empty one does — it renders as a blank line the operator cannot click.
  - `sublabel` is **optional and must stay optional**. A row with no disambiguator is conformant and always was — mark8ly's rows are correct and this check does not touch them. What now fails is `sublabel: null` and `sublabel: ""`: signalling absence through a value rather than by omitting the key. Both survive a consumer's `if ("sublabel" in row)` and land in the DOM as a blank second line or an empty parenthesis. Omitting the key is the only form a consumer can reliably decline to render.
  - `source` **must not be sent**. The platform stamps it from the authenticated request; a product-supplied one is a forgeable claim about provenance, and a federated Directory that trusted it would attribute a record to a product that never sent it. Neither current implementer sends it, so this fails nobody today — it exists so the third one cannot start.
  - `type` is explicitly allowed, and `created_at` is left to §4.3, which already checks its format.

  Findings are reported **per row**, naming the index and the `id` where one is legible — "a row is malformed" against a page of fifty is not actionable — and every bad row is reported rather than only the first, so a systematic problem reads as one.

  An empty page is a **skip, not a pass**: a product with no rows has demonstrated nothing about its row shape, and a green line would claim coverage the run does not have. Point the check at a type that has records before reading it as conformance. A page whose `data` is not an array is also a skip here, because §4.1 already reports that deviation and showing it twice sends the reader looking for a row problem that does not exist.

## 0.5.0

### Minor Changes

- 52fceba: Detect an endpoint a product SERVES but does not declare.

  "Contracts are declared, not discovered" governs what the suite CHECKS. It was never meant to make an implemented-but-undeclared endpoint invisible — and treating absence as proof of absence reproduced the exact failure the allowlist exists to prevent, one level up: an endpoint served in production, checked by nothing, reported as a clean skip.

  The gap is not hypothetical. The estate runs this suite from a Kubernetes CronJob whose declaration lives in a Helm chart, while the contract requires the product to commit its own `admin-conformance.json` at its repo root. Two copies, nothing enforcing that they agree, and the drift is silent in exactly one direction: an endpoint present in the repo file and missing from the chart is never checked, and reports as a skip that reads as a pass.

  So an undeclared endpoint is now probed. A **2xx is a failure**, symmetrical with the declared-but-404 case already reported — declaring something you do not serve and serving something you do not declare are the same mistake from opposite sides, and only one was caught before. Anything else (404, 501, a refusal, an unreachable host) stays the honest skip it always was.

  Two endpoints are never probed blind, and each is named in the skip detail: `entities` has no URL without a `{type}` only the declaration supplies, and `tenant-lifecycle` is a write — asking whether it exists would perform it. A probe that could not be made reports a plain skip rather than a conclusion, because inventing one from a failed request is how a suite starts lying in the reassuring direction.

  Verified against both live products: mark8ly and Kora both still exit 0 with zero failures, and dropping one endpoint from mark8ly's declaration — the exact shape of a stale chart copy — produces exit 1 with that endpoint failing.

  Also adds `requiresSubtypes(id)`, the accessor sibling of `isProbed`, since the field exists on one member of the endpoint union and cannot be read directly.

## 0.4.0

### Minor Changes

- fffd6be: Add contract §8.8: `GET /admin/lifecycle/reason-codes`, and make it conditionally required.

  §8.3 already required a reason code on suspend and unsuspend so an audit row says _why_ and not only _what_, and mark8ly complied — seven suspend codes, four deliberately different unsuspend ones, an unrecognised code refused with §4.4's `invalid_reason_code`. All correct, and all invisible: the sets were a Go var readable only by opening the file, so the console hand-copied them (tesserix-home#345). A copied vocabulary drifts in two directions and only one is loud — offering a retired code is refused where someone sees it, missing a newly added one is silent and the operator picks the nearest wrong option.

  Two new endpoint ids. `lifecycle/reason-codes` is fetched and checked: `{data: {suspend, unsuspend}}`, both verbs present, each entry a snake_case `code` with a non-empty human `label`, no duplicates. `tenant-lifecycle` is declarable but **never called** — a conformance run that suspended a live merchant's tenant to confirm the route conforms is worse than an unchecked route, and there is no sandbox tenant to point one at. It exists to be the antecedent of a rule: declaring it without `lifecycle/reason-codes` now fails the run.

  That rule is the first check in the suite that reads the declaration rather than a response, because the deviation is a combination of what a product implements and what it does not — no single body can be wrong. It reports as a finding rather than a parse-time throw: a well-formed declaration describing a real contract gap belongs in the report next to the other failures, with the section that says so.

## 0.3.0

### Minor Changes

- 0fa1c16: Amend contract §3.1: `GET /admin/kpis` now returns its flat map of scalar metrics wrapped in a `data` object (`{"data": {"chefs_active": 412}}`) rather than bare at the top level. Every other contract endpoint already answers under `data` — §4.1's paginated envelope is `{data, pagination}` — so making the one singleton endpoint the exception was the odd choice, and a generic client can now always read `.data` without knowing whether it asked for a list or a singleton. The `flat-map` envelope kind is renamed `data-flat-map` and checks the wrapped shape; the bare map is now reported as a deviation, with a failure detail that names the amendment so a product still serving the old shape is not sent hunting for a bug in metrics that are fine. mark8ly is the only implementer and already returned the wrapped shape, and nothing consumes the endpoint yet, so the migration cost is zero.

## 0.2.1

### Patch Changes

- cf92438: Fix the `admin-conformance` binary, which npm stripped at publish time. The `bin` path was `./dist/cli.js`; npm rejects the `./` prefix and silently removed the entry, so `npx @tesserix/admin-conformance` — the invocation the contract documents — resolved to nothing. The built CLI also carried no shebang, so it could not have executed even with a valid `bin` entry.

## 0.2.0

### Minor Changes

- 38cf5a3: Add `@tesserix/admin-conformance`, the enforcement half of the Product Admin Integration Contract (§5). A product declares which endpoints it implements in `admin-conformance.json` and runs the CLI against its own admin API in CI; the suite skips the rest and fails on any declared endpoint that deviates. Includes a TypeScript port of the platform HMAC signing scheme, checked against the reference implementation's published golden vectors.
