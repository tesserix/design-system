---
"@tesserix/admin-conformance": minor
---

Amend contract §3.1: `GET /admin/kpis` now returns its flat map of scalar metrics wrapped in a `data` object (`{"data": {"chefs_active": 412}}`) rather than bare at the top level. Every other contract endpoint already answers under `data` — §4.1's paginated envelope is `{data, pagination}` — so making the one singleton endpoint the exception was the odd choice, and a generic client can now always read `.data` without knowing whether it asked for a list or a singleton. The `flat-map` envelope kind is renamed `data-flat-map` and checks the wrapped shape; the bare map is now reported as a deviation, with a failure detail that names the amendment so a product still serving the old shape is not sent hunting for a bug in metrics that are fine. mark8ly is the only implementer and already returned the wrapped shape, and nothing consumes the endpoint yet, so the migration cost is zero.
