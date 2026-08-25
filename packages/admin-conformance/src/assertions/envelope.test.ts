import { describe, expect, it } from "vitest"

import type { Finding } from "../finding"
import { ENVELOPE_SECTION, checkEnvelope, checkEnvelopeShape } from "./envelope"

const statuses = (findings: readonly Finding[]) => findings.map((f) => f.status)
const details = (findings: readonly Finding[]) =>
  findings.map((f) => f.detail ?? "").join(" | ")

const paged = {
  data: [{ id: "a" }],
  pagination: { page: 1, limit: 50, total: 320 },
}

describe("the data/pagination envelope", () => {
  it("accepts the one shape the contract names", () => {
    const findings = checkEnvelopeShape("audit-logs", ENVELOPE_SECTION, paged, "data-pagination")
    expect(statuses(findings)).toEqual(["pass"])
    expect(findings[0]?.section).toBe("4.1")
  })

  it("accepts an empty page, because zero rows is still the envelope", () => {
    const body = { data: [], pagination: { page: 1, limit: 50, total: 0 } }
    expect(statuses(checkEnvelopeShape("audit-logs", "4.1", body, "data-pagination"))).toEqual([
      "pass",
    ])
  })

  it("rejects the flat variant that spreads the page onto the top level", () => {
    const body = { logs: [], total: 0, page: 1, limit: 50 }
    const findings = checkEnvelopeShape("audit-logs", "4.1", body, "data-pagination")
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("pagination")
    expect(details(findings)).toContain("logs")
  })

  it("rejects a data field that is an object rather than an array", () => {
    const body = { data: { id: "a" }, pagination: { page: 1, limit: 50, total: 1 } }
    const findings = checkEnvelopeShape("audit-logs", "4.1", body, "data-pagination")
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("object")
  })

  it("rejects a null data field", () => {
    const body = { data: null, pagination: { page: 1, limit: 50, total: 0 } }
    expect(statuses(checkEnvelopeShape("audit-logs", "4.1", body, "data-pagination"))).toContain(
      "fail",
    )
  })

  it("rejects a pagination block whose counters are strings", () => {
    const body = { data: [], pagination: { page: "1", limit: "50", total: "0" } }
    const findings = checkEnvelopeShape("audit-logs", "4.1", body, "data-pagination")
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("page")
  })

  it("rejects a pagination block missing a counter altogether", () => {
    const body = { data: [], pagination: { page: 1, limit: 50 } }
    const findings = checkEnvelopeShape("audit-logs", "4.1", body, "data-pagination")
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("total")
  })

  it("rejects a fractional page counter", () => {
    const body = { data: [], pagination: { page: 1.5, limit: 50, total: 0 } }
    expect(statuses(checkEnvelopeShape("audit-logs", "4.1", body, "data-pagination"))).toContain(
      "fail",
    )
  })

  it("rejects extra top-level keys, because the contract says exactly two", () => {
    const body = { ...paged, meta: { took_ms: 3 } }
    const findings = checkEnvelopeShape("audit-logs", "4.1", body, "data-pagination")
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("meta")
  })

  it("rejects a top-level array, which is a body with no envelope at all", () => {
    const findings = checkEnvelopeShape("audit-logs", "4.1", [], "data-pagination")
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("array")
  })
})

describe("the items/total envelope", () => {
  it("accepts the inbox shape", () => {
    const body = { items: [{ id: "x" }], total: 1 }
    expect(statuses(checkEnvelopeShape("inbox", "4.1", body, "items-total"))).toEqual(["pass"])
  })

  it("rejects the data/pagination envelope on an items/total endpoint", () => {
    const findings = checkEnvelopeShape("inbox", "4.1", paged, "items-total")
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("items")
  })

  it("rejects a total that is not a whole number", () => {
    const body = { items: [], total: "0" }
    expect(statuses(checkEnvelopeShape("inbox", "4.1", body, "items-total"))).toContain("fail")
  })
})

describe("the flat map envelope", () => {
  it("accepts a flat object of scalar metrics", () => {
    const body = { orders_today: 42, revenue_trend: "up", degraded: false, last_sync_at: null }
    expect(statuses(checkEnvelopeShape("kpis", "4.1", body, "flat-map"))).toEqual(["pass"])
  })

  it("rejects an array, because a flat map is not a list", () => {
    const findings = checkEnvelopeShape("kpis", "4.1", [{ orders: 1 }], "flat-map")
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("array")
  })

  it("rejects a nested object value, which is what a wrapped envelope looks like", () => {
    const body = { data: { orders_today: 42 } }
    const findings = checkEnvelopeShape("kpis", "4.1", body, "flat-map")
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("data")
  })
})

describe("the free envelope", () => {
  it("skips rather than passing, so a green line never implies a checked shape", () => {
    const findings = checkEnvelopeShape("health", "4.1", { ok: true }, "free")
    expect(statuses(findings)).toEqual(["skip"])
    expect(findings[0]?.detail).toBeTruthy()
  })
})

describe("checkEnvelope", () => {
  it("reads the required envelope for a known endpoint out of the registry", () => {
    expect(statuses(checkEnvelope("audit-logs", ENVELOPE_SECTION, paged))).toEqual(["pass"])
    expect(statuses(checkEnvelope("kpis", ENVELOPE_SECTION, paged))).toContain("fail")
  })

  it("skips an endpoint id the contract does not define", () => {
    const findings = checkEnvelope("something-local", ENVELOPE_SECTION, paged)
    expect(statuses(findings)).toEqual(["skip"])
  })
})
