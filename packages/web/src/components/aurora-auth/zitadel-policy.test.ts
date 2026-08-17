import { describe, expect, it } from "vitest"

import {
  allowsPasskeys,
  describeLoginName,
  describeSecondFactor,
  evaluatePasswordRules,
  hasSecondFactor,
  isPasswordCompliant,
} from "./zitadel-policy"

describe("evaluatePasswordRules", () => {
  it("asks only for a minimum length when the tenant set no complexity policy", () => {
    const rules = evaluatePasswordRules("short")

    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ id: "minLength", satisfied: false })
    expect(rules[0].label).toBe("At least 8 characters")
  })

  it("honours the tenant's minimum length", () => {
    const rules = evaluatePasswordRules("1234567890", { minLength: 12 })

    expect(rules[0].label).toBe("At least 12 characters")
    expect(rules[0].satisfied).toBe(false)
  })

  it("ignores a nonsensical minimum length rather than demanding zero characters", () => {
    expect(evaluatePasswordRules("", { minLength: 0 })[0].label).toBe("At least 8 characters")
  })

  it("returns only the rules the tenant actually requires", () => {
    const rules = evaluatePasswordRules("abc", { hasUppercase: true, hasNumber: true })

    expect(rules.map((rule) => rule.id)).toEqual(["minLength", "uppercase", "number"])
  })

  it("evaluates each required rule against the password", () => {
    const policy = {
      minLength: 4,
      hasUppercase: true,
      hasLowercase: true,
      hasNumber: true,
      hasSymbol: true,
    }
    const rules = evaluatePasswordRules("Aa1!", policy)

    expect(rules.every((rule) => rule.satisfied)).toBe(true)
    expect(isPasswordCompliant("Aa1!", policy)).toBe(true)
    expect(isPasswordCompliant("aaaa", policy)).toBe(false)
  })

  it("counts a non-alphanumeric character as a symbol", () => {
    const rules = evaluatePasswordRules("abc def", { hasSymbol: true })

    expect(rules.find((rule) => rule.id === "symbol")?.satisfied).toBe(true)
  })
})

describe("describeLoginName", () => {
  it("accepts username, email and phone by default", () => {
    expect(describeLoginName()).toBe("Username, email or phone number")
  })

  it("drops email when the tenant disabled it", () => {
    expect(describeLoginName({ disableLoginWithEmail: true })).toBe("Username or phone number")
  })

  it("drops phone when the tenant disabled it", () => {
    expect(describeLoginName({ disableLoginWithPhone: true })).toBe("Username or email")
  })

  it("falls back to username alone when both are disabled", () => {
    expect(describeLoginName({ disableLoginWithEmail: true, disableLoginWithPhone: true })).toBe("Username")
  })
})

describe("policy predicates", () => {
  it("detects a configured second factor", () => {
    expect(hasSecondFactor()).toBe(false)
    expect(hasSecondFactor({ secondFactors: [] })).toBe(false)
    expect(hasSecondFactor({ secondFactors: ["otp"] })).toBe(true)
  })

  it("detects whether passkeys are allowed", () => {
    expect(allowsPasskeys()).toBe(false)
    expect(allowsPasskeys({ passwordlessType: "notAllowed" })).toBe(false)
    expect(allowsPasskeys({ passwordlessType: "allowed" })).toBe(true)
  })

  it("describes every second factor Zitadel supports", () => {
    for (const factor of ["otp", "u2f", "otpEmail", "otpSms"] as const) {
      const described = describeSecondFactor(factor)
      expect(described.label).toBeTruthy()
      expect(described.description).toBeTruthy()
    }
  })
})
