import { describe, expect, it } from "vitest"
import { ENDPOINTS, ENDPOINT_IDS, isEndpointId, isProbed } from "./contract"

describe("contract v3 ids", () => {
  const V3_IDS = [
    "outbox",
    "email-sends",
    "notifications",
    "break-glass",
    "conversions",
    "onboarding/funnel",
    "onboarding/sessions",
    "tenant-purge",
  ] as const

  it("recognises every v3 id", () => {
    for (const id of V3_IDS) expect(isEndpointId(id)).toBe(true)
  })

  it("keeps the v2 ids, unrenamed", () => {
    // Renaming one turns a product's declaration into "not implemented",
    // which reports as a pass. This is the guard against that.
    for (const id of [
      "kpis",
      "inbox",
      "audit-logs",
      "entities",
      "health",
      "billing/subscriptions",
      "billing/trials",
      "tenant-lifecycle",
      "lifecycle/reason-codes",
    ]) {
      expect(ENDPOINT_IDS).toContain(id)
    }
  })

  it("fixes the envelope each v3 read answers", () => {
    expect(ENDPOINTS.outbox.envelope).toBe("data-pagination")
    expect(ENDPOINTS["email-sends"].envelope).toBe("data-pagination")
    expect(ENDPOINTS.notifications.envelope).toBe("data-pagination")
    expect(ENDPOINTS["break-glass"].envelope).toBe("data-pagination")
    expect(ENDPOINTS["onboarding/sessions"].envelope).toBe("data-pagination")
    expect(ENDPOINTS["onboarding/funnel"].envelope).toBe("free")
    expect(ENDPOINTS.conversions.envelope).toBe("free")
    expect(ENDPOINTS["tenant-purge"].envelope).toBe("free")
  })

  it("refuses to probe the two endpoints a run must not call", () => {
    // A run that purged a real tenant is unrecoverable; a run that looked up
    // a real person by email is a scheduled PII read. Neither is a check.
    expect(isProbed("tenant-purge")).toBe(false)
    expect(isProbed("conversions")).toBe(false)
  })

  it("probes every other v3 read", () => {
    for (const id of [
      "outbox",
      "email-sends",
      "notifications",
      "break-glass",
      "onboarding/funnel",
      "onboarding/sessions",
    ] as const) {
      expect(isProbed(id)).toBe(true)
    }
  })

  it("gives every endpoint a path under /admin and a section", () => {
    for (const id of ENDPOINT_IDS) {
      expect(ENDPOINTS[id].path.startsWith("/admin")).toBe(true)
      expect(ENDPOINTS[id].section).toMatch(/^\d+\.\d+$/)
    }
  })
})
