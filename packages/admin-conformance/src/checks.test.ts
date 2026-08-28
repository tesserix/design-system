import { describe, expect, it } from "vitest"

import { checkAuditLogScoping, checkInboxItems, checkKpis } from "./checks"

const statuses = (findings: { status: string }[]) => findings.map((f) => f.status)

describe("checkKpis (§3.1)", () => {
  // The rule exists because the old shared route branched on three products
  // and fell through to `{}`, which is why dwellm8 rendered four em-dashes
  // since launch. An empty object is indistinguishable from real zeroes.
  it("fails a 200 with an empty object", () => {
    const findings = checkKpis({ status: 200, body: {} })
    expect(statuses(findings)).toContain("fail")
    expect(findings.find((f) => f.status === "fail")?.detail).toMatch(/501/)
  })

  it("passes a 501, which is how a product says it is not instrumented", () => {
    expect(statuses(checkKpis({ status: 501, body: undefined }))).toEqual(["pass"])
  })

  it("fails a 200 whose data map is empty, for the same reason as {}", () => {
    const findings = checkKpis({ status: 200, body: { data: {} } })
    expect(statuses(findings)).toContain("fail")
    expect(findings.find((f) => f.status === "fail")?.detail).toMatch(/501/)
  })

  it("passes a flat map of metrics wrapped in data", () => {
    const findings = checkKpis({
      status: 200,
      body: { data: { chefs_active: 412, orders_today: 1877 } },
    })
    expect(statuses(findings)).toEqual(["pass"])
  })

  it("fails a metric that is not a scalar", () => {
    const findings = checkKpis({ status: 200, body: { data: { nested: { a: 1 } } } })
    expect(statuses(findings)).toContain("fail")
  })

  it("fails a data key that is not an object", () => {
    expect(statuses(checkKpis({ status: 200, body: { data: [1, 2] } }))).toContain("fail")
  })
})

describe("checkInboxItems (§3.2)", () => {
  const item = {
    id: "uuid",
    kind: "chef_approval",
    title: "Sunita's Kitchen",
    waiting_since: "2026-08-12T09:31:00Z",
    severity: "normal",
    href: "/admin/directory/chefs/abc123",
    actions: [{ id: "approve", label: "Approve", destructive: false }],
  }

  it("passes a well-formed item", () => {
    const findings = checkInboxItems({ items: [item], total: 1 }, {})
    expect(statuses(findings)).not.toContain("fail")
  })

  // waiting_since is what makes the console's front door sortable across
  // products without per-product knowledge. An item without it is invisible
  // to the only question the inbox asks.
  it("fails an item missing waiting_since", () => {
    const without = Object.fromEntries(
      Object.entries(item).filter(([key]) => key !== "waiting_since"),
    )
    const findings = checkInboxItems({ items: [without], total: 1 }, {})
    expect(findings.some((f) => f.status === "fail" && /waiting_since/.test(f.check)))
      .toBe(true)
  })

  it("requires due_at only where the product declared an SLA", () => {
    const withoutDue = checkInboxItems({ items: [item], total: 1 }, { slaDeclared: true })
    expect(findings_fail(withoutDue, /due_at/)).toBe(true)

    const undeclared = checkInboxItems({ items: [item], total: 1 }, {})
    expect(findings_fail(undeclared, /due_at/)).toBe(false)
  })

  // slaDeclared is one boolean per product; SLA reality is per queue kind.
  // mark8ly merges five kinds from independent providers and only
  // sea_manual_review has a deadline — erasure_request deliberately has none,
  // because deriving a statutory deadline in a read endpoint would be
  // inventing policy in the wrong place. Neither boolean value is honest.
  it("requires due_at only on the kinds declared SLA-bearing", () => {
    const sea = { ...item, kind: "sea_manual_review" }
    const erasure = { ...item, kind: "erasure_request" }

    const missing = checkInboxItems(
      { items: [sea, erasure], total: 2 },
      { slaKinds: ["sea_manual_review"] },
    )
    expect(findings_fail(missing, /due_at/)).toBe(true)

    // The erasure item still has no due_at, and that is correct.
    const satisfied = checkInboxItems(
      { items: [{ ...sea, due_at: "2026-08-30T00:00:00Z" }, erasure], total: 2 },
      { slaKinds: ["sea_manual_review"] },
    )
    expect(findings_fail(satisfied, /due_at/)).toBe(false)
  })

  // A declared kind absent from the sampled page demonstrated nothing about
  // whether the product carries its due_at. `pass` would claim coverage the
  // run does not have — the same rule the entity-row assertion follows for a
  // page with no rows.
  it("skips rather than passes when no item of a declared kind is present", () => {
    const findings = checkInboxItems(
      { items: [{ ...item, kind: "erasure_request" }], total: 1 },
      { slaKinds: ["sea_manual_review"] },
    )
    const due = findings.filter((f) => /due_at/.test(f.check))
    expect(due.map((f) => f.status)).toEqual(["skip"])
  })

  it("accepts an empty inbox as a pass, not a gap", () => {
    const findings = checkInboxItems({ items: [], total: 0 }, { slaDeclared: true })
    expect(statuses(findings)).not.toContain("fail")
  })
})

describe("checkAuditLogScoping (§3.3)", () => {
  // A route that ignores its own scope parameter is worse than no route: the
  // HomeChef, DevAI, Dwellm8 and Kora overviews all displayed mark8ly's
  // critical-event count because of exactly this.
  it("fails when a row names a product other than the caller", () => {
    const findings = checkAuditLogScoping(
      { data: [{ id: "1", source: "mark8ly" }, { id: "2", source: "kora" }] },
      "mark8ly",
    )
    expect(statuses(findings)).toContain("fail")
  })

  it("passes when every row that names a product names the caller", () => {
    const findings = checkAuditLogScoping(
      { data: [{ id: "1", product: "mark8ly" }] },
      "mark8ly",
    )
    expect(statuses(findings)).toEqual(["pass"])
  })

  // Honesty over a green tick. Rows are specified as bare ids with no product
  // field — the platform API namespaces them on arrival — so from outside the
  // product there is usually nothing to compare against. Reporting a pass
  // would assert something this suite cannot see.
  it("skips rather than passes when no row carries a product field", () => {
    const findings = checkAuditLogScoping({ data: [{ id: "1", action: "x" }] }, "mark8ly")
    expect(statuses(findings)).toEqual(["skip"])
    expect(findings[0].detail).toMatch(/cannot be verified/i)
  })

  it("skips an empty page, which proves nothing either way", () => {
    expect(statuses(checkAuditLogScoping({ data: [] }, "mark8ly"))).toEqual(["skip"])
  })
})

function findings_fail(
  findings: { status: string; check: string }[],
  pattern: RegExp,
): boolean {
  return findings.some((f) => f.status === "fail" && pattern.test(f.check))
}

describe("checkKpis and the pre-amendment bare map", () => {
  // The contract was amended on 2026-08-26: the wrapped shape mark8ly already
  // served is now what §3.1 requires, and the bare map it used to require is
  // the deviation. The failure has to say the contract moved — the metrics of
  // a product still serving the bare map are perfectly fine, and a generic
  // "missing data key" would send someone hunting a bug that is not there.
  it("names the amendment rather than reporting a bare shape error", () => {
    const findings = checkKpis({
      status: 200,
      body: { tenants_active: 12, trials_expiring: 3 },
    })
    const failure = findings.find((f) => f.status === "fail")
    expect(failure?.detail).toMatch(/§3\.1/)
    expect(failure?.detail).toMatch(/amended/i)
    expect(failure?.detail).toMatch(/data/)
  })
})
