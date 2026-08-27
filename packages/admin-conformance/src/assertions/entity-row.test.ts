import { describe, expect, it } from "vitest"

import type { Finding } from "../finding"
import { ENTITY_ROW_SECTION, checkEntityRow } from "./entity-row"

const statuses = (findings: readonly Finding[]) => findings.map((f) => f.status)
const details = (findings: readonly Finding[]) =>
  findings.map((f) => f.detail ?? "").join(" | ")

const page = (rows: unknown[]) => ({
  data: rows,
  pagination: { page: 1, limit: 50, total: rows.length },
})

describe("an entity row", () => {
  it("accepts a row carrying id, label and a sublabel", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Masala Dosa", sublabel: "South Indian" }]),
    )
    expect(statuses(findings)).toEqual(["pass"])
    expect(findings[0]?.section).toBe("8.9")
  })

  it("accepts a row with no sublabel at all, which is what mark8ly sends", () => {
    const findings = checkEntityRow(
      "entities/order",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Order #2201" }]),
    )
    expect(statuses(findings)).toEqual(["pass"])
  })

  it("rejects sublabel: null, which renders as a placeholder where nothing belongs", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Masala Dosa", sublabel: null }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("sublabel")
    expect(details(findings)).toContain("null")
  })

  it("rejects an empty-string sublabel for the same reason as null", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Masala Dosa", sublabel: "" }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("sublabel")
  })

  it("rejects a missing id", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ label: "Masala Dosa" }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("id")
    expect(details(findings)).not.toContain("label")
  })

  it("rejects a missing label", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1" }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("label")
  })

  it("rejects an empty-string id", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "", label: "Masala Dosa" }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("id")
  })

  it("rejects an empty-string label", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "   " }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("label")
  })

  it("rejects a numeric id, which a consumer's String(id) would paper over", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: 7, label: "Masala Dosa" }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("number")
  })

  it("rejects a row asserting its own source, which the platform stamps", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Masala Dosa", source: "kora" }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("source")
  })

  it("accepts a row carrying type, which §8.9 explicitly allows", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Masala Dosa", type: "food" }]),
    )
    expect(statuses(findings)).toEqual(["pass"])
  })

  it("accepts a row carrying created_at, which §4.3 checks instead", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Masala Dosa", created_at: "2026-08-27T10:00:00Z" }]),
    )
    expect(statuses(findings)).toEqual(["pass"])
  })

  it("reports every bad row, so a systematic problem reads as one", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([
        { id: "e1", label: "Masala Dosa", sublabel: "" },
        { id: "e2", label: "Idli", sublabel: null },
      ]),
    )
    expect(statuses(findings)).toEqual(["fail", "fail"])
    expect(details(findings)).toContain("e1")
    expect(details(findings)).toContain("e2")
  })

  it("names the row by index and by id, so the finding is actionable against a page", () => {
    const findings = checkEntityRow(
      "entities/food",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Idli" }, { id: "e2", label: "" }]),
    )
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toContain("data[1]")
    expect(details(findings)).toContain("e2")
  })

  it("rejects a row that is not an object at all", () => {
    const findings = checkEntityRow("entities/food", ENTITY_ROW_SECTION, page(["e1"]))
    expect(statuses(findings)).toEqual(["fail"])
  })

  it("skips an endpoint that is not entities, because this is a §3.4 row rule", () => {
    const findings = checkEntityRow(
      "audit-logs",
      ENTITY_ROW_SECTION,
      page([{ id: "e1", label: "Masala Dosa", sublabel: null }]),
    )
    expect(statuses(findings)).toEqual(["skip"])
    expect(findings[0]?.detail).toBeTruthy()
  })

  it("skips an empty page rather than passing, because no row shape was demonstrated", () => {
    const findings = checkEntityRow("entities/food", ENTITY_ROW_SECTION, page([]))
    expect(statuses(findings)).toEqual(["skip"])
    expect(findings[0]?.detail).toBeTruthy()
  })

  it("skips rather than restating an envelope deviation §4.1 already reports", () => {
    expect(statuses(checkEntityRow("entities/food", ENTITY_ROW_SECTION, { data: null }))).toEqual([
      "skip",
    ])
    expect(statuses(checkEntityRow("entities/food", ENTITY_ROW_SECTION, null))).toEqual(["skip"])
  })
})
