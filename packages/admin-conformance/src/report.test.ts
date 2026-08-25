import { describe, expect, it } from "vitest"

import { fail, pass, skip, type Finding } from "./finding"
import { exitCode, formatReport } from "./report"

/**
 * The report is the only part of this package a human reads, and they read it
 * in a CI log — scrolled past at speed, days after the change that broke it.
 * These tests hold it to two properties that matter more than its prose: a
 * failure cannot be missed, and two identical runs produce identical bytes.
 */

const findings: readonly Finding[] = [
  pass("health", "3.5", "responds within the deadline"),
  fail(
    "audit-logs",
    "3.3",
    "returns the data/pagination envelope",
    "expected an object with data and pagination, got an array",
  ),
  skip("kpis", "3.1", "returns a flat map", "not declared"),
  pass("audit-logs", "3.3", "scopes entries to the calling product"),
]

/**
 * Matches any ANSI SGR sequence. Built from a code point rather than written
 * as a literal so the escape byte cannot be lost by a copy-paste or a
 * whitespace-trimming editor, which would leave these assertions passing
 * against a report full of colour codes.
 */
const ansi = (flags = ""): RegExp => new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, flags)

const plain = (input: readonly Finding[] = findings): string =>
  formatReport(input, { color: false })

describe("formatReport", () => {
  it("groups findings under the endpoint they belong to", () => {
    const report = plain()

    expect(report).toContain("audit-logs")
    expect(report).toContain("returns the data/pagination envelope")
    expect(report).toContain("scopes entries to the calling product")
  })

  it("prints the detail of every failure, since the check name alone is not actionable", () => {
    expect(plain()).toContain(
      "expected an object with data and pagination, got an array",
    )
  })

  it("marks a failure with a token that survives being skimmed", () => {
    expect(plain()).toContain("FAIL")
  })

  it("states the totals in a single summary line", () => {
    const summary = plain()
      .split("\n")
      .find((line) => line.startsWith("Summary:"))

    expect(summary).toBeDefined()
    expect(summary).toContain("4 checks")
    expect(summary).toContain("2 passed")
    expect(summary).toContain("1 failed")
    expect(summary).toContain("1 skipped")
  })

  it("reports zero of everything rather than printing nothing at all", () => {
    const report = plain([])

    expect(report).toContain("0 checks")
    expect(report.trim()).not.toBe("")
  })

  it("produces identical output for the same findings in a different order", () => {
    const shuffled = [findings[1], findings[3], findings[0], findings[2]] as Finding[]

    expect(plain(shuffled)).toBe(plain())
  })

  it("produces identical output on two runs of the same input", () => {
    expect(plain()).toBe(plain())
  })

  it("does not mutate the findings it was given", () => {
    const input = [...findings]
    const before = JSON.stringify(input)

    plain(input)

    expect(JSON.stringify(input)).toBe(before)
  })
})

describe("colour", () => {
  it("emits no escape sequences when colour is switched off", () => {
    expect(plain()).not.toMatch(ansi())
  })

  it("emits escape sequences only when colour is asked for", () => {
    expect(formatReport(findings, { color: true })).toMatch(ansi())
  })

  it("is off under CI even when the stream is a TTY", () => {
    const report = formatReport(findings, { env: { CI: "true" }, isTty: true })

    expect(report).not.toMatch(ansi())
  })

  it("is off when the stream is not a TTY", () => {
    const report = formatReport(findings, { env: {}, isTty: false })

    expect(report).not.toMatch(ansi())
  })

  it("is on for an interactive terminal outside CI", () => {
    const report = formatReport(findings, { env: {}, isTty: true })

    expect(report).toMatch(ansi())
  })

  it("honours an explicit choice over what the environment suggests", () => {
    const forced = formatReport(findings, {
      color: true,
      env: { CI: "true" },
      isTty: false,
    })

    expect(forced).toMatch(ansi())
  })

  it("says exactly the same thing once the codes are stripped", () => {
    const coloured = formatReport(findings, { color: true })

    expect(coloured.replace(ansi("g"), "")).toBe(plain())
  })
})

describe("exitCode", () => {
  it("is 1 when any finding failed", () => {
    expect(exitCode(findings)).toBe(1)
  })

  it("is 0 when nothing failed", () => {
    expect(exitCode(findings.filter((f) => f.status !== "fail"))).toBe(0)
  })

  it("is 0 for a run that skipped everything, because partial implementation is legitimate", () => {
    expect(exitCode([skip("kpis", "3.1", "returns a flat map", "not declared")])).toBe(0)
  })

  it("is 0 for an empty run", () => {
    expect(exitCode([])).toBe(0)
  })
})
