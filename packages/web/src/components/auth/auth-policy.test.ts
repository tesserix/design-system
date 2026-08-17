import { describe, expect, it } from "vitest"

import {
  allowsPasskeys,
  brandingColors,
  describeLoginName,
  describeSecondFactor,
  evaluatePasswordRules,
  hasSecondFactor,
  isPasswordCompliant,
} from "./auth-policy"

describe("evaluatePasswordRules", () => {
  it("asks only for a minimum length when no policy is supplied", () => {
    const rules = evaluatePasswordRules("short")

    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ id: "minLength", satisfied: false })
    expect(rules[0].label).toBe("At least 8 characters")
  })

  it("honours the tenant's minimum length", () => {
    expect(evaluatePasswordRules("1234567890", { minLength: 12 })[0].label).toBe("At least 12 characters")
  })

  it("ignores a nonsensical minimum rather than demanding zero characters", () => {
    expect(evaluatePasswordRules("", { minLength: 0 })[0].label).toBe("At least 8 characters")
  })

  it("returns only the rules the tenant requires", () => {
    const rules = evaluatePasswordRules("abc", { requireUppercase: true, requireNumber: true })

    expect(rules.map((rule) => rule.id)).toEqual(["minLength", "uppercase", "number"])
  })

  it("evaluates every required rule", () => {
    const policy = {
      minLength: 4,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSymbol: true,
    }

    expect(evaluatePasswordRules("Aa1!", policy).every((rule) => rule.satisfied)).toBe(true)
    expect(isPasswordCompliant("Aa1!", policy)).toBe(true)
    expect(isPasswordCompliant("aaaa", policy)).toBe(false)
  })

  it("counts a non-alphanumeric character as a symbol", () => {
    expect(evaluatePasswordRules("abc def", { requireSymbol: true }).find((r) => r.id === "symbol")?.satisfied).toBe(
      true
    )
  })
})

describe("describeLoginName", () => {
  it("accepts username, email and phone by default", () => {
    expect(describeLoginName()).toBe("Username, email or phone number")
  })

  it("drops what the tenant disabled", () => {
    expect(describeLoginName({ allowEmailLogin: false })).toBe("Username or phone number")
    expect(describeLoginName({ allowPhoneLogin: false })).toBe("Username or email")
    expect(describeLoginName({ allowEmailLogin: false, allowPhoneLogin: false })).toBe("Username")
  })
})

describe("policy predicates", () => {
  it("detects a configured second factor", () => {
    expect(hasSecondFactor()).toBe(false)
    expect(hasSecondFactor({ secondFactors: [] })).toBe(false)
    expect(hasSecondFactor({ secondFactors: ["totp"] })).toBe(true)
  })

  it("detects whether passkeys are allowed", () => {
    expect(allowsPasskeys()).toBe(false)
    expect(allowsPasskeys({ allowPasskeys: false })).toBe(false)
    expect(allowsPasskeys({ allowPasskeys: true })).toBe(true)
  })

  it("describes every supported second factor", () => {
    for (const factor of ["totp", "securityKey", "emailCode", "smsCode"] as const) {
      expect(describeSecondFactor(factor).label).toBeTruthy()
      expect(describeSecondFactor(factor).description).toBeTruthy()
    }
  })
})

describe("brandingColors", () => {
  it("returns nothing for absent branding", () => {
    expect(brandingColors(undefined)).toEqual({})
  })

  it("returns the light roles for a light surface", () => {
    expect(brandingColors({ light: { primary: "#111111" } }, "light")).toEqual({ primary: "#111111" })
  })

  it("falls back to the light role when a dark one is unset", () => {
    const branding = { light: { primary: "#111111", background: "#FFFFFF" }, dark: { background: "#101820" } }

    expect(brandingColors(branding, "dark")).toEqual({
      primary: "#111111",
      background: "#101820",
      font: undefined,
      warn: undefined,
    })
  })
})
