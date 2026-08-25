import { describe, expect, it } from "vitest"

import type { Finding } from "../finding"
import { EMPTY_SECTION, checkEmptyResult } from "./empty"

const statuses = (findings: readonly Finding[]) => findings.map((f) => f.status)
const details = (findings: readonly Finding[]) =>
  findings.map((f) => f.detail ?? "").join(" | ")

describe("an endpoint with no rows", () => {
  it("accepts 200 with an empty data array", () => {
    const findings = checkEmptyResult("audit-logs", EMPTY_SECTION, { data: [], pagination: { page: 1, limit: 50, total: 0 } }, 200)
    expect(statuses(findings)).toEqual(["pass"])
    expect(findings[0]?.section).toBe("4.5")
  })

  it("rejects a null data field, which defeats every caller's ?? [] fallback", () => {
    const findings = checkEmptyResult("audit-logs", "4.5", { data: null }, 200)
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("null")
  })

  it("rejects an object where the empty array belongs, which is how a Go nil slice arrives", () => {
    const findings = checkEmptyResult("audit-logs", "4.5", { data: {} }, 200)
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("object")
  })

  it("rejects a missing data field", () => {
    const findings = checkEmptyResult("audit-logs", "4.5", { pagination: { page: 1, limit: 50, total: 0 } }, 200)
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("data")
  })

  it("rejects a 404 for a collection that simply has no rows", () => {
    const findings = checkEmptyResult("audit-logs", "4.5", { data: [] }, 404)
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("404")
  })

  it("rejects a 204, because an empty body is not an empty array", () => {
    expect(statuses(checkEmptyResult("audit-logs", "4.5", null, 204))).toContain("fail")
  })

  it("reads items instead of data on an items/total endpoint", () => {
    expect(statuses(checkEmptyResult("inbox", "4.5", { items: [], total: 0 }, 200))).toEqual([
      "pass",
    ])
    expect(statuses(checkEmptyResult("inbox", "4.5", { items: null, total: 0 }, 200))).toContain(
      "fail",
    )
  })

  it("skips when the endpoint returned rows, because the rule was never exercised", () => {
    const findings = checkEmptyResult("audit-logs", "4.5", { data: [{ id: "a" }] }, 200)
    expect(statuses(findings)).toEqual(["skip"])
    expect(findings[0]?.detail).toBeTruthy()
  })

  it("skips an endpoint whose envelope has no collection to be empty", () => {
    expect(statuses(checkEmptyResult("kpis", "4.5", { orders_today: 0 }, 200))).toEqual(["skip"])
  })
})
