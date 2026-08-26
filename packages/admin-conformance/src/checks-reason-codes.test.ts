import { describe, expect, it } from "vitest"

import { checkReasonCodes } from "./checks-reason-codes"

const statuses = (findings: { status: string }[]) => findings.map((f) => f.status)
const details = (findings: { detail?: string }[]) => findings.map((f) => f.detail ?? "").join("\n")

/** mark8ly's real sets, trimmed — the shape every check below deviates from. */
const valid = {
  data: {
    suspend: [
      { code: "abuse", label: "Abuse" },
      { code: "non_payment", label: "Non-payment — dunning exhausted" },
    ],
    unsuspend: [{ code: "appeal_upheld", label: "Appeal upheld" }],
  },
}

describe("checkReasonCodes (§8.8)", () => {
  it("passes the shape the contract specifies", () => {
    expect(statuses(checkReasonCodes(valid))).toEqual(["pass"])
  })

  it("fails a body that is not an object", () => {
    expect(statuses(checkReasonCodes([]))).toEqual(["fail"])
    expect(statuses(checkReasonCodes(null))).toEqual(["fail"])
  })

  // Every other endpoint on this surface wraps in `data`; a bare
  // {suspend, unsuspend} would force a client to special-case this one.
  it("fails codes returned bare, outside the data envelope", () => {
    const findings = checkReasonCodes({ suspend: [], unsuspend: [] })
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toMatch(/\$\.data/)
  })

  it("fails an absent verb, because a missing key is not 'the same codes apply'", () => {
    const findings = checkReasonCodes({ data: { suspend: valid.data.suspend } })
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toMatch(/unsuspend is absent/)
  })

  it("fails an empty list, which leaves the console a menu it cannot render", () => {
    const findings = checkReasonCodes({ data: { ...valid.data, unsuspend: [] } })
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toMatch(/empty/)
  })

  it("fails a verb that is not an array", () => {
    const findings = checkReasonCodes({ data: { ...valid.data, unsuspend: { a: 1 } } })
    expect(statuses(findings)).toEqual(["fail"])
  })

  it("fails an entry that is not an object", () => {
    const findings = checkReasonCodes({ data: { ...valid.data, unsuspend: ["resolved"] } })
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toMatch(/must be an object/)
  })

  // The code is matched exactly on the product side and lands verbatim in an
  // audit row, so casing is not cosmetic.
  it("fails a code that is not snake_case", () => {
    const findings = checkReasonCodes({
      data: { ...valid.data, unsuspend: [{ code: "Appeal-Upheld", label: "Appeal upheld" }] },
    })
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toMatch(/snake_case/)
  })

  it("fails a duplicated code, which makes the operator's choice ambiguous", () => {
    const findings = checkReasonCodes({
      data: {
        ...valid.data,
        unsuspend: [
          { code: "resolved", label: "Resolved" },
          { code: "resolved", label: "Settled" },
        ],
      },
    })
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toMatch(/declared twice/)
  })

  // Without a label the console renders the wire value, and `tos_violation`
  // ends up in front of an operator as a menu option.
  it("fails a code with no usable label", () => {
    const findings = checkReasonCodes({
      data: { ...valid.data, unsuspend: [{ code: "resolved", label: "   " }] },
    })
    expect(statuses(findings)).toEqual(["fail"])
    expect(details(findings)).toMatch(/human label/)
  })

  // A product with a problem in each list will fix both in one edit, so it
  // should see both rather than the first.
  it("reports a problem in each verb rather than stopping at the first", () => {
    const findings = checkReasonCodes({ data: { suspend: [], unsuspend: [] } })
    expect(findings).toHaveLength(2)
    expect(statuses(findings)).toEqual(["fail", "fail"])
  })

  it("names the offending index so the fix does not require a search", () => {
    const findings = checkReasonCodes({
      data: { ...valid.data, unsuspend: [{ code: "resolved", label: "Resolved" }, { code: "" }] },
    })
    expect(details(findings)).toMatch(/unsuspend\[1\]/)
  })
})
