import { describe, expect, it } from "vitest"

import type { Finding } from "../finding"
import { TIMESTAMP_SECTION, checkTimestamps } from "./timestamps"

const statuses = (findings: readonly Finding[]) => findings.map((f) => f.status)
const details = (findings: readonly Finding[]) =>
  findings.map((f) => f.detail ?? "").join(" | ")

describe("timestamp fields", () => {
  it("accepts a UTC instant written with Z", () => {
    const findings = checkTimestamps("inbox", TIMESTAMP_SECTION, {
      waiting_since: "2026-08-12T09:31:00Z",
    })
    expect(statuses(findings)).toEqual(["pass"])
    expect(findings[0]?.section).toBe("4.3")
  })

  it("accepts an instant written with a numeric offset", () => {
    const body = { due_at: "2026-08-12T09:31:00+05:30" }
    expect(statuses(checkTimestamps("inbox", "4.3", body))).toEqual(["pass"])
  })

  it("accepts fractional seconds", () => {
    const body = { created_at: "2026-08-12T09:31:00.123456Z" }
    expect(statuses(checkTimestamps("audit-logs", "4.3", body))).toEqual(["pass"])
  })

  it("rejects a local time with no offset, which is the whole point of the rule", () => {
    const findings = checkTimestamps("audit-logs", "4.3", { created_at: "2026-08-12T09:31:00" })
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("offset")
    expect(details(findings)).toContain("created_at")
  })

  it("rejects a date with no time", () => {
    expect(statuses(checkTimestamps("audit-logs", "4.3", { updated_at: "2026-08-12" }))).toContain(
      "fail",
    )
  })

  it("rejects a unix epoch number", () => {
    const findings = checkTimestamps("audit-logs", "4.3", { created_at: 1755859200 })
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("number")
  })

  it("rejects a syntactically shaped string that is not a real instant", () => {
    const body = { due_at: "2026-13-45T09:31:00Z" }
    expect(statuses(checkTimestamps("inbox", "4.3", body))).toContain("fail")
  })

  it("allows null, because an absent value is not a malformed one", () => {
    const body = { waiting_since: null, due_at: "2026-08-12T09:31:00Z" }
    expect(statuses(checkTimestamps("inbox", "4.3", body))).toEqual(["pass"])
  })

  it("checks every key ending in _at or _since, not just the four the contract names", () => {
    const body = { archived_at: "2026-08-12T09:31:00", escalated_since: "2026-08-12T09:31:00" }
    expect(statuses(checkTimestamps("inbox", "4.3", body)).filter((s) => s === "fail")).toHaveLength(
      2,
    )
  })

  it("ignores keys that merely contain at or since", () => {
    const body = { attempts: 3, category: "x", since_label: "yesterday" }
    expect(statuses(checkTimestamps("inbox", "4.3", body))).toEqual(["skip"])
  })

  it("names the path of an offending value inside a collection", () => {
    const body = { items: [{ due_at: "2026-08-12T09:31:00Z" }, { due_at: "2026-08-12" }] }
    expect(details(checkTimestamps("inbox", "4.3", body))).toContain("items[1].due_at")
  })

  it("skips when the response carries no timestamp field", () => {
    const findings = checkTimestamps("kpis", "4.3", { orders_today: 4 })
    expect(statuses(findings)).toEqual(["skip"])
    expect(findings[0]?.detail).toBeTruthy()
  })
})
