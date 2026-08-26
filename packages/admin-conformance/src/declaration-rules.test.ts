import { describe, expect, it } from "vitest"

import { checkDeclarationRules, checkLifecycleReasonCodesDeclared } from "./declaration-rules"
import type { Declaration } from "./declaration"

const declaration = (endpoints: Declaration["endpoints"]): Declaration => ({
  slug: "mark8ly",
  contractVersion: 2,
  endpoints,
})

describe("checkLifecycleReasonCodesDeclared (§8.3 + §8.8)", () => {
  // A product with no writes owes no vocabulary. This must be a skip and not a
  // pass: a green line would claim something was verified about a product that
  // has nothing to verify.
  it("skips a product that declares no lifecycle writes", () => {
    const findings = checkLifecycleReasonCodesDeclared(declaration({ health: { implemented: true } }))
    expect(findings.map((f) => f.status)).toEqual(["skip"])
  })

  // This is tesserix-home#345 as a rule: mark8ly validated a closed set it
  // never published, so the console hand-copied it.
  it("fails a product that declares the writes but not the codes", () => {
    const findings = checkLifecycleReasonCodesDeclared(
      declaration({ "tenant-lifecycle": { implemented: true } }),
    )
    expect(findings.map((f) => f.status)).toEqual(["fail"])
    expect(findings[0]?.detail).toMatch(/lifecycle\/reason-codes/)
    expect(findings[0]?.section).toBe("8.8")
  })

  it("passes a product that declares both", () => {
    const findings = checkLifecycleReasonCodesDeclared(
      declaration({
        "tenant-lifecycle": { implemented: true },
        "lifecycle/reason-codes": { implemented: true },
      }),
    )
    expect(findings.map((f) => f.status)).toEqual(["pass"])
  })

  // Publishing the vocabulary without the writes is not a deviation — it is a
  // product that is about to ship them, or one whose codes are read elsewhere.
  it("does not fault a product that serves the codes but no writes", () => {
    const findings = checkLifecycleReasonCodesDeclared(
      declaration({ "lifecycle/reason-codes": { implemented: true } }),
    )
    expect(findings.map((f) => f.status)).toEqual(["skip"])
  })

  it("treats an explicit false the same as absence", () => {
    const findings = checkLifecycleReasonCodesDeclared(
      declaration({
        "tenant-lifecycle": { implemented: true },
        "lifecycle/reason-codes": { implemented: false },
      }),
    )
    expect(findings.map((f) => f.status)).toEqual(["fail"])
  })
})

describe("checkDeclarationRules", () => {
  it("returns every cross-endpoint rule", () => {
    expect(checkDeclarationRules(declaration({}))).toHaveLength(1)
  })
})
