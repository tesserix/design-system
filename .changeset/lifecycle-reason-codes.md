---
"@tesserix/admin-conformance": minor
---

Add contract §8.8: `GET /admin/lifecycle/reason-codes`, and make it conditionally required.

§8.3 already required a reason code on suspend and unsuspend so an audit row says *why* and not only *what*, and mark8ly complied — seven suspend codes, four deliberately different unsuspend ones, an unrecognised code refused with §4.4's `invalid_reason_code`. All correct, and all invisible: the sets were a Go var readable only by opening the file, so the console hand-copied them (tesserix-home#345). A copied vocabulary drifts in two directions and only one is loud — offering a retired code is refused where someone sees it, missing a newly added one is silent and the operator picks the nearest wrong option.

Two new endpoint ids. `lifecycle/reason-codes` is fetched and checked: `{data: {suspend, unsuspend}}`, both verbs present, each entry a snake_case `code` with a non-empty human `label`, no duplicates. `tenant-lifecycle` is declarable but **never called** — a conformance run that suspended a live merchant's tenant to confirm the route conforms is worse than an unchecked route, and there is no sandbox tenant to point one at. It exists to be the antecedent of a rule: declaring it without `lifecycle/reason-codes` now fails the run.

That rule is the first check in the suite that reads the declaration rather than a response, because the deviation is a combination of what a product implements and what it does not — no single body can be wrong. It reports as a finding rather than a parse-time throw: a well-formed declaration describing a real contract gap belongs in the report next to the other failures, with the section that says so.
