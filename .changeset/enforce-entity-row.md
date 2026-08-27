---
"@tesserix/admin-conformance": minor
---

Enforce §8.9's entity row against `/admin/entities/{type}`.

§3.4 named the endpoint and its envelope but never named the row inside it, and two products filled that silence differently while this suite was already running against both — Kora sends a `sublabel`, mark8ly sends none, and platform-api dropped the field entirely in between without anything noticing. §8.9 settles the row; this makes it enforceable. The amendment shipped saying, in its own text, that it was not yet enforced. That was the state §8.8 exists to prevent.

**What a product must do to stay conformant:**

- Every row carries an `id` and a `label`, both **non-empty strings**. A numeric `id` fails: `String(row.id)` in a consumer makes it appear to work everywhere except where the id is compared against one that arrived as a string, so the mismatch surfaces as a row that will not open rather than as a type error anyone can find. A whitespace-only `label` fails for the same reason an empty one does — it renders as a blank line the operator cannot click.
- `sublabel` is **optional and must stay optional**. A row with no disambiguator is conformant and always was — mark8ly's rows are correct and this check does not touch them. What now fails is `sublabel: null` and `sublabel: ""`: signalling absence through a value rather than by omitting the key. Both survive a consumer's `if ("sublabel" in row)` and land in the DOM as a blank second line or an empty parenthesis. Omitting the key is the only form a consumer can reliably decline to render.
- `source` **must not be sent**. The platform stamps it from the authenticated request; a product-supplied one is a forgeable claim about provenance, and a federated Directory that trusted it would attribute a record to a product that never sent it. Neither current implementer sends it, so this fails nobody today — it exists so the third one cannot start.
- `type` is explicitly allowed, and `created_at` is left to §4.3, which already checks its format.

Findings are reported **per row**, naming the index and the `id` where one is legible — "a row is malformed" against a page of fifty is not actionable — and every bad row is reported rather than only the first, so a systematic problem reads as one.

An empty page is a **skip, not a pass**: a product with no rows has demonstrated nothing about its row shape, and a green line would claim coverage the run does not have. Point the check at a type that has records before reading it as conformance. A page whose `data` is not an array is also a skip here, because §4.1 already reports that deviation and showing it twice sends the reader looking for a row problem that does not exist.
