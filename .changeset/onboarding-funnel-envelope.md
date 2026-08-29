---
"@tesserix/admin-conformance": patch
---

Fix contract §9.6: `onboarding/funnel`'s envelope is `free`, not `data-flat-map`. 0.8.0 declared `data-flat-map` by inferring the shape from one line without reading `toFunnelRow`; the endpoint's real response nests `last_24h` (a grouped sub-window of counts) and `window` (a `{from,to}` pair), which is neither a page nor a flat map of scalars. mark8ly's handler was correct and unchanged — flattening those objects would lose the grouping the endpoint exists to provide. The nightly conformance run was reporting two false §4.1 failures on a contract defect, not a product one; this stops that false failure and reports a skip instead, same as `lifecycle/reason-codes`.
