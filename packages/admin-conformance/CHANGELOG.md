# @tesserix/admin-conformance

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
