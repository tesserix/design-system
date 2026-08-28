---
"@tesserix/admin-conformance": minor
---

`inbox` accepts `slaKinds`, so a product with a mixed queue can be honest

`slaDeclared` is one boolean per product, but SLA reality is per queue kind. mark8ly's `/admin/inbox` merges five kinds from independent providers and only `sea_manual_review` has a deadline — `erasure_request` deliberately has none, because deriving a statutory deadline in a read endpoint would be inventing policy in the wrong place. Neither boolean value was honest: `true` failed the suite unless mark8ly fabricated the value its code documents a refusal to fabricate, and `false` understated a subscription-clock-pausing commitment.

```jsonc
"inbox": { "slaKinds": ["sea_manual_review"] }
```

`due_at` is then required only of items whose `kind` is listed. A declared kind that does not appear on the sampled page is a **skip**, not a pass — it demonstrated nothing, and `pass` would claim coverage the run does not have.

`slaDeclared` is unchanged and still right for a uniform queue. Declaring both is an error: two answers to one question.

Closes tesserix/design-system#36.
