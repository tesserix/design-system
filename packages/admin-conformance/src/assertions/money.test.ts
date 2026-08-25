import { describe, expect, it } from "vitest"

import type { Finding } from "../finding"
import { MONEY_SECTION, checkMoney } from "./money"

const statuses = (findings: readonly Finding[]) => findings.map((f) => f.status)
const details = (findings: readonly Finding[]) =>
  findings.map((f) => f.detail ?? "").join(" | ")

describe("money values", () => {
  it("accepts minor units with an explicit currency", () => {
    const body = { data: [{ total: { amount: 98420, currency: "INR" } }] }
    const findings = checkMoney("billing/subscriptions", MONEY_SECTION, body)
    expect(statuses(findings)).toEqual(["pass"])
    expect(findings[0]?.section).toBe("4.2")
  })

  it("accepts a zero amount, which is a real price and not a missing one", () => {
    const body = { price_amount: { amount: 0, currency: "USD" } }
    expect(statuses(checkMoney("entities", "4.2", body))).toEqual(["pass"])
  })

  it("accepts a negative amount, because a refund is money too", () => {
    const body = { amount: -500, currency: "EUR" }
    expect(statuses(checkMoney("entities", "4.2", body))).toEqual(["pass"])
  })

  it("rejects a bare number under a money-shaped key", () => {
    const body = { data: [{ mrr_amount: 98420 }] }
    const findings = checkMoney("billing/subscriptions", "4.2", body)
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("mrr_amount")
    expect(details(findings)).toContain("currency")
  })

  it("names the path of the offending value so a red log locates it", () => {
    const body = { data: [{ id: "a" }, { id: "b", fee_cents: 100 }] }
    expect(details(checkMoney("billing/trials", "4.2", body))).toContain("data[1].fee_cents")
  })

  it("rejects a money object with no currency", () => {
    const body = { total: { amount: 100 } }
    const findings = checkMoney("entities", "4.2", body)
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("currency")
  })

  it("rejects a fractional amount, because minor units are whole", () => {
    const body = { amount: 98420.5, currency: "INR" }
    const findings = checkMoney("entities", "4.2", body)
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("98420.5")
  })

  it("rejects an amount sent as a string", () => {
    const body = { amount: "98420", currency: "INR" }
    expect(statuses(checkMoney("entities", "4.2", body))).toContain("fail")
  })

  it("rejects a lowercase or malformed currency code", () => {
    expect(statuses(checkMoney("entities", "4.2", { amount: 1, currency: "inr" }))).toContain("fail")
    expect(statuses(checkMoney("entities", "4.2", { amount: 1, currency: "RUPEE" }))).toContain(
      "fail",
    )
    expect(statuses(checkMoney("entities", "4.2", { amount: 1, currency: "" }))).toContain("fail")
  })

  it("does not treat pagination.total as money, since every paged body carries one", () => {
    const body = { data: [], pagination: { page: 1, limit: 50, total: 320 } }
    expect(statuses(checkMoney("audit-logs", "4.2", body))).toEqual(["skip"])
  })

  it("does not treat a bare price or total field as money, to avoid failing a build on a guess", () => {
    const body = { data: [{ price: 12, total: 34, count: 7 }] }
    expect(statuses(checkMoney("entities", "4.2", body))).toEqual(["skip"])
  })

  it("skips when the response carries no money-shaped field at all", () => {
    const findings = checkMoney("inbox", "4.2", { items: [], total: 0 })
    expect(statuses(findings)).toEqual(["skip"])
    expect(findings[0]?.detail).toBeTruthy()
  })

  it("finds money nested arbitrarily deep", () => {
    const body = { items: [{ plan: { billing: { amount: 1.5, currency: "INR" } } }] }
    expect(details(checkMoney("inbox", "4.2", body))).toContain("items[0].plan.billing")
  })

  it("reports every offending value rather than stopping at the first", () => {
    const body = { a: { amount: 1.5, currency: "INR" }, b: { amount: 2, currency: "inr" } }
    expect(statuses(checkMoney("entities", "4.2", body)).filter((s) => s === "fail")).toHaveLength(2)
  })
})
