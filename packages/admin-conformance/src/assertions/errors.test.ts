import { describe, expect, it } from "vitest"

import type { Finding } from "../finding"
import { ERROR_SECTION, checkErrorShape } from "./errors"

const statuses = (findings: readonly Finding[]) => findings.map((f) => f.status)
const details = (findings: readonly Finding[]) =>
  findings.map((f) => f.detail ?? "").join(" | ")

describe("the error envelope", () => {
  it("accepts a machine code paired with a human message", () => {
    const body = { error: "not_found", message: "Chef abc123 does not exist" }
    const findings = checkErrorShape("entities", ERROR_SECTION, body)
    expect(statuses(findings)).toEqual(["pass"])
    expect(findings[0]?.section).toBe("4.4")
  })

  it("accepts digits inside a code", () => {
    const body = { error: "oauth2_token_expired", message: "Reconnect the integration" }
    expect(statuses(checkErrorShape("entities", "4.4", body))).toEqual(["pass"])
  })

  it("rejects a human sentence in the error field", () => {
    const body = { error: "Chef abc123 does not exist", message: "Chef abc123 does not exist" }
    const findings = checkErrorShape("entities", "4.4", body)
    expect(statuses(findings)).toContain("fail")
    expect(details(findings)).toContain("snake_case")
  })

  it("rejects an upper-case or camelCase code", () => {
    expect(
      statuses(checkErrorShape("entities", "4.4", { error: "NotFound", message: "no" })),
    ).toContain("fail")
    expect(
      statuses(checkErrorShape("entities", "4.4", { error: "NOT_FOUND", message: "no" })),
    ).toContain("fail")
  })

  it("rejects a hyphenated or dotted code, which is not the spelling the contract fixes", () => {
    expect(
      statuses(checkErrorShape("entities", "4.4", { error: "not-found", message: "no" })),
    ).toContain("fail")
  })

  it("rejects an empty or missing code", () => {
    expect(statuses(checkErrorShape("entities", "4.4", { error: "", message: "no" }))).toContain(
      "fail",
    )
    expect(details(checkErrorShape("entities", "4.4", { message: "no" }))).toContain("error")
  })

  it("rejects a code that is not a string", () => {
    expect(
      statuses(checkErrorShape("entities", "4.4", { error: 404, message: "no" })),
    ).toContain("fail")
  })

  it("rejects an empty, missing, or non-string message", () => {
    expect(
      statuses(checkErrorShape("entities", "4.4", { error: "not_found", message: "   " })),
    ).toContain("fail")
    expect(details(checkErrorShape("entities", "4.4", { error: "not_found" }))).toContain("message")
    expect(
      statuses(checkErrorShape("entities", "4.4", { error: "not_found", message: 5 })),
    ).toContain("fail")
  })

  it("rejects a body that is not an object at all", () => {
    const findings = checkErrorShape("entities", "4.4", "not found")
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("string")
  })

  it("reports the code and the message separately, so one fix does not hide the other", () => {
    const findings = checkErrorShape("entities", "4.4", { error: "Not Found", message: "" })
    expect(statuses(findings).filter((s) => s === "fail")).toHaveLength(2)
  })
})
